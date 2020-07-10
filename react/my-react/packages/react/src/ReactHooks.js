// import type {
// 	MutableSource,
// 	MutableSourceGetSnapshotFn,
// 	MutableSourceSubscribeFn,
// 	ReactContext,
// 	ReactEventResponder,
// 	ReactEventResponderListener,
//   } from 'shared/ReactTypes';

// import type {OpaqueIDType} from 'react-reconciler/src/ReactFiberHostConfig';

import invariant from '../../shared/invariant';
import {REACT_RESPONDER_TYPE} from '../../shared/ReactSymbols';

import ReactCurrentDispatcher from './ReactCurrentDispatcher';

// https://react.docschina.org/docs/hooks-reference.html#usecontext

function resolveDispatcher() {
	const dispatcher = ReactCurrentDispatcher.current;
	invariant(
		dispatcher !== null,
		'Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for' +
		  ' one of the following reasons:\n' +
		  '1. You might have mismatching versions of React and the renderer (such as React DOM)\n' +
		  '2. You might be breaking the Rules of Hooks\n' +
		  '3. You might have more than one copy of React in the same app\n' +
		  'See https://fb.me/react-invalid-hook-call for tips about how to debug and fix this problem.',
	  );
	return dispatcher
}

export function useContext(Context, unstable_observedBits) {
	const dispatcher = resolveDispatcher();
	if (__DEV__) {
		if (unstable_observedBits !== undefined) {
		  console.error(
			'useContext() second argument is reserved for future ' +
			  'use in React. Passing it is not supported. ' +
			  'You passed: %s.%s',
			unstable_observedBits,
			typeof unstable_observedBits === 'number' && Array.isArray(arguments[2])
			  ? '\n\nDid you call array.map(useContext)? ' +
				  'Calling Hooks inside a loop is not supported. ' +
				  'Learn more at https://fb.me/rules-of-hooks'
			  : '',
		  );
		}
	
		// TODO: add a more generic warning for invalid values.
		if ((Context: any)._context !== undefined) {
		  const realContext = (Context: any)._context;
		  // Don't deduplicate because this legitimately causes bugs
		  // and nobody should be using this in existing code.
		  if (realContext.Consumer === Context) {
			console.error(
			  'Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be ' +
				'removed in a future major release. Did you mean to call useContext(Context) instead?',
			);
		  } else if (realContext.Provider === Context) {
			console.error(
			  'Calling useContext(Context.Provider) is not supported. ' +
				'Did you mean to call useContext(Context) instead?',
			);
		  }
		}
	  }
	return dispatcher.useContext(Context, unstable_observedBits);
}

/** 
 * @param {function}
 * @returns 
*/
export function useState(intialSate) {
	const dispatcher = resolveDispatcher();

	return dispatcher.useState(intialSate)
}

/**
 * @param {function} reducer (state, action) => newstate
 * @returns {[state, dispatch]}
 */
export function useReducers(reducer, intialArg, init) {
	const dispatcher = resolveDispatcher();

	return dispatcher.useReducers(reducer, intialArg, init)
}

/**
 * 
 * @param {Object} initailValue  {current: null}
 */
export function useRef(initailValue) {
	const dispatcher = resolveDispatcher();
	return dispatcher.useRef(initailValue)
}


export function useEffect(create, deps) {
	const dispatcher = resolveDispatcher();

	return dispatcher.useEffect(create, deps);
}

export function useLayoutEffect(create, deps) {
	const dispatcher = resolveDispatcher();
	return dispatcher.useLayoutEffect(create, deps);
}

export function useCallback(callback, deps ){
	const dispatcher = resolveDispatcher();
	return dispatcher.useCallback(callback, deps);
  }

export function useMemo(create, deps) {
	const dispatcher = resolveDispatcher();
  return dispatcher.useMemo(create, deps);
}

export function useImperativeHandle(ref, create, deps) {
	const dispatcher = resolveDispatcher();
  return dispatcher.useImperativeHandle(ref, create, deps);
}


export function useDebugValue(value, formatterFn) {
	if (__DEV__) {
		const dispatcher = resolveDispatcher();
		return dispatcher.useDebugValue(value, formatterFn);
	}
}

export const emptyObject = {};

// https://zh-hans.reactjs.org/docs/concurrent-mode-reference.html#usetransition
export function useResponder(responder, listenerProps) {
	const dispatcher = resolveDispatcher();
	if (__DEV__) {
		if (responder == null || responder.$$typeof !== REACT_RESPONDER_TYPE) {
		  console.error(
			'useResponder: invalid first argument. Expected an event responder, but instead got %s',
			responder,
		  );
		  return;
		}
	  }
  return dispatcher.useResponder(responder, listenerProps || emptyObject);
}

export function useTransition(config) {
	const dispatcher = resolveDispatcher();
  return dispatcher.useTransition(config);
}

export function useDefrredValue(value, config) {
	const dispatcher = resolveDispatcher();
  return dispatcher.useDeferredValue(value, config);
}

export function useImperativeHandle(ref, create, deps) {
	const dispatcher = resolveDispatcher();
  return dispatcher.useImperativeHandle(ref, create, deps);
}

export function useImperativeHandle(ref, create, deps) {
	const dispatcher = resolveDispatcher();
  return dispatcher.useImperativeHandle(ref, create, deps);
}

export function useOpaqueIdentifier() {
	const dispatcher = resolveDispatcher();
	return dispatcher.useOpaqueIdentifier();
}

export function useMutableSource(
	source,
	getSnapshot,
	subscribe
  ){
	const dispatcher = resolveDispatcher();
	return dispatcher.useMutableSource(source, getSnapshot, subscribe);
  }
