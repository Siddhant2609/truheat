const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const assetsDir = path.join(__dirname, '..', 'assets');

async function convertImages() {
  try {
    const files = await fs.promises.readdir(assetsDir);
    let totalSaved = 0;

    console.log('Starting image conversion and compression to WebP...');
    console.log('--------------------------------------------------');

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
        const filePath = path.join(assetsDir, file);
        const nameWithoutExt = path.basename(file, ext);
        const destFileName = `${nameWithoutExt}.webp`;
        const destPath = path.join(assetsDir, destFileName);

        const stats = await fs.promises.stat(filePath);
        const originalSize = stats.size;

        // Perform compression and WebP conversion
        await sharp(filePath)
          .webp({ quality: 80 })
          .toFile(destPath);

        const newStats = await fs.promises.stat(destPath);
        const newSize = newStats.size;
        const saved = originalSize - newSize;
        totalSaved += saved;

        console.log(`Converted: ${file} (${(originalSize / 1024).toFixed(1)} KB) -> ${destFileName} (${(newSize / 1024).toFixed(1)} KB) | Saved: ${(saved / 1024).toFixed(1)} KB (${((saved / originalSize) * 100).toFixed(1)}%)`);
      }
    }

    console.log('--------------------------------------------------');
    console.log(`WebP conversion complete! Total saved space: ${(totalSaved / (1024 * 1024)).toFixed(2)} MB`);
  } catch (error) {
    console.error('Error during image conversion:', error);
  }
}

convertImages();
