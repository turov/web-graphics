import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const sourceDir = './source';
const outputDir = './output';

async function clearOutputDir() {
    try {
        await fs.rm(outputDir, {recursive: true, force: true});
    } catch (error) {
        console.error('Ошибка при очистке папки output:', error);
    }
}

async function getImageWidth(filePath) {
    const metadata = await sharp(filePath).metadata();
    return metadata.width;
}

async function optimizeImages() {
    try {
        await clearOutputDir();
        await fs.mkdir(outputDir, {recursive: true});

        const files = await fs.readdir(sourceDir);

        for (const file of files) {
            const filePath = path.join(sourceDir, file);
            const extension = path.extname(file).toLowerCase();

            if (!['.jpg', '.jpeg', '.png'].includes(extension)) continue;

            const fileName = path.basename(file, extension);
            const outputFilePath1x = path.join(outputDir, `${fileName}@1x${extension}`);
            const outputFilePath2x = path.join(outputDir, `${fileName}@2x${extension}`);

            await sharp(filePath)
                .resize({width: Math.round(await getImageWidth(filePath) / 2)})
                .toFormat(extension === '.jpg' || extension === '.jpeg' ? 'jpeg' : extension.slice(1), {
                    progressive: extension === '.jpg' || extension === '.jpeg',
                    quality: 80
                })
                .toFile(outputFilePath1x);

            await sharp(filePath)
                .toFormat(extension === '.jpg' || extension === '.jpeg' ? 'jpeg' : extension.slice(1), {
                    progressive: extension === '.jpg' || extension === '.jpeg',
                    quality: 80
                })
                .toFile(outputFilePath2x);

            await sharp(filePath)
                .resize({width: Math.round(await getImageWidth(filePath) / 2)})
                .toFormat('webp', {
                    quality: 80
                })
                .toFile(path.join(outputDir, `${fileName}@1x.webp`));

            await sharp(filePath)
                .toFormat('webp', {
                    quality: 80
                })
                .toFile(path.join(outputDir, `${fileName}@2x.webp`));

            await sharp(filePath)
                .resize({width: Math.round(await getImageWidth(filePath) / 2)})
                .toFormat('avif', {
                    quality: 50
                })
                .toFile(path.join(outputDir, `${fileName}@1x.avif`));

            await sharp(filePath)
                .toFormat('avif', {
                    quality: 50
                })
                .toFile(path.join(outputDir, `${fileName}@2x.avif`));
        }

        console.log('🏁');
    } catch (error) {
        console.error('Ошибка при обработке изображений:', error);
    }
}

optimizeImages();
