const ENOUGH_TIME = 1; // MS
const HOST_ROOT = "HOST_ROOT"
const HOST_COMPONENT = "HOST_COMPONENT";
const CLASS_COMPONENT = "CLASS_COMPONENT";

let fiber = {
  tag: null, // HOST_ROOT, HOST_COMPONENT, CLASS_COMPONENT
  type: "div",
  parent: parentFiber,
  chile: chileFilber,
  sibling: siblingFiber,
  alternate: currentFiber,
  stateNode: document.createElement("div"),
  props: {children, style, className...},
  partialState: null,
  effectTag: PLACEMENT,
  effects: []
}

let workQueue = [];
let nextUnitWork = null;

//
function schedule(task) {
  workQueue.push(task);

  requestIdleCallback(performWork)
}


function performWork(deadline) {
  if (!nextUnitWork) {
    nextUnitWork = workQueue.shift();
  }

  while (nextUnitWork && deadline.timeRemaining() > ENOUGH_TIME) {
    nextUnitWork = performUnitOfWork(nextUnitOfWork);
  }
  if (nextUnitWork || nextUnitWork.length > 0 ){
    requestIdleCallback(performWork)
  }
}


function performUnitOfWork(fiber) {

  return fiber
}
