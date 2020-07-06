import {REACT_PROVIDER_TYPE, REACT_CONTEXT_TYPE} from '../../shared/ReactSymbols';

/**
 * 
 * @param {*} defaultValue 
 * @param {function} calculateChangedBits return number
 */
// 
export function createContext(defaultValue, calculateChangedBits) {
	if (calculateChangedBits === undefined) {
		calculateChangedBits = null;
	} else {
		if (__DEV__) {
			if (
				calculateChangedBits !== null &&
				typeof calculateChangedBits !== 'function' 
			) {
				console.error(
					'createContext: Expected the optional second argument to be a ' +
					  'function. Instead received: %s',
					calculateChangedBits,
				  );
			}
		}
	}

	const context = {
		$$typeof: REACT_CONTEXT_TYPE,
		_calculateChangedBits: calculateChangedBits,
		// 作为支持多个并发渲染器的解决方法，我们将一些渲染器归类为主要渲染器，将其他渲染器归为辅助渲染器。 我们只希望最多有两个并发渲染器：React Native（主要）和Fabric（次要）。 React DOM（主要）和React ART（次要）。 辅助渲染器将其上下文值存储在单独的字段中。
		// 主要渲染器，将其他渲染器归为辅助渲染器
		_currentValue: defaultValue,
		_currentValue2: defaultValue,
		    // Used to track how many concurrent renderers this context currently
    // supports within in a single renderer. Such as parallel server rendering.
		_threadCount: 0,
		Provider: null, // 提供者
		Consumer: null // 消费者
	}

	context.Provider = {
		$$typeof: REACT_PROVIDER_TYPE,
		_context: context
	}

	let hasWarnedAboutUsingNestedContextConsumers = false;
	let hasWarnedAboutUsingConsumerProvider = false;
	let hasWarnedAboutDisplayNameOnConsumer = false;

	if (__DEV__) {
		// A separate object, but proxies back to the original context object for
		// backwards compatibility. It has a different $$typeof, so we can properly
		// warn for the incorrect usage of Context as a Consumer.
		const Consumer = {
		$$typeof: REACT_CONTEXT_TYPE,
		_context: context,
		_calculateChangedBits: context._calculateChangedBits,
		};
		// $FlowFixMe: Flow complains about not setting a value, which is intentional here
		Object.defineProperties(Consumer, {
		Provider: {
			get() {
			if (!hasWarnedAboutUsingConsumerProvider) {
				hasWarnedAboutUsingConsumerProvider = true;
				console.error(
				'Rendering <Context.Consumer.Provider> is not supported and will be removed in ' +
					'a future major release. Did you mean to render <Context.Provider> instead?',
				);
			}
			return context.Provider;
			},
			set(_Provider) {
			context.Provider = _Provider;
			},
		},
		_currentValue: {
			get() {
			return context._currentValue;
			},
			set(_currentValue) {
			context._currentValue = _currentValue;
			},
		},
		_currentValue2: {
			get() {
			return context._currentValue2;
			},
			set(_currentValue2) {
			context._currentValue2 = _currentValue2;
			},
		},
		_threadCount: {
			get() {
			return context._threadCount;
			},
			set(_threadCount) {
			context._threadCount = _threadCount;
			},
		},
		Consumer: {
			get() {
			if (!hasWarnedAboutUsingNestedContextConsumers) {
				hasWarnedAboutUsingNestedContextConsumers = true;
				console.error(
				'Rendering <Context.Consumer.Consumer> is not supported and will be removed in ' +
					'a future major release. Did you mean to render <Context.Consumer> instead?',
				);
			}
			return context.Consumer;
			},
		},
		displayName: {
			get() {
			return context.displayName;
			},
			set(displayName) {
			if (!hasWarnedAboutDisplayNameOnConsumer) {
				console.warn(
				'Setting `displayName` on Context.Consumer has no effect. ' +
					"You should set it directly on the context with Context.displayName = '%s'.",
				displayName,
				);
				hasWarnedAboutDisplayNameOnConsumer = true;
			}
			},
		},
		});
		// $FlowFixMe: Flow complains about missing properties because it doesn't understand defineProperty
		context.Consumer = Consumer;
	} else {
		context.Consumer = context;
	}

	if (__DEV__) {
		context._currentRenderer = null;
		context._currentRenderer2 = null;
	}


  return context; 
}
