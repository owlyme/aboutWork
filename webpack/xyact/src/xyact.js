const  TEXT_ELEMENT = "TEXT_ELEMENT";

function createElement(type, config, ...arg) {
  return {
    type,
    props: {
      ...(config || {}),
      children: (arg ? [...arg] : []).map(child => child instanceof Object ? child : createTextElement(child))
    }
  }
}

function createTextElement(value) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: value
    }
  }
}

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

function createDom(fiber) {
  let type = fiber.type;
  const dom = type === TEXT_ELEMENT ? document.createTextNode("") : document.createElement(type);
  updateDomProperties(dom, {}, fiber.props);
  return dom
}


// fiber
let nextUnitOfWork = null
let wipRoot = null
let currentRoot = null
let deletions = []

// In the render function we set nextUnitOfWork to the root of the fiber tree.
function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element]
    },
    alternate: currentRoot
  };
  nextUnitOfWork = wipRoot;
}

function workLoop(deadline) {
  // 判断并 获取下一步 nextUnitOfWork
  // 判断时间
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(
      nextUnitOfWork
    )
    shouldYield = deadline.timeRemaining() < 1
  }
  // DOM 渲染
  if (!nextUnitOfWork && wipRoot) {
    commitRoot()
  }
  // 循环调用
  requestIdleCallback(workLoop)
}

function performUnitOfWork(fiber){
  const isFunctionComponent =
  fiber.type instanceof Function
  if (isFunctionComponent) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }

  if (fiber.child) {
    return fiber.child
  }

  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}

let wipFiber = null
let hookIndex = null
function updateFunctionComponent(fiber) {
  wipFiber = fiber
  wipFiber.hooks = []
  hookIndex = 0;

  let element = fiber.type(fiber.props);
  reconcileChildren(fiber, [element]);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
  reconcileChildren(fiber, fiber.props.children || [])
}

function reconcileChildren(wipFiber, children) {
  let index = 0;
  let oldFiber = wipRoot.alternate && wipFiber.alternate.child;
  let prevFiber = null;

  while(index < children.length || oldFiber != null){
    let child = children[index];
    let newFiber = null;
    let sameType = oldFiber && child && oldFiber.type === child.type;

    if (sameType) {
      // update Fiber node
      newFiber = {
        type: oldFiber.type,
        props: child.props,
        parent: wipFiber,
        dom: oldFiber.dom,
        alternate: oldFiber,
        effectTag: "UPDATE",
      }
    }

    if (child && !sameType) {
      // new fiber node
      newFiber = {
        type: child.type,
        props: child.props,
        parent: wipFiber,
        dom: null,
        alternate: null,
        effectTag: "PLACEMENT"
      }
    }

    if (oldFiber && !sameType) {
      // remove fiber node
      oldFiber.effectTag = "DELETION";
      deletions.push(oldFiber)
    }

    if (index === 0) {
      wipFiber.child = newFiber;
    } else {
      prevFiber.sibling = newFiber
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }

    prevFiber = newFiber;
    index++
  }
}

function commitRoot() {
  // wipRoot
  // root 节点不需要操作
  deletions.forEach(commitWork)

  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}

function commitWork(fiber) {
  if(!fiber) {
    return
  }

  let parentFiber = fiber.parent;
  while(!parentFiber.dom) {
    parentFiber = parentFiber.parent
  }
  const parentDom = parentFiber.dom;

  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    parentDom.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    updateDomProperties(fiber.dom, fiber.alternate.props, fiber.props)
  } else if (fiber.effectTag === "DELETION") {
    parentDom.removeChild(fiber.dom)
  }

  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

function useState(initial) {
  let oldHook = wipFiber.alternate
  && wipFiber.alternate.hooks
  && wipFiber.alternate.hooks[hookIndex];

  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: []
  }

  const actions = oldHook ? oldHook.queue : []
  actions.forEach(action => {
    hook.state = action(hook.state)
  })

  wipFiber.hooks.push(hook);
  hookIndex ++;

  const setState = (action) => {
    hook.queue.push(action);

    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot,
    }
    nextUnitOfWork = wipRoot
    deletions = []
  }


  return [hook.state, setState]
}


requestIdleCallback(workLoop)
// test

function App() {
  let [state, setState] = useState(1)

  return createElement(
    "h1",
    {
      onClick: () => {
        setState((c) => c+1)
      }
    },
    "Hi ",
    state
  )
}
const element = createElement(App, {
  name: "foo",
})

let container = document.getElementById("root");

render(element, container)