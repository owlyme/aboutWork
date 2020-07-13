import {TEXT_ELEMENT} from './symbolTypes'
function didactElement(type, props) {
	let  element = {
		// type: "div",
		// props: {
		// 	id: "container",
		// 	children: [
		// 	{ type: "input", props: { value: "foo", type: "text" } },
		// 	{ type: "a", props: { href: "/bar" } },
		// 	{ type: "span", props: {} }
		// 	]
		// }
		type, props
	}
	return element
}
function createTextElement(value) {
	let type = TEXT_ELEMENT
	let config = {nodeValue: value};
	return createElement(type, config)
}

export function createElement(type, config, ...arg) {
	let props = config ? {...config} : {};
	let children = arg ? [...arg] : {};
	props.children = children.map(child => {
		return child instanceof Object ? child :  createTextElement(child)
	})

	return didactElement(type, props)
}