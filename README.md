# NextClass 智课表

<div align="center">
<img src="./src/assets/logo-white.svg" alt="NextClass Logo" width="240" />

<h3>NextClass 智课表</h3>
<p>基于 AI 图像识别和订阅推送的现代化智能课表管理系统</p>

[![License](<https://img.shields.io/badge/license-MIT%20(Non--Commercial)-red.svg>)](./LICENSE) [![React](https://img.shields.io/badge/React-%2320232a.svg?style=flat-square&logo=react&logoColor=%2361DAFB)](https://react.dev/) [![Sass](https://img.shields.io/badge/Sass-CC6699?style=flat-square&logo=sass&logoColor=white)](https://sass-lang.com/) [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![pnpm](https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=flat-square&logo=pnpm&logoColor=f69220)](https://pnpm.io/) [![Ant Design](https://img.shields.io/badge/Ant%20Design-0170FE?style=flat-square&logo=ant-design&logoColor=white)](https://ant.design/) [![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion/) [![Zustand](https://img.shields.io/badge/Zustand-bear?style=flat-square&color=orange)](https://github.com/pmndrs/zustand) [![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)

</div>

---

## 📖 项目介绍 (Introduction)

**NextClass 智课表** 是一款专为高校学生设计的现代化课表管理应用。它摒弃了繁琐的手动输入，通过集成的 **AI 图像识别技术**，允许用户直接上传教务系统课表截图，即可自动解析并生成可视化的交互式课表。

项目采用最新的 **React 19** 生态系统构建，结合 **Ant Design 5** 打造极简、美观的用户界面，并内置 **AI 助教** 功能，随时回答关于课程安排的自然语言提问。

## ✨ 核心功能 (Features)

### 📅 智能课表 (Smart Schedule)

- **可视化周视图**：清晰展示每周课程安排，支持 1-20 周切换。
- **图片一键导入**：上传课表截图，后台 AI 自动解析并录入课程信息。
- **多时段支持**：完美支持每日 11 节课程 + 午休/晚饭时段的布局。
- **课程详情**：点击课程卡片即可查看教室、教师、周次等详细信息。

### 🤖 AI 助理 (AI Assistant)

- **自然语言交互**：通过对话方式查询课程（例如：“下周二第一节是什么课？”）。
- **状态检测**：实时检测课表导入状态，引导新用户完成配置。

### 📊 仪表板 (Dashboard)

- **实时状态**：首页展示当前正在进行或即将开始的课程，避免迟到。
- **日程概览**：日历组件快速查看特定日期的课程列表。
- **极简设计**：采用 Framer Motion 实现流畅的页面切换动画。

### 🔐 用户系统 (User System)

- **安全登录**：基于 Token 的身份认证机制。
- **个人设置**：自定义用户偏好与系统配置。

## 🛠️ 技术栈 (Tech Stack)

- **核心框架**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **构建工具**: [Vite 5](https://vitejs.dev/)
- **UI 组件库**: [Ant Design 5](https://ant.design/) + [Sass](https://sass-lang.com/)
- **状态管理**: [Zustand](https://github.com/pmndrs/zustand) (轻量级状态管理)
- **网络请求**: [Axios](https://axios-http.com/) (封装拦截器与类型响应)
- **动画效果**: [Framer Motion](https://www.framer.com/motion/)
- **日期处理**: [Day.js](https://day.js.org/)

## 🚀 快速开始 (Getting Started)

### 环境要求 (Prerequisites)

- **Node.js**: >= 18.0.0
- **pnpm**: >= 8.0.0 (推荐) 或 npm/yarn

### 安装步骤 (Installation)

1. **克隆仓库**

   ```bash
   git clone https://github.com/your-username/nextclass.git
   cd nextclass
   ```

2. **安装依赖**

   ```bash
   pnpm install
   ```

3. **配置环境变量**
   复制 `.env.development` 并根据需要修改 API 地址：

   ```bash
   # .env.development
   VITE_API_BASE_URL=http://localhost:8080
   ```

4. **启动开发服务器**
   ```bash
   pnpm dev
   ```
   访问 http://localhost:5173 即可看到项目运行。

### 构建生产版本 (Build)

```bash
pnpm build
```

## 📂 项目结构 (Project Structure)

```
src/
├── api/            # API 接口定义 (AI, Auth, Schedule, User)
├── assets/         # 静态资源 (Images, Icons)
├── components/     # 公共组件
├── pages/          # 页面组件
│   ├── AIChat/     # AI 助教页面
│   ├── Dashboard/  # 仪表板布局
│   ├── DashboardHome/ # 仪表板首页
│   ├── Home/       # 落地页
│   ├── Login/      # 登录页
│   ├── Schedule/   # 课表页
│   └── Settings/   # 设置页
├── router/         # 路由配置
├── stores/         # Zustand 状态管理
├── types/          # TypeScript 类型定义
├── utils/          # 工具函数 (HTTP 封装等)
├── App.tsx         # 根组件
└── main.tsx        # 入口文件
```

## 📜 许可证 (License)

本项目采用 **修改版 MIT 协议**。

✅ **允许**：个人学习、教育用途、非营利性使用。
❌ **禁止**：未经授权的商业用途（包括但不限于付费出售、作为商业项目的一部分）。

详情请参阅 [LICENSE](./LICENSE) 文件。

---

<div align="center">

**⭐ 如果这个项目对您有帮助，请给个 Star！**

Made with ❤️ by NextClass Team（[fufu39](https://github.com/fufu39)）

</div>
