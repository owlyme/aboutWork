// JSON.stringify(obj, replacer, space)
// replacer: 1. 需要的对象属性的数组； 2：function(key,val) {}
// space: 1. 数字（缩进长度）2: 缩进的字符串
let o = {
  a: [1,2,3],
  b: 123,
  c: {
    ca: 11,
    cb: 22
  }
}

// console.log(JSON.stringify(o, null, "$$$"))
// console.log(JSON.stringify(o, null, 2))

// console.log(JSON.stringify(o, ["a", "c"], 2))

console.log(
  JSON.stringify(o, (key, val) => {
    console.log(key, val)
    if (key !== "b") return val
  } , 2)
)

