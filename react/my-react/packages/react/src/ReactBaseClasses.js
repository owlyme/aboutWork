// import invariant from 'shared/invariant';

import ReactNoopUpdateQueue from './ReactNoopUpdateQueue';
const invariant = () => {}

// 定义一个空对象， refs
const emptyObject = {};
// 开发环境
// if (__DEV__) {
// 	Object.freeze(emptyObject);
// }

// Base class helper for the updating state of a componentbundleRenderer.renderToStream
function Component(props, context, updater) {
	this.props = props;
	this.context = context;
	// If a component has string refs, we will assign a different object later
	this.refs = emptyObject;

	// We initialize the default updater but the real one gets inject by the renderer
	// 我们初始化默认的更新程序，但是真正的更新程序由 渲染器 注入。
	this.updater = updater || ReactNoopUpdateQueue
}

Component.prototype.isReactComponent = {}

/**给 state 设置一个子集
 * 不保证 this.state 及时更新
 * 不保证 setState 同步运行, 可能打包运行，回调函数能确保在拿到最新的 state
 * @param {object|function} partialState Next partial state or function to
 *        produce next partial state to be merged with current state.
 * @param {?function} callback Called after state is updated.
 * @final
 * @protected
 */
Component.prototype.setState = function(partialState, callback) {
	invariant(
		typeof partialState === 'object' || typeof partialState === "function" || partialState == null,
		'setState(...): takes an object of state variables to update or a ' +
      'function which returns an object of state variables.',
	)

	this.updater.enqueueSetState(this, partialState, callback, 'setState')
}
/**  
 * This will not invoke `shouldComponentUpdate`, but it will invoke `componentWillUpdate` and `componentDidUpate`
 * @param {?function} callback Called after update is complete.
*/ 
Component.prototype.forceUpdate = function(callback) {
	this.updater.enqueueForceUpdate(this, callback, 'forceUpdate')
}


function ComponentDummy() {}
ComponentDummy.prototype = Component.prototype;

function PureComponent(props, context, updater) {
	this.props = props;
	this.context = context;
	// If a component has string refs, we will assign a different object later.
	this.refs = emptyObject;
	this.updater = updater || ReactNoopUpdateQueue;
}

const pureComponentPrototype = (PureComponent.prototype = new ComponentDummy())

pureComponentPrototype.constructor = PureComponent;
Object.assign(pureComponentPrototype, Component.prototype);
pureComponentPrototype.isPureReactComponent = true;
console.log(pureComponentPrototype)

export { Component, PureComponent }
