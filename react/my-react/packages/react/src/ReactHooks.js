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

	return dispatcher.useContext(Context, unstable_observedBits);
} 