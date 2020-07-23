严格遵循 [Semantic Versioning 2.0.0](http://semver.org/lang/zh-CN/) 语义化版本规范。

# 2.2.0

`2020-07-23`

-   🐛 fix :
    -   修复问题 [#14](https://github.com/SpiritLingPub/hexo-images-watermark/issues/14)
-   🆕 feat :
    -   新增参数 `directory` ，可以自定义配置渲染的目录

## 新增参数 `directory` 使用

渲染图片水印是在`public`生成后，所以目录指定为`public`下的目录

比如你的文章都在 `public/post` 下，你可以设置为：

```yml
watermark:
    directory:
        - posts
```

但是你的主题如果是其他，生成的文章可以是在 `public/2019`，`public/2020`这种目录下，可以设置为：

```yml
watermark:
    directory:
        - 2019
        - 2020
```

甚至如果你只想对某个文章处理水印，可以设置为：

```yml
watermark:
    directory:
        - 2019
        - 2020/07/09/example
```

# 2.1.0

`2020-07-03`

-   🛠 README 中的一些内容[1#card-41138753](https://github.com/SpiritLingPub/hexo-images-watermark/projects/1#card-41138753)
-   🆕 新增一些配置[1#card-41189622](https://github.com/SpiritLingPub/hexo-images-watermark/projects/1#card-41189622)

# 2.0.0

`2020-07-02`

-   🔥 对 1.1.x 版本进行优化，虽然兼容 1.1.x 版本，但是因为重构了代码，所以更新了大版本
-   🔥 添加动态图片处理
-   🔥 增加超限处理
