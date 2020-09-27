const path = require('path');
const fs = require('fs-extra');
const cachePath = require('../constants/cachePath');
/**
 * @description
 * @param {string} filePath 文件路径
 * @param {Buffer} compositeBuffer 文件buffer
 */
function setImageCache(filePath, compositeBuffer) {
    fs.outputFileSync(path.join(process.cwd(), cachePath, filePath), compositeBuffer, {
        encoding: 'binary'
    });
}

/**
 * @description
 * @param {string} filePath 文件路径
 * @returns {Buffer} fileBUffer
 */
function GetImageCache(filePath) {
    return fs.readFileSync(path.join(process.cwd(), cachePath, filePath));
}


/**
 * @description 返回缓存区文件路径
 * @param {string} filePath 文件路径
 * @returns {string}
 */
function GeneralCacheFilePath(filePath) {
    return path.join(cachePath, filePath);
}

module.exports = {
    setImageCache,
    GetImageCache,
    GeneralCacheFilePath
};