# React Admin 脚手架

基于 React + TypeScript + Vite 的现代化前端项目模板，集成了常用的开发工具和最佳实践。

## 🚀 技术栈

- **前端框架**: React 18 + TypeScript 5
- **构建工具**: Vite 5
- **状态管理**: Zustand 4
- **UI组件库**: Ant Design 5
- **路由管理**: React Router DOM 6
- **HTTP客户端**: Axios 1
- **样式方案**: Tailwind CSS + Ant Design

## 📦 项目结构

```
src/
├── api/                    # API接口管理
│   ├── auth.ts            # 认证相关API
│   ├── user.ts            # 用户相关API
│   └── index.ts           # API统一导出
├── router/                 # 路由配置
│   └── index.tsx          # 路由配置
├── utils/                  # 工具函数
│   └── http.ts            # HTTP请求封装
├── pages/                  # 页面组件
│   ├── Home/              # 首页
│   ├── Login/             # 登录页
│   └── Dashboard/         # 仪表板
├── components/             # 公共组件
│   ├── Layout/            # 布局组件
│   └── Common/            # 通用组件
├── stores/                 # 状态管理
│   └── user.ts            # 用户状态
└── types/                  # 类型定义
    └── index.ts           # 全局类型
```

## 🎯 功能特性

### ✅ 已实现功能

1. **项目初始化**
   - ✅ Vite + React + TypeScript 项目配置
   - ✅ 开发环境优化（端口3000，自动打开浏览器）

2. **技术栈集成**
   - ✅ Ant Design 组件库集成
   - ✅ Zustand 状态管理
   - ✅ React Router 路由系统
   - ✅ Axios HTTP客户端封装

3. **核心功能**
   - ✅ 用户登录/认证系统
   - ✅ 响应式页面布局
   - ✅ 状态持久化存储
   - ✅ HTTP请求拦截器

4. **页面组件**
   - ✅ 首页（技术栈展示）
   - ✅ 登录页面（表单验证）
   - ✅ 仪表板（数据统计）

5. **开发工具**
   - ✅ TypeScript 类型检查
   - ✅ ESLint 代码规范检查
   - ✅ 生产环境构建优化

## 🚦 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发环境

```bash
pnpm dev
```

访问 http://localhost:3000 查看应用

### 构建生产版本

```bash
pnpm build
```

### 代码检查

```bash
# 类型检查
pnpm typecheck

# 代码规范检查
pnpm lint
```

## 🔧 环境配置

### 开发环境 (.env.development)
```
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_TITLE=React Admin
```

### 生产环境 (.env.production)
```
VITE_API_BASE_URL=https://api.example.com
VITE_APP_TITLE=React Admin
```

## 📱 页面预览

### 首页
- 技术栈展示
- 快速导航到登录和仪表板

### 登录页面
- 用户名/密码表单
- 表单验证
- 登录状态管理

### 仪表板
- 数据统计卡片
- 用户信息展示
- 系统信息显示
- 退出登录功能

## 🔒 认证流程

1. 用户访问需要认证的页面
2. 检查本地存储的token
3. 如果token存在，自动登录
4. 如果token不存在，跳转到登录页
5. 登录成功后保存token和用户信息
6. 退出登录时清除token和用户信息

## 🎨 设计规范

- **颜色方案**: 主色调蓝色系，辅助绿色系
- **字体大小**: 使用Ant Design默认字体体系
- **间距**: 使用Tailwind CSS的spacing系统
- **响应式**: 支持移动端和桌面端自适应

## 📝 开发规范

### 组件规范
- 使用函数式组件和React Hooks
- 组件文件使用PascalCase命名
- 类型定义使用TypeScript接口

### API管理规范
- 按功能模块划分API文件
- 统一使用封装的HTTP客户端
- 接口函数使用清晰的命名规范

### 状态管理规范
- 使用Zustand进行状态管理
- 按业务模块创建store
- 保持状态的单一数据源

## 🚀 后续优化建议

1. **性能优化**
   - 添加代码分割（Code Splitting）
   - 实现懒加载（Lazy Loading）
   - 优化打包体积

2. **功能扩展**
   - 添加主题切换功能
   - 实现国际化（i18n）
   - 添加权限管理系统

3. **开发体验**
   - 集成Mock服务
   - 添加单元测试
   - 配置CI/CD流程

## 📞 支持

如有问题或建议，欢迎提交Issue或Pull Request。