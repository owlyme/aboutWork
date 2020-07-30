import { reconcile } from "./render";

function updateInstance(internalInstance) {

  const parentDom = internalInstance.dom.parentNode;
  const element = internalInstance.element;

  reconcile(parentDom, internalInstance, element); // 对比-虚拟dom树
}

class Component {
  constructor(props) {
    this.props = props;
    this.state = this.state || {};
  }

  setState(partialState) {
    this.state = Object.assign({}, this.state, partialState);
    // 内部实例的引用
    updateInstance(this.__internalInstance); // 更新 虚拟-Dom树和 更新 html
  }
}

export default Component;