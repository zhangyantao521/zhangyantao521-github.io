
## 功能特性

- ✅ 用户登录验证
- ✅ 问卷调查表单
- ✅ 单选/多选/滑块等多种题型
- ✅ 数据统计与可视化
- ✅ 响应式设计，支持移动端

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000 查看应用

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## GitHub Pages 部署

### 配置步骤

1. 修改 `vite.config.js` 中的 `base` 配置：
   ```js
   base: '/your-repo-name/'
   ```

2. 修改 `src/router/index.js` 中的路由配置：
   ```js
   history: createWebHistory('/your-repo-name/')
   ```

3. 构建项目：
   ```bash
   npm run build
   ```

4. 部署到 GitHub Pages（建议使用 `gh-pages` 分支）

## 路由配置

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | 重定向到 `/login` | - |
| `/login` | 登录页面 | 公开访问 |
| `/survey` | 问卷调查 | 需要登录 |
| `/statistics` | 统计分析 | 需要登录 |

## 许可证
1
MIT License