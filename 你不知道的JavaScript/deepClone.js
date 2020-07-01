let obj = {
	a: 1,
	arr: [1, 2, {}],
	obj: {},
	fn: function() {},
}
obj.self = obj

function deepClone(obj) {
	let mapProperty = []
	function clone (obj) {
		if (mapProperty.indexOf(obj) != -1) {
			// 破环
			return obj
		} 
		if (typeof obj === "object") {
			// 标记引用型数据
			mapProperty.push(obj)
		}

		let newObj = null
		if (typeof obj !== "object" || obj === null) {
			newObj = obj
		} else if (Object.prototype.toString.call(obj) === "[object Array]") {
			newObj = []
			
			for (let i = 0; i < obj.length; i++) {
				newObj[i] = clone(obj[i])
			}
		} else {
			newObj = {}
	
			for (let key in obj) {
				newObj[key] = clone(obj[key])
			}
		}
		return newObj
	}

	return clone(obj)
}


let t1 = Date.now();
console.log(t1);
[...new Array(10000)].forEach(() => {
	deepClone(obj)
});
console.log(Date.now() - t1)
