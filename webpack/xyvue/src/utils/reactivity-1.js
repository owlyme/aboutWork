let price = 2;
let quanity = 3
let total = 0

// effect store
let dep = new Set()
/**
 * 1. 怎样节省计算
 */
// code wo want to save
let effect = () => {total = price * quanity}
let track = () => { dep.add(effect)}
let trigger = () => {
  dep.forEach(effect => effect())
}
// save this code
track()
// run code
effect()
// run all the code we had saved
// trigger()

console.log(total)

quanity = 5;
trigger()
console.log(total)

price = 5;
trigger()
console.log(total)


// Often object has multiple porperities and each properity will nedd their own dep, how can we do?
let product = {
  price: 2,
  quanity: 5,
}


