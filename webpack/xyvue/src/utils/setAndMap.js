// es6提供了两种新的数据解构：Set 集合和Map 映射。

/**
 * Set(0) {}
[[Entries]]
No properties
size: 0
__proto__: Set
          add: ƒ add()
          clear: ƒ clear()
          constructor: ƒ Set()
          delete: ƒ delete()
          entries: ƒ entries()
          forEach: ƒ forEach()
          has: ƒ has()
          keys: ƒ values()
          size: (...)
          values: ƒ values()
          Symbol(Symbol.iterator): ƒ values()
          Symbol(Symbol.toStringTag): "Set"
          get size: ƒ size()
          __proto__: Object
 */
// let set = new Set()
// console.log(1,set)
// set.add(1)
// set.add(1)
// set.add(2)
// set.add("xy")

// set.forEach((key, value) => {
//   console.log(key, value)
// })

// console.log(2,set, set.size,set.entries(), set.keys(), set.values(), set.has('xy'))
// console.log(2.1,)
// set.delete(1)
// console.log(3, set)

// set.clear()
// console.log(4, set)

/**
 * Map(0) {}
[[Entries]]
No properties
size: (...)
__proto__: Map
          clear: ƒ clear()
          constructor: ƒ Map()
          delete: ƒ delete()
          entries: ƒ entries()
          forEach: ƒ forEach()
          get: ƒ ()
          has: ƒ has()
          keys: ƒ keys()
          set: ƒ ()
          size: (...)
          values: ƒ values()
          Symbol(Symbol.iterator): ƒ entries()
          Symbol(Symbol.toStringTag): "Map"
          get size: ƒ size()
          __proto__: Object
 */

// let map = new Map([['name', 'wozien'], ['age', 25]])
// console.log(1,map)
// map.set('a',1)
// map.set('a',1)
// map.set('b',2)

// map.forEach((key, value) => {
//   console.log(key, value)
// })

// console.log(2,map, map.size,map.entries(), map.keys(), map.values(), map.has('xy'))

// map.delete('a')
// console.log(3, map)

// map.clear()
// console.log(4, map)



// 存在一种集合，在外部的引用都不存在时，集合的对象会自动被垃圾回收，该集合就可以称为对该对象的弱引用。
let set = new WeakSet();
let obj = {};

set.add(obj);
console.log(set.has(obj)); // true

obj = null;
console.log(set.has(obj)); // false



let map = new WeakMap();
let obj1 = {};

set.set(obj1, 1);
console.log(set.has(obj1)); // true

obj1 = null;
console.log(set.has(obj1)); // false

/**
 * 1. WeakSet 和 WeakMap 不支持 clear() 和 forEach() 方法。因为垃圾回收执行不能预测，所谓两者都没有 size 属性。
 * 2. 利用Set 进行数组去重：
 * 3. 利用 WeakMap 记录DOM元素的额外信息，并随着DOM的移除自动清除：
 * 4. 利用 WeakMap 实现对象的私有属性：
 */
