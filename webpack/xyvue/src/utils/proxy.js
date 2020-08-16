// proxy reflect

// const handler = {
//   get: function(obj, prop) {
//       return prop in obj ? obj[prop] : 37;
//   }
// };

// const p = new Proxy({}, handler);
// p.a = 1;
// p.b = undefined;

// console.log(p.a, p.b);      // 1, undefined
// console.log('c' in p, p.c); // false, 37

const handler = {
  get: function(obj, prop, value) {
    // console.log(obj, prop, value === p)
    return prop in obj ? obj[prop] : 'undefined'
  },
  set: function(target, prop, value, receiver) {
    console.log(target, prop, value, receiver)
    if (value !== receiver[prop]) {
      console.log('value changed')
      target[prop] = value
    } else {
      console.log('value unchanged')
    }
    return true
  }

}

let o = {a: 2, b: 3}
const p = new Proxy(o, handler) ;

p.a  = 1

p.a  = 1

console.log(p, o)