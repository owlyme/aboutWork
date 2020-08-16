let price = 2;
let quanity = 3
let total = 0

// effect store
let dep = new Set()
/**
 * 1. 怎样节省计算
 */
// save this code
let track = () => { dep.add(effect)}
// run code
let trigger = () => {
  dep.forEach(effect => effect())
}


// code wo want to save
let effect = () => {total = price * quanity}

effect()
console.log(total)

track()

quanity = 5;
trigger()
console.log(total)

price = 5;
trigger()
console.log(total)


