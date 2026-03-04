const fs = require('fs');
const path = require('path');

// Read the dist files
const htmlPath = path.join(__dirname, 'dist', 'index.html');
const jsPath = path.join(__dirname, 'dist', 'bundle.js');

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

// Create output directory
const outputDir = path.join(__dirname, 'dist/dist-single');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write the single file
const outputPath = path.join(outputDir, 'team-timer-offline.html');
fs.writeFileSync(outputPath, inlineHtml, 'utf8');

console.log('✓ Single-file build created successfully!');
console.log(`  Output: ${outputPath}`);
console.log(`  Size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
