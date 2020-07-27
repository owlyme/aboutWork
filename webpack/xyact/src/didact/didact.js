let nextUnitOfWork = null;
let currentRoot = null;
let wipRoot = null;
let deletions = null



const isEvent = name => name.startsWith('on');
const isAttribute = name => !isEvent(name) && name !== 'children';
const isNew = (prev, next) => key => prev[key] !== next[key];
const isGone = (prev, next) => key => !(key in next);

function updateDom(dom, prevProps, nextProps) {
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


function createElement(type, config, ...arg) {
	let props = {
		...(config || {}),
		children: (arg ? [...arg] : []).map(child => child instanceof Object ? child : createTextElement(child))
	}

	return {
		type,
		props
	}
}

function createTextElement(text) {
	return {
		type: "TEXT_ELEMENT",
		props: {
			nodeValue: text,
			children: [],
		}
	}
}


function createDom(fiber) {
	const dom = fiber.type == "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(fiber.type);

	updateDom(dom, {}, fiber.props)

	return dom;
}

function commitRoot() {
	deletions.forEach(commitWork)
	commitWork(wipRoot.child);
	currentRoot = wipRoot;
	wipRoot = null;
}

function commitWork(fiber) {
	if (!fiber) {
		return 
	}

	let domParentFiber = fiber.parent;
	while(!domParentFiber.dom) {
		domParentFiber = domParentFiber.parent
	}

	const domParent = domParentFiber.dom;
	if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
		domParent.appendChild(fiber.dom);
	} else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
		updateDom(fiber.dom, fiber.alternate.props, fiber.props)
	} else if (fiber.effectTag === "DELETION") {
		commitDeletion(fiber.dom, domParent)
	} 
	
	commitWork(fiber.child)
	commitWork(fiber.sibling)
}

function commitDeletion(fiber, domParent) {
	if (fiber.dom) {
		domParent.removeChild(fiber.dom)
	} else {
		commitDeletion(fiber.child, domParent)
	}
}

function render(element, container) {
	wipRoot = {
		dom: container,
		props: {
			children: [element]
		},
		alternate: currentRoot
	}
	deletions = []
	nextUnitOfWork = wipRoot
}

function workLoop(deadline) {
	let shouldYeield = false;

	while (nextUnitOfWork && !shouldYeield) {
		nextUnitOfWork = performUnitOfWork(
			nextUnitOfWork
		)
		shouldYeield = deadline.timeRemaining() < 1;
	}
	
	if (!nextUnitOfWork && wipRoot) {
		commitRoot()
	}
	requestIdleCallback(workLoop)
};

requestIdleCallback(workLoop);

function performUnitOfWork(fiber) {
	const isFunctionComponent = fiber.type instanceof Function
	if (isFunctionComponent) {
		updateFunctionComponent(fiber)
	} else {
		updateHostComponent(fiber)
	}

	// TODO return next unit of work
	if (fiber.child) {
		return fiber.child;
	}

	let nextFiber = fiber;
	while(nextFiber) {
		if(nextFiber.sibling) {
			return nextFiber.sibling
		}
		nextFiber = nextFiber.parent
	}
}

let wipFiber = null
let hookIndex = null

function updateFunctionComponent(fiber) {
	// the fiber from a function component doesn’t have a DOM node
	// and the children come from running the function instead of getting them directly from the props

	wipFiber = fiber
	hookIndex = 0
	wipFiber.hooks = [];

	const children = [fiber.type(fiber.props)];
	reconcileChildren(fiber, children)
}

function useState(initial) {
	const oldHook = wipFiber.alternate && wipFiber.alternate.hooks && wipFiber.alternate.hooks[hookIndex];
	const hook = {
		state: oldHook ? oldHook.state : initial,
		queue: []
	}

	const actions = oldHook ? oldHook.queue : []
	actions.forEach(action => {
	  hook.state = action(hook.state)
	})

	const setState = action => {
		hook.queue.push(action);
		wipRoot = {
			dom: currentRoot.dom,
			props: currentRoot.props,
			alternate: currentRoot,
		}

		nextUnitOfWork = wipRoot
		deletions = []
	}

	wipFiber.hooks.push(hook);
	hookIndex++;

	return [hook.state, setState]
}
function updateHostComponent(fiber) {
	// TODO add dom node
	if (!fiber.dom) {
		fiber.dom = createDom(fiber)
	}

	// TODO create new fibers
	const elements = fiber.props.children;
	reconcileChildren(fiber, elements)
}

function reconcileChildren(wipFiber, elements) {
	let index = 0;
	let oldFiber = wipFiber.alternate && wipFiber.alternate.child
	let prevFiber = null;

	while(index < elements.length || oldFiber != null) {
		let element = elements[index];
		const sameType = oldFiber && element && oldFiber.type === element.type;

		let newFiber = null;

		if (sameType) {
			newFiber = {
				type: oldFiber.type,
				props: element.props,
				parent: wipFiber,
				dom: oldFiber.dom,
				alternate: oldFiber,
				effectTag: "UPDATE",
			}	
		}

		if (element && !sameType) {
			newFiber = {
				type: element.type,
				props: element.props,
				parent: wipFiber,
				dom: null,
				alternate: null,
				effectTag: "PLACEMENT",
				sibling: null
			}	
		}

		if (oldFiber && !sameType) {
			oldFiber.effectTag = "DELETION"
			deletions.push(oldFiber)
		}

		if (oldFiber) {
			oldFiber = oldFiber.sibling
		}

		if (index === 0) {
			wipFiber.child = newFiber;
		} else {
			prevFiber.sibling = newFiber;
		}

		prevFiber = newFiber;
		index ++;
	}
}


const Didact = {
	createElement,
	render,
	useState
};

export default Didact;