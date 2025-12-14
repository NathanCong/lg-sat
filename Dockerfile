# 使用官方 Node.js 运行时作为基础镜像
FROM node:22-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 安装项目依赖
RUN npm install -g pnpm && pnpm install

# 复制项目文件
COPY . .

# 构建生产版本
RUN pnpm build

# 使用 nginx 镜像部署静态文件
FROM nginx:alpine

# 删除 nginx 默认配置
RUN rm -rf /etc/nginx/conf.d/default.conf

# 复制自定义 nginx 配置
COPY ./docker/nginx.conf /etc/nginx/conf.d/

# 从 node 镜像复制构建产物到 nginx 目录
COPY --from=0 /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80
