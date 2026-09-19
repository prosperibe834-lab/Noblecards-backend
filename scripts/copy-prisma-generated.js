const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const sourceDir = path.join(rootDir, 'src', 'generated', 'prisma');
const targetDir = path.join(rootDir, 'dist', 'generated', 'prisma');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    throw new Error(`Missing Prisma generated client at ${src}`);
  }

  fs.rmSync(dest, { recursive: true, force: true });
  fs.mkdirSync(dest, { recursive: true });

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(sourceDir, targetDir);
fs.copyFileSync(path.join(sourceDir, 'index.js'), path.join(targetDir, 'index.js'));
console.log(`Copied Prisma generated client from ${sourceDir} to ${targetDir}`);
