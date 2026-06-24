---
title: 📔CentOS常用指令
date: 2025-06-11 17:12:55
categories: [Linux]
tags: [CentOS, Command]
---
---
# CentOS 常用命令手册

## CentOS 简介

**CentOS**（Community Enterprise Operating System）是一个基于 **Red Hat Enterprise Linux (RHEL)** 源代码重新编译的开源 Linux 发行版，提供免费、稳定、企业级的操作系统环境。它广泛应用于服务器、云计算、虚拟化场景，以及运行 Web 服务器、数据库、邮件服务等企业级应用。

### 核心特点
- **高稳定性**：以可靠性和稳定性著称，适合关键任务的长期运行。
- **长期支持**：每个主要版本提供约 10 年的支持周期，确保长期维护和安全更新。
- **丰富生态**：支持广泛的软件包，兼容 RHEL 的软件生态。
- **包管理工具**：使用 `yum`（早期版本）或 `dnf`（CentOS 8 及以上）进行软件包管理，操作简单高效。
- **免费使用**：完全开源，社区驱动，无需许可费用。

### CentOS Stream 及替代品
自 2021 年起，CentOS 转向 **CentOS Stream**，这是一个滚动更新的发行版，与 RHEL 的开发流程紧密结合，适合需要最新功能和快速迭代的开发者。传统 CentOS（CentOS 7、8 等）已停止常规更新：
- **CentOS 7**：支持至 2024 年 6 月。
- **CentOS 8**：支持已于 2021 年底停止。

为填补传统 CentOS 的空缺，社区推出了以下替代品：
- **Rocky Linux**：由 CentOS 创始人之一发起，目标是提供与传统 CentOS 一致的体验。
- **AlmaLinux**：由 CloudLinux 团队支持，注重稳定性与企业级需求。

两者均为免费、稳定、RHEL 兼容的替代品，适合企业用户和社区开发者。

---

## 常用命令详解

以下是 CentOS 在包管理、系统管理、用户权限、网络、文件操作和服务管理方面的常用命令，包含详细说明和使用场景。所有命令需在终端执行，部分命令需使用 `sudo` 提权。

### 包管理

CentOS 使用 `yum`（Yellowdog Updater Modified，早期版本）或 `dnf`（Dandified YUM，CentOS 8 及以上默认）进行软件包管理。`dnf` 是 `yum` 的升级版，性能更优，语法基本兼容。

#### 更新所有软件包
更新系统中的所有软件包到最新版本，但不升级内核或主要系统组件。
```bash
sudo yum update
# 或
sudo dnf update
```
**场景**：定期运行以获取安全补丁和软件更新。

#### 升级系统（包括内核）
升级所有软件包，包括内核和系统核心组件，可能需要重启。
```bash
sudo yum upgrade
# 或
sudo dnf upgrade
```
**场景**：需要最新内核功能或修复内核漏洞时使用。

#### 安装软件包
安装指定软件包及其依赖项。
```bash
sudo yum install <package_name>
# 或
sudo dnf install <package_name>
# 示例
sudo dnf install nginx
```
**场景**：安装 Web 服务器（如 Nginx）、数据库（如 MySQL）等。

#### 卸载软件包
移除指定软件包，保留配置文件。
```bash
sudo yum remove <package_name>
# 或
sudo dnf remove <package_name>
# 示例
sudo dnf remove nginx
```
**场景**：不再需要某软件时使用，注意备份重要数据。

#### 列出已安装软件包
显示系统中已安装的所有软件包列表。
```bash
yum list installed
# 或
dnf list installed
```
**场景**：检查是否安装了特定软件或审核系统软件清单。

#### 清理缓存
清除 `yum` 或 `dnf` 的缓存文件，释放磁盘空间。
```bash
sudo yum clean all
# 或
sudo dnf clean all
```
**场景**：缓存占用过多空间或包管理器出现问题时使用。

#### 查看软件包信息
显示指定软件包的详细信息，如版本、描述和依赖。
```bash
yum info <package_name>
# 或
dnf info <package_name>
# 示例
dnf info vim
```
**场景**：在安装前了解软件包的详细信息。

#### 搜索软件包
根据关键字搜索可用软件包。
```bash
yum search <keyword>
# 或
dnf search <keyword>
# 示例
dnf search python
```
**场景**：查找与 Python 相关的软件包。

#### 启用/禁用特定仓库
从特定软件仓库安装软件包，需先启用仓库。
```bash
sudo yum --enablerepo=<repo_name> install <package_name>
# 或
sudo dnf --enablerepo=<repo_name> install <package_name>
# 示例
sudo dnf --enablerepo=epel install htop
```
**场景**：从 EPEL（Extra Packages for Enterprise Linux）等第三方仓库安装软件。

### 系统管理

以下命令用于查看系统状态、管理硬件资源和执行基本操作。

#### 查看内核版本
显示当前运行的 Linux 内核版本。
```bash
uname -r
```
**场景**：确认内核版本以检查兼容性或漏洞修复。

#### 显示系统信息
显示系统详细信息，包括内核、架构和主机名。
```bash
uname -a
```
**场景**：快速获取系统概况。

#### 查看操作系统版本
显示 CentOS 的版本信息。
```bash
cat /etc/centos-release
```
**场景**：确认系统版本以选择兼容的软件。

#### 显示 CPU 信息
显示 CPU 的详细信息，如核心数、型号和频率。
```bash
lscpu
```
**场景**：检查服务器硬件规格。

#### 查看内存使用情况
以人类可读格式（MB/GB）显示内存使用情况。
```bash
free -h
```
**场景**：监控内存占用，排查性能问题。

#### 查看磁盘使用情况
显示磁盘分区使用情况。
```bash
df -h
```
**场景**：检查磁盘空间是否充足。

#### 列出块设备信息
显示磁盘、分区和挂载点的详细信息。
```bash
lsblk
```
**场景**：规划磁盘分区或挂载新设备。

#### 重启系统
安全重启系统。
```bash
sudo reboot
```
**场景**：应用内核更新或解决系统问题。

#### 关机
安全关闭系统。
```bash
sudo poweroff
```
**场景**：服务器维护或下线时使用。

#### 检查系统启动时间
显示系统运行时间和负载情况。
```bash
uptime
```
**场景**：检查服务器运行时长或性能负载。

#### 查看当前运行进程
实时显示系统进程、CPU 和内存使用情况。
```bash
top
```
**场景**：监控系统性能，识别高资源占用进程。

#### 查找特定进程
搜索正在运行的进程。
```bash
ps aux | grep <process_name>
# 示例
ps aux | grep nginx
```
**场景**：定位特定进程（如 Nginx）以检查其状态或终止。

### 用户和权限管理

管理用户账户、权限和组的常用命令。

#### 添加新用户
创建新用户账户。
```bash
sudo adduser <username>
```
**场景**：为新用户（如管理员或开发者）创建账户。

#### 设置用户密码
为指定用户设置或更改密码。
```bash
sudo passwd <username>
```
**场景**：确保用户账户安全。

#### 删除用户
删除指定用户账户。
```bash
sudo userdel <username>
```
**场景**：移除不再需要的用户，注意备份用户数据。

#### 查看当前登录用户
显示当前登录系统的用户。
```bash
who
```
**场景**：检查有哪些用户正在使用系统。

#### 查看当前用户
显示当前操作用户的用户名。
```bash
whoami
```
**场景**：确认当前终端的身份。

#### 添加用户到组
将用户添加到指定组。
```bash
sudo usermod -aG <group> <username>
# 示例
sudo usermod -aG wheel username
```
**场景**：授予用户特定权限（如管理员权限）。

#### 修改文件权限
更改文件或目录的权限。
```bash
chmod <permissions> <file>
# 示例
chmod 755 script.sh
```
**场景**：设置脚本可执行权限或限制文件访问。

#### 修改文件所有者
更改文件或目录的所有者和所属组。
```bash
sudo chown <user>:<group> <file>
# 示例
sudo chown user:group document.txt
```
**场景**：将文件所有权转移给其他用户或组。

#### 列出用户组信息
显示指定用户的所属组。
```bash
groups <username>
```
**场景**：检查用户权限归属。

#### 查看系统所有用户
列出系统中所有用户账户。
```bash
cut -d: -f1 /etc/passwd
```
**场景**：审计系统用户列表。

### 网络管理

管理网络接口、连接和防火墙的常用命令。

#### 查看网络接口信息
显示网络接口的 IP 地址和状态。
```bash
ip addr
```
**场景**：检查网络配置或排查连接问题。

#### 显示网络配置
显示网络接口的详细配置。
```bash
ifconfig
```
**场景**：查看旧版网络配置（需安装 `net-tools`）。

#### 测试网络连通性
测试与目标主机的网络连接。
```bash
ping <hostname_or_IP>
# 示例
ping google.com
```
**场景**：验证网络是否正常。

#### 查看路由表
显示系统的网络路由信息。
```bash
route -n
```
**场景**：排查网络路由问题。

#### 显示当前网络连接
显示当前活动的网络连接和监听端口。
```bash
netstat -tuln
# 或
ss -tuln
```
**场景**：检查服务监听的端口。

#### 下载文件
从指定 URL 下载文件。
```bash
wget <url>
# 示例
wget https://example.com/file.tar.gz
```
**场景**：下载安装包或资源文件。

#### 上传文件至 FTP 服务器
连接到 FTP 服务器并上传文件。
```bash
ftp <hostname>
```
**场景**：通过 FTP 传输文件。

#### 查看防火墙状态
检查防火墙服务是否运行。
```bash
sudo systemctl status firewalld
```
**场景**：确认防火墙是否启用。

#### 启用防火墙
启动防火墙服务。
```bash
sudo systemctl start firewalld
```
**场景**：确保系统安全。

#### 添加防火墙规则
开放指定端口以允许流量。
```bash
sudo firewall-cmd --add-port=<port>/tcp --permanent
# 示例
sudo firewall-cmd --add-port=80/tcp --permanent
```
**场景**：为 Web 服务器开放 HTTP 端口。

#### 重新加载防火墙配置
应用防火墙配置更改。
```bash
sudo firewall-cmd --reload
```
**场景**：使新添加的规则生效。

### 文件操作

管理文件和目录的常用命令。

#### 列出当前目录内容
显示当前目录的文件和目录详细信息。
```bash
ls -l
```
**场景**：查看文件权限和所有者。

#### 显示隐藏文件
列出包含隐藏文件（以 `.` 开头）的目录内容。
```bash
ls -a
```
**场景**：检查配置文件或隐藏目录。

#### 创建目录
创建新目录。
```bash
mkdir <directory>
# 示例
mkdir my_folder
```
**场景**：创建项目或存储目录。

#### 复制文件或目录
复制文件或目录到目标位置。
```bash
cp <source> <destination>
# 示例
cp document.txt /backup/
```
**场景**：备份文件或复制配置。

#### 移动或重命名文件
移动文件或目录，或重供命名。
```bash
mv <source> <destination>
# 示例
mv document.txt new_document.txt
```
**场景**：重命名文件或移动到其他目录。

#### 删除文件
删除指定文件。
```bash
rm <file>
# 示例
rm temp.txt
```
**场景**：清理不需要的文件。

#### 删除目录及其内容
递归删除目录及其内容。
```bash
rm -r <directory>
# 示例
rm -r old_folder
```
**场景**：删除整个项目目录。

#### 压缩文件
将文件或目录压缩为 `.tar.gz` 格式。
```bash
tar -czvf <archive_name>.tar.gz <directory>
# 示例
tar -czvf backup.tar.gz my_folder
```
**场景**：备份目录或传输文件。

#### 解压缩文件
解压 `.tar.gz` 格式的压缩文件。
```bash
tar -xzvf <archive_name>.tar.gz
# 示例
tar -xzvf backup.tar.gz
```
**场景**：恢复备份或提取下载的文件。

#### 查找文件
在指定目录中查找文件。
```bash
find <directory> -name <filename>
# 示例
find /home -name "*.txt"
```
**场景**：定位丢失的文件。

#### 计算文件的 SHA256 校验值
计算文件的 SHA256 校验和。
```bash
sha256sum <file>
# 示例
sha256sum file.tar.gz
```
**场景**：验证文件完整性。

### 服务管理

管理系统服务的常用命令。

#### 启动服务
启动指定服务。
```bash
sudo systemctl start <service_name>
# 示例
sudo systemctl start nginx
```
**场景**：启动 Web 服务器。

#### 停止服务
停止指定服务。
```bash
sudo systemctl stop <service_name>
# 示例
sudo systemctl stop nginx
```
**场景**：暂停服务以进行维护。

#### 重启服务
重启指定服务。
```bash
sudo systemctl restart <service_name>
# 示例
sudo systemctl restart nginx
```
**场景**：应用服务配置更改。

#### 查看服务状态
检查指定服务的运行状态。
```bash
sudo systemctl status <service_name>
# 示例
sudo systemctl status nginx
```
**场景**：排查服务运行问题。

#### 启用服务自启动
设置服务在系统启动时自动运行。
```bash
sudo systemctl enable <service_name>
# 示例
sudo systemctl enable nginx
```
**场景**：确保关键服务开机自启。

#### 禁用服务自启动
禁止服务在系统启动时自动运行。
```bash
sudo systemctl disable <service_name>
# 示例
sudo systemctl disable nginx
```
**场景**：关闭不必要的自启服务。

---

## 补充说明

本文整理了 CentOS 的常用命令，涵盖包管理、系统管理、用户权限、网络、文件操作和服务管理等方面，适合初学者和管理员快速参考。