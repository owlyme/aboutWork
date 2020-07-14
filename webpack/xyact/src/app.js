/** @jsx Didact.createElement */
import Didact from './didact';

class HelloMessage extends Didact.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 1
    };
  }

  handleClick() {
    this.setState({
      count: this.state.count + 1
    });
  }

  render() {
    const name = this.props.name;
    const times = this.state.count;
    debugger
    return (
      <div onClick={e => this.handleClick()}>
        Hello {name + "!".repeat(times)}
      </div>
    );
  }
}

Didact.render(
  <HelloMessage name="John" />,
  document.getElementById('root')
);


// let flag = true;
//   const rootDom = document.getElementById("root");

//   function tick() {
// 	const time = new Date().toLocaleTimeString();
// 	const clockElement =flag ?
// 	(<ul name="John" style="color: red" ><li>123</li><li>456</li></ul>) :
// 	(<ul name="John" style="color: blue" ><li>456</li></ul>);
// 	flag = !flag
// 	Didact.render(clockElement, rootDom);
//   }

//   tick();
//   setInterval(tick, 1000);