const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const mobileRoot = path.resolve(__dirname, '..');
const webImagesDir = path.resolve(mobileRoot, '../web/images');
const androidResDir = path.resolve(mobileRoot, 'android/app/src/main/res');

const defaultLegacySource = path.join(webImagesDir, 'tt-icon-512x512.png');
const defaultForegroundSource = path.join(webImagesDir, 'tt-icon-big-transparent-bg.png');

const legacySource = process.env.TEAMTIMER_ANDROID_ICON_LEGACY_SRC
  ? path.resolve(mobileRoot, process.env.TEAMTIMER_ANDROID_ICON_LEGACY_SRC)
  : defaultLegacySource;

const foregroundSource = process.env.TEAMTIMER_ANDROID_ICON_FOREGROUND_SRC
  ? path.resolve(mobileRoot, process.env.TEAMTIMER_ANDROID_ICON_FOREGROUND_SRC)
  : defaultForegroundSource;

const densities = [
  { name: 'mdpi', legacySize: 48, foregroundSize: 108 },
  { name: 'hdpi', legacySize: 72, foregroundSize: 162 },
  { name: 'xhdpi', legacySize: 96, foregroundSize: 216 },
  { name: 'xxhdpi', legacySize: 144, foregroundSize: 324 },
  { name: 'xxxhdpi', legacySize: 192, foregroundSize: 432 },
];

function assertFileExists(filePath, description) {
  if (!fs.existsSync(filePath)) {
    console.error(`${description} not found: ${filePath}`);
    process.exit(1);
  }
}

function runSharp(args) {
  execFileSync('npx', ['--yes', 'sharp-cli', ...args], {
    cwd: mobileRoot,
    stdio: 'inherit',
  });
}

function generateLegacyIcon(sourcePath, outputPath, size) {
  runSharp([
    '-i',
    sourcePath,
    '-o',
    outputPath,
    'resize',
    String(size),
    String(size),
    '--fit',
    'contain',
    '--background',
    'rgba(255,255,255,1)',
    '--position',
    'centre',
    '--withoutEnlargement',
  ]);
}

function generateForegroundIcon(sourcePath, outputPath, size) {
  runSharp([
    '-i',
    sourcePath,
    '-o',
    outputPath,
    'resize',
    String(size),
    String(size),
    '--fit',
    'contain',
    '--background',
    'rgba(255,255,255,0)',
    '--position',
    'centre',
  ]);
}

assertFileExists(legacySource, 'Legacy icon source');
assertFileExists(foregroundSource, 'Foreground icon source');

for (const density of densities) {
  const mipmapDir = path.join(androidResDir, `mipmap-${density.name}`);

  generateLegacyIcon(legacySource, path.join(mipmapDir, 'ic_launcher.png'), density.legacySize);
  generateLegacyIcon(
    legacySource,
    path.join(mipmapDir, 'ic_launcher_round.png'),
    density.legacySize
  );
  generateForegroundIcon(
    foregroundSource,
    path.join(mipmapDir, 'ic_launcher_foreground.png'),
    density.foregroundSize
  );
}

console.log('Android launcher icons generated successfully.');
console.log(`  Legacy source: ${legacySource}`);
console.log(`  Foreground source: ${foregroundSource}`);
