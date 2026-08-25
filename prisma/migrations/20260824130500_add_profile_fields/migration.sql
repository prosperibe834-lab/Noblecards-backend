ALTER TABLE "User"
  ADD COLUMN "username" TEXT,
  ADD COLUMN "displayName" TEXT,
  ADD COLUMN "dateOfBirth" TIMESTAMP(3),
  ADD COLUMN "bio" TEXT,
  ADD COLUMN "address" TEXT,
  ADD COLUMN "profileImageUrl" TEXT,
  ADD COLUMN "isProfileComplete" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "isVerified" BOOLEAN NOT NULL DEFAULT false;

CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
