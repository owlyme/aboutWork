let obj = {
	a: 1,
	arr: [1, 2, {}],
	obj: {},
	fn: function() {},
	c: null,
	un: undefined
}
// obj.self = obj

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

function JsonCopy(obj) {
	// function, undefined 类型无法拷贝
	// 不能打破环
	if (typeof obj !== "object" || obj === null) {
		return obj
	}
	return JSON.parse(JSON.stringify(obj))
}



console.log(JsonCopy(obj))




