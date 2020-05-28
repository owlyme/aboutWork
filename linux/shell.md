## 一切皆文件
### 查询命令
history
ctrl+p
ctrl+n

### 光标
C+ b
C+ f
C+ a
C+ e

### 删除
C + u
C + d

### path
/bin 命令
/boot 开机启动
/dev 设备
/etc 存放配置文件
/home 存放所有用户的主目录
/lib 动态库
/lost+found 文件碎片
/media 
/sbin 
/usr user softwave resouce

### path change
cd /
cd ./
cd ../
cd - 
cd ~ 宿主目录

### 目录
mkdir -p aa/bb/cc
rm -r aa
rm -ri aa

cp a b
cp -r adir bdir

### 文件查看
1. cat filename
2. head -10 filename
3. tail -10 filename 
4. tail -f filename ## 动态
5. more
6. less

### 修改名称
mv filename

### ln
1. ln 
2. ln -s

### which :  查看指定命令的目录（外部命令）
which ls 

### 文件权限
1. whoami // 查看用户名
2. chmod (change model) 修改权限
3. chmod [who][+|-|=][mode]
4. who: u(user)：所有者； g(group): 文件所属组; o(other):其他人
5. mode: r(read); w(write); x(执行)

### 文件所属分组 所属人
1. chown （chang owner ）
2. chgrp 


### lesson 18