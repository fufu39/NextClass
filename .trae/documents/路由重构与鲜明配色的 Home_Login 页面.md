## 路由调整
- 在 `src/router/index.tsx` 将默认路径 `/` 设置为重定向到 `/home`（使用 `Navigate` 组件）。
- 保留现有结构：`/home` 和 `/login` 两个基础页面，后续可再挂接 `/dashboard`。
- `src/main.tsx` 继续使用 `RouterProvider`，无需改动。

## 配色与主题（非赛博风格）
- 配色目标：大胆、鲜活、强对比、干净利落。
- 拟定色板：
  - 主色：`#ff4d4f`（鲜红）
  - 次主色：`#00c2ff`（亮蓝）
  - 强调：`#ffcf00`（明黄）
  - 文本：`#101010`（深灰黑）、次文本：`#4a4a4a`
  - 背景：浅色底（白/极浅灰），叠加大面积彩色块而非霓虹发光。
- 在 `src/index.css` 定义 CSS 变量：`--color-primary`、`--color-accent`、`--color-blue`、`--color-bg`、`--color-text`，以及两个背景类（`vibrant-hero`、`vibrant-auth`）。
- 在 `src/App.tsx` 的 `ConfigProvider` 切换为亮色算法（不使用暗色算法），`token.colorPrimary` 设为主色，以匹配 AntD 组件视觉。

## 页面设计
### /home
- 结构：大标题 + 简洁标语 + 两个主按钮（“立即体验”“前往登录”）。
- 背景：大块渐变（红/蓝/黄）形成高对比但不过度发光；按钮使用主色/次主色的纯色填充。
- 移除现有 `neon-*` 类，改用新 CSS 类（`vibrant-hero`）。

### /login
- 结构：醒目的登录标题 + 竖直表单卡片（用户名/密码/提交）。
- 背景：鲜明纯色+轻渐变的对比区块（`vibrant-auth`）；卡片采用浅底、深色文本、主色按钮。
- 登录成功后继续跳转 `/dashboard`（逻辑保留）。

## 代码改动列表
1. `src/router/index.tsx`：新增 `/home` 路由；根路径 `/` 使用 `<Navigate to="/home" replace />`。
2. `src/index.css`：新增鲜明风格的 CSS 变量与背景类，移除首页/登录使用到的 `neon-*`。
3. `src/App.tsx`：切换为亮色主题配置，`colorPrimary` 设为 `#ff4d4f`，统一组件视觉。
4. `src/pages/Home/index.tsx`：重写布局与样式，替换为鲜明风格；按钮链接到 `/login`。
5. `src/pages/Login/index.tsx`：重写视觉与表单样式，按钮使用主色，保留表单校验与跳转。

## 验证与交付
- 运行 `pnpm typecheck`、`pnpm dev` 验证无诊断错误。
- 浏览器访问 `/` 自动跳转 `/home`；检查 `/home` 与 `/login` 的视觉是否满足“大胆、鲜活、强对比”。
- 若色彩需微调，我将根据你的反馈调整主色/强调色与背景比例。