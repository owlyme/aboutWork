// import type {
// 	ReactFundamentalImpl,
// 	ReactFundamentalComponent,
//   } from 'shared/ReactTypes';
import {REACT_FUNDAMENTAL_TYPE} from '../../shared/ReactSymbols';
import {hasBadMapPolyfill} from './BadMapPolyfill';


export function createFundament(impl) {
	if (__DEV__ && !hasBadMapPolyfill) {
		Object.freeze(impl);
	}
	const fundamentalComponent = {
		$$typeof: REACT_FUNDAMENTAL_TYPE,
		impl,
	};
	if (__DEV__) {
		Object.freeze(fundamentalComponent);
	}
	return fundamentalComponent;
}