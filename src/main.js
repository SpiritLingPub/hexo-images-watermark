'use strict';

const defaultOptions = require('./config');
const utils = require('./utils');
const svg2png = require('svg2png');
// const path = require('path');
const minimatch = require('minimatch');
const GifUtil = require('gifwrap').GifUtil;
const StaticImageRender = require('./render/static');
const DynamicImageRender = require('./render/dynamic');


async function ImageWatermark() {
    try {
        const hexo = this;
        const route = hexo.route;
        const watermarkOptions = hexo.config.watermark || {};
        watermarkOptions.text = watermarkOptions.text || hexo.config.url;
        // If enable is false return
        if (!watermarkOptions.enable || (!watermarkOptions.imageEnable && !watermarkOptions.textEnable) || (watermarkOptions.imageEnable && watermarkOptions.textEnable)) {
            return;
        }
        // 合并options
        const options = Object.assign(Object.assign({}, defaultOptions), watermarkOptions);
        // 支持的图片格式
        const staticTargetFile = ['jpg', 'jpeg', 'png'];
        const dynamicTargetFile = ['gif', 'sl'];
        const routes = route.list();
        let watermarkBuffer;
        // 过滤获取对应的图片
        const allImgFiles = routes.filter(file => {
            return minimatch(file, '*.{' + staticTargetFile.join(',') + '}', {
                nocase: true,
                matchBase: true
            });
        });
        const staticImgFiles = allImgFiles.filter((item) => item.indexOf('posts') === 0);
        // 过滤获取对应的图片
        const dynamicImgFiles = routes.filter(file => {
            return minimatch(file, '*.{' + dynamicTargetFile.join(',') + '}', {
                nocase: true,
                matchBase: true
            });
        }).filter((item) => item.indexOf('posts') === 0);
        // 无论是图片还是文字都全部转为图片再转为buffer，水印图片的buffer
        if (options.imageEnable) {
            watermarkBuffer = await utils.GetWatermarkImageBuffer(allImgFiles, options.watermarkImage, route);
        } else {
            const svgBuffer = utils.text2svg(options);
            watermarkBuffer = await svg2png(svgBuffer);
        }
        // fs.writeFileSync(path.join(process.cwd(), 'watermarkBuffer.png'), watermarkBuffer);
        /**
         * 静态图片渲染
         */
        await Promise.all(staticImgFiles.map(async (path) => {
            const stream = route.get(path);
            const arr = [];
            stream.on('data', chunk => arr.push(chunk));
            // eslint-disable-next-line
            console.log(`\x1b[40;94mINFO\x1b[0m  \x1b[40;94mGenerated Image Process: \x1b[0m\x1b[40;95m${path}\x1b[0m`);
            const sourceBuffer = await new Promise(function (resolve) {
                stream.on('end', () => resolve(Buffer.concat(arr)));
            });
            const compositeInfo = await StaticImageRender(sourceBuffer, watermarkBuffer, options);
            if (compositeInfo.isError) {
                // eslint-disable-next-line
                console.log(`\x1b[40;94mINFO\x1b[0m  \x1b[40;93mGenerated Image Waring: \x1b[0m\x1b[40;95m${path}\x1b[0m \x1b[40;93mThe width and height of the watermark image are larger than the original image, and cannot be rendered. The original image has been returned.\x1b[0m`);
            } else {
                // eslint-disable-next-line
                console.log(`\x1b[40;94mINFO\x1b[0m  \x1b[40;92mGenerated Image Success: \x1b[0m\x1b[40;95m${path}\x1b[0m`);
                route.set(path, compositeInfo.compositeBuffer);
            }

        }));
        /**
         * 动态图片渲染
         */
        await Promise.all(dynamicImgFiles.map(async (path) => {
            const stream = route.get(path);
            const arr = [];
            stream.on('data', chunk => arr.push(chunk));
            // eslint-disable-next-line
            console.log(`\x1b[40;92mINFO\x1b[0m  \x1b[40;94mGenerated Image Process: \x1b[0m\x1b[40;95m${path}\x1b[0m`);
            const sourceBuffer = await new Promise(function (resolve) {
                stream.on('end', () => resolve(Buffer.concat(arr)));
            });
            const inputGif = await DynamicImageRender(sourceBuffer, watermarkBuffer, options);
            const gif = await GifUtil.write('public/a.gif', inputGif.frames, inputGif);
            // eslint-disable-next-line
            console.log(`\x1b[40;94mINFO\x1b[0m  \x1b[40;92mGenerated Image Success: \x1b[0m\x1b[40;95m${path}\x1b[0m`);
            route.set(path, gif.buffer);
        }));
        // eslint-disable-next-line
        console.log(dynamicImgFiles);

    } catch (err) {
        // eslint-disable-next-line
        console.log(err);
        // eslint-disable-next-line
        console.log(`\x1B[31m${err}\x1B[39m`);
    }
}

module.exports = ImageWatermark;;