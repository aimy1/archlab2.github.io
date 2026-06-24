---
title: MariaDB的安装（适用于 Arch）
date: 2025-06-12 15:03:11
categories: [Database]
tags: [MariaDB, Installation]
---
---
## 简单、直观、文档全
📦后端 & 数据库（本地搭建）
数据库：MariaDB（比 MySQL 更轻便）
数据库前端管理工具：DBeaver（图形界面，像 Navicat，但免费）
API 服务端：Node.js + Express.js（用 JS 写，入门快）
🌐 前端框架（页面展示 + 数据交互）
框架：Vue.js 3（中文资料多，上手快）
样式工具：Vite + Element Plus（UI 组件库）

##  安装 MariaDB
```bash
sudo pacman -S mariadb
sudo mariadb-install-db --user=mysql --basedir=/usr --datadir=/var/lib/mysql
sudo systemctl start mariadb
sudo systemctl enable mariadb
sudo mysql_secure_installation
```
## 安装 DBeaver（图形界面）
```bash
sudo pacman -S dbeaver
```
DBeaver 可以连接 MariaDB，像 Excel 表格一样管理数据，非常适合新手学习 SQL 和建表逻辑。

## 安装 Node.js 与 Express（后端 API）
```bash
sudo pacman -S nodejs npm
mkdir my-api && cd my-api
npm init -y
npm install express mysql2 cors
```
创建简单的 API 服务器：
```bash
// index.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '你的数据库密码',
  database: 'testdb'
});

app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.listen(3000, () => console.log('API running on http://localhost:3000'));
```

##  安装 Vue.js + Element Plus（前端）
```bash
npm create vite@latest my-vue-app -- --template vue
cd my-vue-app
npm install
npm install axios element-plus
npm run dev
```
页面调用 API 的示例：
```bash
<!-- App.vue -->
<template>
  <el-table :data="users" style="width: 100%">
    <el-table-column prop="id" label="ID" width="50" />
    <el-table-column prop="name" label="Name" />
  </el-table>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const users = ref([])

onMounted(async () => {
  const res = await axios.get('http://localhost:3000/users')
  users.value = res.data
})
</script>
```
##  登录数据库
```bash
mysql -u root -p
```
## 创建一个名为 student，密码是 123456 的用户：
```bash
CREATE USER 'student'@'localhost' IDENTIFIED BY '123456';
```
用户只能从本机登录（localhost），连接数据库。

## 给用户分配权限（常用语法）
✔️ 方式一：授予对某个数据库的全部权限
```bash
GRANT ALL PRIVILEGES ON testdb.* TO 'student'@'localhost';
```
其中 testdb.* 是指该数据库下的所有表。

✔️方式二：授予所有权限（不推荐给普通用户）
```bash
GRANT ALL PRIVILEGES ON *.* TO 'student'@'localhost' WITH GRANT OPTION;
```
应用权限更改
```bash
FLUSH PRIVILEGES;
```
退出
```bash
EXIT;
```
##  查看用户和权限（可选）
```bash
-- 查看所有用户
SELECT user, host FROM mysql.user;

-- 查看权限
SHOW GRANTS FOR 'student'@'localhost';
```
## ❌ 删除用户（如出错）
```bash
DROP USER 'student'@'localhost';
```
## 最小常用总结版（复制即可）
```bash
-- 登录后执行以下：
CREATE USER 'student'@'localhost' IDENTIFIED BY '123456';
GRANT ALL PRIVILEGES ON testdb.* TO 'student'@'localhost';
FLUSH PRIVILEGES;
```
# MySQL/MariaDB 使用包

init.sql — 数据库初始化 SQL 文件
包含：
创建数据库 testdb
创建用户 student，密码 123456
建立示例表 users
```bash
-- 创建数据库
CREATE DATABASE IF NOT EXISTS testdb DEFAULT CHARACTER SET utf8mb4;

-- 创建用户（本地登录）
CREATE USER IF NOT EXISTS 'student'@'localhost' IDENTIFIED BY '123456';

-- 授权
GRANT ALL PRIVILEGES ON testdb.* TO 'student'@'localhost';
FLUSH PRIVILEGES;

-- 切换数据库
USE testdb;

-- 创建 users 表
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE
);

-- 插入示例数据
INSERT INTO users (name, email) VALUES 
('Alice', 'alice@example.com'),
('Bob', 'bob@example.com'),
('Charlie', 'charlie@example.com');
```


























