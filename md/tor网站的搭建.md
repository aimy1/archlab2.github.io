---
title: tor(暗网地址)网站的搭建
date: 2025-06-16 22:44:22
categories: [Security]
tags: [Tor, Network]
---
---
<h1 style="text-align: center; color: crimson;">
  后续更新详细说明
</h1>
## 搭建步骤：
1、你需要准备一个VPS或者服务器，你可以使用免费的、或者自行购买，如果没有可以自己去获取https://www.vultr.com/

 在里面开通VPS，然后通过 WindTerm 远程连接工具进行连接[点击下载 ](https://github.com/kingToolbox/WindTerm/releases/tag/2.5.0)

2、安装洋葱服务，执行下方的安装命令：
```bash
apt-get install tor
```
3、在 /etc/tor/torrc 下去除下方代码前面的#号，并修改反代80端口
```bash
#HiddenServiceDir /var/lib/tor/hidden_service/
#HiddenServicePort 80 127.0.0.1:80
```
修改后如下
```bash
#HiddenServiceDir /var/lib/tor/hidden_service/
#HiddenServicePort 80 127.0.0.1:8888
```
4、然后执行重启tor服务命令（注意要先关闭SELinux ）
```bash
service tor restart
```
重启后就会在/var/lib/tor/hidden_service 文件下生成属于你自己的暗网域名，它是完全免费的，可以自由生成！
```bash
dmr66yoi7y6xwvwhpm2qzsyboiq5n4at5d4frwaid25z64kwqs5hbqyd.onion
```
5、生成洋葱域名后，就是部署网站服务器环境了，老手推荐自己手动部署，当然对于新手来说，为了降低难度，你可以选择服务器面板进行安装，比如可以选择开源的1panel面板，一键部署命令如下：
```bash
bash -c "$(curl -sSL https://resource.fit2cloud.com/1panel/package/v2/quick_start.sh)"
```