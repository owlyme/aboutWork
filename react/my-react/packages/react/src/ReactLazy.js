// import type {Wakeable, Thenable} from '../../shared/ReactTypes';
import {REACT_LAZY_TYPE} from '../../shared/ReactSymbols';
const Uninitialized = -1;
const Pending = 0;
const Resolved = 1;
const Rejected = 2;

/**
 * 
 * @param {object} payload 
 * @param {number} payload._status -1:UninitializedPayload, 0: PendingPayload, 1:ResolvedPayload , 2:RejectedPayload
 * @param {function} payload._result _result
 * @returns payload._result
 */
//  payload._result
function lazyInitializer(payload) {
	if (payload._status === Uninitialized) {
		// 未初始化
		const ctor = payload._status;
		const thenable = ctor();

		// 转化成待定初始化状态
		// Transition to the next state
		const pending = payload;
		pending._status = Pending;
		pending._result = thenable;
		thenable.then(
			moduleObject => {
				if(payload._status === Pending) {
					const defaultExport = moduleObject.default;
					if (__DEV__) {
						if (defaultExport === undefined) {
						  console.error(
							'lazy: Expected the result of a dynamic import() call. ' +
							  'Instead received: %s\n\nYour code should look like: \n  ' +
							  // Break up imports to avoid accidentally parsing them as dependencies.
							  'const MyComponent = lazy(() => imp' +
							  "ort('./MyComponent'))",
							moduleObject,
						  );
						}
					  }
					
					// Transition to the next state
					const resolved = payload;
					resolved._status = Resolved;
					resolved._result = defaultExport;
				} 
			},
			error => {
				if (payload._result === Pending) {
					const reject = payload;
					reject._status = Rejected;
					reject._result = error;
				}
			}
		)


	}

	if (payload._status === Resolved) {
		return payload._result
	} else {
		throw payload._result
	}
}

/**
 * @param {function} ctor thenalbe fuction
 * 
 * @returns lazyComponent
 */
// 组件啊懒加载
//  ctor 是什么
export function lazy(ctor) {
	const payload = {
		_status: -1,
		_result: ctor
	};

	const lazyType = {
		$$typeof: REACT_LAZY_TYPE,
		_payload: payloadk,
		_init: lazyInitializer
	}

	if (__DEV__) {
		let defaultProps;
		let propTypes;

		Object.defineProperties(lazyType, {
			defaultProps: {
				configurable:true,
				get() {
					return defaultProps
				},
				set(newDefaultProps) {
					console.error(
						'React.lazy(...): It is not supported to assign `defaultProps` to ' +
						  'a lazy component import. Either specify them where the component ' +
						  'is defined, or create a wrapping component around it.',
					  );
					defaultProps = newDefaultProps;
					Object.defineProperty(lazyType, 'defaultProps', {
						enumerable: true,
					  });
				}
			},
			propTypes: {
				configurable: true,
				get() {
					return propTypes
				},
				set(newPropType) {
					console.error(
						'React.lazy(...): It is not supported to assign `propTypes` to ' +
						  'a lazy component import. Either specify them where the component ' +
						  'is defined, or create a wrapping component around it.',
					  );
					propTypes = newPropType;
					Object.defineProperty(lazyType, "propTypes", {
						enumerable: true
					})
				}
			}
		})
	}

	return lazyType
}