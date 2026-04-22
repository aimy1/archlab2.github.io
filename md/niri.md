---
title: "为什么我放弃传统桌面，选择 Wayland + Niri"
date: 2026-03-27
categories: ["Linux", "System Design"]
tags: ["Arch Linux", "Wayland", "Niri", "Window Manager", "Geek", "Workflow"]
description: "从传统桌面到 Wayland + Niri，一次关于“系统可控性与可设计性”的选择。"
---

# 🧠 为什么我放弃传统桌面，选择 Wayland + Niri

## 0x00 / 背景：从“使用系统”到“设计系统”

我对 Linux 桌面的需求经历了一个变化：

```

可用 → 好用 → 好看 → 可控 → 可设计

```

大多数桌面环境停在前三层，而我最终需要的是后两者。

这也是我离开传统桌面（GNOME / KDE）的根本原因。

---

## 0x01 / 问题建模：传统桌面的问题不是性能，而是“不可推导”

传统桌面环境的核心问题可以抽象为：

> 👉 **系统行为不可预测（Non-deterministic UI State）**

---

### 1.1 状态黑箱（State Black Box）

在 KDE / GNOME 中：

- 多进程（kwin / gnome-shell / dbus / portals…）
- 多层抽象（WM / Compositor / Shell）
- 隐式状态（focus / stacking / animation state）

👉 导致一个问题：

```

当前 UI = f(未知状态集合)

```

而不是：

```

当前 UI = f(明确规则)

```

---

### 1.2 Debug 成本极高

当出现问题：

- 窗口焦点异常
- 输入行为异常
- 渲染 glitch

你需要排查：

- WM？
- Compositor？
- Toolkit（GTK / Qt）？
- Driver？

👉 这不是“使用系统”，而是在逆向系统。

---

### 1.3 UI ≠ 工作流

传统桌面设计目标：

> 模拟现实桌面（Desktop Metaphor）

但我的需求是：

> 构建信息处理环境（Information Processing Interface）

---

## 0x02 / 方案选择：为什么是 Wayland

我选择 Wayland，不是因为它“新”，而是因为：

> 👉 **它允许系统重新变得“可建模”**

---

### 2.1 架构收敛（Architecture Collapse）

X11：

```

Client → X Server → WM → Compositor → Display

```

Wayland：

```

Client → Compositor → Display

```

👉 结果：

- 层级减少
- 状态路径缩短
- 行为更可推导

---

### 2.2 输入/渲染路径可控

Wayland 中：

- 输入事件由 compositor 控制
- buffer 交换路径明确
- 没有历史兼容层干扰

👉 这意味着：

> 👉 UI 行为 ≈ 可推导系统

---

### 2.3 为现代系统设计

Wayland 是为这些场景设计的：

- 高刷新率（144Hz+）
- Fractional scaling
- GPU compositing

而不是为 1980s 的网络透明窗口系统服务。

---

## 0x03 / 关键选择：为什么是 Niri

在 Wayland 生态中，关键不是协议，而是 compositor。

我最终选择 Niri，而不是 Hyprland / Sway，原因可以抽象为：

> 👉 **系统模型的差异，而不是功能差异**

---

## 0x04 / 模型对比：Hyprland vs Niri

### 4.1 Hyprland：状态驱动（Stateful WM）

Hyprland 的模型：

- 窗口 = 节点
- 布局 = 动态树
- 状态 = 可变

👉 特点：

- 灵活
- 可动画化
- 视觉效果强

👉 代价：

```

窗口位置 = f(历史状态 + 当前操作)

```

不可预测性上升。

---

### 4.2 Niri：规则驱动（Rule-based WM）

Niri 的模型：

> 👉 **Scrolling Tiling（流式窗口系统）**

核心抽象：

```

窗口 = 流中的元素
布局 = 单向序列
视图 = 滚动窗口

```

---

### 4.3 可预测性（Determinism）

在 Niri 中：

- 没有“随机分裂”
- 没有“隐式重排”
- 没有“布局漂移”

👉 任意时刻：

```

窗口位置 = f(索引 + 规则)

```

---

### 4.4 复杂度对比

| 维度 | Hyprland | Niri |
|------|----------|------|
| 状态复杂度 | 高 | 低 |
| 可预测性 | 中 | 高 |
| 动画能力 | 强 | 中 |
| 系统可建模性 | 中 | 高 |

---

## 0x05 / 系统重构：桌面 → 组件化架构

使用 Niri 后，我的桌面不再是“环境”，而是一个系统：

```

[ Compositor ]  → Niri
[ Status Layer ] → Waybar / 自定义
[ Launcher ]     → Rofi / Walker
[ Terminal ]     → Foot / Alacritty
[ Monitor ]      → MangoHud / 自建 UI

```

👉 每个组件：

- 可替换
- 可调试
- 可独立优化

---

## 0x06 / 工作流变化（关键收益）

### 6.1 从 GUI 导向 → 键盘导向

所有操作变成：

```

Action = Keybinding → Deterministic Result

```

---

### 6.2 从“找窗口” → “定位窗口”

传统桌面：

> 视觉搜索

Niri：

> 逻辑定位（index / workspace）

---

### 6.3 从“使用 UI” → “构建 UI”

我现在会主动设计：

- 状态信息如何展示
- 窗口如何流动
- 快捷键如何组织

---

## 0x07 / 代价与边界

### ❌ 成本

- 学习成本高
- 初始配置复杂
- 生态不如传统桌面成熟

---

### ❌ 不适合人群

- 依赖 GUI 操作的人
- 不愿意维护配置的人
- 需要“开箱即用”的用户

---

## 0x08 / 本质结论

我最终选择 Wayland + Niri，本质上不是技术选择，而是：

> 👉 **系统哲学选择**

---

传统桌面：

```

用户 → 适应系统

```

Niri：

```

系统 → 服从用户定义

```

---

## 0x09 / 最终状态

现在我的桌面可以描述为：

```

* 无冗余 UI
* 无隐式行为
* 完全键盘驱动
* 所有状态可推导

```

---

## 0x0A / 结语

如果你也在折腾 Linux 桌面，可以换一个问题：

不要问：

> 哪个桌面最好？

而是问：

> 👉 **这个系统是否“可理解、可控制、可重构”？**

---


