'use strict';

const Text2SVG = require('text-to-svg');
const path = require('path');
async function text2svg(options) {
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
module.exports = text2svg;