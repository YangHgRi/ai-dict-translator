# AI Translator (Chrome Extension)

这是一个基于 Manifest V3 的现代化 Chrome 扩展项目，提供强大的 AI 驱动翻译功能。

项目使用现代前端技术栈构建，包括 Vite、React 和 TypeScript，以确保高效的开发体验和优秀的项目可维护性。

## ✨ 核心功能

- **划词翻译**: 在任何网页上选中文字，通过右键菜单获得 AI 翻译结果
- **Popup 主动查询**: 点击扩展图标，在弹出的窗口中输入单词或句子进行快速翻译
- **多模型支持**: 支持配置不同的 AI 模型（默认 Gemini 2.5 Flash）
- **自定义端点**: 支持配置自定义 API 端点，兼容 OpenAI API 格式
- **安全配置**: 所有敏感信息（如 API Key）都存储在用户本地的 `chrome.storage` 中，确保数据安全

## 🛠️ 技术栈

- **构建工具**: [Vite](https://vitejs.dev/) 7.1.2
- **核心框架**: [React](https://react.dev/) 19.1.1
- **开发语言**: [TypeScript](https://www.typescriptlang.org/) 5.8.3
- **样式框架**: [Tailwind CSS](https://tailwindcss.com/) 4.1.13
- **Chrome 扩展插件**: [CRXJS Vite Plugin](https://crxjs.dev/vite-plugin) 2.2.0
- **代码规范**: ESLint 9.33.0
- **打包工具**: vite-plugin-zip-pack（自动生成发布包）

## 🚀 安装与使用

### 1. 准备工作

- 确保你已经安装了 [Node.js](https://nodejs.org/) (v18 或更高版本) 和 [pnpm](https://pnpm.io/)

### 2. 克隆与安装依赖

```bash
git clone [你的项目仓库地址]
cd ai-dict-translator
pnpm install
```

### 3. 启动开发模式

```bash
pnpm dev
```

该命令会启动 Vite 开发服务器，并在项目根目录下生成一个 `dist` 文件夹，支持热重载开发。

### 4. 在 Chrome 中加载扩展

1. 打开 Chrome 浏览器，地址栏输入 `chrome://extensions/` 并回车
2. 打开右上角的 **"开发者模式"** 开关
3. 点击 **"加载已解压的扩展程序"** 按钮
4. 选择项目根目录下的 `dist` 文件夹

### 5. 配置 API 设置

1. 在扩展列表页面，找到 "AI Translator"，点击 **"扩展程序选项"**
2. 在选项页面中配置以下信息：
   - **API Key**: 你的 AI 服务 API 密钥
   - **模型**: AI 模型名称（默认：gemini-2.5-flash）
   - **服务端点**: API 端点地址（默认：<http://localhost:8000/openai/v1/chat/completions）>
   - **系统提示**: 自定义翻译指令（可选）
3. 点击"保存设置"

### 6. 开始使用

- **划词翻译**: 在任意网页选中文字，右键选择"AI翻译选中文本"
- **主动翻译**: 点击扩展图标，在弹窗中输入要翻译的内容

## 📁 项目结构

```plaintext
ai-dict-translator/
├── src/
│   ├── background/          # Service Worker 后台脚本
│   │   └── index.ts        # 右键菜单和消息处理
│   ├── content/            # Content Script 内容脚本
│   │   └── index.ts        # 页面文字选择监听
│   ├── options/            # 选项页面
│   │   ├── main.tsx        # 选项页入口
│   │   └── Options.tsx     # 配置界面组件
│   ├── services/           # 服务层
│   │   └── translator.ts   # AI 翻译服务
│   ├── App.tsx             # Popup 主界面
│   ├── main.tsx            # Popup 入口
│   └── index.css           # 全局样式
├── public/                 # 静态资源
├── manifest.config.ts      # Chrome 扩展配置
├── vite.config.ts          # Vite 构建配置
└── package.json            # 项目依赖
```

## 🔧 开发指南

### 可用脚本

```bash
# 开发模式（支持热重载）
pnpm dev

# 生产构建
pnpm build

# 代码检查
pnpm lint

# 预览构建结果
pnpm preview
```

### 核心功能实现

- **划词翻译**: Content Script 监听文字选择，Background Script 处理右键菜单
- **AI 翻译**: 支持兼容 OpenAI API 格式的各种 AI 服务
- **配置管理**: 使用 Chrome Storage API 安全存储用户配置
- **热重载**: 开发模式下自动重载扩展，提升开发效率

### 扩展权限

- `contextMenus`: 右键菜单功能
- `storage`: 配置信息存储
- `scripting`: 注入脚本执行
- `activeTab`: 访问当前标签页
- `<all_urls>`: 在所有网站运行

## 🚀 构建与发布

### 开发构建

```bash
pnpm build
```

### 发布包生成

构建完成后会自动在 `release/` 目录生成 `release.zip` 文件，可直接用于 Chrome Web Store 发布。

## 🔧 自定义配置

### 支持的 AI 服务

项目默认配置适用于本地部署的 AI 服务，但可以轻松配置为使用其他兼容 OpenAI API 的服务：

- OpenAI GPT 系列
- Google Gemini
- Anthropic Claude
- 本地部署的开源模型

### 系统提示自定义

可以通过选项页面自定义系统提示，以获得更符合需求的翻译结果。
