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
├── 📁 tasks/words/        # 存放日语单词 CSV 文件
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

### **📄 日语数据库信息展示页面**
#### **📌 页面介绍**
该页面用于展示日语词汇数据库的信息，包括：
- **热门日语单词**（根据用户学习情况统计）
- **最新日语学习新闻**
- **用户学习数据统计**（例如最常见的错题）

#### **📄 相关文件**
- `database.html`：前端页面，展示日语数据库信息
- `database.js`：处理日语数据库相关逻辑

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

### **🛠 未来开发计划**
| 任务 | 描述 | 优先级 |
|------|------|------|
| 🎨 **优化 UI 设计** | 提高界面美观度，添加动画效果 | ⭐⭐⭐ |
| 🎧 **单词发音** | 添加日语发音功能（Google TTS / 语音合成 API） | ⭐⭐⭐ |
| 🎯 **错题本功能** | 记录用户不会的单词，强化记忆 | ⭐⭐ |
| 📱 **移动端优化** | 适配手机端 UI，提升触控体验 | ⭐ |
| 📊 **日语数据库扩展** | 增强数据库页面功能，增加更多统计信息 | ⭐⭐ |

---

### **🌟 开发建议**
#### **1️⃣ 代码优化**
- **封装函数**：目前的 `script.js` 代码逻辑较为线性，可以封装 `Firebase` 操作（例如 `saveUserProgress()` 和 `loadUserProgress()`）。  
- **异常处理**：目前 `catch` 语句没有详细的错误处理，可以添加 `console.error()` 方便调试。

#### **2️⃣ Firebase 安全性**
- Firestore 规则需要限制访问权限，确保用户只能修改自己的学习进度。
- 可以使用 **Firebase Authentication** 绑定用户邮箱，防止恶意用户随意创建账户。

---

### **📬 联系方式**
📧 如果你有任何建议或问题，可以通过 `kok_s0s@163.com` 联系我！  
💬 欢迎 PR 和 Issue，一起完善这个项目！
