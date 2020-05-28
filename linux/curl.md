## linux curl是一个利用URL规则在命令行下工作的文件传输工具。它支持文件的上传和下载，所以是综合传输工具

1. curl https://xiaodashi.com

2. 抓取页面内容到一个文件中, curl -o index.html  https://xiaodashi.com

curl https://xiaodashi.com >> inde.html

3. 用-O（大写的），后面的url要具体到某个文件，不然抓不下来。我们还可以用正则来抓取东西 , https://xiaodashi.com/offical/img/logo-top1.png
 curl -O https://xiaodashi.com/offical/img/logo-top\d.png

4. -T/--upload-file <file>                  上传文件

5. -u/--user <user[:password]>      设置服务器的用户和密码


4. 模拟表单信息，模拟登录，保存头信息
curl D ./a.text -F platformType=PC_WEB_MANAGE -F psw=xk123456 -F sessionId=ZreWtIFAJHWk1bDFYEPyHWz9F2BjGjsN https://apitest.xingke100.com/apimanage/manage/login
192.168.0.243 root RU2&5wp3tgwp0MIH

curl -T test.sql ftp://用户名:密码@ip:port/demo/curtain/bbstudy_fil