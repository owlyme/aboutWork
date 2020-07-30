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
  let inputText = {current: null}
  return (
    <input  onChange={() => props.change(inputText)} className="FancyButton" />
  );
};

const inputRef = React.createRef();

function XX () {
  let [val, setVal] = useState('')

  return (
    <div>
      {val}
      <FancyInput ref={inputRef} change={() => {
        console.log(inputRef);

      }}></FancyInput>
    </div>
  )
}

let element =<XX />
console.log(element)

let container = document.getElementById("root");

ReactDom.render(element, container)

