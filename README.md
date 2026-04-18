# Sudoku Game Web

一个基于 Vue3 + Vite 的数独小游戏前端项目，支持 Docker 部署，支持运行时通过 .env 配置 API 地址。

## 本地开发

```bash
npm install
npm run dev
```

## Docker 构建与运行

### 1. 构建镜像

```bash
docker build -t game-web .
```

### 2. 运行容器（支持自定义 API 地址）

- 先准备一个 .env 文件（如放在项目根目录）：

```
VITE_API_BASE_URL=https://your-api.com
```

- 运行容器时挂载 .env 文件：

```bash
docker run -d \
  -p 8080:80 \
  -v ${PWSD}/.env:/app/.env \
  --name game-web game-web:tag版本

docker run -d \
  -p 8083:80 \
  -v 根目录/.env:/app/.env \
  --name game-web dockerhub名称/game-web:tag版本
```

- 也可以直接在构建镜像前将 .env 放到项目根目录，镜像会自动读取。

### 3. 上传镜像到仓库（以 Docker Hub 为例）

```bash
docker tag game-web your-dockerhub-username/game-web:latest
docker push your-dockerhub-username/game-web:latest
```

## 运行时配置说明

- **entrypoint.sh**
  - 容器启动时自动读取 /app/.env 文件，将 VITE_API_BASE_URL 注入到 /usr/share/nginx/html/env.js，前端通过 window.ENV.VITE_API_BASE_URL 读取。
  - 支持运行时灵活切换 API 地址，无需重建镜像。

- **nginx.conf**
  - 配置了 history 路由支持，所有前端路由都能正确 fallback 到 index.html。
  - 监听 80 端口，静态资源目录为 /usr/share/nginx/html。

## 目录结构说明

- `Dockerfile`：多阶段构建，Node 阶段打包，Nginx 阶段部署。
- `nginx.conf`：Nginx 配置文件，自动复制到容器内。
- `entrypoint.sh`：容器启动脚本，负责注入运行时环境变量。
- `.env`：API 地址等运行时配置，支持热切换。
- `src/api/request.ts`：自动优先读取 window.ENV.VITE_API_BASE_URL，无缝兼容本地和 Docker。

## 访问

- 启动后访问 http://localhost:8080
- 首页为游戏大厅，点击进入数独游戏。

---

如需扩展更多游戏或自定义部署方式，欢迎随时联系维护者！


## 扩展
- 接口信息
```
URL: /api/sudoku/
METHOD: GET
返回: {
    "code": 0,
    "message": "success",
    "data": {
        "id": 3,
        "puzzle": "81位字符串，组成0-9，0表示可填，1-9表示题",
        "solution": "结构同puzzle"
    }
}
```


docker run -d \
  -p 8083:80 \
  -v /Users/wangzhidong/codes/games/game_web/.env:/app/.env \
  --name game-web wangzhidong/game-web:1.0.0