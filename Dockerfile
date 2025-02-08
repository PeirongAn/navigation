# 使用基础镜像
FROM ai-navigation-base:latest

# 安装 nginx 和 vim
RUN apt-get update && apt-get install -y nginx vim

# 复制源代码和配置文件
COPY src ./src
COPY public ./public
COPY tsconfig.json .
COPY tailwind.config.js .
COPY postcss.config.js .
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 首次构建
RUN npm run build

# 暴露端口
EXPOSE 8081

# 启动 nginx 并保持容器运行
CMD ["sh", "-c", "nginx && tail -f /dev/null"] 