// 创建一个对象
export function createRef() {
	const refObject = {
		current: null,

	}

	// if (__DEV__) {
	// 	Object.seal(refObject);
	// }
	return refObject
}