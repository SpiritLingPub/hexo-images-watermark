const fs = require('fs-extra');
const path = require('path');
const cachePath = require('../constants/cachePath');
/**
 * @description 判断已有渲染图片和准备渲染图片路径是否一致
 * @param {string} currentFilePath
 * @return {boolean} 一致返回true，否则返回false
 */
function IsEqual(currentFilePath) {
    const fileCachePath = path.join(process.cwd(), cachePath, currentFilePath);
    return fs.pathExistsSync(fileCachePath);
}

module.exports = IsEqual;