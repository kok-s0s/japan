## **📌 README 文件**

### **📝 项目名称**
🚀 **Pass Japan N1 - 日语 N1 词汇学习工具**

### **📖 项目介绍**
本项目是一个基于 **Firebase** 和 **JavaScript** 的日语词汇学习工具，支持 **单词展示、用户进度保存、登录/注册功能**。
目标是帮助用户备考 **日语能力考试（JLPT N1）**，通过**单词闪卡**的方式高效学习日语词汇。

---

### **📂 目录结构**
```
📂 pass-japan-n1
├── 📁 database/words/        # 存放日语单词 CSV 文件
├── 📄 index.html          # 主页面
├── 📄 database.html       # 日语数据库信息展示页面
├── 📄 styles.css          # 样式文件
├── 📄 script.js           # 主要 JavaScript 逻辑
└── 📄 README.md           # 项目说明文档（本文件）
```

---

### **🎯 功能概览**
✅ **日语词汇学习**：支持显示日语单词（假名、日文、中文、罗马字）
✅ **单词切换**：支持 `上一条` / `下一条` 按钮切换单词
✅ **用户注册 & 登录**：Firebase **Auth** 进行用户身份管理
✅ **学习进度保存**：Firebase **Firestore** 存储用户学习进度
✅ **响应式 UI**：适配不同设备，提升学习体验
✅ **日语数据库展示**：展示日语词汇数据、新闻及用户相关信息

---

### **🚀 技术栈**
- **HTML + CSS + JavaScript**
- **Firebase（Firestore + Auth）**
- **CSV 数据解析**
- **ES Modules（import/export 方式加载 Firebase SDK）**

---

### **🔧 部署 & 运行**
#### **1️⃣ 安装 Firebase CLI（可选）**
如果你希望本地运行 Firebase 服务，可以安装 Firebase CLI：
```sh
npm install -g firebase-tools
firebase login
```

#### **2️⃣ 克隆本项目**
```sh
git clone https://github.com/你的GitHub/pass-japan-n1.git
cd pass-japan-n1
```

#### **3️⃣ 启动本地服务器**
使用 **VS Code Live Server** 或者 Python HTTP 服务器：
```sh
python3 -m http.server 8000
```
然后访问 `http://localhost:8000`

---

### **📬 联系方式**
📧 如果你有任何建议或问题，可以通过 `kok_s0s@163.com` 联系我！
💬 欢迎 PR 和 Issue，一起完善这个项目！
