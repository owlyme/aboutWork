function createPublicInstance(element, internalInstance) {

	
	const publicInstance = new element();

	publicInstance.__internalInstance = 123

	return publicInstance
}

class Component {
	constructor(props) {
		this.props = props || {};
		this.setState = this.setState || {};
	}

	setState(partialState = {}) {
		this.state = Object.assign({}, this.state, partialState);
		// 内部实例的引用
		updateInstance(this.__internalInstance); // 更新 虚拟-Dom树和 更新 html
	}
}

class C extends Component {
	constructor(props) {
		super(props)
		this.setState = this.setState || {};
	}

	
}

function updateInstance(internalInstance) {
	console.log(internalInstance);
}

let i = createPublicInstance(C, {})

i.setState()