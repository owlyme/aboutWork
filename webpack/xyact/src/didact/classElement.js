import {CLASS_COMPONENT} from './symbolTypes'
import {reconcile} from './didact'
import { schedule } from './fiber'

export function createPublicInstance(element, internalInstance) {
	const {type, props} = element;
	let publicInstance = null

	try{
		publicInstance = new type(props);
	} catch (err) {
		console.log(err);
		publicInstance = {props};
		publicInstance.render = () => type(publicInstance.props);
	}

	publicInstance.__internalInstance = internalInstance;

	return publicInstance;
}

export function createInstance(fiber) {
	const instance = new fiber.type(fiber.props);
	instance.__fiber = fiber;
	return instance;
}

export class Component {
	constructor(props) {
		
		this.props = props || {};
		this.setState = this.setState || {};
	}

	setState(partialState) {
		// this.state = Object.assign({}, this.state, partialState);

		// 内部实例的引用
		// updateInstance(this.__internalInstance); // 更新 虚拟-Dom树和 更新 html
		scheduleUpdate(this, partialState); // <==
	}
}

function updateInstance(internalInstance) {
	const parentDom = internalInstance.dom.parentNode;
	const element = internalInstance.element;

	reconcile(parentDom, internalInstance, element);
}


function scheduleUpdate(instance, partialState) {
	schedule({
		from: CLASS_COMPONENT,
		instance: instance,
		partialState,
	})
}