### 什么是docker
### docker的应用场景

### docker常用指令
``` linux
docker version
docker search <imagename>
docker pull <imagename>
# 执行
docker run <imagename> shell commonds
# 再image中安装工具
docker run <imagename> shell commonds
# 提交镜像
docker commit <id> <new imagename>
docker run <new imagename> commond
# 查看正在運行中的image
docker ps
# 查看運行image的信息
docker inspect <id/imagename>
# 查看所有
docker images

# docker 刪除 image
docker rmi 
# docker hub 
docker push <imagename>

```

### docker 可安裝于各個系統

