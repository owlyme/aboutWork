// 警告卸载的组件的状态更新
const didWarnStateUpdateForUnmountedComponent = {};

// 警告方法
function warnNoop(publicInstance, callerName) {

}

/**
 * This is the abstract API for an update queue.
 * 这是更新队列的抽象API
 */

const ReactNoopUpdateQueue = {

  isMounted: function(publicInstance) {
    return false
  },

  // *强制更新。 只有在确定我们不是DOM事务中的“肯定”对象时，才应调用此方法。
  enqueueForceUpdate(publicInstance, callback, callerName) {
    warnNoop(publicInstance, "forceUpdate")
  },

  // 替换所有状态， 总是使用this 或者 setState 来改变状态
  // There is no guarantee that 'this.state' will be immediately updated, so 
  // accessing `this.state` after calling this methood may return the old value
  enqueueReplaceState(publicInstance, completeState, callback, callerName) {
    warnNoop(publicInstance, "forceUpdate")
  },

  // 设置状态的子集。 这仅是因为_pendingState是内部的。 这提供了深层无法使用的合并策略
  // 属性令人困惑。 待办事项：在合并过程中公开未决状态或不使用它。
  /**
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} partialState Next partial state to be merged with state.
   * @param {?function} callback Called after component is updated.
   * @param {?string} Name of the calling function in the public API.
   * @internal
   */
  enqueueSetState(publicInstance, partialState, callback, Name) {
    warnNoop(publicInstance, 'setState');
  }
}


export default ReactNoopUpdateQueue;