//  store effects
let depMaps = new Map()

let track = (key) => {
  let dep = depMaps.get(key)
  if (!dep) {
    depMaps.set(key, (dep = new Set()))
  }

  dep.add(effect)
}

let trigger = (key) => {
  let dep = depMaps.get(key);
  if (dep) {
    dep.forEach(effect => effect());
  }
}

// Often object has multiple porperities and each properity will nedd their own dep, how can we do?
let product = {
  price: 2,
  quanity: 5,
}
let total = 0

let effect = () => {total = product.price * product.quanity}
effect()
console.log(total)

track('quanity')

product.quanity = 4
trigger('quanity')
console.log(total)

product.price = 4
trigger('quanity')
console.log(total)
