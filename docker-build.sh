#!/bin/sh
# 用法: ./docker-push.sh 1.2.3
# 传入版本号作为第一个参数

if [ -z "$1" ]; then
  echo "用法: $0 <version>"
  exit 1
fi

VERSION=$1
IMAGE=wangzhidong/games-web

echo "==> 构建镜像: $IMAGE:$VERSION"
docker build -t $IMAGE:$VERSION . || exit 1

echo "==> 完成"