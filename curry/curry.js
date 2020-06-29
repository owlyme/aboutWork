//
// 在计算机科学中，柯里化（Currying）是把接受多个参数的函数变换成
// 接受一个单一参数 (最初函数的第一个参数) 的函数，
// 并且返回接受余下的参数且 返回结果 的新函数的技术。
// 这个技术由 Christopher Strachey 以逻辑学家 Haskell Curry 命名的，尽管它是 Moses Schnfinkel 和 Gottlob Frege 发明的。
//

//  1
// var greet = function(greeting, name) {
//   return greeting + ", " + name
// };
// console.log(greet("Hello", "Heidi")); //"Hello, Heidi"

// function greetCurry(greeting) {
//   return function(name) {
//     return greeting + ", " + name
//   }
// }

// console.log(greetCurry("Hello")("Heidi"))

//  2
// var curryIt = function(uncurried) {
//   var parameters = Array.prototype.slice.call(arguments, 1);
//   console.log(parameters)
//   return function() {
//     return uncurried.apply(this, parameters.concat(
//       Array.prototype.slice.call(arguments, 0)
//     ));
//   };
// };

// var greeter = function(greeting, separator, emphasis, name) {
//   return greeting + separator + name + emphasis;
// };
// var greetHello = curryIt(greeter, "Hello", ", ", ".");
// console.log(greetHello('1231'))

// 3
// fn(5)(4)(3) =?> 60

// function fn (a) {
//   return function x5(b) {
//     return function x4(c) {
//       return a * b * c
//     }
//   }
// }

// console.log(fn(5)(4)(3))


// function getCurried() {
//   let arg_arr = []

//   let c = function(a) {

//     if (a) {
//       arg_arr.push(a)
//       return c
//     } else {
//       return arg_arr.reduce((total, current) => total * current)
//     }
//   }

//   return c
// }

// let fn = getCurried()

// console.log(fn(5)(4)(3)())

function checkByRegExp(regExp,string) {
  return regExp.test(string);
}
let curry = (fn) => (reg) => (val) => fn(reg, val)
let _check = curry(checkByRegExp);

let checkCellPhone = _check(/^1\d{10}$/);

console.log(checkCellPhone('13156521414'))
