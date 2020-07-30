import React, {Component, useState}from "react"
import ReactDom from "react-dom"



class Square extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    let style={height: 20,width: 20}
    return (
      <button style={style}
        onClick={this.props.onPlay}>
        {this.props.value}
      </button>
    )
  }
}

class Brand extends Component {
  constructor(props) {
    super(props);
    this.state = {
      player: "X"
    }
  }



  renderSquare(i, index_row, index_col) {
    return <Square key={index_col} value={i} onPlay={() => this.palyKey(i, index_row, index_col)} />
  }

  palyKey(i, index_row, index_col) {
    if (i == "") {
      let player = this.state.player;
      let list = this.props.list;;
      list[index_row][index_col] = player
      player = player === 'X' ? "Y" : "X"
      this.setState({
        player
      })

      this.props.onChange(JSON.parse(JSON.stringify(list)))
    }
  }

  render() {
    const status =  'Next player: ' + this.state.player;
    const list = this.props.list;
    return (
      <div>
        <div>{status}</div>
        {
          list.map((row, index_row) =>
            <div key={index_row}>{
              row.map((col, index_col)=> { return this.renderSquare(col, index_row, index_col) } )
            }</div>
          )
        }
      </div>
    )
  }
}

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [],
      list: [
        ["","",""],
        ["","",""],
        ["","",""]
      ]
    }
  }

  onChange(step) {
    let history = this.state.history
    history.push(step)
    console.log(history)
    this.setState({history})
  }

  goBack(index){
    let list = this.state.history[index];
    let history = this.state.history.splice(0, index)
    this.setState({list, history})
  }

  render() {
    return (
      <div>
        <Brand list={this.state.list} onChange={this.onChange.bind(this)} />
        <div>
          steps list:
          <ul>
          {
            this.state.history.map(
              (i, index)=> <li key={index} onClick={() => this.goBack(index)}>step{index + 1}</li>
            )
          }
          </ul>
        </div>
      </div>

    )
  }
}


const element = <Game />

let container = document.getElementById("root");

ReactDom.render(element, container)

