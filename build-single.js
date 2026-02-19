const fs = require('fs');
const path = require('path');

// Read the dist files
const htmlPath = path.join(__dirname, 'dist', 'index.html');
const jsPath = path.join(__dirname, 'dist', 'bundle.js');

const html = fs.readFileSync(htmlPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');

// Create inline version
const inlineHtml = html.replace(
  /<script defer="defer" src="bundle\.js"><\/script>/,
  `<script>${js}</script>`
);

// Create output directory
const outputDir = path.join(__dirname, 'dist-single');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write the single file
const outputPath = path.join(outputDir, 'team-timer.html');
fs.writeFileSync(outputPath, inlineHtml, 'utf8');

console.log('✓ Single-file build created successfully!');
console.log(`  Output: ${outputPath}`);
console.log(`  Size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
