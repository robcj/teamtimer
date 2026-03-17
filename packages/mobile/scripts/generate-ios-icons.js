const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const mobileRoot = path.resolve(__dirname, '..');
const webImagesDir = path.resolve(mobileRoot, '../web/images');
const appIconDir = path.resolve(mobileRoot, 'ios/App/App/Assets.xcassets/AppIcon.appiconset');

const defaultSource = path.join(webImagesDir, 'tt-icon-512x512.png');
const source = process.env.TEAMTIMER_IOS_ICON_SRC
  ? path.resolve(mobileRoot, process.env.TEAMTIMER_IOS_ICON_SRC)
  : defaultSource;

if (!fs.existsSync(source)) {
  console.error(`Icon source not found: ${source}`);
  process.exit(1);
}

const outputPath = path.join(appIconDir, 'AppIcon-512@2x.png');

execFileSync(
  'npx',
  [
    '--yes',
    'sharp-cli',
    '-i',
    source,
    '-o',
    outputPath,
    'resize',
    '1024',
    '1024',
    '--fit',
    'contain',
    '--background',
    'rgba(255,255,255,1)',
    '--position',
    'centre',
  ],
  { cwd: mobileRoot, stdio: 'inherit' }
);

console.log('iOS app icon generated successfully.');
console.log(`  Source: ${source}`);
console.log(`  Output: ${outputPath}`);
