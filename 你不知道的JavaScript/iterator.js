// Symbol.iterator 为每一个对象定义了默认的迭代器。该迭代器可以被 for...of 循环使用。


let arr = [1,2,3]

// 迭代器对象 ：@@iterator
// for...of 循环首先会向 被访问对象 请求 一个 @@iterator ，然后通过  @@iterator 对象的next() 方法来遍历所有返回值
// for (let i of arr) {
// 	console.log(i)
// };

/*
let it = arr[Symbol.iterator]()

console.log(it.next()); // { value:1, done:false }
console.log(it.next()); // { value:2, done:false }
console.log(it.next()); // { value:3, done:false }
console.log(it.next()); // { done:true }

*/

// 普通对象没有内置的@@iterator
var obj = {
	a: 1, 
	b: 2
}

Object.defineProperty(obj, Symbol.iterator, {
	writable: false,
	enumerable: false,
	configurable: true,
	value: function() {
		let self = this;
		let keyIndex = 0;
		let keys = Object.keys(self)
		return {
			next: function() {
				return {
					value: self[keys[keyIndex++]],
					done: keyIndex > keys.length // 值为 false 时 for...of 无线循环
				}
			}
		}

	}
}) 

// var it = obj[Symbol.iterator]()

// console.log(it.next()); // { value:1, done:false }
// console.log(it.next()); // { value:2, done:false }
// console.log(it.next()); // { done:true }
let count = 0
for (var v of obj) {
	if (count > 10)  break;
	console.log( v );
	count ++
}




