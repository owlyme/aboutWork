/** @jsx Didact.createElement */
import Didact from './didact';

let Fn = (props) => {
	return (
		<ul name="John" style="color: red" ><li>{props.name}</li></ul>
	)
}

class HelloMessage extends Didact.Component {
  constructor(props) {
    super(props);
    this.state = {
	  count: 1,
	  flag: false
    };
  }

  handleClick() {
	  console.log('click time')
    this.setState({
	  count: this.state.count + 1,
	  flag: !this.state.flag
    });
  }

  render() {
    const name = this.props.name;
	const times = this.state.count;
	const flag = this.state.flag
    return (
      <div onClick={e => this.handleClick()}>
        Hello {name + "!".repeat(times)}

		<Fn name={flag ? "xxx" : "yyy"} />
      </div>
    );
  }
}

Didact.render(
  <HelloMessage name="John" />,
  document.getElementById('root')
);


let flag = true;
  const rootDom = document.getElementById("root");

  function tick() {
	const time = new Date().toLocaleTimeString();
	const clockElement =flag ?
	(<ul name="John" style="color: red" ><li>123</li><li>456</li></ul>) :
	(<ul name="John" style="color: blue" ><li>456</li></ul>);
	flag = !flag
	Didact.render(<Fn name={flag ? "xxx" : "yyy"} />, rootDom);
  }
  
//   tick();
//   setInterval(tick, 1000);