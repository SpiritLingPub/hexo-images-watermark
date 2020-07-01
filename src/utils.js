'use strict';

const Text2SVG = require('text-to-svg');
const path = require('path');

/**
 * @description 文字转svg
 * @param {{[key:string]:string}} options
 * @returns {Buffer}
 */
function text2svg(options) {
    let textToSVG;
    if (options.fontPath) {
        textToSVG = Text2SVG.loadSync(path.join(process.cwd(), options.fontPath));
    } else {
        textToSVG = Text2SVG.loadSync();
    }
    const attributes = {
        fill: options.color
    };
    const optionsSvg = {
        x: 0,
        y: 0,
        fontSize: options.fontSize,
        anchor: 'top',
        attributes: attributes
    };
    const svg = textToSVG.getSVG(options.text, optionsSvg);
    return Buffer.from(svg);
}
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
module.exports = {
    text2svg,
    PostsFileList,
    GetWatermarkImageBuffer
};