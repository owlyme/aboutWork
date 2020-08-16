// What if we have multiple reactive objects that each need to track effects?

//  store effects
let targetMap = new WeakMap()

let track = (target, key) => {
  let depMaps = targetMap.get(target)
  if (!depMaps) {
    targetMap.set(target, depMaps = new Map())
  }

  let dep = depMaps.get(key)
  if (!dep) {
    depMaps.set(key, dep = new Set())
  }

  dep.add(effect)
}

let trigger = (target, key) => {
  let depMaps = targetMap.get(target)
  if (!depMaps) return;
  dep = depMaps.get(key)
  if (dep) {
    dep.forEach(effect => effect());
  }
}

// -----------------------------------
function reactive (target) {
  const handler = {
    get(target, prop, receiver) {
      console.log('get')
      let result = Reflect.get(target, prop, receiver)
      track(target, prop)
      return result
    },

    set(target, prop, value, receiver) {
      console.log('set')
      let oldValue = target[prop]
      let result = Reflect.set(target, prop, value, receiver)
      if (oldValue !== result) {
        trigger(target, prop)
      }

      return result
    }
  };

  let pp = new Proxy(target, handler)

  return pp
}
// -----------------------------------

let product = {
  price: 2,
  quanity: 5,
}
let total = 0

let rep = reactive(product)

let effect = () => total = rep.price * rep.quanity
effect()

console.log(total)

rep.price = 10;
console.log(total)

rep.quanity = 10;
console.log(total)

