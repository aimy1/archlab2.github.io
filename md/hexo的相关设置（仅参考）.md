---
title: hexo的相关设置（仅参考）
date: 2025-06-09 17:49:22
categories: [Blog]
tags: [Hexo, Configuration]
---
# 先从最基本的开始
### 初始化 Hexo 项目
```bash
mkdir hexo（建立一个叫hexo的文件）
cd hexo（进入这个文件夹下）
hexo init（初始化）
npm install
```
# 启动本地服务器浏览器查看效果
```bash
hexo server
```
### 然后安装主题
安装好之后在_config.yml  修改theme:（主题名称）
添加仓库：
deploy:
  type: git
  repo: https://github.com/aimy1/book.github.io.git

  ## 安装一键部署的工具
  ```bash
  npm install hexo-deployer-git --save
  ```
  运行三合一
  ```bash
  hexo cl & hexo g *& hexo s
  ```
  推送的命令（从新修改本地的推到github,最简单就这一条）
  ```bash
  hexo d
  ```
  # post.md模版，仅供参考
  ```bash
  ---
title: {{ title }} #【必需】页面标题
date: {{ date }} #【必需】页面创建日期
updated: #【可选】页面更新日期
tags: #【可选】文章标签
categories: #【可选】文章分类
keywords: #【可选】文章关键字
description: #【可选】文章描述
top: # 1 置顶
top_img: #【可选】文章顶部图片
comments: #【可选】显示文章评论模块(默认 true)
cover: https://img.090227.xyz/file/ae62475a131f3734a201c.png #【可选】文章缩略图(如果没有设置 top_img,文章页顶部将显示缩略图，可设为 false/图片地址/留空)
toc: #【可选】显示文章 TOC(默认为设置中 toc 的 enable 配置)
toc_number: #【可选】显示 toc_number(默认为设置中 toc 的 number 配置)
toc_style_simple: #【可选】显示 toc 简洁模式
copyright: #【可选】显示文章版权模块(默认为设置中 post_copyright 的 enable 配置)
copyright_author: #【可选】文章版权模块的文章作者
copyright_author_href: #【可选】文章版权模块的文章作者链接
copyright_url: #【可选】文章版权模块的文章作者链接
copyright_info: #【可选】文章版权模块的版权声明文字
mathjax: #【可选】显示 mathjax(当设置 mathjax 的 per_page: false 时，才需要配置，默认 false)
katex: #【可选】显示 katex(当设置 katex 的 per_page: false 时，才需要配置，默认 false)
aplayer: #【可选】在需要的页面加载 aplayer 的 js 和 css,请参考文章下面的音乐 配置
highlight_shrink: #【可选】配置代码框是否展开(true/false)(默认为设置中 highlight_shrink 的配置)
aside: #【可选】显示侧边栏 (默认 true)
swiper_index: 10 #【可选】首页轮播图配置 index 索引，数字越小越靠前
top_group_index: 10 #【可选】首页右侧卡片组配置, 数字越小越靠前
ai: #【可选】文章ai摘要
background: "#fff" #【可选】文章主色，必须是16进制颜色且有6位，不可缩减，例如#ffffff 不可写成#fff
---

<div class="video-container">
[up主专用，视频内嵌代码贴在这]
</div>

<style>
.video-container {
    position: relative;
    width: 100%;
    padding-top: 56.25%; /* 16:9 aspect ratio (height/width = 9/16 * 100%) */
}

.video-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>
```
# page.md模版，仅供参考
```bash
---
title: {{ title }} #【必需】页面标题
date: {{ date }} #【必需】页面创建日期
type: #【必需】标签、分类、关于、音乐馆、友情链接、相册、相册详情、朋友圈、即刻页面需要配置
updated: #【可选】页面更新日期
comments: #【可选】显示页面评论模块(默认 true)
description: #【可选】页面描述
keywords: #【可选】页面关键字
top_img: https://img.090227.xyz/file/ae62475a131f3734a201c.png #【可选】页面顶部图片
mathjax: #【可选】显示 mathjax(当设置 mathjax 的 per_page: false 时，才需要配置，默认 false)
katex: #【可选】显示 katex(当设置 katex 的 per_page: false 时，才需要配置，默认 false)
aside: #【可选】显示侧边栏 (默认 true)
aplayer: #【可选】在需要的页面加载 aplayer 的 js 和 css,请参考文章下面的音乐 配置
highlight_shrink: #【可选】配置代码框是否展开(true/false)(默认为设置中 highlight_shrink 的配置)
top_single_background: #【可选】部分页面的顶部模块背景图片
---
```
# 新建博文命令
```bash
hexo new 这是一篇新的博文
```
# 开启本地搜索
```bash
npm install hexo-generator-search --save
```
## 设置主题配置文件
```bash
local_search:
  enable: true
  preload: false
  CDN:
  ```
