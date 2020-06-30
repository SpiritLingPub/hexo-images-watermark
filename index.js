/**
 * Created by SpiritLing
 * github: https://github.com/SpiritLing
 * web: https://blog.spiritling.cn
 */

'use strict';

var hexo = hexo || {};

hexo.extend.filter.register('after_generate', require('./lib/main'));