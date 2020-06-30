'use strict';

const defaultOptions = require('./config');
const utils = require('./utils');
const svg2png = require('svg2png');
const fs = require('fs');
const path = require('path');
const minimatch = require('minimatch');

async function ImageWatermark() {
    try {
        const hexo = this;
        const watermarkOptions = hexo.config.watermark || {};
        watermarkOptions.text = watermarkOptions.text || hexo.config.url;
        // If enable is false return
        if (!watermarkOptions.enable || (!watermarkOptions.imageEnable && !watermarkOptions.textEnable) || (watermarkOptions.imageEnable && watermarkOptions.textEnable)) {
            return;
        }
        // 合并options
        const options = Object.assign(Object.assign({}, defaultOptions), watermarkOptions);
        // 支持的图片格式
        let targetfile = ['jpg', 'jpeg', 'png', 'gif'];
        let imgBuffer;
        // 定义基本路径，source路径和_posts路径，_posts在source下
        const sourceUrl = path.join(process.cwd(), options.source);
        const postsUrl = path.join(sourceUrl, options.posts);
        // 获取_post下的文件
        const files = utils.PostsFileList(path.join(postsUrl));
        // 过滤获取对应的图片
        const imgFiles = files.filter(file => {
            return minimatch(file, '*.{' + targetfile.join(',') + '}', {
                nocase: true,
                matchBase: true
            });
        });

        if (options.imageEnable) {
            imgBuffer = fs.readFileSync(path.join(process.cwd(), options.watermarkImage));
        } else {
            const svgBuffer = utils.text2svg(options);
            imgBuffer = await svg2png(svgBuffer);
        }

        // eslint-disable-next-line
        console.log(imgFiles)
        // eslint-disable-next-line
        console.log(imgBuffer);
    } catch (err) {
        // eslint-disable-next-line
        console.log(`\x1B[31m${err}\x1B[39m`);
    }
}

module.exports = ImageWatermark;;