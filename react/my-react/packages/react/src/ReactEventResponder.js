import {REACT_RESPONDER_TYPE} from '../../shared/ReactSymbols';
import {hasBadMapPolyfill} from './BadMapPolyfill';

export function createEventResponder(displayName, responderConfig) {
	const {
		getInitialState,
		onEvent,
		onMount,
		onUnmout,
		onRootEvent,
		rootEventTypes,
		targetEventTypes,
		targetPortalPropagtion
	} = responderConfig;

	const eventResponder = {
		$$typeof: REACT_RESPONDER_TYPE,
		displayName,
		getInitialState: getInitialState || null,
		onEvent: onEvent || null,
		onMount: onMount || null,
		onRootEvent: onRootEvent || null,
		onUnmount: onUnmount || null,
		rootEventTypes: rootEventTypes || null,
		targetEventTypes: targetEventTypes || null,
		targetPortalPropagation: targetPortalPropagation || false,
	};

	if (__DEV__ && !hasBadMapPolyfill) {
		Object.freeze(eventResponder);
	  }
	return eventResponder;
}