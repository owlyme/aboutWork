console.log(Symbol.iterator)
let randoms = {
  [Symbol.iterator] : function() {
    return {
      next: function() {
        return {value: Math.random()}
      }
    }
  }
}

var pool = []
for (var n of randoms) {
  pool.push[n]
  if (pool.length >=10) break;
}

// let o = {
//   a: 1,
//   b: 2
// }

// for (var key of o) {
//   console.log(key)
// }

// for (var key in o ) {
//   console.log(key)
// }