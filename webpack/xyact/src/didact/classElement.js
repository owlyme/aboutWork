import {reconcile} from './didact'

export function createPublicInstance(element, internalInstance) {
	const {type, props} = element;
	const publicInstance = new type(props);

	publicInstance.__internalInstance = internalInstance;

	return publicInstance;
}

export class Component {
	constructor(props) {
		this.props = props || {};
		this.setState = this.setState || {};
	}

	setState(partialState) {
		this.state = Object.assign({}, this.state, partialState);
		// 内部实例的引用
		updateInstance(this.__internalInstance); // 更新 虚拟-Dom树和 更新 html
	}
}

function updateInstance(internalInstance) {
	const parentDom = internalInstance.dom.parentNode;
	const element = internalInstance.element;

	reconcile(parentDom, internalInstance, element);
}