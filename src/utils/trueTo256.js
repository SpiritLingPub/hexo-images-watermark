// 参考地址：https://blog.jijian.link/2020-04-17/nodejs-watermark/
'use strict';

function colorTransfer(rgb) {
    var r = (rgb & 0x0F00000) >> 12;
    var g = (rgb & 0x000F000) >> 8;
    var b = (rgb & 0x00000F0) >> 4;
    return (r | g | b);
};

function colorRevert(rgb) {
    var r = (rgb & 0x0F00) << 12;
    var g = (rgb & 0x000F0) << 8;
    var b = (rgb & 0x00000F) << 4;
    return (r | g | b);
}

function getDouble(a, b) {
    var red = ((a & 0x0F00) >> 8) - ((b & 0x0F00) >> 8);
    var grn = ((a & 0x00F0) >> 4) - ((b & 0x00F0) >> 4);
    var blu = (a & 0x000F) - (b & 0x000F);
    return red * red + blu * blu + grn * grn;
}

function getSimulatorColor(rgb, rgbs, m) {
    var r = 0;
    var lest = getDouble(rgb, rgbs[r]);
    for (var i = 1; i < m; i++) {
        var d2 = getDouble(rgb, rgbs[i]);
        if (lest > d2) {
            lest = d2;
            r = i;
        }
    }
    return rgbs[r];
}

function transferTo256(rgbs) {
    var n = 4096;
    var m = 256;
    var colorV = new Array(n);
    var colorIndex = new Array(n);

    //初始化
    for (var i = 0; i < n; i++) {
        colorV[i] = 0;
        colorIndex[i] = i;
    }

    //颜色转换
    for (var x = 0; x < rgbs.length; x++) {
        for (var y = 0; y < rgbs[x].length; y++) {
            rgbs[x][y] = colorTransfer(rgbs[x][y]);
            colorV[rgbs[x][y]]++;
        }
    }

    //出现频率排序
    var exchange;
    var r;
    for (var i = 0; i < n; i++) {
        exchange = false;
        for (var j = n - 2; j >= i; j--) {
            if (colorV[colorIndex[j + 1]] > colorV[colorIndex[j]]) {
                r = colorIndex[j];
                colorIndex[j] = colorIndex[j + 1];
                colorIndex[j + 1] = r;
                exchange = true;
            }
        }
        if (!exchange) break;
    }

    //颜色排序位置
    for (var i = 0; i < n; i++) {
        colorV[colorIndex[i]] = i;
    }

    for (var x = 0; x < rgbs.length; x++) {
        for (var y = 0; y < rgbs[x].length; y++) {
            if (colorV[rgbs[x][y]] >= m) {
                rgbs[x][y] = colorRevert(getSimulatorColor(rgbs[x][y], colorIndex, m));
            } else {
                rgbs[x][y] = colorRevert(rgbs[x][y]);
            }
        }
    }
    return rgbs;
}

// 获取 rgba int 值
function getRgbaInt(bitmap, x, y) {
    const bi = (y * bitmap.width + x) * 4;
    return bitmap.data.readUInt32BE(bi, true);
}

// 设置 rgba int 值
function setRgbaInt(bitmap, x, y, rgbaInt) {
    const bi = (y * bitmap.width + x) * 4;
    return bitmap.data.writeUInt32BE(rgbaInt, bi);
}

// int 值转为 rgba
function intToRGBA(i) {
    let rgba = {};

    rgba.r = Math.floor(i / Math.pow(256, 3));
    rgba.g = Math.floor((i - rgba.r * Math.pow(256, 3)) / Math.pow(256, 2));
    rgba.b = Math.floor(
        (i - rgba.r * Math.pow(256, 3) - rgba.g * Math.pow(256, 2)) /
        Math.pow(256, 1)
    );
    rgba.a = Math.floor(
        (i -
            rgba.r * Math.pow(256, 3) -
            rgba.g * Math.pow(256, 2) -
            rgba.b * Math.pow(256, 1)) /
        Math.pow(256, 0)
    );
    return rgba;
};

// rgba int 转为 rgb int
function rgbaIntToRgbInt(i) {
    const r = Math.floor(i / Math.pow(256, 3));
    const g = Math.floor((i - r * Math.pow(256, 3)) / Math.pow(256, 2));
    const b = Math.floor(
        (i - r * Math.pow(256, 3) - g * Math.pow(256, 2)) /
        Math.pow(256, 1)
    );

    return r * Math.pow(256, 2) +
        g * Math.pow(256, 1) +
        b * Math.pow(256, 0);
};

// rgb int 转为 rgba int
function rgbIntToRgbaInt(i, a) {
    const r = Math.floor(i / Math.pow(256, 2));
    const g = Math.floor((i - r * Math.pow(256, 2)) / Math.pow(256, 1));
    const b = Math.floor(
        (i - r * Math.pow(256, 2) - g * Math.pow(256, 1)) /
        Math.pow(256, 0)
    );
    return r * Math.pow(256, 3) +
        g * Math.pow(256, 2) +
        b * Math.pow(256, 1) +
        a * Math.pow(256, 0);
};

/**
 * @interface Bitmap { data: Buffer; width: number; height: number;}
 * @param {Bitmap} bitmap
 */
module.exports = function (bitmap) {
    const width = bitmap.width;
    const height = bitmap.height;

    let rgbs = new Array();
    let alphas = new Array();

    for (let x = 0; x < width; x++) {
        rgbs[x] = rgbs[x] || [];
        alphas[x] = alphas[x] || [];
        for (let y = 0; y < height; y++) {
            // 由于真彩色转 256色 算法是使用 int rgb 计算，所以需要把获取到的 int rgba 转为 int rgb
            const rgbaInt = getRgbaInt(bitmap, x, y);
            rgbs[x][y] = rgbaIntToRgbInt(rgbaInt);
            alphas[x][y] = intToRGBA(rgbaInt).a;
        }
    }

    // 颜色转换
    const color = transferTo256(rgbs);

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            // 写入转换后的颜色
            setRgbaInt(bitmap, x, y, rgbIntToRgbaInt(color[x][y], alphas[x][y]));
        }
    }

    return bitmap;
};