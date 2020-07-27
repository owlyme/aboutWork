/** @jsx Didact.createElement */
import Didact from './didact/didact';

let flag = true;
  const rootDom = document.getElementById("root");

function tick() {
	const time = new Date().toLocaleTimeString();
	const clockElement =flag ?
	(<ul name="John" style={{color: "red"}} onClick={() => tick()} >14562</ul>) :
  (<ul name="John" style="color: blue" onClick={() => tick()}  >333333</ul>);

  flag = !flag

	Didact.render(clockElement, rootDom);
}
// tick() 
function Counter() {
  const [state, setState] = Didact.useState(1)
  return (
    <h1 onClick={() => setState(c => c + 1)}>
      Count: {state}
    </h1>
  )
}
const element = (<div>
  <Counter />
  <Counter />
  </div>)
Didact.render(element, rootDom);