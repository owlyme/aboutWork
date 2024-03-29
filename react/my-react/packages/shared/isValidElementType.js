import {
	REACT_CONTEXT_TYPE,
	REACT_FORWARD_REF_TYPE,
	REACT_FRAGMENT_TYPE,
	REACT_PROFILER_TYPE,
	REACT_PROVIDER_TYPE,
	REACT_DEBUG_TRACING_MODE_TYPE,
	REACT_STRICT_MODE_TYPE,
	REACT_SUSPENSE_TYPE,
	REACT_SUSPENSE_LIST_TYPE,
	REACT_MEMO_TYPE,
	REACT_LAZY_TYPE,
	REACT_FUNDAMENTAL_TYPE,
	REACT_RESPONDER_TYPE,
	REACT_SCOPE_TYPE,
	REACT_BLOCK_TYPE,
	REACT_SERVER_BLOCK_TYPE,
	REACT_LEGACY_HIDDEN_TYPE,
  } from './shared/ReactSymbols';

/**
 * 
 * @param {any} type
 * @returns boolean 
 */
export default function isValidElementType(type) {
	return (
		typeof type === 'string' ||
		typeof type === 'function' ||
		// Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
		type === REACT_FRAGMENT_TYPE ||
		type === REACT_PROFILER_TYPE ||
		type === REACT_DEBUG_TRACING_MODE_TYPE ||
		type === REACT_STRICT_MODE_TYPE ||
		type === REACT_SUSPENSE_TYPE ||
		type === REACT_SUSPENSE_LIST_TYPE ||
		type === REACT_LEGACY_HIDDEN_TYPE ||
		(
			typeof type === 'object' && type !== null &&
			(
				type.$$typeof === REACT_LAZY_TYPE ||
				type.$$typeof === REACT_MEMO_TYPE ||
				type.$$typeof === REACT_PROVIDER_TYPE ||
				type.$$typeof === REACT_CONTEXT_TYPE ||
				type.$$typeof === REACT_FORWARD_REF_TYPE ||
				type.$$typeof === REACT_FUNDAMENTAL_TYPE ||
				type.$$typeof === REACT_RESPONDER_TYPE ||
				type.$$typeof === REACT_SCOPE_TYPE ||
				type.$$typeof === REACT_BLOCK_TYPE ||
				type[0] === REACT_SERVER_BLOCK_TYPE
			)
		)
	)
}