import testa from "./a.js"

function component() {
var element = document.createElement('div');
// element.innerHTML = ['Hello', 'webpack', testa.a, obj.head].join(" ") 
element.innerHTML = ['Hello', 'webpack'].join(" ") + 
'<br/><img src="http://pic1.zhimg.com/80/v2-8cec7f1a1597ed7759a5c3d74546b550_720w.jpg" />' + 
'<img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2050318681,1081448419&fm=26&gp=0.jpg" />' +
'<br/><img src="http://xdstest.xingke100.com/login_logo.png" />'

return element;
}

document.body.appendChild(component());  