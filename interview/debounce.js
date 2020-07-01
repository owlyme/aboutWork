function continuousEvents(fn, count = 3, delay = 1000) {
  let _couter = 0;
  let timer = setInterval(() => {
    if (count <= _couter) {
      clearInterval(timer);
      _couter = 0;
    } else {
      fn();
      _couter++;
    }
  }, delay);
}

//防抖（debounce）： 在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时，重新出发定时器。
// 防抖必然会触发最后一次事件

function debounce(func, wait = 200) {
  let timer = null

  return (...arg) => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }

    timer = setTimeout(() => {
      func(...arg)
      clearTimeout(timer)
      timer = null
    }, wait)
  }
}


// 节流（throttle）：规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效。
function throttle(func, wait) {
  let startTime = 0
  let timer = null
  return (...arg) => {
    let nextTime = Date.now()

    if (startTime + wait < nextTime) {
      func(...arg);
      startTime = nextTime
      clearTimeout(timer)
    } else {
      // 取保最后一个状态被触发
      clearTimeout(timer)
      timer = setTimeout(() => {
        func(...arg);
      }, wait)
    }
  }
}

let log = () => console.log(1111)
let tl = throttle(log, 200)

continuousEvents(tl, 15, 4)