---
title: 📃Windows常用指令
date: 2025-06-11 17:22:24
categories: [Windows]
tags: [Windows, Command]
---
---
# Windows 常用命令手册

## Windows 简介

**Microsoft Windows** 是一个广泛使用的商业操作系统，以其用户友好的图形界面和广泛的软件兼容性著称。它适用于个人电脑、服务器、工作站和嵌入式设备，覆盖桌面、游戏、办公和企业级应用等多种场景。

### 核心特点
- **图形化界面**：直观的 GUI，适合各种用户水平。
- **广泛兼容性**：支持大量软件和硬件，拥有丰富的生态系统。
- **持续更新**：通过 Windows Update 提供安全补丁和功能升级。
- **包管理工具**：现代 Windows 系统支持 `winget`，简化软件安装。
- **企业支持**：Windows Server 提供企业级功能，如 Active Directory。
- **多样化版本**：包括 Windows 10、11、Windows Server 等，满足不同需求。

### Windows 生态
Windows 是全球最流行的桌面操作系统，拥有强大的社区和商业支持。用户可通过 Microsoft Store、winget 或手动安装软件来扩展功能。Windows Subsystem for Linux (WSL) 允许在 Windows 上运行 Linux 环境，增强了开发者的灵活性。

---

## 常用命令详解

以下是 Windows 在包管理、系统管理、用户权限、网络、文件操作和服务管理方面的常用命令，包含详细说明和使用场景。命令主要在 **命令提示符 (CMD)** 或 **PowerShell** 中执行，部分命令需以管理员权限运行（右键选择“以管理员身份运行”）。

### 包管理

Windows 10/11 引入了 `winget`，一个命令行包管理工具，类似 Linux 的包管理器。传统上，软件通过手动下载安装或 Microsoft Store 管理。

#### 更新 winget 源
同步 winget 的软件包数据库。
```powershell
winget source update
```
**场景**：确保软件源是最新的。

#### 升级所有软件包
更新通过 winget 安装的所有软件到最新版本。
```powershell
winget upgrade --all
```
**场景**：保持系统软件最新。

#### 安装软件包
通过 winget 安装指定软件。
```powershell
winget install <package_name>
# 示例
winget install Mozilla.Firefox
```
**场景**：快速安装浏览器、编辑器等软件。

#### 卸载软件包
移除通过 winget 安装的软件。
```powershell
winget uninstall <package_name>
# 示例
winget uninstall Mozilla.Firefox
```
**场景**：删除不再需要的软件。

#### 列出已安装软件包
显示通过 winget 安装的软件列表。
```powershell
winget list
```
**场景**：检查已安装的软件。

#### 搜索软件包
根据关键字搜索 winget 软件源中的软件。
```powershell
winget search <keyword>
# 示例
winget search python
```
**场景**：查找 Python 相关的软件。

#### 查看软件包信息
显示指定软件包的详细信息。
```powershell
winget show <package_name>
# 示例
winget show VSCode
```
**场景**：在安装前了解软件详情。

### 系统管理

以下命令用于查看系统状态、管理硬件资源和执行基本操作。

#### 查看系统版本
显示 Windows 的版本信息。
```powershell
systeminfo | findstr /C:"OS Name" /C:"OS Version"
# 或在 CMD
ver
```
**场景**：确认系统版本以检查兼容性。

#### 显示系统信息
显示详细的系统信息，包括硬件和操作系统。
```powershell
systeminfo
```
**场景**：获取系统概况。

#### 显示 CPU 信息
显示 CPU 的详细信息。
```powershell
Get-WmiObject Win32_Processor | Select-Object Name, NumberOfCores, NumberOfLogicalProcessors
```
**场景**：检查处理器规格。

#### 查看内存使用情况
显示内存使用情况。
```powershell
Get-CimInstance Win32_OperatingSystem | Select-Object TotalVisibleMemorySize, FreePhysicalMemory
```
**场景**：监控内存占用。

#### 查看磁盘使用情况
显示磁盘分区的使用情况。
```powershell
Get-Disk
Get-Volume
```
**场景**：检查磁盘空间。

#### 重启系统
安全重启系统。
```powershell
Restart-Computer
# 或在 CMD
shutdown /r /t 0
```
**场景**：应用更新或解决系统问题。

#### 关机
安全关闭系统。
```powershell
Stop-Computer
# 或在 CMD
shutdown /s /t 0
```
**场景**：维护或下线系统。

#### 检查系统启动时间
显示系统运行时间。
```powershell
net statistics workstation | find "Statistics since"
```
**场景**：检查系统运行时长。

#### 查看当前运行进程
显示正在运行的进程。
```powershell
Get-Process
# 或在 CMD
tasklist
```
**场景**：监控系统性能。

#### 终止进程
终止指定进程。
```powershell
Stop-Process -Name <process_name>
# 示例
Stop-Process -Name notepad
# 或在 CMD
taskkill /IM notepad.exe /F
```
**场景**：关闭卡死的程序。

### 用户和权限管理

管理用户账户和权限的常用命令。

#### 添加新用户
创建新用户账户。
```powershell
New-LocalUser -Name "<username>" -Password (ConvertTo-SecureString "<password>" -AsPlainText -Force) -FullName "<full_name>" -Description "User account"
# 示例
New-LocalUser -Name "testuser" -Password (ConvertTo-SecureString "P@ssw0rd" -AsPlainText -Force) -FullName "Test User" -Description "Test account"
```
**场景**：为新用户创建账户。

#### 设置用户密码
更改用户密码。
```powershell
Set-LocalUser -Name "<username>" -Password (ConvertTo-SecureString "<new_password>" -AsPlainText -Force)
# 或在 CMD
net user <username> <new_password>
```
**场景**：更新用户密码。

#### 删除用户
删除指定用户账户。
```powershell
Remove-LocalUser -Name "<username>"
# 或在 CMD
net user <username> /delete
```
**场景**：移除不再需要的用户。

#### 查看当前登录用户
显示当前登录的用户。
```powershell
whoami
```
**场景**：确认当前用户身份。

#### 添加用户到组
将用户添加到指定组（如管理员组）。
```powershell
Add-LocalGroupMember -Group "Administrators" -Member "<username>"
# 或在 CMD
net localgroup Administrators <username> /add
```
**场景**：授予用户管理员权限。

#### 修改文件权限
更改文件或目录的权限。
```powershell
icacls "<path>" /grant "<username>:F"
# 示例
icacls "C:\Files" /grant "testuser:F"
```
**场景**：授予用户对文件的完全控制权限。

#### 修改文件所有者
更改文件或目录的所有者。
```powershell
takeown /F "<path>" /R /D Y
# 示例
takeown /F "C:\Files" /R /D Y
```
**场景**：转移文件所有权。

#### 列出用户组信息
显示指定用户的所属组。
```powershell
Get-LocalGroupMember -Group "Administrators"
# 或在 CMD
net localgroup Administrators
```
**场景**：检查用户权限归属。

#### 查看系统所有用户
列出系统中所有用户账户。
```powershell
Get-LocalUser
# 或在 CMD
net user
```
**场景**：审计用户列表。

### 网络管理

管理网络接口和连接的常用命令。

#### 查看网络接口信息
显示网络接口的 IP 地址和状态。
```powershell
Get-NetIPAddress
# 或在 CMD
ipconfig
```
**场景**：检查网络配置。

#### 测试网络连通性
测试与目标主机的网络连接。
```powershell
Test-Connection <hostname_or_IP>
# 示例
Test-Connection google.com
# 或在 CMD
ping google.com
```
**场景**：验证网络连接。

#### 查看路由表
显示网络路由信息。
```powershell
Get-NetRoute
# 或在 CMD
route print
```
**场景**：排查路由问题。

#### 显示当前网络连接
显示活动的网络连接和监听端口。
```powershell
Get-NetTCPConnection
# 或在 CMD
netstat -ano
```
**场景**：检查服务监听的端口。

#### 下载文件
从指定 URL 下载文件。
```powershell
Invoke-WebRequest -Uri "<url>" -OutFile "<filename>"
# 示例
Invoke-WebRequest -Uri "https://example.com/file.zip" -OutFile "file.zip"
```
**场景**：下载安装包。

#### 查看防火墙状态
检查 Windows 防火墙状态。
```powershell
Get-NetFirewallProfile
```
**场景**：确认防火墙是否启用。

#### 启用防火墙
启用 Windows 防火墙。
```powershell
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True
```
**场景**：确保系统安全。

#### 添加防火墙规则
开放指定端口以允许流量。
```powershell
New-NetFirewallRule -DisplayName "<rule_name>" -Direction Inbound -Protocol TCP -LocalPort <port> -Action Allow
# 示例
New-NetFirewallRule -DisplayName "Allow HTTP" -Direction Inbound -Protocol TCP -LocalPort 80 -Action Allow
```
**场景**：为 Web 服务器开放端口。

### 文件操作

管理文件和目录的常用命令。

#### 列出当前目录内容
显示当前目录的文件和目录。
```powershell
Get-ChildItem
# 或在 CMD
dir
```
**场景**：查看文件列表。

#### 显示隐藏文件
列出包含隐藏文件的目录内容。
```powershell
Get-ChildItem -Force
# 或在 CMD
dir /a
```
**场景**：检查隐藏配置文件。

#### 创建目录
创建新目录。
```powershell
New-Item -ItemType Directory -Path "<directory>"
# 示例
New-Item -ItemType Directory -Path "my_folder"
# 或在 CMD
mkdir my_folder
```
**场景**：创建项目目录。

#### 复制文件或目录
复制文件或目录到目标位置。
```powershell
Copy-Item <source> <destination>
# 示例
Copy-Item document.txt C:\Backup\
# 或在 CMD
copy document.txt C:\Backup\
```
**场景**：备份文件。

#### 移动或重命名文件
移动文件或目录，或重命名。
```powershell
Move-Item <source> <destination>
# 示例
Move-Item document.txt new_document.txt
# 或在 CMD
move document.txt new_document.txt
```
**场景**：重命名或移动文件。

#### 删除文件
删除指定文件。
```powershell
Remove-Item <file>
# 示例
Remove-Item temp.txt
# 或在 CMD
del temp.txt
```
**场景**：清理文件。

#### 删除目录及其内容
递归删除目录及其内容。
```powershell
Remove-Item <directory> -Recurse
# 示例
Remove-Item old_folder -Recurse
# 或在 CMD
rmdir old_folder /S /Q
```
**场景**：删除整个目录。

#### 压缩文件
将文件或目录压缩为 ZIP 格式。
```powershell
Compress-Archive -Path <source> -DestinationPath <archive_name>.zip
# 示例
Compress-Archive -Path my_folder -DestinationPath backup.zip
```
**场景**：备份目录。

#### 解压缩文件
解压 ZIP 格式的压缩文件。
```powershell
Expand-Archive -Path <archive_name>.zip -DestinationPath <destination>
# 示例
Expand-Archive -Path backup.zip -DestinationPath extracted
```
**场景**：提取压缩文件。

#### 查找文件
在指定目录中查找文件。
```powershell
Get-ChildItem -Path <directory> -Recurse -Include <filename>
# 示例
Get-ChildItem -Path C:\ -Recurse -Include *.txt
# 或在 CMD
dir C:\*.txt /S
```
**场景**：定位文件。

#### 计算文件的 SHA256 校验值
计算文件的 SHA256 校验和。
```powershell
Get-FileHash <file> -Algorithm SHA256
# 示例
Get-FileHash file.zip -Algorithm SHA256
```
**场景**：验证文件完整性。

### 服务管理

管理系统服务的常用命令。

#### 启动服务
启动指定服务。
```powershell
Start-Service -Name <service_name>
# 示例
Start-Service -Name wuauserv
# 或在 CMD
net start wuauserv
```
**场景**：启动 Windows Update 服务。

#### 停止服务
停止指定服务。
```powershell
Stop-Service -Name <service_name>
# 示例
Stop-Service -Name wuauserv
# 或在 CMD
net stop wuauserv
```
**场景**：暂停服务以进行维护。

#### 重启服务
重启指定服务。
```powershell
Restart-Service -Name <service_name>
# 示例
Restart-Service -Name wuauserv
```
**场景**：应用服务配置更改。

#### 查看服务状态
检查指定服务的运行状态。
```powershell
Get-Service -Name <service_name>
# 示例
Get-Service -Name wuauserv
```
**场景**：排查服务问题。

#### 启用服务自启动
设置服务在系统启动时自动运行。
```powershell
Set-Service -Name <service_name> -StartupType Automatic
# 示例
Set-Service -Name wuauserv -StartupType Automatic
```
**场景**：确保关键服务开机自启。

#### 禁用服务自启动
禁止服务在系统启动时自动运行。
```powershell
Set-Service -Name <service_name> -StartupType Disabled
# 示例
Set-Service -Name wuauserv -StartupType Disabled
```
**场景**：关闭不必要的服务。

---

## 补充说明

本文整理了 Windows 的常用命令，涵盖包管理、系统管理、用户权限、网络、文件操作和服务管理等方面，适合初学者和管理员快速参考。如有其他常用命令建议，欢迎在评论区补充！(๑´ڡ`๑)