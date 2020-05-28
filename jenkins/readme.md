## linux 安装jenkins
0. wget https://pkg.jenkins.io/redhat-stable/jenkins-2.222.3-1.1.noarch.rpm https://pkg.jenkins.io/redhat-stable/
https://blog.csdn.net/xishaoguo/article/details/88577459
1. sudo rpm -ih jenkins-2.164.1-1.1.noarch.rpm命令安装jenkins
enkins-2.147-1.1.noarch.rpm: 头V4 DSA/SHA1 Signature, 密钥 ID d50582e6: NOKEY


2. 运行sudo  service jenkins start 启动jenkins出现错误

3. 配置 jenkin
```
vim /etc/init.d/jenkins
# Search usable Java as /usr/bin/java might not point to minimal version required by Jenkins.
# see http://www.nabble.com/guinea-pigs-wanted-----Hudson-RPM-for-RedHat-Linux-td25673707.html
candidates="
/etc/alternatives/java
/usr/lib/jvm/java-1.8.0/bin/java
/usr/lib/jvm/jre-1.8.0/bin/java
/usr/lib/jvm/java-1.7.0/bin/java
/usr/lib/jvm/jre-1.7.0/bin/java
/usr/bin/java
/xkdata/server/jdk1.8.0_161/bin/java # java 的环境变量
"
```

4. sudo  service jenkins start
Starting jenkins (via systemctl):  Warning: jenkins.service changed on disk. Run 'systemctl daemon-reload' to reload units.

5. systemctl status jenkins

6. http://192.168.0.243:8080 如何修改port？
```
JAVA_CMD="$JENKINS_JAVA_CMD $JENKINS_JAVA_OPTIONS -DJENKINS_HOME=$JENKINS_HOME -jar $JENKINS_WAR"
PARAMS="--logfile=/var/log/jenkins/jenkins.log --webroot=/var/cache/jenkins/war --daemon"
[ -n "$JENKINS_PORT" ] && PARAMS="$PARAMS --httpPort=$JENKINS_PORT"
[ -n "$JENKINS_LISTEN_ADDRESS" ] && PARAMS="$PARAMS --httpListenAddress=$JENKINS_LISTEN_ADDRESS"
[ -n "$JENKINS_HTTPS_PORT" ] && PARAMS="$PARAMS --httpsPort=$JENKINS_HTTPS_PORT"
[ -n "$JENKINS_HTTPS_KEYSTORE" ] && PARAMS="$PARAMS --httpsKeyStore=$JENKINS_HTTPS_KEYSTORE"
[ -n "$JENKINS_HTTPS_KEYSTORE_PASSWORD" ] && PARAMS="$PARAMS --httpsKeyStorePassword='$JENKINS_HTTPS_KEYSTORE_PASSWORD'"
[ -n "$JENKINS_HTTPS_LISTEN_ADDRESS" ] && PARAMS="$PARAMS --httpsListenAddress=$JENKINS_HTTPS_LISTEN_ADDRESS"
```
7. 设置过防火墙，开放过端口，

8. 密码 f0d16b3b09894e33a90fd556d9eecf48


## 卸载
1. rpm卸载

2. rpm -e jenkins

3. rpm -ql jenkins 检查是否卸载成功

4. 彻底删除残留文件：find / -iname jenkins | xargs -n 1000 rm -rf