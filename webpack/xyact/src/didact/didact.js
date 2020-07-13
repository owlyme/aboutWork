import {TEXT_ELEMENT} from './symbolTypes'
import {createPublicInstance} from './classElement'

const isEvent = name => name.startsWith('on');
const isAttribute = name => !isEvent(name) && name !== 'children';

// element -> Didact 元素
// dom -> html 元素
// childInstances是一个包含元素-子元素实例的数组。
let rootInstance = null;



export function render(element, parentDom) {
	let instance = rootInstance;
	rootInstance = reconcile(parentDom, instance, element);
	console.log(rootInstance)
}

export function reconcile(parentDom, instance, element) {
	if (instance == null) {
		let newInstance = instantiate(element);
		parentDom.appendChild(newInstance.dom);
		return newInstance;
	} else if (element == null) {
		parentDom.removeChild(instance.dom);
		return null
	}  else if (instance.publicInstance) {
		
		let publicInstance = createPublicInstance(element, instance);
		let childElement = publicInstance.render();

		updateDomProperties(instance.dom, instance.element.props, childElement.props);
		let newChildrenInstances = reconcileChildren(instance, childElement);


		Object.assign(instance, {
			element: childElement,
			childInstances: newChildrenInstances,
			publicInstance });


		return instance;


	} else if (instance.element.type === element.type && typeof element.type === 'string') {
		updateDomProperties(instance.dom, instance.element.props, element.props);
		let newChildrenInstances = reconcileChildren(instance, element);
		instance.childInstances = newChildrenInstances;
		instance.element = element;
		return instance;
	} else {
		let newInstance = instantiate(element);
		parentDom.replaceChild(newInstance.dom, instance.dom);
		return newInstance;
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

		let {dom, childInstances} = instantiate(childElement);
		Object.assign(instance, {
			dom,
			element,
			childInstances,
			publicInstance });

		return instance;
	}
}

function updateDomProperties(dom, prevProps, nextProps) {
	const isEvent = name => name.startsWith("on");
	const isAttribute = name => !isEvent(name) && name != "children";
  
  	// preProps Remove
	// Remove event listeners
	Object.keys(prevProps).filter(isEvent).forEach(name => {
	  const eventType = name.toLowerCase().substring(2);
	  dom.removeEventListener(eventType, prevProps[name]);
	});
  
	// Remove attributes
	Object.keys(prevProps).filter(isAttribute).forEach(name => {
	  dom[name] = null;
	});
  
  	// nextProps Add
	// Set attributes
	Object.keys(nextProps).filter(isAttribute).forEach(name => {
	  dom[name] = nextProps[name];
	});
  
	// Add event listeners
	Object.keys(nextProps).filter(isEvent).forEach(name => {
	  const eventType = name.toLowerCase().substring(2);
	  dom.addEventListener(eventType, nextProps[name]);
	});
}

