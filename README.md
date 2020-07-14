# hexo-images-watermark

![favico](./public/images/android-chrome-192x192.png)

[![Build Status](https://travis-ci.com/SpiritLingPub/hexo-images-watermark.svg?branch=master)](https://travis-ci.com/SpiritLingPub/hexo-images-watermark) [![npm version](https://img.shields.io/npm/v/hexo-images-watermark?label=npm%20version)](https://www.npmjs.com/package/hexo-images-watermark) [![npm package download](https://img.shields.io/npm/dm/hexo-images-watermark?label=npm%20downloads)](https://www.npmjs.com/package/hexo-images-watermark) [![NPM License](https://img.shields.io/npm/l/hexo-images-watermark)](https://spdx.org/licenses/GPL-3.0-only.html)

一款用于 Hexo 静态博客网站生成时对图片添加水印。

不对原图产生任何影响，在网站静态页构建过程中将原图读取，输出添加了水印的图片。

在构建的静态网站中不会存在原图，只存在水印图片。

> **一定要阅读最后的提示事项，包含现有版本的支持情况和即将添加的功能**

使用 `npm` 安装插件

```shell
npm install hexo-images-watermark
```

使用 `yarn` 安装插件

```shell
yarn add hexo-images-watermark
```

在站点配置文件 `_config.yml` 中进行如下配置：

```yml
watermark:
    enable: true
    textEnable: true
    rotate: -45
    gravity: centre
```

在 `hexo generate` 运行后会自动为你的 `post` 目录下的图片添加水印，新的图片将会覆盖 `public/post` 下原本的图片，而对 `source` 源图片不会产生影响。

**🚀 [无法安装问题解决](https://github.com/SpiritLingPub/hexo-images-watermark/wiki)**

**🚀 [查看支持类型](#todo-list)**

**[更新日志](CHANGELOG.md)**

从 `2.0.0` 开始支持动态图片 gif 图添加水印，但是位置只能是中间位置，并且一旦水印图片大于源图，则会报错。

水印图片大于源图报错问题目前只存在 gif 动态图上，静态图在本版本中已修复。如果依旧希望能够渲染上去，保持参数 `bigSkip`为`false`，则会自动缩放，以适应源图大小。

如果 `bigSkip`为`true`，默认值时，则会跳过不渲染，并且输出黄色警告此图片太小。

## 参数

### 基本参数

| 字段        | 是否必须 | 默认值 | 说明                                                                |
| ----------- | :------: | ------ | ------------------------------------------------------------------- |
| enable      |    ✅    | false  | `true` 将会执行图片添加水印，`false` 将会不执行添加                 |
| textEnable  |          | false  | 是否使用文本来添加水印（❌ 警告：目前不支持文本和图片同时添加水印） |
| imageEnable |          | false  | 是否使用图片来添加水印（❌ 警告：目前不支持文本和图片同时添加水印） |
| static      |          | true   | 是否渲染静态图                                                      |
| dynamic     |          | true   | 是否渲染动态图                                                      |
| log         |          | true   | 是否输出日志信息                                                    |

### `text` 和 `image` 共通参数（始终有作用）

| 字段    | 是否必须 | 默认值    | 说明                                                                                      |
| ------- | :------: | --------- | ----------------------------------------------------------------------------------------- |
| gravity |          | southeast | 设置水印位置处于什么方向，以 `上北下南左东右西` 来确定（sharp 插件的配置）                |
| rotate  |          | 0         | 旋转角度，如`45`代表逆时针 45 度，`-45`代表顺时针 45 度                                   |
| bigSkip |          | true      | 是否跳过水印图片比原始图片大的，false，不跳过，按照原始图大小进行缩放，不保证缩放后的质量 |

gravity 参数可用值：

| 类型      | 说明 | 备注       |
| --------- | ---- | ---------- |
| centre    | 中央 | 图片正中间 |
| north     | 北   | 上方中间   |
| west      | 东   | 左边中间   |
| south     | 南   | 下边中间   |
| east      | 西   | 右边中间   |
| northwest | 东北 | 左上角     |
| southwest | 东南 | 左下角     |
| southeast | 西南 | 右下角     |
| northeast | 西北 | 右上角     |

### `text` 参数（只对文字水印起作用）

| 字段       | 是否必须 | 默认值                   | 说明                                                                                                     |
| ---------- | :------: | ------------------------ | -------------------------------------------------------------------------------------------------------- |
| text       |          | config.url \| SpiritLing | 尽量英文，中文需要引入字体，并且中文有可能发生其他错误，推荐就是不设置，使用 cofig.yml 中的 url          |
| fontPath   |          | undefined                | 例子：`source/static/font/custom.ttf`                                                                    |
| color      |          | rgb(169,169,167)         | 颜色可以使用 rgb,rgba,#xxxxxx 以及 red 名字式的                                                          |
| fontSize   |          | 18                       | 文本字体大小                                                                                             |
| background |          | transparent              | 配合 text 和 rotate 使用，指的是文字转成的图片一旦旋转会出现多余空白，设置这些地方的颜色，一般透明色即可 |

### `image` 参数（只对图片水印起作用）

| 字段           | 是否必须 | 默认值        | 说明                                         |
| -------------- | :------: | ------------- | -------------------------------------------- |
| watermarkImage |          | watermark.png | 水印图片，放置在 source 文件根路径的图片名称 |
| width          |          | 50            | 对图片进行缩放                               |
| height         |          | 50            | 对图片进行缩放                               |

## 例子

### 图片大于水印图片

-   原图

![原图](./public/images/normal.png)

-   处理后

![原图](./public/images/normal_.png)

#### 图片小于水印图片，并且 bigSkip 为 false

-   原图

![原图](./public/images/small.jpg)

-   处理后

![原图](./public/images/small_.jpg)

#### 动态图

-   原图

![原图](./public/images/dynamic.gif)

-   处理后

![原图](./public/images/dynamic_.gif)

## TODO LIST

-   [x] 文字水印
    -   [x] 自定义文字，颜色，大小
    -   [x] 自定义字体 - 2019-12-24 Done
    -   [ ] 支持循环添加
    -   [x] 超限处理
-   [x] 图片水印
    -   [x] 自定义水印图片
    -   [ ] 远程水印图片
    -   [ ] 支持循环添加
    -   [x] 超限处理
-   [x] 位置
    -   [x] 固定位置：九个方位
    -   [ ] 自定义 top，left
-   [x] 旋转
-   [x] 缩放（仅限图片）
-   [x] 其他格式支持
    -   [x] GIF 动图
        -   [x] 固定位置：中间

## 使用注意事项 ⚠️⚠️⚠️

1. 暂不支持图片和文字共同添加
2. 只支持`source/_posts`文件夹下的图片，也就是文章本地图片
3. 水印图片也不支持远程和非 soucre 根路径下的文件，也是只支持 `*.jpg`,`*.jpeg`，`*.png` 三种格式静态图片
4. 动态图只支持 `source/_posts` 下的 `*.gif` 图片
5. 请使用 `1.1.x` 以上版本， `1.0.x` 是进行 Hexo api 相关测试时使用的，版本杂乱无章，使用 `1.0.x` 版本出现任何问题，概不理会
