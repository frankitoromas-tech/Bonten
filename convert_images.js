import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsDir = path.join(__dirname, 'public', 'assets');

async function convertImages() {
    console.log('Starting image conversion to WebP...');
    const files = fs.readdirSync(assetsDir);
    let converted = 0;

    for (const file of files) {
        if (file.match(/\.(png|jpe?g)$/i)) {
            const parsed = path.parse(file);
            const inputPath = path.join(assetsDir, file);
            const outputPath = path.join(assetsDir, `${parsed.name}.webp`);
            
            try {
                await sharp(inputPath)
                    .webp({ quality: 80 })
                    .toFile(outputPath);
                console.log(`Converted: ${file} -> ${parsed.name}.webp`);
                
                // Optionally delete the old file to save space
                fs.unlinkSync(inputPath);
                converted++;
            } catch (err) {
                console.error(`Error converting ${file}:`, err);
            }
        }
    }
    console.log(`Finished converting ${converted} images.`);
}

convertImages();
