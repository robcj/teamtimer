// This script takes the output of the webpack build (index.html and bundle.js)
// and produces a single HTML file with the JS inlined, suitable for offline use.
// It can also copy a release APK into the web output for download.
const fs = require('fs');
const path = require('path');
const distDir = path.join(__dirname, '..', 'dist');
const downloadsDir = path.join(distDir, 'downloads');
const defaultAndroidApkPath = path.resolve(
  __dirname,
  '..',
  '..',
  'mobile',
  'android',
  'app',
  'build',
  'outputs',
  'apk',
  'release',
  'app-release.apk'
);

function ensureDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function copyAndroidApk() {
  const configuredApkPath = process.env.TEAMTIMER_ANDROID_APK_PATH;
  const sourceApkPath = configuredApkPath
    ? path.resolve(process.cwd(), configuredApkPath)
    : defaultAndroidApkPath;

  if (!fs.existsSync(sourceApkPath)) {
    console.log('! Android APK not copied.');
    console.log(`  Expected APK: ${sourceApkPath}`);
    console.log('  Build a signed release APK first, or set TEAMTIMER_ANDROID_APK_PATH.');
    return;
  }

  ensureDirectory(downloadsDir);

  const outputApkPath = path.join(downloadsDir, 'team-timer.apk');
  fs.copyFileSync(sourceApkPath, outputApkPath);

  console.log('✓ Android APK copied successfully!');
  console.log(`  Source: ${sourceApkPath}`);
  console.log(`  Output: ${outputApkPath}`);
}

// Read the dist files
const htmlPath = path.join(distDir, 'index.html');
const jsPath = path.join(distDir, 'bundle.js');

const html = fs.readFileSync(htmlPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');

// Replace </script> with <\/script> to prevent premature HTML parsing
// Replace <script with <\u0073cript (unicode escape for 's')
// Replace $ with $$$$ to escape special regex replacement patterns
const safeJs = js
  .replace(/<\/script>/gi, '<\\/script>')
  .replace(/<script/gi, '<\\u0073cript')
  .replace(/\$/g, '$$$$');

// Remove external bundle script and inject inline script at end of body
const scriptPattern = /<script[^>]*\ssrc\s*=\s*["'][^"']*bundle\.js["'][^>]*>\s*<\/script>/i;
const htmlWithoutBundle = html.replace(scriptPattern, '');
const inlineScript = '<script>' + safeJs + '</script>';
const inlineHtml = htmlWithoutBundle.replace(/<\/body>/i, inlineScript + '</body>');

ensureDirectory(downloadsDir);

// Write the single file
const outputPath = path.join(downloadsDir, 'team-timer-offline.html');
fs.writeFileSync(outputPath, inlineHtml, 'utf8');

copyAndroidApk();

console.log('✓ Single-file build created successfully!');
console.log(`  Output: ${outputPath}`);
console.log(`  Size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
