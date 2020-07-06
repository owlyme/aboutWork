import type {LazyComponent} from './ReactLazy';

import {
	REACT_LAZY_TYPE,
	REACT_BLOCK_TYPE,
	REACT_MEMO_TYPE,
	REACT_FORWARD_REF_TYPE,
  } from 'shared/ReactSymbols';

/**
 * 
 * @param {} payload 
 */
function lazyInitializer(payload) {
	return {
		$$typeof: REACT_BLOCK_TYPE,
		_data: payload.load.apply(null, payload.args),
		_render: payload.render,
	  };
}

/**
 * 
 * @param {function} render 
 * @param {function} load
 */
export function block(render, load) {
	if (__DEV__) {
		if (load !== undefined && typeof load !== 'function') {
			console.error(
			  'Blocks require a load function, if provided, but was given %s.',
			  load === null ? 'null' : typeof load,
			);
		  }
		if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
			console.error(
				'Blocks require a render function but received a `memo` ' +
				'component. Use `memo` on an inner component instead.',
			);
		} else if (render != null && render.$$typeof === REACT_FORWARD_REF_TYPE) {
			console.error(
			  'Blocks require a render function but received a `forwardRef` ' +
				'component. Use `forwardRef` on an inner component instead.',
			);
		} else if (typeof render !== 'function') {
			console.error(
			  'Blocks require a render function but was given %s.',
			  render === null ? 'null' : typeof render,
			);
		} else if (render.length !== 0 && render.length !== 2) {
			// Warn if it's not accepting two args.
			// Do not warn for 0 arguments because it could be due to usage of the 'arguments' object.
			console.error(
			  'Block render functions accept exactly two parameters: props and data. %s',
			  render.length === 1
				? 'Did you forget to use the data parameter?'
				: 'Any additional parameter will be undefined.',
			);
		}

		if (
			render != null &&
			(render.defaultProps != null || render.propTypes != null)
		  ) {
			console.error(
			  'Block render functions do not support propTypes or defaultProps. ' +
				'Did you accidentally pass a React component?',
			);
		  }
	  
	}

	if (load === undefined) {
		return function() {
			const blockComponent = {
				$$typeof: REACT_BLOCK_TYPE,
				_data: undefined,
				_render: render
			}

			return blockComponent;
		};
	}

	const loadFn = load;

	return function() {
		const args = arguments;
		const payload = {
			load: loadFn,
			args: args,
			render: render
		}

		const lazyType = {
			$$typeof: REACT_LAZY_TYPE,
			_payload: payload,
			_init: lazyInitializer
		}

		return lazyType
	}
}