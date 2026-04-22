---
title: manjaro入门
date: 2025-06-10 00:27:17
categories: [Linux]
tags: [Manjaro, Tutorial]
---

---
# 本文为manjaro新手朋友解决系统入门使用问题
---
<img src="https://pub-5f3a5cbde802498dbb733b8d292edb17.r2.dev/manjaro_by_duschaan_dicvjpw.png" alt="图片描述">

## 1、换源
```bash
sudo pacman-mirrors -i -c China -m rank
```

这里推荐中科大源ustc

## pacman文件配置
```bash
sudo nano /etc/pacman.conf
```

在末尾插入
```bash
[archlinuxcn]
Server = https://mirrors.ustc.edu.cn/archlinuxcn/$arch
```

2、设置软件商店aur软件库
3、安装GPG Key
```bash
sudo pacman -S archlinuxcn-keyring
```

4、更新系统（这一步可以经常做）
```bash
sudo pacman -Syyu
```

5、双系统下系统时间统一（非必须）
```bash
timedatectl set-local-rtc 1 --adjust-system-clock
timedatectl set-ntp 0
```

6、寻找你需要的软件
https://wiki.archlinux.org/

软件安装方法：
（1）pacman安装：
```bash
sudo pacman -S 软件名
```

（2）yay安装：
```bash
yay -s 软件名
```

使用yay 需要先安装yay
```bash
sudo pacman -S yay
```

（3）添加删除软件搜索：
```bash
sudo pacman -R 软件名
```
