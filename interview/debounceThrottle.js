// 采取防抖（debounce）和节流（throttle）来处理，减少调用事件的频率，达到较好的用户体验。

//防抖（debounce）： 在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时，重新出发定时器。

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

var deBounce = function (fn, delay = 1000) {
  let timer = null;

  return function (...arg) {
    if (timer != null) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      fn(arg);
    }, delay);
  };
};

function log(a) {
  console.log(a);
}

let dlog = deBounce(log);



function throttle(fn, delay = 1000) {
  let startTime = 0;

  return function (...arg) {
    let nextTime = Date.now();

    if (nextTime > startTime + delay) {
      startTime = nextTime;
      fn(...arg);
    }
  };
}

let tlog = throttle(log);
continuousEvents(
  () => {
    tlog("333333");
  },
  4,
  500
);
