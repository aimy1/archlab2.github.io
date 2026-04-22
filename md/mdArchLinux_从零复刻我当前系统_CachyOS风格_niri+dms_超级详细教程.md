---
title: archlinux配置教程
date: 2026-3-21 00:27:17
categories: [Linux]
tags: [Wayland, archlinux]
---

---
# Arch Linux 从零复刻「我当前这套系统」的超详细配置教程（niri + Wayland + NVIDIA 混合显卡 + 风格美化）

> 我把你当成第一次装 Arch，但又想一步到位做成“能用、好看、稳定、可维护”的人。
>
> 目标：把一台全新电脑从 **Arch ISO** 装到和我当前机器类似的最终效果：
>
> - 系统基底：Arch Linux（可选用 CachyOS 获得同款优化）
> - 会话：Wayland
> - 桌面/窗口管理器：**niri**（scrollable-tiling）
> - 登录管理器：LightDM（Wayland 会话）
> - 终端：kitty
> - 应用启动器：fuzzel（含主题色与键位）
> - 输入法：fcitx5（中文）
> - 音频：PipeWire + WirePlumber
> - NVIDIA + Intel 混合显卡：按需用独显（prime-run）
> - 美化：圆角/阴影/主题色、Breeze 光标、合理 DPI 缩放
> - 可维护：Btrfs 子卷 + Snapper 快照（更新翻车可回滚）
>
> 注意：我这台机器是 CachyOS + niri + dms-shell（AUR 包）组合；**本教程以“原生 Arch 可复刻”为核心**，同时给出“如果你想更像 CachyOS”的可选分支。

---

## 目录

- [A. 你需要准备什么](#a-你需要准备什么)
- [B. 安装前的 BIOS/UEFI 设置（非常关键）](#b-安装前的-biosuefi-设置非常关键)
- [C. 用 Arch ISO 安装：分区、格式化、挂载（Btrfs 子卷布局）](#c-用-arch-iso-安装分区格式化挂载btrfs-子卷布局)
- [D. pacstrap 安装系统（内核、固件、基础工具）](#d-pacstrap-安装系统内核固件基础工具)
- [E. chroot 内系统初始化（时区、locale、用户、sudo、网络）](#e-chroot-内系统初始化时区locale用户sudo网络)
- [F. 引导（systemd-boot）与微码（Intel/AMD）](#f-引导systemd-boot与微码intelamd)
- [G. 图形栈：Wayland + niri + LightDM（可登录）](#g-图形栈wayland--niri--lightdm可登录)
- [H. NVIDIA + Intel 混合显卡：驱动、prime-run、常见坑](#h-nvidia--intel-混合显卡驱动prime-run常见坑)
- [I. 音频：PipeWire 全家桶（含蓝牙音频）](#i-音频pipewire-全家桶含蓝牙音频)
- [J. 中文体验：字体、fcitx5、环境变量（Wayland 可靠方案）](#j-中文体验字体fcitx5环境变量wayland-可靠方案)
- [K. 桌面生态：fuzzel、portal、截图、剪贴板、文件管理器](#k-桌面生态fuzzelportal截图剪贴板文件管理器)
- [L. niri 配置：直接贴出我当前同款 config（可复制即用）](#l-niri-配置直接贴出我当前同款-config可复制即用)
- [M. 美化细节：DPI、圆角、阴影、光标、GTK 主题、图标](#m-美化细节dpi圆角阴影光标gtk-主题图标)
- [N. Btrfs + Snapper：自动快照、更新前后快照、清理策略](#n-btrfs--snapper自动快照更新前后快照清理策略)
- [O. 常用软件清单（稳定优先）](#o-常用软件清单稳定优先)
- [P. 故障排查：你遇到问题时按这个 SOP 走](#p-故障排查你遇到问题时按这个-sop-走)

---

## A. 你需要准备什么

1) **一个 U 盘**（>= 8GB）

2) **Arch Linux ISO**
- 官方下载：<https://archlinux.org/download/>
- 校验（推荐）：下载后核对 SHA256。

3) **能上网的环境**
- 最理想：有线网
- 也可以 Wi‑Fi（在安装环境里用 `iwctl`/`nmcli` 连接）

4) 你要明确你想要的磁盘布局
- 本教程采用：**UEFI + GPT + Btrfs（子卷） + swapfile（可选）**
- 这是 Arch 上最“长期省心”的方案之一。

---

## B. 安装前的 BIOS/UEFI 设置（非常关键）

进入 BIOS/UEFI（通常开机按 F2/Del）：

1) **Boot Mode：UEFI**（必须）
2) **关闭 CSM/Legacy**（如果有）
3) **Secure Boot：建议先关**
- 你熟练后可以再开 Secure Boot 并自己签名模块（高级玩法）。
4) **SATA/NVMe 模式默认即可**（多数是 AHCI/NVMe）
5) 如果是 NVIDIA 笔记本混合显卡：
- 保持 Hybrid/Optimus 模式即可，不要强行 dGPU only（除非你清楚功耗代价）。

---

## C. 用 Arch ISO 安装：分区、格式化、挂载（Btrfs 子卷布局）

### C.1 进 Arch ISO 后先确认你在 UEFI 模式

```bash
ls /sys/firmware/efi/efivars
```

- 如果这个目录存在且有内容 → 你是 UEFI 启动
- 如果没有 → 你用 legacy 启动了，回 BIOS 调整

### C.2 联网（有线通常自动）

检查网络：

```bash
ping -c 3 archlinux.org
```

Wi‑Fi（推荐 iwd 的 iwctl）：

```bash
iwctl
# 进入交互后：
# device list
# station wlan0 scan
# station wlan0 get-networks
# station wlan0 connect "你的WiFi"
```

### C.3 同步时间（安装中证书/镜像会用到）

```bash
timedatectl set-ntp true
```

### C.4 分区（示例：一块磁盘 /dev/nvme0n1）

先看磁盘：

```bash
lsblk
```

用 `cgdisk`/`fdisk` 分区都可以。我用 `cgdisk` 举例（更直观）。

> 你需要至少两个分区：
> - EFI System Partition（ESP）：512MB～1GB，FAT32
> - Linux filesystem：剩余全部，Btrfs

```bash
cgdisk /dev/nvme0n1
```

建议分区方案：

- **/dev/nvme0n1p1**：EFI System Partition
  - Size：1G
  - Type：EF00
- **/dev/nvme0n1p2**：Linux filesystem（Btrfs）
  - Size：剩余全部
  - Type：8300

写入并退出。

### C.5 格式化

EFI 分区：

```bash
mkfs.fat -F32 /dev/nvme0n1p1
```

Btrfs 分区：

```bash
mkfs.btrfs -f -L ArchRoot /dev/nvme0n1p2
```

### C.6 创建 Btrfs 子卷（推荐布局）

先临时挂载根分区：

```bash
mount /dev/nvme0n1p2 /mnt
```

创建子卷：

```bash
btrfs subvolume create /mnt/@
btrfs subvolume create /mnt/@home
btrfs subvolume create /mnt/@var
btrfs subvolume create /mnt/@snapshots
```

卸载：

```bash
umount /mnt
```

### C.7 以子卷方式重新挂载（带常用参数）

挂载根：

```bash
mount -o subvol=@,compress=zstd:3,noatime /dev/nvme0n1p2 /mnt
```

创建目录并挂载其他子卷：

```bash
mkdir -p /mnt/{home,var,.snapshots,boot}
mount -o subvol=@home,compress=zstd:3,noatime /dev/nvme0n1p2 /mnt/home
mount -o subvol=@var,compress=zstd:3,noatime /dev/nvme0n1p2 /mnt/var
mount -o subvol=@snapshots,compress=zstd:3,noatime /dev/nvme0n1p2 /mnt/.snapshots
```

挂载 EFI：

```bash
mount /dev/nvme0n1p1 /mnt/boot
```

确认：

```bash
findmnt -R /mnt
```

---

## D. pacstrap 安装系统（内核、固件、基础工具）

### D.1 选内核

- 想稳定：`linux`（官方）
- 想更激进：`linux-zen`（延迟更低一些）

我建议先 `linux`，后面想换再换。

### D.2 安装基本包

```bash
pacstrap -K /mnt \
  base linux linux-firmware \
  btrfs-progs \
  nano vim \
  sudo \
  networkmanager \
  man-db man-pages \
  git curl wget \
  reflector \
  intel-ucode \
  base-devel
```

说明：
- `btrfs-progs`：Btrfs 管理命令
- `networkmanager`：图形环境/笔记本最省心
- `intel-ucode`：Intel CPU 微码（AMD 则用 `amd-ucode`）

### D.3 生成 fstab

```bash
genfstab -U /mnt >> /mnt/etc/fstab
```

检查一下：

```bash
sed -n '1,200p' /mnt/etc/fstab
```

---

## E. chroot 内系统初始化（时区、locale、用户、sudo、网络）

进入新系统：

```bash
arch-chroot /mnt
```

### E.1 时区与时间同步

```bash
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
hwclock --systohc
```

### E.2 语言与 locale（建议：系统中文 + 保留英文 LC_CTYPE 可选）

编辑 `/etc/locale.gen`：

```bash
nano /etc/locale.gen
```

取消注释（至少这两个）：

```
en_US.UTF-8 UTF-8
zh_CN.UTF-8 UTF-8
```

生成：

```bash
locale-gen
```

设置默认语言：

```bash
echo 'LANG=zh_CN.UTF-8' > /etc/locale.conf
```

> 我当前系统还会在 niri 的环境里单独设置 `LC_CTYPE=en_US.UTF-8`，这是为了避免部分程序在中文 locale 下字符分类/输入法行为怪异（可选）。

### E.3 主机名与 hosts

```bash
echo 'arch-niri' > /etc/hostname
```

编辑 `/etc/hosts`：

```bash
nano /etc/hosts
```

写入：

```
127.0.0.1   localhost
::1         localhost
127.0.1.1   arch-niri.localdomain arch-niri
```

### E.4 设置 root 密码

```bash
passwd
```

### E.5 创建普通用户（强烈建议）

```bash
useradd -m -G wheel -s /bin/bash yourname
passwd yourname
```

安装后你也可以换 fish，这里先别急。

### E.6 sudo（让 wheel 组可 sudo）

```bash
EDITOR=nano visudo
```

找到并取消注释：

```
%wheel ALL=(ALL:ALL) ALL
```

### E.7 启用 NetworkManager

```bash
systemctl enable NetworkManager
```

---

## F. 引导（systemd-boot）与微码（Intel/AMD）

### F.1 安装引导

```bash
bootctl install
```

### F.2 配置 systemd-boot 条目

找到你的根分区 UUID：

```bash
blkid | grep ArchRoot -n || true
blkid /dev/nvme0n1p2
```

编辑 `/boot/loader/entries/arch.conf`：

```bash
nano /boot/loader/entries/arch.conf
```

写入（把 UUID 换成你自己的）：

```ini
title   Arch Linux (niri)
linux   /vmlinuz-linux
initrd  /intel-ucode.img
initrd  /initramfs-linux.img
options root=UUID=YOUR-ROOT-UUID rootflags=subvol=@ rw quiet loglevel=3
```

再编辑 `/boot/loader/loader.conf`：

```bash
nano /boot/loader/loader.conf
```

建议：

```ini
default arch.conf
timeout 3
console-mode max
editor no
```

---

## G. 图形栈：Wayland + niri + LightDM（可登录）

### G.1 安装 niri 与 Wayland 必备组件

```bash
pacman -S --needed \
  niri \
  xdg-desktop-portal xdg-desktop-portal-gtk xdg-desktop-portal-gnome \
  xwayland-satellite \
  qt5-wayland qt6-wayland \
  polkit-gnome
```

解释（你必须理解这些，不然以后会卡）：
- `xdg-desktop-portal-*`：**屏幕共享、截图 API、文件选择器、权限门户** 的核心。没有它你会发现：OBS/浏览器共享屏幕失败。
- `xdg-desktop-portal-gnome`：niri 在 Wayland 下录屏/共享屏幕常见选择。
- `xwayland-satellite`：让 X11 应用在 Wayland 下跑（兼容层）。
- `polkit-gnome`：GUI 提权认证代理（比如改网络、挂载等会弹窗）。

### G.2 安装 LightDM + greeter

```bash
pacman -S --needed lightdm lightdm-gtk-greeter
systemctl enable lightdm
```

> 你也可以用 `lightdm-slick-greeter`，但先用 gtk greeter 最稳。

### G.3 让 LightDM 显示 niri 会话

通常 `niri-session` 会安装一个桌面条目。如果没有，你可以手工创建。

检查：

```bash
ls -la /usr/share/wayland-sessions | head
```

如果没有 niri：创建 `/usr/share/wayland-sessions/niri.desktop`：

```bash
nano /usr/share/wayland-sessions/niri.desktop
```

内容：

```ini
[Desktop Entry]
Name=niri
Comment=niri Wayland session
Exec=niri-session
Type=Application
```

---

## H. NVIDIA + Intel 混合显卡：驱动、prime-run、常见坑

> 这一节是笔记本/混合显卡的重点。目标是：
> - **桌面默认用核显**（省电、安静）
> - **需要性能时再用独显**（prime-run 启动特定程序）

### H.1 安装驱动（两条路线）

#### 路线 1：原生 Arch（推荐先走这条）

```bash
pacman -S --needed nvidia nvidia-utils nvidia-settings
pacman -S --needed nvidia-prime
```

> 说明：
> - `nvidia-prime` 提供 `prime-run`，最适合“按需独显”

#### 路线 2：类似我当前系统（CachyOS 用的 nvidia-open）

在 CachyOS 上常见为 `nvidia-open`。原生 Arch 也能装，但策略/包名可能不同。

你如果明确要 `nvidia-open`：**按你发行版仓库为准**（CachyOS 的包名就是 `nvidia-open`）。

### H.2 基础验证

进入系统后（装完重启）：

```bash
nvidia-smi
```

能看到 GPU 型号、驱动版本、显存等即 OK。

### H.3 用独显启动某个程序（核心用法）

例如：

```bash
prime-run glxinfo | grep -i "OpenGL renderer"
prime-run steam
prime-run blender
prime-run obs
```

你也可以边开程序边看：

```bash
watch -n 1 nvidia-smi
```

### H.4 Wayland 下的常见坑（你提前知道会省命）

1) **Portal 没装/没起来** → 共享屏幕失败
- 解决：确保装了 `xdg-desktop-portal-gnome`，并且用户服务运行正常：
  ```bash
  systemctl --user status xdg-desktop-portal --no-pager
  ```

2) **Xwayland 应用黑屏/输入异常**
- 解决：装 `xwayland-satellite`

3) **独显常驻唤醒导致高功耗**
- 你如果不需要独显：别把所有程序都 prime-run。

---

## I. 音频：PipeWire 全家桶（含蓝牙音频）

```bash
pacman -S --needed \
  pipewire pipewire-pulse pipewire-alsa \
  wireplumber \
  pavucontrol
```

启用一般自动（用户服务），验证：

```bash
wpctl status
pavucontrol
```

蓝牙（可选）：

```bash
pacman -S --needed bluez bluez-utils blueman
systemctl enable --now bluetooth
```

---

## J. 中文体验：字体、fcitx5、环境变量（Wayland 可靠方案）

### J.1 安装字体（避免方块字 + emoji）

```bash
pacman -S --needed \
  noto-fonts noto-fonts-cjk noto-fonts-emoji \
  ttf-jetbrains-mono-nerd
```

### J.2 安装 fcitx5（中文）

```bash
pacman -S --needed \
  fcitx5 fcitx5-gtk fcitx5-qt \
  fcitx5-chinese-addons fcitx5-configtool
```

### J.3 环境变量（最关键，不设置会出现：部分软件没输入法）

建议写到 `~/.profile`（Wayland 会话也会读）：

```bash
nano ~/.profile
```

加入：

```bash
export GTK_IM_MODULE=fcitx
export QT_IM_MODULE=fcitx
export XMODIFIERS=@im=fcitx
export INPUT_METHOD=fcitx
export SDL_IM_MODULE=fcitx
```

重新登录后验证：

```bash
echo $GTK_IM_MODULE
fcitx5-diagnose | head -n 40
```

---

## K. 桌面生态：fuzzel、portal、截图、剪贴板、文件管理器

### K.1 fuzzel（启动器）

```bash
pacman -S --needed fuzzel
mkdir -p ~/.config/fuzzel
```

我当前同款配置在后面会完整贴出（包含颜色主题 `colors.ini`）。

### K.2 截图与剪贴板（常用组合）

```bash
pacman -S --needed \
  grim slurp \
  wl-clipboard
```

截图到文件：

```bash
grim ~/Pictures/Screenshots/test.png
```

截图到剪贴板（示例）：

```bash
grim -g "$(slurp)" - | wl-copy
```

### K.3 文件管理器（Thunar + GVFS）

```bash
pacman -S --needed thunar gvfs gvfs-mtp file-roller
```

---

## L. niri 配置：直接贴出我当前同款 config（可复制即用）

> 这一节是“复刻效果”的灵魂。你复制之后，重登 niri 就能获得：
> - 触摸板自然滚动/轻触
> - 鼠标禁加速（flat）
> - 动画参数
> - 圆角/裁剪
> - 自定义快捷键（包含：启动器、终端、截图、工作区管理等）
> - 光标主题
> - 输出（分辨率、缩放、双屏坐标）

### L.1 准备目录

```bash
mkdir -p ~/.config/niri/dms
mkdir -p ~/.config/niri/shorin-niri
```

### L.2 写入主配置 `~/.config/niri/config.kdl`

> 说明：下面内容就是我当前系统同款（来自我机器的配置）。
> 你可以先原样粘贴跑起来，再按你的习惯改。

把下面整段保存到：`~/.config/niri/config.kdl`

```kdl
// This config is in the KDL format: https://kdl.dev
// Check the wiki for a full description of the configuration:
// https://github.com/YaLTeR/niri/wiki/Configuration:-Introduction
config-notification {
    disable-failed
}

gestures {
    hot-corners {
        off
    }
}

input {
    keyboard {
        xkb {
            // 留空时，niri 会从系统的 localectl 设置读取
        }
    }

    touchpad {
        tap
        natural-scroll
    }

    mouse {
        accel-profile "flat" // 关闭鼠标加速：使用“平坦”曲线（无加速度）
    }
}

layout {
    background-color "transparent"

    center-focused-column "never"

    preset-column-widths {
        proportion 0.33333
        proportion 0.5
        proportion 0.66667
    }

    default-column-width { proportion 0.5; }

    border {
        off
        width 4
        active-color   "#707070"
        inactive-color "#d0d0d0"
        urgent-color   "#cc4444"
    }

    shadow {
        softness 30
        spread 5
        offset x=0 y=5
        color "#0007"
    }

    struts {
    }
}

layer-rule {
    match namespace="^quickshell$"
    place-within-backdrop false
}

overview {
    workspace-shadow {
        off
    }
}

environment {
    // Qt theme
    QT_QPA_PLATFORMTHEME "gtk3"
    QT_QPA_PLATFORMTHEME_QT6 "gtk3"

    // fix quickshell icon theme missing
    QS_ICON_THEME "Adwaita"

    // locale / ime
    LC_CTYPE "en_US.UTF-8"
    XMODIFIERS "@im=fcitx"
    LANG "zh_CN.UTF-8"
    XDG_CURRENT_DESKTOP "niri"
}

hotkey-overlay {
    skip-at-startup
}

prefer-no-csd

screenshot-path "~/Pictures/Screenshots/Screenshot from %Y-%m-%d %H-%M-%S.png"

animations {
    workspace-switch {
        spring damping-ratio=0.80 stiffness=523 epsilon=0.0001
    }
    window-open {
        duration-ms 150
        curve "ease-out-expo"
    }
    window-close {
        duration-ms 150
        curve "ease-out-quad"
    }
    horizontal-view-movement {
        spring damping-ratio=0.85 stiffness=423 epsilon=0.0001
    }
    window-movement {
        spring damping-ratio=0.75 stiffness=323 epsilon=0.0001
    }
    window-resize {
        spring damping-ratio=0.85 stiffness=423 epsilon=0.0001
    }
    config-notification-open-close {
        spring damping-ratio=0.65 stiffness=923 epsilon=0.001
    }
    screenshot-ui-open {
        duration-ms 200
        curve "ease-out-quad"
    }
    overview-open-close {
        spring damping-ratio=0.85 stiffness=800 epsilon=0.0001
    }
}

window-rule {
    match app-id=r#"^org\.wezfurlong\.wezterm$"#
    default-column-width {}
}

window-rule {
    match app-id=r#"^org\.gnome\."#
    draw-border-with-background false
    geometry-corner-radius 12
    clip-to-geometry true
}

window-rule {
    match app-id=r#"^gnome-control-center$"#
    match app-id=r#"^pavucontrol$"#
    match app-id=r#"^nm-connection-editor$"#
    default-column-width { proportion 0.5; }
    open-floating false
}

window-rule {
    match app-id=r#"^gnome-calculator$"#
    match app-id=r#"^galculator$"#
    match app-id=r#"^blueman-manager$"#
    match app-id=r#"^org\.gnome\.Nautilus$"#
    match app-id=r#"^xdg-desktop-portal$"#
    open-floating true
}

window-rule {
    match app-id=r#"^steam$"# title=r#"^notificationtoasts_\d+_desktop$"#
    default-floating-position x=10 y=10 relative-to="bottom-right"
    open-focused false
}

window-rule {
    match app-id=r#"^org\.wezfurlong\.wezterm$"#
    match app-id="Alacritty"
    match app-id="zen"
    match app-id="com.mitchellh.ghostty"
    match app-id="kitty"
    draw-border-with-background false
}

window-rule {
    match app-id=r#"firefox$"# title="^Picture-in-Picture$"
    match app-id="zoom"
    open-floating true
}

window-rule {
    match app-id=r#"org.quickshell$"#
    open-floating true
}

debug {
    honor-xdg-activation-with-invalid-serial
}

recent-windows {
    binds {
        Alt+Tab         { next-window scope="output"; }
        Alt+Shift+Tab   { previous-window scope="output"; }
        Alt+grave       { next-window filter="app-id"; }
        Alt+Shift+grave { previous-window filter="app-id"; }
    }
}

// Include DMS / Shorin modules
include "dms/colors.kdl"
include "dms/layout.kdl"
include "dms/alttab.kdl"
include "dms/binds.kdl"
include "dms/outputs.kdl"
include "dms/cursor.kdl"

spawn-at-startup "dms" "run"
spawn-at-startup "xhost" "+si:localuser:root"
spawn-at-startup "fcitx5" "-d"
spawn-sh-at-startup "dbus-update-activation-environment --systemd WAYLAND_DISPLAY XDG_CURRENT_DESKTOP=niri & /usr/lib/xdg-desktop-portal-gnome"
spawn-at-startup "~/.config/niri/shorin-niri/scripts/screenshot-sound.sh"

include "shorin-niri/rule.kdl"
include "shorin-niri/supertab.kdl"

cursor {
    xcursor-theme "breeze_cursors"
    xcursor-size 30
    hide-after-inactive-ms 15000
}

include "dms/windowrules.kdl"
```

### L.3 写入 DMS 相关 KDL（我当前同款）

> 注意：这些文件在我当前系统是 DMS 自动生成的。
> 你在 Arch 复刻时也可以先手工放进去，效果是一样的。

1) `~/.config/niri/dms/outputs.kdl`

```kdl
output "eDP-1" {
    mode "2560x1600@180.000"
    scale 1.25
    position x=0 y=0
}

output "DP-3" {
    mode "3440x1440@164.999"
    scale 1
    position x=2048 y=0
}
```

- `eDP-1` 是笔记本内屏常见名称，你可以在 niri 里执行：
  ```bash
  niri msg outputs
  ```
  来确认你机器的实际名称。

2) `~/.config/niri/dms/colors.kdl`

```kdl
layout {
    background-color "transparent"

    focus-ring {
        active-color   "#bcc2ff"
        inactive-color "#90909a"
        urgent-color   "#ffb4ab"
    }

    border {
        active-color   "#bcc2ff"
        inactive-color "#90909a"
        urgent-color   "#ffb4ab"
    }

    shadow {
        color "#00000070"
    }

    tab-indicator {
        active-color   "#bcc2ff"
        inactive-color "#90909a"
        urgent-color   "#ffb4ab"
    }

    insert-hint {
        color "#bcc2ff80"
    }
}

recent-windows {
    highlight {
        active-color   "#3b4279"
        urgent-color   "#ffb4ab"
    }
}
```

3) `~/.config/niri/dms/layout.kdl`

```kdl
layout {
    gaps 4

    border {
        width 2
    }

    focus-ring {
        width 2
    }
}

window-rule {
    geometry-corner-radius 12
    clip-to-geometry true
    tiled-state true
    draw-border-with-background false
}
```

4) `~/.config/niri/dms/alttab.kdl`

```kdl
recent-windows {
    debounce-ms 750
    open-delay-ms 150

    highlight {
        padding 30
        corner-radius 12
    }

    previews {
        max-height 480
        max-scale 0.2
    }

    binds {
        Mod+Tab         { next-window scope="workspace"; }
        Mod+Shift+Tab   { previous-window scope="workspace"; }
        Mod+grave       { next-window     filter="app-id"; }
        Mod+Shift+grave { previous-window filter="app-id"; }
    }
}
```

5) `~/.config/niri/dms/cursor.kdl`

```kdl
cursor {
    xcursor-theme "breeze_cursors"
    xcursor-size 24
}
```

6) `~/.config/niri/dms/windowrules.kdl`

```kdl
layer-rule{
    match namespace="dms:blurwallpaper"
    place-within-backdrop true
}

window-rule {
    match app-id="imv"
    open-focused false
    open-floating true
}

window-rule{
    match app-id="shorinclip"
    default-column-width { fixed 625; }
    default-window-height { fixed 700; }
    open-floating true
    default-floating-position x=0 y=18 relative-to="top"
}

window-rule {
    match app-id="com.gabm.satty"
    match app-id="nm-connection-editor"
    match app-id=r#"google-chrome-stable$"# title="^Picture-in-Picture$"
    match app-id="steam" title="Friends List"
    match app-id="blueman-manager"
    match app-id="org.pulseaudio.pavucontrol" title="音量控制"
    match app-id="org.gnome.FileRoller"
    match app-id="thunar" title="文件操作进度"
    match title="聊天记录"
    match title="日历"
    match title="重命名"
    match title="另存为"
    open-floating true
}

window-rule {
    match app-id="quickterminal"
    open-floating true
    default-floating-position x=20 y=20 relative-to="top"
}

window-rule {
    match title="图片查看器"
    match title="画中画"
    match title="视频播放器"
    open-floating true
    opacity 1.0
}

window-rule {
    match app-id="mpv"
    match app-id="celluloid"
    opacity 1.0
}

window-rule {
    match app-id=r#"^org\.wezfurlong\.wezterm$"#
    default-column-width {}
}
```

7) `~/.config/niri/dms/binds.kdl`

> 这个文件很长，我建议你先复制我这份，再慢慢删减成自己的。

把下面内容保存到：`~/.config/niri/dms/binds.kdl`

```kdl
binds {
    Mod+Shift+Slash hotkey-overlay-title="快捷键教程 Keybind tutorial" { show-hotkey-overlay; }

    Mod+F1 hotkey-overlay-title="开关输入法 Toggle fcitx" {spawn-sh "pkill fcitx5 || fcitx5 ";}

    Mod+Slash hotkey-overlay-title="临时终端 Quick Terminal" {spawn "kitty" "--single-instance" "--class" "quickterminal";}
    Mod+B hotkey-overlay-title="浏览器 Browser" { spawn "google-chrome-stable"; }

    Mod+T hotkey-overlay-title="终端 Terminal" { spawn "kitty" "--single-instance"; }

    Mod+E hotkey-overlay-title="文档管理器 Filemanager" { spawn-sh "thunar || env GSK_RENDERER=gl GTK_IM_MODULE=fcitx  nautilus"; }

    Mod+Z hotkey-overlay-title="程序菜单 Applauncher" { spawn-sh "dms ipc call spotlight toggle || fuzzel"; }

    Mod+O hotkey-overlay-title="切换总览界面 toggle overview" repeat=false { toggle-overview; }

    Mod+Q hotkey-overlay-title="关闭聚焦窗口 Close focus window" repeat=false { close-window; }
    Alt+F4 repeat=false { close-window; }

    Mod+Left  { focus-column-left; }
    Mod+Down  { focus-window-down; }
    Mod+Up    { focus-window-up; }
    Mod+Right { focus-column-right; }

    Mod+H     { focus-column-left; }
    Mod+J     { focus-window-down; }
    Mod+K     { focus-window-up; }
    Mod+L     { focus-column-right; }

    Mod+R  hotkey-overlay-title="按预设切换宽度 Switch width" { switch-preset-column-width; }

    Mod+V hotkey-overlay-title="切换浮动 Toggle floating" { toggle-window-floating; }

    Print {spawn-sh "niri msg action screenshot --show-pointer false";}

    Mod+Shift+E hotkey-overlay-title="退出niri Quit niri" { quit; }

    // 工作区 1-9
    Mod+1 { focus-workspace 1; }
    Mod+2 { focus-workspace 2; }
    Mod+3 { focus-workspace 3; }
    Mod+4 { focus-workspace 4; }
    Mod+5 { focus-workspace 5; }
    Mod+6 { focus-workspace 6; }
    Mod+7 { focus-workspace 7; }
    Mod+8 { focus-workspace 8; }
    Mod+9 { focus-workspace 9; }

    Mod+Ctrl+1 { move-column-to-workspace 1; }
    Mod+Ctrl+2 { move-column-to-workspace 2; }
    Mod+Ctrl+3 { move-column-to-workspace 3; }
    Mod+Ctrl+4 { move-column-to-workspace 4; }
    Mod+Ctrl+5 { move-column-to-workspace 5; }
    Mod+Ctrl+6 { move-column-to-workspace 6; }
    Mod+Ctrl+7 { move-column-to-workspace 7; }
    Mod+Ctrl+8 { move-column-to-workspace 8; }
    Mod+Ctrl+9 { move-column-to-workspace 9; }
}
```

> 说明：我当前系统的 binds 还有 DMS 的媒体键、亮度键、电源菜单、壁纸切换、剪贴板等整套绑定。
> 你如果也装了 DMS（见后文），可以把完整版本加回去。

### L.4 写入 Shorin 模块（supertab）

`~/.config/niri/shorin-niri/supertab.kdl`：

```kdl
recent-windows {
    debounce-ms 750
    open-delay-ms 150

    highlight {
        padding 30
        corner-radius 12
    }

    previews {
        max-height 480
        max-scale 0.2
    }

    binds {
        Mod+Tab         { next-window scope="workspace"; }
        Mod+Shift+Tab   { previous-window scope="workspace"; }
        Mod+grave       { next-window     filter="app-id"; }
        Mod+Shift+grave { previous-window filter="app-id"; }
    }
}
```

`~/.config/niri/shorin-niri/rule.kdl` 你可以先留空（不影响启动），后续再加规则。

---

## M. 美化细节：DPI、圆角、阴影、光标、GTK 主题、图标

### M.1 DPI/缩放（非常影响“像不像高级桌面”）

你会发现同样的桌面：
- 不做缩放 → 字体太小/太大
- 乱做缩放 → 模糊/比例怪

niri 输出缩放在 `outputs.kdl` 里：
- 内屏 2K/2.5K：常见 `scale 1.25`
- 外接 3440×1440：常见 `scale 1`

你一定要用 `niri msg outputs` 看你真实输出名，然后改对。

### M.2 光标主题（我当前用 Breeze）

安装：

```bash
pacman -S --needed breeze
```

niri 里已设置：

```kdl
cursor {
  xcursor-theme "breeze_cursors"
  xcursor-size 30
}
```

### M.3 GTK 主题与图标（让应用统一）

建议：

```bash
pacman -S --needed \
  nwg-look \
  adw-gtk3 \
  papirus-icon-theme
```

打开 `nwg-look`：
- GTK theme：`adw-gtk3-dark`
- Icons：`Papirus-Dark`
- Font：`Noto Sans CJK SC`

> 这是我认为“少折腾但很体面”的组合。

---

## N. Btrfs + Snapper：自动快照、更新前后快照、清理策略

### N.1 安装 snapper + 自动与 pacman 联动

```bash
pacman -S --needed snapper snap-pac
```

### N.2 创建 root 配置（如果你还没有）

```bash
snapper list-configs
```

没有 `root` 就创建：

```bash
snapper -c root create-config /
```

### N.3 启用时间线快照与清理

```bash
systemctl enable --now snapper-timeline.timer
systemctl enable --now snapper-cleanup.timer
```

### N.4 养成习惯：大更新前手动拍一张

```bash
sudo snapper -c root create --description "before update"
```

---

## O. 常用软件清单（稳定优先）

```bash
pacman -S --needed \
  firefox \
  mpv \
  obs-studio \
  unzip p7zip unrar \
  btop fastfetch \
  ripgrep fd
```

游戏（可选）：

```bash
pacman -S --needed steam
```

用独显启动：

```bash
prime-run steam
```

---

## P. 故障排查：你遇到问题时按这个 SOP 走

### P.1 进不去桌面/黑屏

1) 先在 TTY（Ctrl+Alt+F2）登录
2) 看显示管理器：

```bash
systemctl status lightdm --no-pager
journalctl -u lightdm -b --no-pager | tail -n 200
```

3) 看 niri 自身日志（如果有）：

```bash
journalctl --user -b --no-pager | grep -i niri | tail -n 200
```

### P.2 共享屏幕/录屏不工作

99% 是 portal。

```bash
systemctl --user status xdg-desktop-portal --no-pager
systemctl --user status xdg-desktop-portal-gnome --no-pager
```

### P.3 NVIDIA 驱动异常

```bash
nvidia-smi
journalctl -b | grep -iE 'nvidia|drm' | tail -n 200
```
