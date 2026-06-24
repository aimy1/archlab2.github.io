---
title:  ③ OpenClaw + Ollama 实战（本地 AI 工作流）
date: 2026-3-22 00:27:17
categories: [Linux]
tags: [openclaw]
---



> 这一篇是整个系列的核心。
>
> 👉 我们要做一件事：**把 AI 变成你系统里的一个“命令”。**

---

# 一、目标：一条命令调用 AI

最终你会得到这样的体验：

```bash
openclaw ask "写一篇 Arch Linux 教程"
```

或者：

```bash
cat article.md | openclaw summarize
```

👉 不再打开网页，不再复制粘贴
👉 AI 直接成为你的 CLI 工具

---

# 二、整体架构（一定要看懂）

```
你 → OpenClaw → 脚本 → Ollama → 本地模型
```

👉 每一层的作用：

- OpenClaw：入口
- 脚本：逻辑控制
- Ollama：AI 服务
- 模型：真正计算

---

# 三、准备环境

---

## 1️⃣ 安装 Ollama

```bash
sudo pacman -S ollama
```

启动服务：

```bash
ollama serve
```

👉 作用：
- 在本地启动 AI 服务

---

## 2️⃣ 下载模型

```bash
ollama pull llama3
```

👉 你也可以用：

- mistral
- gemma
- deepseek

---

## 3️⃣ 测试是否正常

```bash
ollama run llama3
```

👉 如果能对话，说明 OK

---

# 四、核心实现：让 OpenClaw 调用 AI

---

## 思路

我们要做的是：

👉 写一个脚本 → OpenClaw 调用 → 请求 Ollama

---

## 示例脚本（ask）

创建文件：

```bash
nano ~/scripts/openclaw-ask.sh
```

内容：

```bash
#!/bin/bash

prompt="$*"

curl http://localhost:11434/api/generate \
  -d "{\"model\":\"llama3\",\"prompt\":\"$prompt\"}" \
  | jq -r '.response'
```

---

## 赋予权限

```bash
chmod +x ~/scripts/openclaw-ask.sh
```

---

## 绑定到 OpenClaw（思路）

```bash
openclaw ask "hello"
```

👉 实际执行：

```
openclaw → 调用脚本 → curl → ollama
```

---

# 五、进阶玩法（真正爆点）

---

## 🧠 1. 总结文件

```bash
cat notes.md | openclaw summarize
```

👉 自动总结

---

## 💻 2. 生成代码

```bash
openclaw code "写一个快速排序"
```

---

## 📝 3. 自动写博客

```bash
openclaw blog "OpenClaw 教程"
```

---

## ⚡ 4. 批量处理

```bash
for f in *.md; do openclaw summarize "$f"; done
```

---

# 六、CLI + AI = 为什么这么强

---

## 1. 可组合

```bash
cat log.txt | openclaw analyze | grep error
```

---

## 2. 可自动化

```bash
watch -n 60 "openclaw report"
```

---

## 3. 可扩展

你可以定义任意命令：

- ask
- summarize
- code
- translate

---

# 七、关键认知升级

很多人用 AI 是这样的：

- 打开网页
- 输入问题
- 复制结果

👉 这是“工具使用”

---

你现在做的是：

```bash
openclaw something
```

👉 这是：

> **把 AI 变成系统能力**

---

# 八、你已经可以做到什么？

现在你已经可以：

- 在终端调用 AI
- 自动处理文件
- 构建 AI 工作流

👉 这已经是高级用户能力

---

# 九、下一步可以怎么玩

你可以继续扩展：

- 接入 Git 自动提交
- 接入博客生成系统
- 接入系统监控

---

# 十、总结（最重要的一句话）

> OpenClaw + Ollama = 本地 AI 操作系统

当你开始用命令调用 AI：

👉 你就不再是“用户”，而是在“构建系统”

---

# 下一篇预告（最终篇）

👉 《打造你的 CLI 自动化系统（高阶篇）》

---

# 完成 🚀

这一篇的目标是：

👉 **让 AI 从“工具”变成“能力”**

如果你走到这一步，你已经和普通用户拉开巨大差距。

