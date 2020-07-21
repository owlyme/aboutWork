import {TEXT_ELEMENT, HOST_ROOT} from './symbolTypes'
import { schedule } from './fiber'



const isEvent = name => name.startsWith('on');
const isAttribute = name => !isEvent(name) && name !== 'children';
const isNew = (prev, next) => key => prev[key] !== next[key];
const isGone = (prev, next) => key => !(key in next);

// element -> Didact 元素
// dom -> html 元素
// childInstances是一个包含元素-子元素实例的数组。

export function render(elements, containerDom) {
	schedule({
		from: HOST_ROOT,
		dom: containerDom,
		newProps: { children: elements }
	})
}

export function createDomElement(fiber) {
	const {type, props} = fiber 
	const dom = type === TEXT_ELEMENT ? document.createTextNode("") : document.createElement(type);
	updateDomProperties(dom, {}, props)
	return dom; 
}

export function updateDomProperties(dom, prevProps, nextProps) {
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


