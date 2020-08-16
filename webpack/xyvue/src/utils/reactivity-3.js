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


let product = {
  price: 2,
  quanity: 5,
}
let total = 0

let effect = () => {total = product.price * product.quanity}
effect()
console.log(total)

track(product, 'price')

product.price = 4
trigger(product, 'price')
console.log(total)

