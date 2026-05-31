const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');
const { minify } = require('terser');

const projectDir = path.join(__dirname, '..');
const cssDir = path.join(projectDir, 'css');
const jsDir = path.join(projectDir, 'js');

const htmlFiles = [
  path.join(projectDir, 'index.html'),
  ...fs.readdirSync(path.join(projectDir, 'products'))
    .filter(f => f.endsWith('.html'))
    .map(f => path.join(projectDir, 'products', f))
];

async function minifyFiles() {
  try {
    console.log('Starting CSS and JS minification...');
    console.log('--------------------------------------------------');

    // 1. Minify CSS files
    const cssFiles = ['style.css', 'product.css'];
    const cleanCss = new CleanCSS({ level: 1 });
    
    for (const cssFile of cssFiles) {
      const srcPath = path.join(cssDir, cssFile);
      if (fs.existsSync(srcPath)) {
        const originalContent = fs.readFileSync(srcPath, 'utf8');
        const minified = cleanCss.minify(originalContent);
        
        if (minified.errors.length) {
          console.error(`Errors in ${cssFile}:`, minified.errors);
          continue;
        }

        const destName = cssFile.replace('.css', '.min.css');
        const destPath = path.join(cssDir, destName);
        fs.writeFileSync(destPath, minified.styles, 'utf8');

        const origSize = Buffer.byteLength(originalContent);
        const minSize = Buffer.byteLength(minified.styles);
        console.log(`Minified CSS: ${cssFile} (${(origSize / 1024).toFixed(1)} KB) -> ${destName} (${(minSize / 1024).toFixed(1)} KB) | Saved: ${(((origSize - minSize) / origSize) * 100).toFixed(1)}%`);
      }
    }

    // 2. Minify JS files
    const jsFiles = ['main.js'];
    for (const jsFile of jsFiles) {
      const srcPath = path.join(jsDir, jsFile);
      if (fs.existsSync(srcPath)) {
        const originalContent = fs.readFileSync(srcPath, 'utf8');
        const minified = await minify(originalContent, {
          compress: true,
          mangle: true
        });

        if (minified.code) {
          const destName = jsFile.replace('.js', '.min.js');
          const destPath = path.join(jsDir, destName);
          fs.writeFileSync(destPath, minified.code, 'utf8');

          const origSize = Buffer.byteLength(originalContent);
          const minSize = Buffer.byteLength(minified.code);
          console.log(`Minified JS: ${jsFile} (${(origSize / 1024).toFixed(1)} KB) -> ${destName} (${(minSize / 1024).toFixed(1)} KB) | Saved: ${(((origSize - minSize) / origSize) * 100).toFixed(1)}%`);
        }
      }
    }

    console.log('--------------------------------------------------');
    console.log('Updating HTML files to reference minified CSS & JS...');

    for (const htmlFile of htmlFiles) {
      let content = await fs.promises.readFile(htmlFile, 'utf8');
      let originalContent = content;

      // Replace style.css with style.min.css (ignoring or preserving optional query params like ?v=4)
      content = content.replace(/css\/style\.css(\?[^"']*)?/g, 'css/style.min.css');
      // Replace product.css with product.min.css
      content = content.replace(/css\/product\.css(\?[^"']*)?/g, 'css/product.min.css');
      // Replace main.js with main.min.js
      content = content.replace(/js\/main\.js(\?[^"']*)?/g, 'js/main.min.js');

      if (content !== originalContent) {
        await fs.promises.writeFile(htmlFile, content, 'utf8');
        console.log(`Updated HTML: ${path.basename(htmlFile)}`);
      }
    }

    console.log('--------------------------------------------------');
    console.log('Minification and reference updates complete!');
  } catch (error) {
    console.error('Error during minification:', error);
  }
}

minifyFiles();
