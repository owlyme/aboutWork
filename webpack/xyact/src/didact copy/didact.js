import {TEXT_ELEMENT} from './symbolTypes'
import {createPublicInstance} from './classElement'

const isEvent = name => name.startsWith('on');
const isAttribute = name => !isEvent(name) && name !== 'children';
const isNew = (prev, next) => key => prev[key] !== next[key];
const isGone = (prev, next) => key => !(key in next);

function updateDomProperties(dom, prevProps, nextProps) {
	// preProps Remove
	// Remove event listeners
	Object.keys(prevProps)
	.filter(isEvent)
	.filter(key => !(key in nextProps) || isNew(prevProps, nextProps)(key))
	.forEach(name => {
		const eventType = name.toLowerCase().substring(2);
		dom.removeEventListener(eventType, prevProps[name]);
	});

	// Remove attributes
	Object.keys(prevProps)
	.filter(isAttribute)
	.filter(isGone(prevProps, nextProps))
	.forEach(name => {
		dom[name] = null;
	});

	// nextProps Add
	// Set attributes
	Object.keys(nextProps)
	.filter(isAttribute)
	.filter(isNew(prevProps, nextProps))
	.forEach(name => {
		dom[name] = nextProps[name];
	});

	// Set style
	prevProps.style = typeof prevProps.style === 'object' ? prevProps.style : {};
	nextProps.style = typeof nextProps.style === 'object' ? nextProps.style : {};

	Object.keys(nextProps.style)
	.filter(isNew(prevProps.style, nextProps.style))
	.forEach(key => {
		dom.style[key] = nextProps.style[key];
	});
	// Add event listeners
	Object.keys(nextProps)
	.filter(isEvent)
	.filter(isNew(prevProps, nextProps))
	.forEach(name => {
		const eventType = name.toLowerCase().substring(2);
		dom.addEventListener(eventType, nextProps[name]);
	});
}


// element -> Didact 元素
// dom -> html 元素
// childInstances是一个包含元素-子元素实例的数组。
let rootInstance = null;

export function render(element, parentDom) {
	let instance = rootInstance;
	rootInstance = reconcile(parentDom, instance, element);
	console.log(rootInstance);
}

export function reconcile(parentDom, instance, element) {
	if (instance == null) {
		let newInstance = instantiate(element);
		parentDom.appendChild(newInstance.dom);
		return newInstance;
	} else if (element == null) {
		parentDom.removeChild(instance.dom);
		return null
	} else if (instance.element.type !== element.type) {
		let newInstance = instantiate(element);
		parentDom.replaceChild(newInstance.dom, instance.dom);
		return newInstance;
	} else if (typeof element.type === 'string') {
		updateDomProperties(instance.dom, instance.element.props, element.props);
		let newChildrenInstances = reconcileChildren(instance, element);
		instance.childInstances = newChildrenInstances;
		instance.element = element;
		return instance;
	}  else {
		// 更新 state 和 props
		instance.publicInstance.props = element.props;
		let childElement = instance.publicInstance.render();
		let newInstance = reconcile(parentDom, instance.childInstance, childElement);
		Object.assign(instance, {
			dom: newInstance.dom,
			element,
			childInstance: newInstance
		});
		return instance;
	}
}

export function reconcileChildren(instance, element) {
	let newChildInstances = [];
	let dom = instance.dom;
	let oldChildInstances = instance.childInstances;
	let newChildElements = element.props.children || [];
	let maxLength = Math.max(oldChildInstances.length, newChildElements.length);

	for(let i = 0; i< maxLength; i++) {
		let newElement = newChildElements[i] || null;
		let oldInstance = oldChildInstances[i] || null;
		newChildInstances.push(reconcile(dom, oldInstance, newElement))
	}

	return newChildInstances.filter(i => i != null)
}

export function instantiate(element) {
	const {type, props} = element;
	const isDomElement = typeof type === 'string';

	if (isDomElement) {
		const dom = type === TEXT_ELEMENT ? document.createTextNode("") : document.createElement(type);

		updateDomProperties(dom, {}, props)

		let childInstances = (props.children || []).map(instantiate);
		childInstances.forEach(child => {
			dom.appendChild(child.dom)
		})

		let instance = {
			element,
			dom,
			childInstances
		}

		return instance
	} else {
		let instance = {};
		let publicInstance = createPublicInstance(element, instance);
		let childElement = publicInstance.render();

		let childInstance = instantiate(childElement);
		Object.assign(instance, {
			dom: childInstance.dom,
			element,
			childInstance,
			publicInstance });

		return instance;
	}
}



