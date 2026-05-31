const fs = require('fs');
const path = require('path');

const projectDir = path.join(__dirname, '..');
const assetsDir = path.join(projectDir, 'assets');

// List of HTML files to process
const htmlFiles = [
  path.join(projectDir, 'index.html'),
  ...fs.readdirSync(path.join(projectDir, 'products'))
    .filter(f => f.endsWith('.html'))
    .map(f => path.join(projectDir, 'products', f))
];

async function updateHTMLFiles() {
  try {
    const assets = fs.readdirSync(assetsDir);
    // Find all webp files and check their original filenames
    const webpMapping = {};
    assets.forEach(file => {
      if (file.endsWith('.webp')) {
        const base = path.basename(file, '.webp');
        // Look for corresponding png, jpg, jpeg
        const png = `${base}.png`;
        const jpg = `${base}.jpg`;
        const jpeg = `${base}.jpeg`;
        
        if (assets.includes(png)) webpMapping[png] = file;
        if (assets.includes(jpg)) webpMapping[jpg] = file;
        if (assets.includes(jpeg)) webpMapping[jpeg] = file;
      }
    });

    console.log('WebP Mappings discovered:', webpMapping);
    console.log('--------------------------------------------------');

    for (const htmlFile of htmlFiles) {
      let content = await fs.promises.readFile(htmlFile, 'utf8');
      let originalContent = content;
      let replacementsCount = 0;

      // Replace each original image filename with its .webp version
      for (const [orig, webp] of Object.entries(webpMapping)) {
        // We want to avoid replacing the favicon link: <link rel="icon" type="image/png" href=".../truheat-logo.png">
        // So let's construct a pattern or check
        if (orig === 'truheat-logo.png') {
          // Replace only if it's not preceded by rel="icon" or type="image/png" or inside <link
          // Let's use a regex that matches src="...truheat-logo.png" or content="...truheat-logo.png"
          const regex = new RegExp(`(src|content|href)=["']([^"']*/)?${orig.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}["']`, 'g');
          content = content.replace(regex, (match, attr, prefix) => {
            // If the matched attribute is href in a link element with rel="icon", do not replace
            if (attr === 'href' && (match.includes('rel="icon"') || content.includes('rel="icon"'))) {
              // Wait, to be super safe, let's verify if the line contains rel="icon"
              const line = content.substring(content.lastIndexOf('\n', content.indexOf(match)) + 1, content.indexOf('\n', content.indexOf(match)));
              if (line.includes('rel="icon"') || line.includes('rel=\'icon\'')) {
                return match; // Don't replace favicon
              }
            }
            replacementsCount++;
            return `${attr}="${prefix || ''}${webp}"`;
          });
        } else {
          // Regular files: replace all references in src="..." or href="..." or content="..."
          // Handle spaces in filenames (some files have spaces like 'Acidity testing.png')
          const escapedOrig = orig.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          const regex = new RegExp(`(src|content|href)=["']([^"']*/)?${escapedOrig}["']`, 'g');
          content = content.replace(regex, (match, attr, prefix) => {
            replacementsCount++;
            return `${attr}="${prefix || ''}${webp}"`;
          });
        }
      }

      if (content !== originalContent) {
        await fs.promises.writeFile(htmlFile, content, 'utf8');
        console.log(`Updated: ${path.basename(htmlFile)} | Replacements: ${replacementsCount}`);
      } else {
        console.log(`No changes needed: ${path.basename(htmlFile)}`);
      }
    }

    console.log('--------------------------------------------------');
    console.log('HTML references updated successfully!');
  } catch (error) {
    console.error('Error updating HTML files:', error);
  }
}

updateHTMLFiles();
