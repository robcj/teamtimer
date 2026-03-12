/**
 * This script copies the contents of the web build output directory (../web/dist)
 * into the mobile www directory (./www) for use in the mobile app.
 */
const fs = require('fs');
const path = require('path');

const mobileRoot = path.resolve(__dirname, '..');
const webDistDir = path.resolve(mobileRoot, '../web/dist');
const mobileWebDir = path.resolve(mobileRoot, 'www');

function removeDirIfExists(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

function copyDirRecursive(sourceDir, targetDir) {
  fs.mkdirSync(targetDir, { recursive: true });
  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

if (!fs.existsSync(webDistDir)) {
  console.error('Web build output not found at:', webDistDir);
  console.error('Run `npm run build:web` first.');
  process.exit(1);
}

removeDirIfExists(mobileWebDir);
copyDirRecursive(webDistDir, mobileWebDir);

console.log('Copied web build to mobile www directory:', mobileWebDir);
