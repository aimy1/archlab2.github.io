---
title: 📕Debian常用指令
date: 2025-06-11 16:42:10
categories: [Linux]
tags: [Debian, Command]
---
---
Debian 是一个开源、自由的操作系统，以其稳定性和安全性著称。它由全球的开发者社区维护，支持多种架构，如 x86、ARM 和 PowerPC。Debian 采用了包管理系统，通过 APT（Advanced Package Tool）来安装和管理软件，使得系统更新和维护非常方便。

Debian 的特点是高度的自由度和灵活性，用户可以根据需求选择不同的桌面环境（如 GNOME、KDE）和软件包。由于其稳定性，Debian 常被用作服务器操作系统，也被许多其他 Linux 发行版（如 Ubuntu）作为基础。Debian 的发布周期较长，但每个版本都经过严格测试，确保系统的可靠性和安全性。

---

 ## 包管理相关
 Debian 使用 APT（Advanced Package Tool）进行软件包管理，以下是常用命令：

更新软件包列表
```bash 
sudo apt update
```
升级已安装的软件包
```bash
sudo apt upgrade
```
全面升级（包含处理依赖）
```bash
sudo apt full-upgrade
```
安装软件包
```bash
sudo apt install <package_name>
```
卸载软件包
```bash
sudo apt remove <package_name>
```
彻底卸载软件包
```bash
sudo apt purge <package_name>
```
清理下载的包缓存
```bash
sudo apt clean
```
移除不再需要的依赖
```bash
sudo apt autoremove
```
列出所有已安装的软件包
```bash
dpkg -l
```
检查特定软件包是否安装
```bash
dpkg -l | grep <package_name>
```
显示软件包详细信息
```bash
apt show <package_name>
```
搜索可用的软件包
```bash
apt search <keyword>
```
---
## 系统管理
查看当前运行的内核版本
```bash
uname -r
```
显示系统信息
```bash
uname -a
```
查看操作系统版本
```bash
lsb_release -a
```
查看磁盘使用情况
```bash
df -h
```
查看内存使用情况
```bash
free -h
```
查看当前加载的模块
```bash
lsmod
```
加载模块
```bash
sudo modprobe <module_name>
```
卸载模块
```bash
sudo modprobe -r <module_name>
```
重启系统
```bash
sudo reboot
```
关机
```bash
sudo poweroff
```
查看系统启动时间
```bash
uptime
```
列出所有硬盘分区
```bash
lsblk
```
检查硬盘空间使用情况
```bash
du -sh <path>
```
查看系统当前运行的服务
```bash
systemctl list-units --type=service
```
---
## 用户和权限管理
添加新用户
```bash
sudo adduser <username>
```
删除用户
```bash
sudo deluser <username>
```
切换用户
```bash
su - <username>
```
查看当前用户
```bash
whoami
```
修改用户密码
```bash
passwd <username>
```
列出系统中的所有用户
```bash
cut -d: -f1 /etc/passwd
```
查看用户组信息
```bash
groups <username>
```
添加用户到组
```bash
sudo usermod -aG <group> <username>
```
修改文件权限
```bash
chmod <permissions> <file>
```
例如：chmod 755 script.sh

修改文件所属用户和组
```bash
chown <user>:<group> <file>
```
例如：chown root:root /etc/myconfig.conf

---
## 网络相关
查看网络状态
```bash
ip addr
```
显示网络接口信息
```bash
ifconfig
```
测试网络连通性
```bash
ping <hostname or IP>
```
查看路由表
```bash
route -n
```
显示网络连接统计
```bash
netstat -i
```
查看端口占用情况
```bash
sudo netstat -tuln
或
ss -tuln
```
下载文件
```bash
wget <url>
或
curl -O <url>
```
上传文件至FTP服务器
```bash
ftp <hostname>
```
显示当前网络连接
```bash
lsof -i
```
文件操作
查看当前目录内容
```bash
ls -l
```
显示隐藏文件
```bash
ls -a
```
复制文件或目录
```bash
cp <source> <destination>
```
移动或重命名文件
```bash
mv <source> <destination>
```
删除文件
```bash
rm <file>
```
删除目录及其内容
```bash
rm -r <directory>
```
创建目录
```bash
mkdir <directory>
```
创建多层级目录
```bash
mkdir -p <parent_directory>/<sub_directory>
```
压缩文件
```bash
tar -czvf <archive_name>.tar.gz <directory>
```
解压缩文件
```bash
tar -xzvf <archive_name>.tar.gz
```
列出压缩文件内容
```bash
tar -tzvf <archive_name>.tar.gz
```
更改文件名大小写
```bash
rename 'y/A-Z/a-z/' *
```
计算文件的MD5校验值
```bash
md5sum <file>
```
查找文件
```bash
find <directory> -name <filename>
```
---
## 日志查看
查看系统日志
```bash
sudo journalctl
```
实时查看日志
```bash
sudo tail -f /var/log/syslog
```
查看特定服务日志
```bash
sudo journalctl -u <service_name>
```
清理旧日志
```bash
sudo journalctl --vacuum-time=7d
```
---
## 服务管理
启动服务
```bash
sudo systemctl start <service_name>
```
停止服务
```bash
sudo systemctl stop <service_name>
```
重启服务
```bash
sudo systemctl restart <service_name>
```
查看服务状态
```bash
sudo systemctl status <service_name>
```
开机启用服务
```bash
sudo systemctl enable <service_name>
```
禁用开机自启服务
```bash
sudo systemctl disable <service_name>
```
---
## 开发与调试
查看系统日志实时更新
```bash
dmesg -w
```
编译C语言代码
```bash
gcc -o <output_file> <source_file.c>
```
检查文件打开数限制
```bash
ulimit -n
```
设置临时环境变量
```bash
export <variable_name>=<value>
```
测试脚本执行时间
```bash
time <command>
```
补充
可能还落下了一些常用的代码，后续会持续更新。
