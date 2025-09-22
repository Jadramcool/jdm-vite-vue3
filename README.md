# JDM Vue3 Admin Template

一个基于 Vue 3 + TypeScript + Vite + Naive UI 的现代化后台管理系统模板。

## ✨ 特性

- 🚀 **最新技术栈**：基于 Vue 3、TypeScript、Vite 等最新技术开发
- 🎨 **精美UI**：使用 Naive UI 组件库，界面美观大方
- 📱 **响应式设计**：支持多种设备，自适应不同屏幕尺寸
- 🌈 **主题切换**：支持明暗主题切换，多种主题配色
- 🔐 **权限管理**：完整的权限控制系统，支持角色权限管理
- 🌍 **国际化**：内置 i18n 国际化解决方案
- 📊 **图表组件**：集成图表展示功能
- 🎯 **TypeScript**：全面的 TypeScript 支持，提供更好的开发体验
- 📦 **组件封装**：丰富的业务组件和基础组件
- 🔧 **开发工具**：集成 ESLint、Prettier、UnoCSS 等开发工具

## 🛠️ 技术栈

### 核心框架

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - JavaScript 的超集，提供静态类型检查
- **Vite** - 下一代前端构建工具

### UI 组件库

- **Naive UI** - 一个 Vue 3 组件库
- **UnoCSS** - 即时按需原子化 CSS 引擎
- **Iconify** - 统一的图标框架

### 状态管理

- **Pinia** - Vue 的状态管理库

### 路由管理

- **Vue Router** - Vue.js 官方路由管理器

### 工具库

- **Day.js** - 轻量级日期处理库
- **Axios** - HTTP 客户端
- **VueUse** - Vue 组合式 API 工具集

### 开发工具

- **ESLint** - 代码质量检查工具
- **Prettier** - 代码格式化工具
- **Husky** - Git hooks 工具
- **Lint-staged** - 暂存文件检查工具

## 📁 项目结构

```
jdm-vite-vue3/
├── env/                    # 环境配置文件
│   ├── .env.development    # 开发环境配置
│   ├── .env.production     # 生产环境配置
│   └── .env.test          # 测试环境配置
├── public/                 # 静态资源
├── src/
│   ├── api/               # API 接口
│   ├── assets/            # 静态资源
│   ├── components/        # 公共组件
│   ├── config/            # 配置文件
│   ├── constants/         # 常量定义
│   ├── directives/        # 自定义指令
│   ├── hook/              # 组合式函数
│   ├── layout/            # 布局组件
│   ├── locales/           # 国际化
│   ├── router/            # 路由配置
│   ├── store/             # 状态管理
│   ├── utils/             # 工具函数
│   ├── views/             # 页面组件
│   ├── App.vue            # 根组件
│   ├── main.ts            # 入口文件
│   └── settings.ts        # 全局设置
├── package.json           # 项目依赖
├── vite.config.ts         # Vite 配置
├── tsconfig.json          # TypeScript 配置
└── README.md              # 项目说明
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- pnpm >= 7.0.0 (推荐) 或 npm >= 8.0.0

### 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

### 启动开发服务器

```bash
# 启动开发服务器
pnpm dev

# 或
npm run dev
```

访问 [http://localhost:4000](http://localhost:4000) 查看应用。

### 构建生产版本

```bash
# 构建生产版本
pnpm build

# 或
npm run build
```

### 预览生产版本

```bash
# 预览生产版本
pnpm preview

# 或
npm run preview
```

## 📋 功能模块

### 🏠 首页

- 数据概览
- 快捷操作
- 系统信息展示

### 🔧 基础功能

- **基本组件**：展示常用 UI 组件
- **图标库**：Iconify 图标集成
- **UnoCSS**：原子化 CSS 演示
- **KeepAlive**：页面缓存功能
- **主题演示**：主题切换功能
- **功能展示**：各种功能特性演示
- **图表示例**：数据可视化图表

### 🛡️ 系统管理

- **用户管理**：用户信息管理，支持增删改查
- **菜单管理**：系统菜单配置管理
- **角色管理**：角色权限分配管理

## 🎨 主题配置

项目支持多种主题配置：

### 字体选择

- 得意黑 (Smiley Sans)
- 鸿蒙字体 (HarmonySans)
- 霞鹜文楷 (LXGWWenKai)
- 系统默认字体

### 主题色彩

- 主色调：#18a058 (绿色)
- 信息色：#2080f0 (蓝色)
- 成功色：#18a058 (绿色)
- 警告色：#f0a020 (橙色)
- 错误色：#d03050 (红色)

## 🔧 开发指南

### 代码规范

项目使用 ESLint + Prettier 进行代码规范检查：

```bash
# 检查代码规范
pnpm lint

# 自动修复代码规范问题
pnpm lint:fix
```

### 提交规范

项目使用 Husky + Lint-staged 进行提交前检查，请遵循以下提交规范：

- `feat`: 新功能
- `fix`: 修复问题
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

### 新增页面

1. 在 `src/views` 目录下创建页面组件
2. 在 `src/router/local-router/router-config.ts` 中配置路由
3. 根据需要在 `src/api` 中添加接口

### 新增组件

1. 在 `src/components` 目录下创建组件
2. 在 `src/components/index.ts` 中导出组件
3. 在需要的地方引入使用

## 📝 环境配置

### 开发环境 (.env.development)

```env
VITE_NODE_ENV=development
VITE_APP_TITLE=开发环境
VITE_APP_BASE_URL=http://localhost:3000/api
VITE_APP_TOKEN_KEY=token
VITE_USE_HASH=true
```

### 生产环境 (.env.production)

根据实际部署环境修改相应配置。

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源。

## 👨‍💻 作者

**jdm** - 项目维护者

---

如果这个项目对你有帮助，请给个 ⭐️ 支持一下！
