
const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const CleanCSS = require('clean-css');
const HTMLMinifier = require('html-minifier-terser');
const klaw = require('klaw');
const ffmpeg = require('fluent-ffmpeg');
const os = require('os');
let imagemin, imageminPngquant, imageminMozjpeg;

async function main() {
    const distFolder = path.resolve('dist');
    const publicFolder = path.resolve('public');
    
    // Copy all files from 'public' to 'dist'
    fs.copySync(publicFolder, distFolder);
    const filesToDelete = [];
    await deleteSpecifiedFiles(distFolder, filesToDelete);

    // Image Minification Libraries
    imagemin = (await import('imagemin')).default;
    imageminPngquant = (await import('imagemin-pngquant')).default;
    imageminMozjpeg = (await import('imagemin-mozjpeg')).default;

    const items = await new Promise((resolve, reject) => {
        const results = [];
        klaw(distFolder)
            .on('data', item => results.push(item))
            .on('end', () => resolve(results))
            .on('error', reject);
    });

    for (const item of items) {
        try {
            if (item.stats.isFile()) {
                const filePath = item.path;
                const fileHash = crypto
                    .createHash('md5')
                    .update(filePath)
                    .digest('hex');

                const tempFilePath = path.join(
                    os.tmpdir(),
                    `temp_${fileHash}_${path.basename(filePath)}`
                );

                if (filePath.endsWith('index.html')) {
                    console.log(`🤖 Modifying index.html: ${filePath}`);
                    let htmlContent = fs.readFileSync(filePath, 'utf-8');
                    htmlContent = htmlContent.replace('src/Core.js', 'lalala.js');
                    fs.writeFileSync(filePath, htmlContent, 'utf-8');
                }

                if (filePath.endsWith('.css')) {
                    console.log(`🤖 Minifying CSS: ${filePath}`);
                    const source = fs.readFileSync(filePath, 'utf-8');
                    const output = new CleanCSS().minify(source).styles;
                    fs.writeFileSync(filePath, output, 'utf-8');
                } else if (filePath.endsWith('.png') || filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
                    await compressAndWriteImage(filePath, imagemin, imageminPngquant, imageminMozjpeg);
                } else if (filePath.endsWith('.html')) {
                    console.log(`🤖 Minifying HTML: ${filePath}`);
                    const source = fs.readFileSync(filePath, 'utf-8');
                    const output = HTMLMinifier.minify(source, {
                        collapseWhitespace: true,
                        removeComments: true,
                    });
                    fs.writeFileSync(filePath, output, 'utf-8');
                } else if (filePath.endsWith('.mp3') || filePath.endsWith('.wav')) {

                }
            }
        } catch (err) {
            console.error(`❌ An error occurred while processing ${item.path}: ${err}`);
        }
    }
    console.log('🎉 Build completed!');
}

function deleteTempFile(tempFilePath) {
    fs.unlink(tempFilePath, (err) => {
        if (err) {
            console.error(`❌ Could not delete temp file: ${err}`);
        } else {
            console.log(`🗑️ Temp file deleted: ${tempFilePath}`);
        }
    });
}

async function deleteSpecifiedFiles(basePath, filesToDelete) {
    for (const file of filesToDelete) {
        const filePath = path.join(basePath, file);
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`🗑️ Deleted: ${filePath}`);
            }
        } catch (err) {
            console.error(`❌ Could not delete ${filePath}: ${err}`);
        }
    }
}

async function compressAndWriteImage(filePath, imagemin, imageminPngquant, imageminMozjpeg) {
    console.log(`🤖 Compressing image: ${filePath}`);

    // await imagemin([filePath], {
    //     destination: path.dirname(filePath),
    //     plugins: [
    //         imageminMozjpeg({ quality: 90 }),
    //         imageminPngquant({ quality: [0.80, 0.90] })
    //     ]
    // });
}

main().catch((err) => console.error(`❌ An error occurred: ${err}`));
