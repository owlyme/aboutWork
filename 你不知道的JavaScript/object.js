
// let o = {
//   a: 1,
//   b: 2,
//   fn() {
//     console.log(this.a)
//   }
// }


// if (!Object.create) {
//   Object.create = function(obj) {
//     function F() {};
//     F.prototype = obj;
//     return new F();
//   }
// }


// let o1 = Object.create(o);
// // console.log(o1, o1.__proto__);
// o1.a = 111
// o1.fn() // 11



const Elem = {
  css() {
    console.log("css", arguments)
    return this
  },
  appendTo() {
    console.log("appendTo", arguments);
    return this
  },
  click(callback) {
    console.log("click");
    if (typeof callback === "function") {
      callback()
    }
  }
}
// 类模型
// 父类
function Widget(width, height) {
  this.width = width;
  this.heiht = height;
  this.$elem = null
}
Widget.prototype.render = function($where) {
  if (this.$elem) {
    this.$elem.css({
      width: this.width + "px",
      height: this.heiht + "px"
    }).appendTo($where)
  }
}

// zilei
function Button(width, height, label, elem) {
  Widget.call(this, width, height);
  this.label = label || "default";

  this.$elem = elem
}

Button.prototype = Object.create(Widget.prototype);

Button.prototype.render = function($where) {
  Widget.prototype.render.call(this, $where);

  this.$elem.click(this.onClick.bind(this));
}

Button.prototype.onClick = function() {
  console.log("Button " + this.label + " clicked")
}

// var btn1 = new Button(5,5, "button1 ", Elem)

// btn1.render("where")

// ES6 class
class Widget1 {
  constructor(width, height) {
    this.width = width;
    this.heiht = height;
    this.$elem = null
  }

  render($where) {
    if (this.$elem) {
      this.$elem.css({
        width: this.width + "px",
        height: this.heiht + "px"
      }).appendTo($where)
    }
  }
}

class Button1 extends Widget1 {
  constructor(width, height, label, elem) {
    super(width, height);
    this.label = label;
    this.$elem = elem;
  }

  onrender($where) {
    this.render($where)
    this.$elem.click(this.onClick.bind(this));
  }
  onClick() {
    console.log("Button 1 " + this.label + " clicked")
  }
}

// var btn1 = new Button1(5,5, "button1 ", Elem)

// btn1.onrender("where 11")

let Widget2 = {
  init(width, height) {
    this.width = width;
    this.heiht = height;
    this.$elem = null
  },

  render($where) {
    if (this.$elem) {
      this.$elem.css({
        width: this.width + "px",
        height: this.heiht + "px"
      }).appendTo($where)
    }
  }
}

let Button2 = Object.create(Widget2);

Button2.setup = function(width, height, label, elem) {
  this.init(width, height);
  this.label = label;
  this.$elem = elem;
}
Button2.build = function($where) {
  this.render($where)
  this.$elem.click(this.onClick.bind(this));
}
Button2.onClick = function () {
  console.log("Button 1 " + this.label + " clicked")
}

let btn2 = Object.create(Button2);
btn2.setup(5, 5, "button2 ", Elem);
btn2.build(5, 5, "button2 ", Elem);