# AI Translator + MDX Dictionary (Chrome Extension)

这是一个基于 Manifest V3 的现代化 Chrome 扩展项目，旨在提供强大的划词翻译和本地 MDX 词典查询功能。

项目使用现代前端技术栈构建，包括 Vite、React 和 TypeScript，以确保高效的开发体验和优秀的项目可维护性。

## ✨ 核心功能

- **划词翻译**: 在任何网页上选中文字，即可通过右键菜单或自动弹窗获得 AI 翻译结果。
- **Popup 主动查询**: 点击扩展图标，在弹出的窗口中输入单词或句子进行快速翻译和词典查询。
- **MDX 词典支持**: 支持导入本地 MDX 格式的词典文件，实现离线、高速的单词查询。
- **安全配置**: 所有敏感信息（如 API Key）都存储在用户本地的 `chrome.storage` 中，确保数据安全。

## 🛠️ 技术栈

- **构建工具**: [Vite](https://vitejs.dev/)
- **核心框架**: [React](https://react.dev/) 19
- **开发语言**: [TypeScript](https://www.typescriptlang.org/)
- **Chrome 扩展插件**: [CRXJS Vite Plugin](https://crxjs.dev/vite-plugin)
- **代码规范**: ESLint + Prettier

## 🚀 安装与使用

### 1. 准备工作

- 确保你已经安装了 [Node.js](https://nodejs.org/) (v18 或更高版本) 和 [pnpm](https://pnpm.io/)。

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

该命令会启动 Vite 开发服务器，并在项目根目录下生成一个 `dist` 文件夹。

### 4. 在 Chrome 中加载扩展

1. 打开 Chrome 浏览器，地址栏输入 `chrome://extensions/` 并回车。
2. 打开右上角的 **“开发者模式”** 开关。
3. 点击 **“加载已解压的扩展程序”** 按钮。
4. 选择项目根目录下的 `dist` 文件夹。

### 5. 配置 API Key

1. 在扩展列表页面，找到 "AI Translator"，右键点击图标或找到详情，选择 **“扩展程序选项”**。
2. 在打开的选项页面中，填入你的 AI 服务 API Key 和其他相关配置。
3. 点击“保存设置”。

现在，你可以开始使用此扩展了！

## 🔧 开发指南

- **项目结构**:
  - `src/background`: Service Worker 相关逻辑。
  - `src/content`: Content Script 相关逻辑。
  - `src/popup`: Popup 页面的 React 应用。
  - `src/options`: 选项页的 React 应用。
  - `src/services`: 封装的各类服务，如翻译 API 调用。
- **热重载**: 在 `pnpm dev` 模式下，你对代码的任何修改都会自动触发扩展的热重载，无需手动刷新。
- **生产构建**: 当你准备发布时，运行以下命令：

  ```bash
  pnpm build
  ```

  这会在 `dist` 目录下生成一个优化过的、可用于发布的生产版本扩展包。
