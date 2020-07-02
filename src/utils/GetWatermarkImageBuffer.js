'use strict';

/**
 * @description 获取水印图片的buffer
 * @param {string[]} images
 * @param {string} watermarkImage
 * @param {any} route
 * @returns {Buffer}
 */
async function GetWatermarkImageBuffer(images, watermarkImage, route) {
    if (images.indexOf(watermarkImage) < 0) {
        throw 'watermarkImage does not exist in the source directory';
    }
    const stream = route.get(watermarkImage);
    var arr = [];
    stream.on('data', chunk => arr.push(chunk));

    var buffer = await new Promise(function (resolve, reject) {
        stream.on('end', () => resolve(Buffer.concat(arr)));
        stream.on('error', () => reject());
    });
    return buffer;
}

module.exports = GetWatermarkImageBuffer;