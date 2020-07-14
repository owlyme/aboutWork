import { TEXT_ELEMENT } from "./elementTypes"


// 把保存实例对象
let rootInstance = null; // {dom, element, childInstances, publicInstance}
// 判断属性类型
// 1 事件 onClick
const isListener = name => name.startsWith("on");
// 2 style
const isAttribute = name => !isListener(name) && name !== 'children'

//
function createPublicInstance(element, internalInstance) {
  // 当 元素进到这里来, 说明
  // type 是 一个函数
  const { type, props } = element;
  // 新建-实例
  const publicInstance = new type(props);
  //
  publicInstance.__internalInstance = internalInstance; //
  return publicInstance;
}

// 遍历虚拟节点生成 DOM, 更新dom的唯一方法是使用不同的元素再次调用render函数

/**
 *
 * @param {vNode}} element
 * @param {DOM_node} parentDom
 */
export function render(element, container) {
  console.log("render")
  const prevInstance = rootInstance;

  const nextInstance = reconcile(container, prevInstance, element);
  rootInstance = nextInstance; // 2-支树干- 领头啦
};

/**
 *
 * @param {DOM_node} parentDom
 * @param {Object} instance
 * @param {vNode} element
 */
export function reconcile(parentDom, instance, element) {
  if (instance == null) {
    let newInstance = instantiate(element);
    parentDom.appendChild(newInstance.dom);
    return newInstance;
  } else if (element == null) {
    parentDom.removeChild(instance.dom);
    return null;
  } else if (instance.element.type !== element.type) {
    let newInstance = instantiate(element);
    parentDom.replaceChild(newInstance.dom, instance.dom);
    return newInstance;
  } else if (typeof element.type === 'string') {
    updateDomProperties(instance.dom, instance.element.props, element.props)
    instance.childInstances = reconcileChildren(instance, element);
    instance.element = element;
    return instance;
  } else {
    instance.publicInstance.props = element.props; // 更新-props
    const childElement = instance.publicInstance.render(); // 组件的render函数
    const oldChildInstance = instance.childInstance;
    const childInstance = reconcile(parentDom, oldChildInstance, childElement); // 对比-剩下-孩子
    instance.dom = childInstance.dom; // 更新-dom
    instance.childInstance = childInstance; // 更新-虚拟dom数
    instance.element = element; // 更新-Didact元素

    return instance;
  }
}

export function reconcileChildren(instance, element) {
  // instance 旧
  // element 新

  const dom = instance.dom;
  const childInstances = instance.childInstances;
  const nextChildElements = element.props.children || [];
  const newChildInstances = []; // 新的孩子数组

  const count = Math.max(childInstances.length, nextChildElements.length); // 比较谁-大

  for (let i = 0; i < count; i++) {
    const childInstance = childInstances[i];
    const childElement = nextChildElements[i];
    // 2. 递归 - 上一层函数 reconcile
    const newChildInstance = reconcile(dom, childInstance, childElement);
    newChildInstances.push(newChildInstance);
  }

  return newChildInstances.filter(instance => instance != null); // <---- 2
}

export function instantiate(element) {
  const {type, props} = element;
  if (typeof type === 'string') {
    const isTextElement = type === TEXT_ELEMENT; // 文本类型判定
    const dom = isTextElement
      ? document.createTextNode("")
      : document.createElement(type);

    updateDomProperties(dom, {}, props);

    // Render children
    const childElements = props.children || [];
    const childInstances = childElements.map(instantiate);

    const childDoms = childInstances.map(childInstance => childInstance.dom);
    childDoms.forEach(childDom => dom.appendChild(childDom));

    return {
      dom, element, childInstances
    }
  } else {
    // Instantiate component element
    // 初始化 组件 <App />
    const instance = {};

    // createPublicInstance
    // 1. 新建 newApp = new App()
    // 2. newApp.__internalInstance = instance
    // 3. publicInstance = newApp
    const publicInstance = createPublicInstance(element, instance);
    const childElement = publicInstance.render(); // 自己定义的 渲染-render-函数
    const childInstance = instantiate(childElement); // 递归 孩子拿到 { dom, element, childInstances }
    const dom = childInstance.dom;

    Object.assign(instance, { dom, element, childInstance, publicInstance }); // >> 组件元素比Didact元素 多了本身- 实例

    return instance;
  }
}

function updateDomProperties(dom, prevProps, nextProps) {
  // preProps Remove
  // Remove event listeners
  Object.keys(prevProps).filter(isListener).forEach(name => {
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
  Object.keys(nextProps).filter(isListener).forEach(name => {
    const eventType = name.toLowerCase().substring(2);
    dom.addEventListener(eventType, nextProps[name]);
  });
}

