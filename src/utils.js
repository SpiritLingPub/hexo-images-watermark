'use strict';

const Text2SVG = require('text-to-svg');
const path = require('path');
const fs = require('fs');

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

function PostsFileList(rootPath) {
    const files = fs.readdirSync(rootPath);
    let fileNames = [];
    files.forEach(item => {
        const itemPath = path.join(rootPath, item);
        const stat = fs.statSync(itemPath);
        if (stat.isFile()) {
            fileNames.push(itemPath);
        }
        if (stat.isDirectory()) {
            let dirFiles = PostsFileList(itemPath);
            fileNames = fileNames.concat(dirFiles);
        }
    });
    return fileNames;
}
module.exports = {
    text2svg,
    PostsFileList
};