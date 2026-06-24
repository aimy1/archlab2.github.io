---
layout: 手机上安装linux
title: 🐭手机上安装 Linux(手机变电脑)🦢
date: 2025-06-11 14:59:52
categories: [Linux]
tags: [Mobile, Termux]
---
---
## 在手机上安装Linux，最常见、最方便的方法是通过Termux + proot。它不需要root权限，也不会破坏安卓系统.你可以在安卓手机上完整运行Ubuntu、Debian、Arch等Linux系统。
## 新手就别试了（推荐去用集成的软件）
下面是对在手机上通过 Termux + proot 技术运行 Linux 的详细介绍，适合初学者和开发者理解背后的原理与实际用途。
* 技术核心原理
Termux 是一个安卓上的终端模拟器和类 Linux 环境。
它允许你在 Android 上运行标准 Linux 工具，例如：bash, vim, gcc, python, ssh 等。
内置包管理器（pkg，类似于 apt）。
📌 但 Termux 自身不是完整的 Linux 发行版，这就需要用到下一位主角——proot。
proot 是一个用户空间的工具，模拟 chroot 环境（即切换根目录），让你在一个文件夹中“伪装成一个 Linux 系统”运行。
它不需要 root 权限，但可以“假装”成你换了整个系统。
它还能模拟某些系统调用（如 mount、link、execve 等）。
📌 proot 类似于一个“虚拟隔离沙箱”，在 Android 上模拟一个标准的 Linux 文件系统（rootfs）。
## 简化安装
proot-distro：封装简化安装过程
proot-distro 是一个辅助脚本工具，自动化了 proot 配置与 rootfs 下载。
一行命令就能安装 Ubuntu、Debian、Arch 等发行版。

## 使用Termux+proot你可以:在Android手机上运行完整的Linux系统.学习命令行、包管理、开发编程等,不需要 Root，几乎适用于所有设备,这是一种安全、轻便又强大的Linux模拟方式
---
# ✅ 方法：使用 Termux + proot 在手机上安装 Linux（无需 root）
步骤 1：安装 Termux
* 不要从 Play 商店安装，它的版本过旧。
推荐去 F-Droid 或 Termux 官方 GitHub 下载 APK：
GitHub 页面：https://github.com/termux/termux-app

步骤 2：更新并安装 proot-distro
打开 Termux 后输入以下命令：
```bash
pkg update
pkg upgrade
pkg install proot-distro

pkg update && pkg upgrade -y
pkg install proot-distro git wget -y

```

步骤 3：安装一个 Linux 发行版（以 Ubuntu 为例）
```bash
proot-distro install ubuntu
```
安装完成后运行：
```bash
proot-distro login ubuntu
```
现在你就进入了 Ubuntu 系统的 shell，像这样(默认是root用户)：root@localhost:~#

 ## 常见指令
查看支持的 Linux 版本：proot-distro list
安装其他系统（如 Debian）：proot-distro install debian
登录系统：proot-distro login debian
退出 Linux：exit

## 补充建议
可以安装 vim, gcc, python, apt 等等工具：
```bash
apt update
apt install vim python3
```

## ⚠️ 注意事项
不能运行图形界面（除非你配置VNC，后面说怎么配置）
不支持所有系统调用（但大多数CLI软件都能正常使用）
推荐给开发者、学习Linux、写脚本等用途


# 配置桌面（更推荐LXQT，会配置无所谓）
## 安装 Xfce 桌面环境 + VNC Server
* 在 Ubuntu 环境下执行以下命令（一次性复制粘贴）：
```bash
apt update && apt install xfce4 xfce4-goodies tightvncserver -y
```
## 配置 VNC Server
初始化 VNC 密码（第一次运行）：
```bash
vncserver :1
```
系统会提示你设置密码（建议设置6-8位，不能太短）。它还会创建配置文件。

## 然后停止服务器：
```bash
vncserver -kill :1
```

## 创建 Xfce 启动脚本：
```bash
echo '#!/bin/bash
xrdb $HOME/.Xresources
startxfce4 &' > ~/.vnc/xstartup

chmod +x ~/.vnc/xstartup
```

## 启动图形界面服务
```bash
vncserver :1
```
## 手机上安装 VNC Viewer 客户端
从 Google Play 或酷安下载 VNC Viewer
添加连接：
地址：127.0.0.1:5901
名称：Ubuntu Desktop
点击连接，输入你设置的密码，即可看到 Ubuntu 桌面！

## 退出桌面：直接关闭 VNC Viewer 应用即可
停止服务：
```bash
vncserver -kill :1
```

## 下次重新登录 Ubuntu 后启动 VNC：
```bash
proot-distro login ubuntu
vncserver :1
```
# 可选增强（进阶玩法）
## 安装中文输入法（不只要这一个中文包）：
```bash
apt install fcitx fcitx-googlepinyin
```
## 安装浏览器：
```bash
apt install firefox
```
## 安装 Python 开发环境：
```bash
apt install python3 pip
```





