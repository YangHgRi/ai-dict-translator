# Chrome 扩展“AI Translator + MDX Dictionary”现代化改造报告

## 1. 项目现状分析

通过对项目 `manifest.json` 及 `src` 目录下所有源代码的分析，我们总结出当前项目的核心特点和主要问题。

### 1.1. 项目概述

该项目是一个基于 `Manifest V3` 的 Chrome 扩展，旨在为用户提供划词翻译和 MDX 词典查询功能。其基本功能链路已经搭建完成：

- **划词翻译**: 通过 `content_script` 监听用户划词动作，将选中文本发送至 `background_script`，调用 API 进行翻译，并以弹窗形式展示结果。
- **Popup 主动翻译**: 用户可在扩展的 Popup 页面输入文本，进行翻译和词典查询。
- **MDX 词典**: 提供了词典文件上传的接口，但查询功能尚未实现。

### 1.2. 主要问题

尽管项目雏形已备，但其开发方式较为传统，存在多个亟待改进的问题：

1. **严重安全隐患**: **API Key 被硬编码**在 `src/config.js` 文件中。这会将开发者的密钥直接暴露给所有安装该扩展的用户，极易导致密钥被盗用和滥用，产生意外的经济损失。
2. **缺乏工程化体系**:
    - **无依赖管理**: 项目没有使用 `npm` 或 `pnpm` 等包管理器，无法系统地管理第三方库（如未来需要引入的 `mdict-js`）。
    - **无构建流程**: 所有 JS 文件通过原始的 `<script>` 标签引入，依赖关系不明确，容易导致全局变量污染和加载顺序问题。
    - **无代码规范**: 缺乏 `ESLint` 和 `Prettier` 等工具的约束，代码风格不一，长期维护成本高。
3. **代码组织混乱**:
    - **UI 与逻辑耦合**: `background.js` 中通过拼接 HTML 字符串的方式创建浮动窗口，这种做法使得样式和结构难以维护。
    - **模块划分不清**: 功能代码散落在不同文件中，缺乏清晰的模块化（ES Module）组织，可读性和复用性差。
4. **用户体验不佳**:
    - **交互方式原始**: 右键菜单翻译后使用 `alert()` 显示结果，体验非常糟糕。
    - **UI 简陋**: 无论是 Popup 还是浮动窗口，UI 都比较简单，缺乏现代感和良好的交互设计。
5. **可维护性与扩展性差**:
    - 当前的开发模式下，添加新功能（例如支持多种翻译引擎、管理多个词典）会非常困难。
    - 调试过程繁琐，难以进行单元测试。

---

## 2. 现代化改造方案

针对以上问题，我们提出一套完整的现代化、工程化改造方案，旨在提升项目的安全性、可维护性和用户体验。

### 2.1. 引入前端工程化体系

这是改造的核心，为后续所有优化奠定基础。

- **包管理器**: 推荐使用 **`pnpm`**，它能高效管理依赖，并节省磁盘空间。
- **构建工具**: 引入 **`Vite`**。它为 Chrome 扩展开发提供了开箱即用的支持（例如通过 `vite-plugin-crx-mv3`），并带来极速的开发体验和高效的打包输出。
- **代码规范工具**:
  - **`ESLint`**: 用于静态代码分析，保证代码质量。
  - **`Prettier`**: 用于代码格式化，统一团队风格。
  - **`husky` + `lint-staged`**: 在 `git commit` 时自动执行代码检查和格式化，从源头保证代码仓库的整洁。

### 2.2. 重构代码结构与开发范式

- **全面模块化**: 将所有 JavaScript 代码迁移至 ES Module，利用 `import`/`export` 语法管理依赖。
- **组件化开发 (推荐 React)**:
  - 使用 **React** 和 **TypeScript** 重构 `popup` 页面和划词后的浮动窗口。
  - 将浮动窗口封装成一个独立的 `<TranslateCard>` 组件，在 `content_script` 中动态挂载。这能彻底分离 UI 和逻辑，并便于实现复杂交互（如加载状态、错误提示）。
- **优化目录结构**: 按照功能对代码进行重新组织，提升项目清晰度。

    ```plaintext
    src/
    ├── background/       # Service Worker 逻辑
    ├── content/          # Content Script 逻辑
    ├── popup/            # Popup 页面 (React 应用)
    ├── options/          # 选项页面 (React 应用)
    ├── components/       # 可复用的 React 组件
    ├── services/         # 封装的 API 服务、存储服务等
    └── assets/           # 静态资源
    ```

### 2.3. 解决核心安全问题

- **移除硬编码的 API Key**: 从 `config.js` 中彻底删除 API Key。
- **创建选项页面 (Options Page)**:
  - 新建一个选项页面，让用户自行输入并保存他们的 API Key。
  - 使用 **`chrome.storage.sync`** 或 **`chrome.storage.local`** API 来安全地存储用户配置。数据将仅保存在用户本地的浏览器中。
- **API 请求重构**: 在 `services/translator.ts` 中，发起请求前从 `chrome.storage` 中异步读取用户保存的 Key。

### 2.4. 提升用户体验 (UI/UX)

- **UI 框架**: 引入 **Tailwind CSS** 或一个轻量级的 React 组件库（如 **Ant Design**, **MUI**），快速构建美观、一致的界面。
- **Shadow DOM 隔离**: 在 `content_script` 中创建浮动窗口时，将其挂载在 **Shadow DOM** 内部。这可以确保扩展的 UI 不受宿主页面 CSS 的污染，反之亦然。
- **优化交互**:
  - 用全新的 `<TranslateCard>` 组件替代 `alert()` 和原始的 `div` 弹窗。
  - 在组件内部实现加载中、翻译成功、翻译失败等不同状态的 UI 展示。
  - 增加“一键复制”翻译结果、查看翻译历史等实用功能。

### 2.5. 完善核心功能

- **集成 `mdict-js`**: 使用 `pnpm` 将 `mdict-js` 作为依赖安装，并在 `services/` 目录中封装词典的加载和查询逻辑。
- **处理 WebAssembly**: `mdict-js` 依赖 WebAssembly (`.wasm` 文件)。需要配置 Vite (例如使用 `vite-plugin-wasm`) 来正确处理和打包 `.wasm` 资源。

## 3. 总结

当前项目是一个很好的起点，但其“刀耕火种”式的开发方式限制了其未来的发展。通过上述现代化改造，我们可以将其转变为一个**安全、健壮、易于维护和扩展**的现代化 Chrome 扩展项目，并为用户提供更加出色的使用体验。


---

## 4. 详细实施步骤 (Step-by-Step Guide)

本章节将提供一个从零开始，将现有项目迁移到现代化技术栈的详细操作指南。

### 第 1 步：环境准备与项目初始化

1.  **安装 pnpm**: 如果你还没有安装 pnpm，请先执行以下命令进行安装：
    ```bash
    npm install -g pnpm
    ```

2.  **初始化 Vite 项目**: 在你的项目根目录（`ai-dict-translator`）下，执行以下命令来创建一个新的 Vite + React + TypeScript 项目。
    ```bash
    pnpm create vite . --template react-ts
    ```
    *注意：最后的 `.` 表示在当前目录下创建项目。*

3.  **安装依赖**:
    ```bash
    pnpm install
    ```

4.  **安装 Chrome 扩展开发插件**: 我们需要 `CRXJS` 这个 Vite 插件来帮助我们处理 Chrome 扩展的打包和热重载。
    ```bash
    pnpm install @crxjs/vite-plugin@next -D
    ```

### 第 2 步：配置 Vite for Chrome Extension

1.  **创建 `vite.config.ts`**: 在项目根目录下创建 `vite.config.ts` 文件，并填入以下内容：

    ```typescript
    import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'
    import { crx } from '@crxjs/vite-plugin'
    import manifest from './manifest.json' // 直接复用现有的 manifest.json

    export default defineConfig({
      plugins: [
        react(),
        crx({ manifest }),
      ],
    })
    ```

2.  **修改 `manifest.json`**: CRXJS 插件会自动处理脚本的打包路径，因此我们需要稍微修改一下 `manifest.json`，移除 `src/` 前缀。

    ```diff
    - "service_worker": "src/background.js"
    + "service_worker": "src/background.ts" 
    + "type": "module"

    - "default_popup": "src/popup.html"
    + "default_popup": "index.html"

    - "js": ["src/content.js"]
    + "js": ["src/content.ts"]
    ```
    *我们还将文件名后缀改为 `.ts`，为后续使用 TypeScript 做准备。*

3.  **创建新的入口 HTML**: Vite 需要一个根 `index.html` 文件。在项目根目录创建它，这个文件将成为我们的 Popup 页面。
    ```html
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Popup</title>
      </head>
      <body>
        <div id="root"></div>
        <script type="module" src="/src/popup/main.tsx"></script>
      </body>
    </html>
    ```

### 第 3 步：迁移现有代码

1.  **重组目录**: 按照之前方案设计的目录结构，创建新的文件夹，并将旧的 `.js` 文件移动到对应位置，同时将后缀改为 `.ts` 或 `.tsx`。
    -   `src/background.js` -> `src/background/index.ts`
    -   `src/content.js` -> `src/content/index.ts`
    -   `src/popup.js` & `popup.html` -> `src/popup/` (后续用 React 重写)
    -   `src/translator.js` -> `src/services/translator.ts`
    -   删除 `src/config.js`，其功能将被选项页替代。

2.  **改造 Background 脚本**:
    -   `src/background/index.ts`: 将全局代码封装在 ES Module 环境中。暂时保留原有逻辑。

3.  **改造 Content 脚本**:
    -   `src/content/index.ts`: 同样改为 ES Module。这里是未来挂载 React 组件的地方。

4.  **改造翻译服务**:
    -   `src/services/translator.ts`: 导出 `translateWithChatGPT` 函数。API Key 的获取方式需要重构，暂时可以留空或使用占位符。

### 第 4 步：启动开发服务器

1.  **修改 `package.json`**: 在 `scripts` 中添加 `dev` 和 `build` 命令。
    ```json
    "scripts": {
      "dev": "vite",
      "build": "vite build"
    },
    ```

2.  **启动开发模式**:
    ```bash
    pnpm dev
    ```
    Vite 会启动一个开发服务器，并在根目录生成一个 `dist` 文件夹。

3.  **加载扩展**:
    -   打开 Chrome，进入 `chrome://extensions/`。
    -   启用“开发者模式”。
    -   点击“加载已解压的扩展程序”，选择项目根目录下的 `dist` 文件夹。
    -   现在，你对代码的任何修改都会被 Vite 捕捉到，并自动重新加载扩展，实现了现代化开发流程中的**热重载 (HMR)**。

### 第 5 步：使用 React 重构并解决安全问题

1.  **重构 Popup**:
    -   在 `src/popup/` 目录下，使用 React 组件的方式重写原有的 `popup.html` 和 `popup.js` 的功能。可以创建 `App.tsx` 作为主组件。

2.  **创建选项页**:
    -   在 `manifest.json` 中注册选项页：
        ```json
        "options_page": "options.html"
        ```
    -   创建 `options.html` 和对应的 React 入口 `src/options/main.tsx`。
    -   在选项页中，创建一个输入框和保存按钮，让用户输入并保存他们的 API Key 到 `chrome.storage.sync`。

3.  **安全地获取 API Key**:
    -   修改 `src/services/translator.ts`。在调用 `fetch` 之前，先通过 `await chrome.storage.sync.get('apiKey')` 来获取密钥。如果获取不到，就提示用户去选项页设置。

通过以上步骤，你就可以将一个传统的 Chrome 扩展项目，彻底改造为一个基于 Vite + React + TypeScript 的现代化工程项目。
