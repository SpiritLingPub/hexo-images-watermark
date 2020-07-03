'use strict';

const jimp = require('jimp');
const GifUtil = require('gifwrap').GifUtil;
const utils = require('../utils');
const sharp = require('sharp');

/**
 * @param {Buffer} sourceBuffer
 * @param {Buffer} watermarkBuffer
 * @param {{[key:string]:string}} options
 * @returns {Gif} inputGif
 */
async function DynamicImageRender(sourceBuffer, watermarkBuffer, options) {
    const sharpWatermark = sharp(watermarkBuffer);
    const sharpWatermarkBuffer = await sharpWatermark.rotate(options.rotate, {
        background: options.background
    }).toBuffer();
    const watermark = await jimp.read(sharpWatermarkBuffer);
    const inputGif = await GifUtil.read(sourceBuffer);
    // 初始化位置
    const X = (inputGif.width - watermark.bitmap.width) / 2;
    const Y = (inputGif.height - watermark.bitmap.height) / 2;
    // 给每一帧都打上水印
    inputGif.frames.forEach((frame) => {
        const jimpCopied = GifUtil.copyAsJimp(jimp, frame);
        // 计算获得的坐标再减去每一帧偏移位置，为实际添加水印坐标
        jimpCopied.composite(watermark, X - frame.xOffset, Y - frame.yOffset, [{
            mode: jimp.BLEND_SOURCE_OVER,
            opacitySource: 0.1,
            opacityDest: 1
        }]);
        // 压缩图片 0-100
        jimpCopied.quality(80);

        frame.bitmap = jimpCopied.bitmap;
        // 真彩色转 256 色
        frame.bitmap = utils.trueTo256(frame.bitmap);
    });
    // 不使用 trueTo256 也可以使用自带的 quantizeWu 进行颜色转换，不过自带的算法运行需要更多的时间，没有 trueTo256 快
    // GifUtil.quantizeWu(inputGif.frames);
    return inputGif;
}

module.exports = DynamicImageRender;