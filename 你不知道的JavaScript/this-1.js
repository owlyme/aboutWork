// 箭头函数在涉及this绑定时的行为和普通函数的行为完全不一致。
// 它放弃了所有普通this绑定的规则，取而代之的是用当前的词法作用域覆盖了this本来的值。

// 是否可以说箭头函数不产生作用域气泡？

var obj = {
	id: "awesome",
	cool: function coolFn() {
		console.log( this.id );
	},
	cool1: () => {
		console.log( this.id );
	},
	coolTimeout: function() {
		setTimeout(() => {
			console.log( this.id );
		}, 100);
	}
};
var id = "not awesome"

// obj.cool(); // awesome
// setTimeout(() => {
// 	obj.cool()
// }, 100); // awesome
// setTimeout( obj.cool, 100 ); // not awesome

// obj.cool1(); // not awesome
// setTimeout( () => {
// 	obj.cool1()
// }, 100); // not awesome
// setTimeout( obj.cool1, 100 ); // not awesome

// obj.coolTimeout()

// function foo1() {console.log( this.a );}
var obj1 = {
	a: 2,
	foo: function foo1() {console.log( this.a );}
};
obj1.foo()
var foo1_1 = obj1.foo
foo1_1()
var foo1_2 = obj1.foo.bind(obj1)
foo1_2()

// 1. 硬绑定 简单的辅助绑定函数
function bind(fn, obj) {
	return function() {
		return fn.apply(obj, arguments)
	}
}


