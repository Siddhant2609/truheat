const fs = require('fs');
const path = require('path');

const projectDir = path.join(__dirname, '..');

function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== 'image-tools' && file !== '.git') {
        results = results.concat(getHtmlFiles(filePath));
      }
    } else if (file.endsWith('.html')) {
      results.push(filePath);
    }
  });
  return results;
}

const htmlFiles = getHtmlFiles(projectDir);

console.log('Starting broken link and asset validator...');
console.log('--------------------------------------------------');

let totalErrors = 0;

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const dir = path.dirname(file);
  const relativeFile = path.relative(projectDir, file);
  console.log(`Checking file: ${relativeFile}`);

  // Find all ids in this file to check internal anchors
  const ids = new Set();
  const idRegex = /id=["']([^"']+)["']/g;
  let idMatch;
  while ((idMatch = idRegex.exec(content)) !== null) {
    ids.add(idMatch[1]);
  }

  // Find all hrefs
  const hrefRegex = /href=["']([^"']+)["']/g;
  let hrefMatch;
  while ((hrefMatch = hrefRegex.exec(content)) !== null) {
    const url = hrefMatch[1];
    
    // Ignore absolute URLs (http, mailto, tel)
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:') || url.startsWith('tel:') || url === '#') {
      continue;
    }

    if (url.startsWith('#')) {
      const targetId = url.substring(1);
      if (!ids.has(targetId)) {
        console.warn(`  [Warning] Broken anchor: "${url}" (ID "${targetId}" not found in this file)`);
        totalErrors++;
      }
    } else {
      // Resolve path
      const urlWithoutAnchor = url.split('#')[0];
      if (urlWithoutAnchor) {
        const targetPath = path.resolve(dir, urlWithoutAnchor);
        if (!fs.existsSync(targetPath)) {
          console.error(`  [Error] Broken link: "${url}" (Resolved to: ${targetPath})`);
          totalErrors++;
        }
      }
    }
  }

  // Find all srcs (images, scripts)
  const srcRegex = /src=["']([^"']+)["']/g;
  let srcMatch;
  while ((srcMatch = srcRegex.exec(content)) !== null) {
    const url = srcMatch[1];
    
    // Ignore absolute URLs
    if (url.startsWith('http://') || url.startsWith('https://')) {
      continue;
    }

    const targetPath = path.resolve(dir, url);
    if (!fs.existsSync(targetPath)) {
      console.error(`  [Error] Broken resource src: "${url}" (Resolved to: ${targetPath})`);
      totalErrors++;
    }
  }
});

console.log('--------------------------------------------------');
if (totalErrors === 0) {
  console.log('✅ Validation complete! No broken links or resources found.');
} else {
  console.error(`❌ Validation complete with ${totalErrors} issue(s) found.`);
}
