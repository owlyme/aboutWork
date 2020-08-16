//  store effects
let targetMap = new WeakMap()
let activeEffect = null

function effect(eff)  {
  activeEffect = eff
  activeEffect()
  activeEffect = null
}

function track(target, key) {
  if (activeEffect) {
    let depMaps = targetMap.get(target)
    if (!depMaps) {
      targetMap.set(target, depMaps = new Map())
    }

    let dep = depMaps.get(key)
    if (!dep) {
      depMaps.set(key, dep = new Set())
    }
    dep.add(activeEffect)
  }
}

function trigger(target, key) {
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

  return new Proxy(target, handler)
}
// -----------------------------------
function ref(init) {
  /**
   * r = {value: raw}
   */
  let value = init
  let r = {
    get value() {
      console.log("ref get")
      track(r, 'value')
      return value
    },

    set value(newValue) {
      console.log("ref set")
      if (value !== newValue) {
        value = newValue
        trigger(r, 'value')
      }
    }
  }

  return r
}
// -----------------------------------
let product = {
  price: 2,
  quanity: 5,
}
let total = 0
let totalSale = ref(0)
let rep = reactive(product)
console.log(total, totalSale)

effect(() => totalSale.value = 99 )
effect(() => total = totalSale.value)

console.log(total, totalSale.value)

// console.log('out set')
// rep.price = 10;
// console.log(total, totalSale)

