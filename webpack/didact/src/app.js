/** @jsx Didact.createElement */
import Didact from './didact';



// class HelloMessage extends Didact.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       count: 1
//     };
//   }

//   handleClick() {

//     this.setState({
//       count: this.state.count + 1
//     });
//   }

//   render() {
//     const name = this.props.name;
//     const times = this.state.count;
//     return (
//       <div onClick={e => this.handleClick()}>
//         Hello {name + "!".repeat(times)}
//       </div>
//     );
//   }
// }

// Didact.render(<HelloMessage name="xuyuan"/>, document.getElementById("app"));

const rootDom = document.getElementById("root");
let list = [];
let maxCounter = 2;
let switchFlag = false
function tick() {
  console.log("tick")
  const time = new Date().toLocaleTimeString();

  // if (list.length < maxCounter) {
  //   list.push(time);
  // } else {
  //   list.shift();
  // }
  // const clockElement = (<ul onClick={() => console.log(123123)}>{
  //   list.map(i => (<li>{i}</li>))
  // }</ul>);

  const clockElement = (<ul onClick={() => tick()}>
    <li>{time}</li>
    <li>{time} {time}</li>
  </ul>);

  const clockElement1 = (<ul onClick={() => tick()}>
    <ol>{time} {time}</ol>
    <ol>{time}</ol>

  </ul>);

  Didact.render(switchFlag ? clockElement : clockElement1, rootDom);

  switchFlag = !switchFlag;
}

tick();
