import React, {Component, useState}from "react"
import ReactDom from "react-dom"


const ref = React.createRef();
const FancyButton = React.forwardRef((props, ref) => {
  return (
    <input ref={ref} onChange={() => props.change()} className="FancyButton" />
  );
})

function XY () {
  let [val, setVal] = useState('')

  return (
    <div>
      <div>{val}</div>
      <FancyButton
      change={() => {
        console.log(ref);

        setVal(ref.current.value)
      }}
      ref={ref} >Click me!</FancyButton>;
    </div>
  )
}
const FancyInput = (props) => {
  return (
    <input  onChange={() => props.change()} className="FancyButton" />
  );
};

const inputRef = React.createRef();
function XX () {
  let [val, setVal] = useState('')

  return (
    <div>
      {val}
      <FancyInput change={() => {

      }}></FancyInput>
    </div>
  )
}


class ClassInput extends Component {
  render () {
    return (
      <input  onChange={() => this.props.change()} className="FancyButton" />
    );
  }
}

const classInputRef = React.createRef();


function XC () {
  let [val, setVal] = useState('')

  return (
    <div>
      {val}
      <ClassInput ref={classInputRef}  change={() => {
        console.log(classInputRef);

      }}></ClassInput>
    </div>
  )
}


let element =<XC />

let container = document.getElementById("root");

ReactDom.render(element, container)


/**
 * 1. Refs 提供一种方式，允许用户访问DOM节点或者render 方法中创建的React元素
 * Function components cannot be given refs,
 * React.forwardRef((props, ref) => ...) can
 * class Components can (方法中创建的React元素)
 * Host Components can
 */

