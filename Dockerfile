# 基于官方node镜像构建阶段
FROM node:22.2.0-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY .env ./
COPY . ./
RUN npm install && npm run build

# 生产环境nginx镜像
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist .
COPY ./nginx.conf /etc/nginx/nginx.conf

# 启动脚本用于注入.env变量到window.ENV
COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
