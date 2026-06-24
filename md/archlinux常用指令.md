---
title: 📘Archlinux常用指令
date: 2025-06-11 17:13:23
categories: [Linux]
tags: [ArchLinux, Command]
---
---
# Arch Linux 常用命令手册

## Arch Linux 简介

**Arch Linux** 是一个独立开发的开源 Linux 发行版，以**简洁**、**灵活**和**滚动更新**为核心设计理念。它面向高级用户，提供高度自定义的操作系统环境，广泛应用于桌面、服务器和开发场景。

### 核心特点
- **滚动更新**：持续提供最新软件包，无需等待大版本升级。
- **高度自定义**：用户可完全控制系统组件，构建个性化环境。
- **简洁设计**：默认安装最小化系统，仅包含核心组件。
- **包管理工具**：使用 `pacman` 作为包管理器，高效管理软件包。
- **活跃社区**：Arch Wiki 提供详尽文档，社区支持强大。
- **免费开源**：完全由社区驱动，无商业限制。

### Arch Linux 与衍生发行版
Arch Linux 本身不提供预配置的桌面环境或开箱即用的体验，适合有经验的用户。若需更简单的安装流程，可选择衍生发行版：
- **Manjaro**：基于 Arch，提供用户友好的安装程序和预配置桌面环境。
- **EndeavourOS**：接近原生 Arch 体验，简化安装并提供社区支持。

---

## 常用命令详解

以下是 Arch Linux 在包管理、系统管理、用户权限、网络、文件操作和服务管理方面的常用命令，包含详细说明和使用场景。所有命令需在终端执行，部分命令需使用 `sudo` 提权。

### 包管理

Arch Linux 使用 `pacman`（Package Manager）作为默认包管理工具，结合 AUR（Arch User Repository）提供丰富的软件生态。

#### 同步软件包数据库
更新软件包数据库以获取最新软件信息。
```bash
sudo pacman -Syy
```
**场景**：在安装或更新软件前同步数据库。

#### 更新所有软件包
升级系统中的所有软件包到最新版本。
```bash
sudo pacman -Syu
```
**场景**：定期运行以保持系统最新，获取安全补丁。

#### 安装软件包
安装指定软件包及其依赖项。
```bash
sudo pacman -S <package_name>
# 示例
sudo pacman -S nginx
```
**场景**：安装 Web 服务器（如 Nginx）、编辑器（如 Vim）等。

#### 卸载软件包
移除指定软件包，保留配置文件。
```bash
sudo pacman -R <package_name>
# 示例
sudo pacman -R nginx
```
**场景**：移除不再需要的软件，注意备份数据。

#### 卸载软件包及其依赖
移除软件包及其未被其他包依赖的依赖项。
```bash
sudo pacman -Rns <package_name>
# 示例
sudo pacman -Rns nginx
```
**场景**：彻底清理不再使用的软件及其依赖。

#### 列出已安装软件包
显示系统中已安装的所有软件包。
```bash
pacman -Q
```
**场景**：检查是否安装了特定软件或审计系统软件清单。

#### 清理缓存
清除未使用的软件包缓存，释放磁盘空间。
```bash
sudo pacman -Sc
```
**场景**：缓存占用过多空间时使用。

#### 查看软件包信息
显示指定软件包的详细信息，如版本、描述和依赖。
```bash
pacman -Si <package_name>
# 示例
pacman -Si vim
```
**场景**：在安装前了解软件包详情。

#### 搜索软件包
根据关键字搜索可用软件包。
```bash
pacman -Ss <keyword>
# 示例
pacman -Ss python
```
**场景**：查找与 Python 相关的软件包。

#### 安装 AUR 软件包
使用 AUR 助手（如 `yay` 或 `paru`）安装 AUR 软件包。
```bash
yay -S <package_name>
# 示例
yay -S visual-studio-code-bin
```
**场景**：从 AUR 安装社区维护的软件包。

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
显示 Arch Linux 的版本信息。
```bash
cat /etc/os-release
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
# 或者更现代的替代工具
htop
```
**场景**：监控系统性能，识别高资源占用进程（需安装 `htop`）。

#### 查找特定进程
搜索正在运行的进程。
```bash
ps aux | grep <process_name>
# 示例
ps aux | grep nginx
```
**场景**：定位特定进程以检查状态或终止。

### 用户和权限管理

管理用户账户、权限和组的常用命令。

#### 添加新用户
创建新用户账户并设置主目录。
```bash
sudo useradd -m <username>
```
**场景**：为新用户（如管理员或开发者）创建账户。

#### 设置用户密码
为指定用户设置或更改密码。
```bash
sudo passwd <username>
```
**场景**：确保用户账户安全。

#### 删除用户
删除指定用户及其主目录。
```bash
sudo userdel -r <username>
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
**场景**：授予用户管理员权限（`wheel` 组）。

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
ip link
```
**场景**：查看网络接口状态。

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
ip route
```
**场景**：排查网络路由问题。

#### 显示当前网络连接
显示当前活动的网络连接和监听端口。
```bash
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
检查防火墙服务（`ufw` 或 `firewalld`）是否运行。
```bash
sudo systemctl status ufw
# 或
sudo systemctl status firewalld
```
**场景**：确认防火墙是否启用（需安装 `ufw` 或 `firewalld`）。

#### 启用防火墙
启动防火墙服务。
```bash
sudo systemctl start ufw
# 或
sudo systemctl start firewalld
```
**场景**：确保系统安全。

#### 添加防火墙规则
开放指定端口以允许流量。
```bash
sudo ufw allow <port>/tcp
# 示例
sudo ufw allow 80/tcp
# 或使用 firewalld
sudo firewall-cmd --add-port=<port>/tcp --permanent
```
**场景**：为 Web 服务器开放 HTTP 端口。

#### 重新加载防火墙配置
应用防火墙配置更改。
```bash
sudo ufw reload
# 或
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
移动文件或目录，或重命名。
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

管理系统服务的常用命令（基于 `systemd`）。

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

本文整理了 Arch Linux 的常用命令，涵盖包管理、系统管理、用户权限、网络、文件操作和服务管理等方面，适合初学者和高级用户快速参考。