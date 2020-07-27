/** @jsx Didact.createElement */
import Didact from './didact';

let Fn = (props) => {
	return (
		<ul name="John" style="color: red" ><li>{props.name}</li></ul>
	)
}
let Fn1 = (props) => {
	return (
		<ul name="John" style="color: red" ><li>{props.name}</li><li>{props.children}</li></ul>
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
<<<<<<< HEAD
	const times = this.state.count;
	const flag = this.state.flag
    return (
      <div onClick={e => this.handleClick()}>
        Hello {name + "!".repeat(times)}

		<Fn name={flag ? "xxx" : "yyy"} />

=======
    const times = this.state.count;
    const flag = this.state.flag
    return (
      <div onClick={e => this.handleClick()}>
        Hello {name + "!".repeat(times)}
>>>>>>> ce6004a8dded8fd6dc6a95bbdfe795ac4e048e5f
      </div>
    );
  }
}

<<<<<<< HEAD
// Didact.render(
//   (<Fn1  name="zzz"><HelloMessage name="John" /></Fn1>),
//   document.getElementById('root')
// );
=======
Didact.render(
 <Fn name="xxxxx" />,
  document.getElementById('root')
);
>>>>>>> ce6004a8dded8fd6dc6a95bbdfe795ac4e048e5f


let flag = true;
  const rootDom = document.getElementById("root");

function tick() {
	const time = new Date().toLocaleTimeString();
	const clockElement =flag ?
<<<<<<< HEAD
	(<ul name="John" style={{color: "red"}} ><li>123</li><li>456</li></ul>) :
  (<ul name="John" style="color: blue" ><li>456</li></ul>);
=======
	(<ul name="John" style={{color: "red"}} onClick={() => tick()} >14562</ul>) :
  (<ul name="John" style="color: blue" onClick={() => tick()}  >333333</ul>);
>>>>>>> ce6004a8dded8fd6dc6a95bbdfe795ac4e048e5f

  flag = !flag

	Didact.render(clockElement, rootDom);
}

<<<<<<< HEAD
  tick();
  setInterval(tick, 1000);
=======
// 
>>>>>>> ce6004a8dded8fd6dc6a95bbdfe795ac4e048e5f
