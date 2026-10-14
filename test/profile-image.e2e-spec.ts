import * as bcrypt from 'bcrypt';
import { INestApplication } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import { unlink } from 'node:fs/promises';
import { basename, join } from 'node:path';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Profile image upload (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userId: string;
  let accessToken: string;
  let uploadedPath: string | undefined;

  const imageBytes = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADUlEQVR4nGP4z8AAAAMBAQDJ/pLvAAAAAElFTkSuQmCC',
    'base64',
  );

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestExpressApplication>();
    app.enableCors({ origin: /^https?:\/\/localhost:\d+$/ });
    app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' });
    await app.init();
    prisma = app.get(PrismaService);

    const email = `profile-image-${crypto.randomUUID()}@example.test`;
    const password = `Test-${crypto.randomUUID()}!`;
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: await bcrypt.hash(password, 4),
        firstName: 'Profile',
        lastName: 'Image Test',
        isEmailVerified: true,
        isActive: true,
      },
      select: { id: true },
    });
    userId = user.id;

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(201);
    accessToken = login.body.accessToken;
  });

  afterAll(async () => {
    if (userId) {
      await prisma.refreshSession.deleteMany({ where: { userId } });
      await prisma.user.delete({ where: { id: userId } });
    }
    if (uploadedPath) {
      await unlink(join(process.cwd(), 'uploads', 'profile', basename(uploadedPath))).catch(() => {});
    }
    await app?.close();
  });

  it('requires authentication and rejects unsupported or oversized images', async () => {
    await request(app.getHttpServer())
      .post('/users/me/image')
      .attach('image', imageBytes, { filename: 'profile.png', contentType: 'image/png' })
      .expect(401);

    await request(app.getHttpServer())
      .post('/users/me/image')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('image', Buffer.from('not an image'), {
        filename: 'profile.txt',
        contentType: 'text/plain',
      })
      .expect(400);

    await request(app.getHttpServer())
      .post('/users/me/image')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('image', Buffer.alloc(5 * 1024 * 1024 + 1), {
        filename: 'profile.png',
        contentType: 'image/png',
      })
      .expect(413);
  });

  it('stores an authenticated image, updates the profile, and serves the returned URL', async () => {
    const upload = await request(app.getHttpServer())
      .post('/users/me/image')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('image', imageBytes, { filename: 'profile.png', contentType: 'image/png' })
      .expect(201);

    uploadedPath = upload.body.user.profileImageUrl;
    expect(uploadedPath).toMatch(/^\/uploads\/profile\/[a-f0-9]+\.png$/);

    const persistedUser = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { profileImageUrl: true },
    });
    expect(persistedUser.profileImageUrl).toBe(uploadedPath);

    const profile = await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    expect(profile.body.user.profileImageUrl).toBe(uploadedPath);

    const image = await request(app.getHttpServer())
      .get(uploadedPath)
      .set('Origin', 'http://localhost:5173')
      .buffer(true)
      .parse((response, callback) => {
        const chunks: Buffer[] = [];
        response.on('data', (chunk: Buffer) => chunks.push(chunk));
        response.on('end', () => callback(null, Buffer.concat(chunks)));
      })
      .expect(200);
    expect(image.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    expect(image.body).toEqual(imageBytes);
  });

  it('removes only the authenticated user profile image and returns null after refresh', async () => {
    await request(app.getHttpServer())
      .delete('/users/me/image')
      .expect(401);

    const removal = await request(app.getHttpServer())
      .delete('/users/me/image')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    expect(removal.body.user.profileImageUrl).toBeNull();

    const persistedUser = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { profileImageUrl: true },
    });
    expect(persistedUser.profileImageUrl).toBeNull();

    const profile = await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    expect(profile.body.user.profileImageUrl).toBeNull();
  });

  it('marks editable required fields complete without claiming verification', async () => {
    const update = await request(app.getHttpServer())
      .patch('/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        username: 'profilecomplete',
        country: 'Testland',
        gender: 'Prefer not to say',
      })
      .expect(200);

    expect(update.body.user.isProfileComplete).toBe(true);
    expect(update.body.user.isVerified).toBe(false);

    const profile = await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    expect(profile.body.user.isProfileComplete).toBe(true);
    expect(profile.body.user.isVerified).toBe(false);
    expect(profile.body.user.isEmailVerified).toBe(true);
  });

  it('persists and returns a date-only DOB without shifting its calendar day', async () => {
    await prisma.user.update({
      where: { id: userId },
      data: { bio: 'Existing test bio' },
    });
    await request(app.getHttpServer())
      .patch('/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ dateOfBirth: '2001-07-13' })
      .expect(200);

    const persistedUser = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { dateOfBirth: true, bio: true },
    });
    expect(persistedUser.dateOfBirth?.toISOString()).toBe('2001-07-13T00:00:00.000Z');
    expect(persistedUser.bio).toBe('Existing test bio');

    const profile = await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    expect(profile.body.user.dateOfBirth).toBe('2001-07-13T00:00:00.000Z');
  });
});