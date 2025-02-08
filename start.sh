#!/bin/bash

# 确保 resource 目录存在
mkdir -p resource/images/1
mkdir -p resource/videos

# 构建基础镜像
docker build -t ai-navigation-base -f Dockerfile.base .

# 构建应用镜像
docker build -t ai-navigation-dev .

# 停止并删除已存在的容器
docker stop ai-navigation >/dev/null 2>&1
docker rm ai-navigation >/dev/null 2>&1

# 运行容器，添加 nginx.conf 的 volume mapping
docker run -d \
  --name ai-navigation \
  -p 8081:8081 \
  -v $(pwd)/src:/app/src \
  -v $(pwd)/nginx.conf:/etc/nginx/conf.d/default.conf \
  --add-host=host.docker.internal:host-gateway \
  ai-navigation-dev 