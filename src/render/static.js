'use strict';

const sharp = require('sharp');
// const fs = require('fs');
// const path = require('path');

/**
 * @param {Buffer} sourceBuffer
 * @param {Buffer} watermarkBuffer
 * @param {{[key:string]:string}} options
 */
async function StaticImageRender(sourceBuffer, watermarkBuffer, options) {
    const watermark = sharp(watermarkBuffer);
    const composite = sharp(sourceBuffer);
    const watermarkMetdata = await watermark.metadata();
    const compositeMetdata = await composite.metadata();
    let watermarkNewBuffer;
    let compositeBuffer;
    if (watermarkMetdata.width > compositeMetdata.width || watermarkMetdata.height > compositeMetdata.height) {
        // 是否跳过水印图片比原始图片大的
        if (!options.bigSkip) {
            if (watermarkMetdata.width > compositeMetdata.width && watermarkMetdata.height > compositeMetdata.height) {
                watermarkNewBuffer = await watermark.rotate(options.rotate, {
                    background: options.background
                }).resize(compositeMetdata.width, compositeMetdata.height).toBuffer();
            }
            if (watermarkMetdata.width > compositeMetdata.width) {
                watermarkNewBuffer = await watermark.rotate(options.rotate, {
                    background: options.background
                }).resize(compositeMetdata.width).toBuffer();
            }
            if (watermarkMetdata.height > compositeMetdata.height) {
                watermarkNewBuffer = await watermark.rotate(options.rotate, {
                    background: options.background
                }).resize(compositeMetdata.height).toBuffer();
            }
        } else {
            return {
                isError: true,
                compositeBuffer: null
            };
        }
    } else {
        watermarkNewBuffer = await watermark.rotate(options.rotate, {
            background: options.background
        }).toBuffer();
    }
    compositeBuffer = await composite.composite([{
        input: watermarkNewBuffer,
        gravity: options.gravity
    }]).toBuffer();
    // fs.writeFileSync(path.join(process.cwd(), 'watermarkBuffer1.png'), watermarkNewBuffer);
    // fs.writeFileSync(path.join(process.cwd(), 'watermarkBuffer2.png'), compositeBuffer);
    return {
        isError: false,
        compositeBuffer
    };
}

module.exports = StaticImageRender;