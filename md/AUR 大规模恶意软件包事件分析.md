---
title: AUR 大规模恶意软件包事件分析：一次针对 Arch Linux 开发者生态的供应链攻击
date: 2026-06-015 14:48:35
categories: [Linux]
tags: [ArchLinux，AUR]
---
---

## 前言

2026 年 6 月，Arch Linux 社区爆发了一起近年来影响范围最大的 AUR（Arch User Repository）恶意软件包事件。

从最初发现的数百个恶意软件包，到后续统计的上千个受影响软件包，此次事件已经超出了「单个软件包被投毒」的范畴，而演变为一次典型的**开源供应链攻击（Open Source Supply Chain Attack）**。

此次事件并没有利用 Linux 内核漏洞，也没有利用提权漏洞，更没有攻击 Arch Linux 官方仓库。

攻击者攻击的目标只有一个：

> 社区信任机制。

对于所有 Arch Linux 用户，尤其是开发者、运维人员和长期使用 AUR 的用户而言，这次事件都具有较高的警示意义。

---

# 一、什么是 AUR？

AUR（Arch User Repository）是 Arch Linux 社区维护的用户软件仓库。

需要特别强调的是：

> AUR 并不是官方软件仓库。

AUR 中保存的并不是经过官方审计的二进制软件，而是软件构建脚本，主要包括：

* PKGBUILD
* install 脚本
* Patch 文件
* 下载地址
* 构建依赖关系

例如：

```bash
yay -S google-chrome
```

或者：

```bash
paru -S visual-studio-code-bin
```

实际执行过程大致如下：

```text
下载 PKGBUILD
↓
解析依赖关系
↓
执行 prepare()
↓
执行 build()
↓
执行 package()
↓
安装软件
```

本质上：

> 安装 AUR 软件包，就是在本地执行其他用户编写的 Shell 脚本。

这一设计赋予了 AUR 极高的灵活性，同时也意味着：

> 安全边界被下放给了最终用户。

---

# 二、事件时间线

根据目前公开的信息，本次事件大致可以归纳为以下阶段：

## 第一阶段：异常软件包出现

社区用户发现部分 AUR 软件包：

* 下载地址异常；
* 新增未知依赖；
* 引入可疑 npm/Bun 包；
* 执行远程脚本。

初步统计：

```text
400+ 软件包受到影响
```

---

## 第二阶段：进一步排查

随着更多社区成员参与审计，发现：

* 受影响软件包数量持续增加；
* 部分软件包存在维护者变更；
* 大量软件包属于长期无人维护状态。

后续统计：

```text
1500+ 软件包受到影响
```

并且数量仍可能进一步变化。

---

# 三、攻击链分析（Attack Chain）

从目前公开的样本来看，攻击链大致如下：

```text
发现孤儿包
        ↓
申请成为维护者
        ↓
提交恶意 PKGBUILD 更新
        ↓
引入恶意依赖
        ↓
用户执行 yay -Syu
        ↓
恶意代码执行
        ↓
收集凭据和敏感数据
        ↓
下载二阶段 Payload
        ↓
建立持久化机制
```

这是一次非常典型的：

> 利用软件供应链和社区信任模型传播恶意代码的攻击。

---

# 四、为什么孤儿包成为攻击目标？

AUR 中存在大量：

## Orphan Package（孤儿包）

定义：

> 原维护者已经停止维护，但软件包仍然保留在仓库中。

这类软件包通常存在以下特点：

### 长期无人审计

```text
最后更新时间：数月甚至数年以前
```

### 用户基数较大

例如：

```text
数千至数万次安装记录
```

### 用户天然信任

用户通常认为：

```text
之前能用，现在更新也应该没问题。
```

攻击者正是利用了这种心理。

因为对于大部分用户而言：

```bash
yay -Syu
```

往往意味着：

```text
输入密码
等待更新完成
```

而不会逐行审查：

* PKGBUILD
* 下载地址
* 新增依赖
* install 脚本

因此，一旦恶意代码进入更新链路，就拥有非常高的成功执行概率。

---

# 五、恶意代码可能实施的行为

根据目前公开样本分析，其目的更偏向于：

> 开发者资产窃取（Developer Credential Theft）。

## 1. 窃取 SSH 密钥

目标目录：

```text
~/.ssh/
```

可能包括：

```text
id_ed25519
id_rsa
known_hosts
config
```

风险：

* GitHub 仓库被接管；
* GitLab 被接管；
* VPS 被远程登录；
* 企业服务器被入侵。

---

## 2. 窃取浏览器会话

目标目录：

```text
~/.config/chromium/
~/.config/google-chrome/
~/.mozilla/
```

攻击者可能获取：

* Session Cookie
* 登录 Token
* OAuth 凭据

后果：

无需密码即可登录：

* GitHub；
* 云平台；
* 邮箱；
* 管理后台。

---

## 3. 窃取环境变量

例如：

```bash
env
printenv
```

可能泄露：

```text
GITHUB_TOKEN
OPENAI_API_KEY
AWS_SECRET_ACCESS_KEY
DATABASE_URL
SSH_AUTH_SOCK
```

现代开发环境中：

> API Key 和 Access Token 往往拥有比密码更高的权限。

---

## 4. 下载二阶段 Payload

部分样本存在：

```bash
curl xxx | bash
wget xxx | sh
```

其目的可能包括：

* 下载信息窃取程序；
* 安装远控组件；
* 部署后门；
* 更新恶意载荷。

---

## 5. 建立持久化机制

例如：

### Systemd 用户服务

```text
~/.config/systemd/user/
```

### 系统服务

```text
/etc/systemd/system/
```

### Shell 启动脚本

```text
~/.bashrc
~/.zshrc
~/.profile
```

甚至不排除使用：

* eBPF；
* LD_PRELOAD；
* 定时任务（Cron）。

实现长期驻留。

---

# 六、为什么开发者是主要受害群体？

普通桌面用户：

```text
浏览器
聊天软件
游戏
```

开发者环境：

```text
SSH Key
Git 凭据
云平台 Access Key
CI/CD Secret
生产数据库
Kubernetes 配置
代码签名证书
```

攻击者获得这些凭据后：

可能造成：

```text
开发机
↓
代码仓库
↓
CI/CD
↓
生产环境
↓
企业基础设施
```

形成完整的攻击链。

这也是近年来供应链攻击的共同特征：

> 攻击开发者，而不是直接攻击服务器。

---

# 七、如何判断自己是否受到影响？

## 查看安装记录

```bash
grep "\[ALPM\] installed" /var/log/pacman.log
```

## 查看升级记录

```bash
grep "\[ALPM\] upgraded" /var/log/pacman.log
```

重点排查：

```text
2026-06-11
2026-06-15
```

期间所有更新过的 AUR 软件包。

---

# 八、应急排查建议

## 检查异常服务

```bash
systemctl --user list-unit-files
systemctl list-unit-files
```

## 检查异常进程

```bash
ps auxf
```

## 检查异常网络连接

```bash
ss -tulpn
```

## 检查最近新增文件

```bash
find ~ -mtime -7
```

## 检查最近新增可执行文件

```bash
find ~ -type f -perm -111 -mtime -7
```

---

# 九、凭据处置建议

如果在受影响期间：

* 执行过可疑 PKGBUILD；
* 更新过未知维护者的软件包；
* 保存有重要凭据；

建议直接：

## 重建 SSH Key

```bash
mv ~/.ssh ~/.ssh_old
ssh-keygen -t ed25519
```

## 撤销所有 Token

包括：

* GitHub PAT；
* GitLab Token；
* 云平台 Access Key；
* API Key。

## 退出所有浏览器会话

重新登录所有重要账户。

在安全响应领域有一个基本原则：

> 一旦怀疑凭据泄露，就应当将其视为已经泄露。

---

# 十、结语

AUR 事件再次证明：

> 开源并不天然安全，透明也不等于可信。

此次攻击没有突破 Linux 的权限模型，没有利用内核漏洞，也没有攻破官方仓库。

攻击者只是利用了三个最简单的事实：

1. 软件包长期无人维护；
2. 用户习惯于自动更新；
3. 用户默认信任社区提交的脚本。

而这三点叠加之后，最终形成了一次波及整个 Arch Linux 生态的大规模供应链事件。

对于每一个 Arch Linux 用户而言，都应该记住一句话：

> `yay -S 软件包` 的本质，并不是下载一个应用程序。
>
> 而是在自己的机器上执行一个陌生人编写的 Shell 脚本。

这也是本次 AUR 恶意软件包事件留给整个 Linux 社区最值得反思的一课。
