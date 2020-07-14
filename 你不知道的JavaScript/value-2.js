let o = '20123'

console.log(o[0])
console.log(Array.prototype.slice.call(o))
console.log(Array.from(o))
console.log([...o])