(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.Redux = {}));
	}(
	this,
	function (exports) {
		// exports 挂载到全局对象/抛出
		'use strict';
		// 定义一个唯一标识
		function symbolObservablePonyfill(root) {
			var result;
			var Symobl = root.Symobl;
			if (typeof Symobl === "function") {
				if (Symobl.observable) {
					result = result = Symbol.observable;
				} else {
					result = Symobl("observable");
					Symobl.observable(result)
				}
			} else {
				// 任意一个字符串都可以
				result = "@@observable"
			}

			return result;
		}

		// 判断全局变量
		var root // 定义全局变量名
		if (typeof self !== "undefined") {
			root = self;
		} else if (typeof window !== "undefined") {
			root = window;
		} else if (typeof global !== "undefined") {
			root = global;
		} else if (typeof module !== "undefined") {
			root = module;
		} else {
			root = Function('return this')()
		}

		var result = symbolObservablePonyfill(root)

		// 定义随机字符串生成工具
		function randomString() {
			// toString(radix) radix	可选。规定表示数字的基数，使 2 ~ 36 之间的整数。若省略该参数，则使用基数 10。但是要注意，如果该参数是 10 以外的其他值，则 ECMAScript 标准允许实现返回任意值。
			return Math.random().toString(36).substring(7).split("").join(".")
		}

		// 定义一些常量
		var ActionTypes = {
			INIT: "@@redux/INIT" + randomString(),
			REPLACE: "@@redux/REPLACE" + randomString(),
			PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
				return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
			}
		};

		// 判断一个对象为普通对象的检查方法
		function isPlainObject(obj) {
			if (typeof obj !== "object" || obj === null) {
				return false
			}

			var proto = obj;
			while (Object.getPrototypeOf(proto) !==null) {
				proto = Object.getPrototypeOf(proto)
			}

			return Object.getPrototypeOf(obj) === proto
		}

		/* 相关的准备工作结束 */
		// 创建store
		/**
		 * @param {Function} reducer, 默认提供当前状态树（state tree），和action为参数，返回新的state tree 的一个方法
		 *
		 * @param {any} [preloadedstate] , 初始化State tree,
		 *
		 * @param {Function} [enhancer] , applyMiddleware()
		 *
		 * @returns {Store} , redux store
		 */
		function createStore(reducer, preloadedstate, enhancer) {
			var _ref2; // store
			if (typeof preloadedState === 'function' && typeof enhancer === 'function' || typeof enhancer === 'function' && typeof arguments[3] === 'function') {
				throw new Error('It looks like you are passing several store enhancers to ' + 'createStore(). This is not supported. Instead, compose them ' + 'together to a single function.');
			}

			if (typeof preloadedstate === "function" && typeof enhancer === "function") {
				enhancer = preloadedstate;
				preloadedstate = undefined;
			}

			if (typeof enhancer !== "undefined") {
				if (typeof enhancer !== "function") {
					throw new Error('Expected the enhancer to be a function.');
				}
				return enhancer(createStore)(reducer, preloadedstate);
			}
			if (typeof reducer !== 'function') {
				throw new Error('Expected the reducer to be a function.');
			}

			var currentReducer = reducer,
				currentState = preloadedstate,
				currentListeners = [],
				nextListeners = currentListeners,
				isDispatching = false ;

			// 浅拷贝 一份currentListeners
			// 防止使用者在dispatch 是订阅/注销（subscribe/unsubscribe）产生的各种问题
			function ensureCanMutateNextListeners() {
				if (nextListeners === currentListeners) {
					nextListeners = currentListeners.slice()
				}
			}

			// 获取当前state
			function getState() {
				// 当有修改，同时获取state 会抛出异常
				if (isDispatching) {
					throw new Error('You may not call store.getState() while the reducer is executing. ' + 'The reducer has already received the state as an argument. ' + 'Pass it down from the top reducer instead of reading it from the store.');
				}

				return currentState;
			}

			// 订阅
			function subscribe(listener) {
				if (typeof listener !== 'function') {
					throw new Error('Expected the listener to be a function.');
				}
				if (isDispatching) {
					throw new Error('You may not call store.subscribe() while the reducer is executing. ' + 'If you would like to be notified after the store has been updated, subscribe from a ' + 'component and invoke store.getState() in the callback to access the latest state. ' + 'See https://redux.js.org/api-reference/store#subscribelistener for more details.');
				}


				let isSubscribed = true;
				ensureCanMutateNextListeners();
				nextListeners.push(listener);

				// 返回取消订阅的函数
				return function unsubscribe() {
					if (!isSubscribed) {
						return;
					}

					if (isDispatching) {
						throw new Error('You may not unsubscribe from a store listener while the reducer is executing. ' + 'See https://redux.js.org/api-reference/store#subscribelistener for more details.');
					}
					isSubscribed = false;
					let index = nextListeners.indexOf(listener);
					nextListeners.splice(index, 1)
					currentListeners = null
				}
			}

			// 发布 返回action
			function dispatch(action) {
				if (!isPlainObject(action)) {
					throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
				}
				// action 必须要有type 属性
				if (typeof action.type === 'undefined') {
					throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
				}
				// 同时只能有一个dispatch 事件
				if (isDispatching) {
					throw new Error('Reducers may not dispatch actions.');
				}

				try {
					isDispatching = true
					// 改变state 的唯一方法， 其他方法都是野路子
					currentState = currentReducer(currentState, action)
				} finally {
					isDispatching = false
				}

				var listeners = currentListeners = nextListeners

				listeners.forEach(listener => {
					listener()
				})

				return action
			}

			// 动态替换reducer
			function replaceReducer(nextReducer) {
				// isDispatching === false
				if (typeof nextReducer === 'function') {
					throw new Error('Expected the nextReducer to be a function.');
				}

				currentReducer = nextReducer
				// 重新初始化
				dispatch({
					type: ActionTypes.REPLACE
				})
			}

			function observable() {
				var _ref;
				var outerSubscribe = subscribe;

				_ref = {
					subscribe: function subscribe(obsever) {
						if (typeof obsever !== "object" || obsever === null) {
							throw new TypeError('Expected the observer to be an object.');
						}

						function observeState() {
							if (obsever.next) {
								obsever.next(getState())
							}
						}

						observeState();

						return {
							unsubscribe: outerSubscribe(observeState)
						}
					}
				};

				_ref[result] =  function () {
					return this;
				}

				return _ref;
			}


			// 初始化 store
			// 若 perloadedState 不存在时，初始化 currentState
			dispatch({
				type: ActionTypes.INIT
			})


			// 最终返回结果
			_ref2 = {
				dispatch: dispatch,
				subscribe: subscribe,
				getState: getState,
				replaceReducer: replaceReducer
			};
			_ref2[result] = observable;
			return _ref2
		}

		// compose
		function compose(...funcs) {
			if (funcs.length === 0) {
				return arg => arg
			}

			if (funcs.length === 1) {
				return funcs[0]
			}

			return funcs.reduce((fn1, fn2) => {
				return (...arg) => {
					return fn1(fn2(...arg))
				}
			})
		}

		// redux 中间件 applyMiddleWare
		function applyMiddleware() {
			// const logger = store => next => action => {
			//   console.info('dispatching', action)
			//   let result = next(action)
			//   console.log('next state', store.getState())
			//   return result
			// }

			// 获取中间件
			var _len = arguments.length,
				middlewares = new Array(_len);
			for ( var _key = 0; _key < _len; _key++) {
				middlewares[_key] = arguments[_key];
			}
			return function(createStore) {
				return function (reducer, preloadedState) {
					var store = createStore.apply(void 0, [reducer, preloadedState]);

					var _dispatch = function dispatch() {
						throw new Error('Dispatching while constructing your middleware is not allowed. ' + 'Other middleware would not be applied to this dispatch.');
					};

					var middlewareAPI = {
						getState: store.getState,
						dispatch: function dispatch(){
							return _dispatch.apply(void 0, arguments)
						}
					}

					var chain = middlewares.map(middleware => {
						return  middleware(middlewareAPI);
					})

					_dispatch = compose.apply(void 0, chain)(store.dispatch)

					return {
						...store,
						dispatch: _dispatch
					}
				}
			}
		}

		// bindActionCreators
		function bindActionCreator(actionCreator, dispatch) {
			return function () {
				return dispatch(actionCreator.apply(this, arguments));
			};
		}

		function bindActionCreators(actionCreators, dispatch) {
			if (typeof actionCreators === "function") {
				return bindActionCreator(actionCreators, dispatch)
			}

			if (typeof actionCreators !== "object" || actionCreators === null) {
				throw new Error("bindActionCreators expected an object or a function, instead received " + (actionCreators === null ? 'null' : typeof actionCreators) + ". " + "Did you write \"import ActionCreators from\" instead of \"import * as ActionCreators from\"?");
			}

			var boundActionCreators = {};

			for (var key in actionCreators) {
				var actionCreator = actionCreators[key];

				if (typeof actionCreator === "function") {
					boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
				}
			}

			return boundActionCreators;
		}

		function combineReducers(obj = {}) {
			/**
			 * {
			 * 	a: (state, action) => {.... return state},
			 * 	b: (state, action) => {.... return state},
			 * }
			 */

			let _state = {};
			let _keys = Object.keys(obj);

			// 返回一个reducer
			return (state, action) => {

				if (state === void 0) {
					state = {};
				}

				_keys.forEach(key => {
					_state[key] = obj[key](state[key], action)
				})

				return {...state, ..._state}
			}
		}

		// 添加属性
		exports.__DO_NOT_USE__ActionTypes = ActionTypes;
		exports.applyMiddleware = applyMiddleware;
		exports.bindActionCreators = bindActionCreators;
		exports.combineReducers = combineReducers;
		exports.compose = compose;
		exports.createStore = createStore;
		Object.defineProperty(exports, '__esModule', { value: true });
	}
))