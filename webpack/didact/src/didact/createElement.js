
import { TEXT_ELEMENT } from "./elementTypes"
// 生成虚拟节点

// jsx 的每一个标签都对应一个createTextElement 方法，
// 其中 经过@babel/plugin-syntax-jsx 转换编译， Tag 上的属性转换为props集合的参数，
// 标签包裹的内容解析为props.children 属性

function DidactElement(type, props = {}) {
  const element = {
    // type: "div",
    // props: {
    //   id: "container",
    //   children: [
    //     { type: "input", props: { value: "foo", type: "text" } },
    //     { type: "a", props: { href: "/bar" } },
    //     { type: "span", props: {} }
    //   ]
    // }
    type,
    props
  };
  return element
}

function createTextElement(value) {
  // 规范数据
  let {type, props} = DidactElement(TEXT_ELEMENT, { nodeValue: value })
  return createElement(type, props);
}

export function createElement(type, config = {}, ...children) {
  const props = Object.assign({}, config);
  const hasChildren = children.length > 0;
  const rawChildren = hasChildren ? [].concat(...children) : [];
  props.children = rawChildren
    .filter(c => c != null && c !== false)
    .map(c => c instanceof Object ? c : createTextElement(c));

  return { type, props };
};
