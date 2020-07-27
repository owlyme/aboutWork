import { TEXT_ELEMENT } from "./elementTypes"

const isEvent = key => key.startsWith('on');

const isAttribute = key => !isEvent(key) && key != 'children'
/**
 *
 * @param {Object} vNodeElement createElement 生成的对象
 * @param {*} container DOM
 */

let rootInstance = null;
export function render(vNodeElement, container) {
  console.log('render')

  let instance = rootInstance;
  let nextInstacne = reconcile(container, instance, vNodeElement);

  rootInstance = nextInstacne;
}
// 为了做对比需要对之前渲染 保留-先前渲染的树, 以及对之前DOM的引用
//
export function reconcile(parentDOM, instance, vNodeElement) {
  // 判断相同的当前节点是否存在
  if (instance == null) {
    let newInstance = instantiate(vNodeElement)
    parentDOM.appendChild(newInstance.dom)
    return newInstance
  } else if (vNodeElement == null) {
    parentDOM.removeChild(instance.dom);
    return null
  } else if (instance.element.type != vNodeElement.type) {
    let newInstance = instantiate(vNodeElement)
    parentDOM.replaceChild(newInstance.dom, instance.dom);
    return newInstance
  } else if (instance && vNodeElement) {
      updateDomProperties(instance.dom, instance.element.props, vNodeElement.props);
      let newChildredInstances = reconcileChildren(instance, vNodeElement);
      instance.element = vNodeElement;
      instance.childInstances = newChildredInstances;
      return instance;
  }
}

function reconcileChildren(instance, vNodeElement) {
  let newChildrenInstances = [];
  let parentDom = instance.dom
  let oldChildrenInstances = instance.childInstances;

  let newChildren = vNodeElement.props.children;

  let maxLength = Math.max(oldChildrenInstances.length, newChildren.length);

  // 这里可以做很多优化
  for (let i = 0; i < maxLength; i++) {
    let oldChildInstance = oldChildrenInstances[i] || null;
    let newElement = newChildren[i] || null;

    let newInstance = reconcile(parentDom, oldChildInstance, newElement)
    newChildrenInstances.push(newInstance)
  }

  return newChildrenInstances.filter(i => i)
}


export function instantiate(vNodeElement) {
  const {type, props} = vNodeElement;

  let dom = type === TEXT_ELEMENT ?
    document.createTextNode("") :
    document.createElement(type);

  updateDomProperties(dom, {}, props);

  let childInstances = props.children.map(instantiate);

  childInstances.forEach(child => {
    dom.appendChild(child.dom)
  })

  return {
    dom,
    element: vNodeElement,
    childInstances
  }
}

export function updateDomProperties(dom, prevProps, nextProps) {
  let prevPropsKeys = Object.keys(prevProps);
    // set event
    prevPropsKeys.filter(isEvent).forEach(key => {
      const eventType = key.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[key]);
    });
  // set attr
  prevPropsKeys.filter(isAttribute).forEach(key => {
    dom[key] = null;
  });


  let nextPropsKeys = Object.keys(nextProps);
  // set attr
  nextPropsKeys.filter(isAttribute).forEach(key => {
    dom[key] = nextProps[key]
  });
  // set event
  nextPropsKeys.filter(isEvent).forEach(key => {
    const eventType = key.toLowerCase().substring(2);
    dom.addEventListener(eventType, nextProps[key])
  });

}
