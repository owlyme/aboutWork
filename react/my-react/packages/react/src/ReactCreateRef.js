// 创建一个 拥有current 属性 的对象
export function createRef() {
	const refObject = {
		current: null,

	}

	// if (__DEV__) {
	// 	Object.seal(refObject);
	// }
	return refObject
}