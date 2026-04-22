---
title: 通过官方下载office
date: 2025-06-10 13:08:46
categories: [Software]
tags: [Office, Microsoft]
---
---
1.office 软件部署工具：https://www.microsoft.com/en-us/download/details.aspx?id=49117

2.office 版本自定义工具：https://config.office.com/deploymentsettings

3.基于KMS的 GVLK：https://learn.microsoft.com/zh-cn/deployoffice/vlactivation/gvlks

## 然后以管理员身份运行CMD 进入命令终端

## 下载命令：
```bash
setup /download config.xml
```
## 安装命令:
```bash
setup /configure config.xml
```

## 最后启动命令:
```bash
cd C:\Program Files\Microsoft Office\Office16
cscript ospp.vbs /sethst:kms.03k.org 
cscript ospp.vbs /act
```

## 注意：如果你安装的是32位版本，那么启动命令第一个要改成：
cd C:\Program Files (x86)\Microsoft Office\Office16