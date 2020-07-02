'use strict';

const jimp = require('jimp');
const GifUtil = require('gifwrap').GifUtil;
const utils = require('../utils');
// const fs = require('fs');
// const path = require('path');

/**
 * @param {Buffer} sourceBuffer
 * @param {Buffer} watermarkBuffer
 * @returns {Gif} inputGif
 */
async function DynamicImageRender(sourceBuffer, watermarkBuffer) {
    // 水印距离右下角百分比
    const LOGO_MARGIN_PERCENTAGE = 5 / 100;
    const watermark = await jimp.read(watermarkBuffer);
    const inputGif = await GifUtil.read(sourceBuffer);
    const xMargin = inputGif.width * LOGO_MARGIN_PERCENTAGE;
    const yMargin = inputGif.height * LOGO_MARGIN_PERCENTAGE;
    const X = inputGif.width - watermark.bitmap.width - xMargin;
    const Y = inputGif.height - watermark.bitmap.height - yMargin;
    inputGif.frames.forEach((frame) => {
        const jimpCopied = GifUtil.copyAsJimp(jimp, frame);
        // 计算获得的坐标再减去每一帧偏移位置，为实际添加水印坐标
        jimpCopied.composite(watermark, X - frame.xOffset, Y - frame.yOffset, [{
            mode: jimp.BLEND_SOURCE_OVER,
            opacitySource: 0.1,
            opacityDest: 1
        }]);
        jimpCopied.quality(80);
        frame.bitmap = jimpCopied.bitmap;

        frame.bitmap = utils.trueTo256(frame.bitmap);
    });
    return inputGif;
}

module.exports = DynamicImageRender;