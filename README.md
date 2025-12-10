# 联机五子棋游戏

一个基于WebSocket的联机五子棋游戏，支持双人实时对战。

## 功能特性

- ✅ 15x15标准五子棋棋盘
- ✅ 黑白双方交替落子
- ✅ 自动胜负判断
- ✅ 房间创建与加入
- ✅ 实时双人对战
- ✅ 落子同步
- ✅ 胜负同步

## 部署说明

### 1. 静态网页部署（GitHub Pages）

#### 步骤1：创建GitHub仓库
1. 在GitHub上创建一个新仓库（例如：`gobang-online`）
2. 将项目文件（主要是`五子棋.html`）上传到仓库

#### 步骤2：启用GitHub Pages
1. 进入仓库的`Settings`页面
2. 点击左侧的`Pages`选项
3. 在`Source`部分选择`main`分支
4. 选择根目录（`/ (root)`）
5. 点击`Save`
6. 等待几分钟，GitHub Pages会生成访问链接（例如：`https://yourusername.github.io/gobang-online/`）

### 2. WebSocket服务器部署

由于GitHub Pages只支持静态网页，不支持WebSocket服务器，你需要单独部署WebSocket服务器。以下是几种常见的部署方式：

#### 选项A：使用Vercel部署WebSocket服务器

1. 将`server.js`和`package.json`上传到一个新的GitHub仓库
2. 登录Vercel，导入该仓库
3. Vercel会自动检测Node.js项目并部署
4. 部署完成后，你会得到一个WebSocket服务器地址（例如：`wss://your-websocket-server.vercel.app`）

#### 选项B：使用Render部署WebSocket服务器

1. 登录Render，创建一个新的`Web Service`
2. 连接你的GitHub仓库
3. 设置构建命令为`npm install`
4. 设置启动命令为`node server.js`
5. 部署完成后，你会得到一个WebSocket服务器地址

#### 选项C：使用云服务器部署

1. 购买一台云服务器（如阿里云、腾讯云、AWS等）
2. 在服务器上安装Node.js
3. 上传`server.js`和`package.json`到服务器
4. 运行`npm install`安装依赖
5. 使用PM2或其他进程管理工具启动服务器
6. 配置域名和SSL证书，启用wss协议

### 3. 配置客户端WebSocket地址

1. 打开`五子棋.html`文件
2. 找到`connectToServer`函数
3. 将WebSocket地址修改为你部署的服务器地址：

```javascript
// 替换为你部署的WebSocket服务器地址
socket = new WebSocket('wss://your-websocket-server.example.com');
```

4. 重新上传修改后的`五子棋.html`到GitHub仓库

## 本地开发与测试

### 1. 安装依赖

```bash
npm install
```

### 2. 启动WebSocket服务器

```bash
npm start
```

WebSocket服务器将在`ws://localhost:8080`启动

### 3. 启动HTTP服务器（可选）

```bash
npx http-server -p 3000
```

或使用Node.js内置服务器：

```bash
node http-server.js
```

### 4. 访问游戏

在浏览器中访问：
- 本地：`http://localhost:3000`
- GitHub Pages：`https://yourusername.github.io/gobang-online/`

## 使用方法

1. 打开游戏网页
2. 点击「连接服务器」
3. 选择「创建房间」或输入房间ID「加入房间」
4. 等待对手连接
5. 点击「开始游戏」
6. 点击棋盘落子，开始对战

## 技术栈

- **前端**：HTML5 + CSS3 + JavaScript
- **后端**：Node.js + WebSocket (ws库)
- **部署**：GitHub Pages + 外部WebSocket服务器

## 文件结构

```
├── 五子棋.html    # 游戏主页面
├── server.js      # WebSocket服务器
├── package.json   # 服务器依赖
├── http-server.js # 简单HTTP服务器（可选）
└── README.md      # 项目说明
```

## 注意事项

1. WebSocket服务器必须支持CORS，否则浏览器会阻止连接
2. 生产环境必须使用wss协议（加密WebSocket），否则浏览器会阻止连接
3. GitHub Pages不支持WebSocket，必须使用外部服务器
4. 确保WebSocket服务器有足够的带宽和连接数限制

## 许可证

MIT
