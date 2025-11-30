# NextClass 智能课表

<div align="center">

![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?style=flat-square&logo=vite&logoColor=white)
![Ant Design](https://img.shields.io/badge/Ant%20Design-6.0-0170FE?style=flat-square&logo=antdesign&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-5.0-443E38?style=flat-square&logo=redux&logoColor=white)

**基于 React 19 + TypeScript + Vite 7 的现代化智能课表管理系统**

[快速开始](#-快速开始) • [功能特性](#-功能特性) • [技术栈](#-技术栈) • [项目结构](#-项目结构)

</div>

---

## 📖 项目简介

**NextClass 智能课表** 是一个高效、现代化的课表管理解决方案。项目采用最新的前端技术栈构建，旨在提供流畅的用户体验和强大的功能支持。通过集成 Ant Design 6 和 Framer Motion，实现了美观且富有交互性的界面。

## 🚀 技术栈

本项目采用前沿的前端技术组合，确保高性能与可维护性：

| 类别          | 技术                                            | 版本   | 说明                        |
| ------------- | ----------------------------------------------- | ------ | --------------------------- |
| **核心框架**  | [React](https://react.dev/)                     | ^19.2  | 最新一代前端框架            |
| **开发语言**  | [TypeScript](https://www.typescriptlang.org/)   | ^5.9   | 强类型 JavaScript 超集      |
| **构建工具**  | [Vite](https://vitejs.dev/)                     | ^7.2   | 极速开发与构建工具          |
| **UI 组件库** | [Ant Design](https://ant.design/)               | ^6.0   | 企业级 UI 设计语言          |
| **状态管理**  | [Zustand](https://zustand-demo.pmnd.rs/)        | ^5.0   | 轻量级状态管理库            |
| **路由管理**  | [React Router](https://reactrouter.com/)        | ^7.9   | 声明式路由库                |
| **HTTP 请求** | [Axios](https://axios-http.com/)                | ^1.13  | 基于 Promise 的 HTTP 客户端 |
| **样式处理**  | [Sass](https://sass-lang.com/)                  | ^1.94  | CSS 预处理器                |
| **动画效果**  | [Framer Motion](https://www.framer.com/motion/) | ^12.23 | 强大的 React 动画库         |

## 🎯 功能特性

### ✅ 已实现功能

- **🔐 认证系统**

  - 完整的登录流程
  - Token 持久化存储与自动登录
  - HTTP 请求拦截器处理认证信息

- **📊 仪表板**

  - 数据统计展示
  - 用户信息管理
  - 响应式布局设计

- **🛠 工程化配置**
  - TypeScript 严格类型检查
  - ESLint 代码规范检查 (v9)
  - 生产环境构建优化
  - 模块化 API 管理

### 🚧 规划中功能

- [ ] 智能排课算法
- [ ] 课程冲突检测
- [ ] 多维度课表视图 (日/周/月)
- [ ] 导出/打印功能
- [ ] 主题切换与个性化设置

## 🚦 快速开始

### 1. 环境准备

确保您的开发环境满足以下要求：

- **Node.js**: >= 18.0.0
- **pnpm**: 推荐使用 pnpm 管理依赖

### 2. 安装依赖

```bash
# 克隆项目 (如果是从 git 获取)
# git clone <repository-url>

# 进入项目目录
cd nextclass

# 安装依赖
pnpm install
```

### 3. 启动开发服务器

```bash
pnpm dev
```

访问 [http://localhost:5173](http://localhost:5173) 查看应用 (端口视 Vite 配置而定)。

### 4. 构建生产版本

```bash
pnpm build
```

### 5. 代码检查

```bash
# 类型检查
pnpm typecheck

# 代码规范检查
pnpm lint
```

## 📦 项目结构

```text
src/
├── api/                    # API 接口管理
│   ├── auth.ts             # 认证相关接口
│   └── user.ts             # 用户相关接口
├── components/             # 公共组件
│   ├── Common/             # 通用基础组件
│   └── Layout/             # 布局组件
├── pages/                  # 页面组件
│   ├── Dashboard/          # 仪表板页
│   ├── Home/               # 首页
│   └── Login/              # 登录页
├── router/                 # 路由配置
├── stores/                 # Zustand 状态管理
├── types/                  # TypeScript 类型定义
├── utils/                  # 工具函数 (HTTP 等)
└── App.tsx                 # 根组件
```

## 🔧 环境配置

项目支持多环境配置，请在根目录创建 `.env` 文件：

**开发环境 (.env.development)**

```properties
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_TITLE=NextClass 智能课表
```

**生产环境 (.env.production)**

```properties
VITE_API_BASE_URL=https://api.your-domain.com
VITE_APP_TITLE=NextClass 智能课表
```

## 🎨 开发规范

- **组件命名**: 采用 PascalCase，如 `UserProfile.tsx`
- **状态管理**: 使用 Zustand Store，按业务模块拆分
- **样式编写**: 优先使用 Ant Design 组件属性，自定义样式使用 SCSS 模块
- **API 调用**: 统一封装在 `src/api` 目录，通过 `request` 工具函数调用

## 📞 支持与反馈

如果您在使用过程中遇到任何问题，或有任何建议，欢迎联系开发团队或提交 Issue。

---

<div align="center">
  Copyright © 2025 NextClass Team. All rights reserved.
</div>
