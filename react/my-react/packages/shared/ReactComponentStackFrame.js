import {enableComponentStackLocations} from './shared/ReactFeatureFlags';

import {
	REACT_SUSPENSE_TYPE,
	REACT_SUSPENSE_LIST_TYPE,
	REACT_FORWARD_REF_TYPE,
	REACT_MEMO_TYPE,
	REACT_BLOCK_TYPE,
	REACT_LAZY_TYPE,
  } from './shared/ReactSymbols';

import {disableLogs, reenableLogs} from 'shared/ConsolePatchingDev';

import ReactSharedInternals from './shared/ReactSharedInternals';

const {ReactCurrentDispatcher} = ReactSharedInternals;

let prefix;

/**
 * 
 * @param {string} name 
 * @param {object} source 
 * @param {function} ownerFn 
 */
export function describeBuiltInComponentFrame(name, source, ownerFn) {
	if (enableComponentStackLocations) {
		if (prefix === undefined) {
			try {
				throw Error();
			} catch (x) {
				const macth = x.stack.trim().match(/\n( *(at )?)/);
				prefix = (match && match[1]) || '';
			}
		}
		// We use the prefix to ensure our stacks line up with native stack frames.
		return '\n' + prefix + name;
	} else {
		let ownerName = null;
		if (__DEV__ && ownerFn) {
			ownerName = ownerFn.displayName || ownerFn.name || null;
		}
		return describeComponentFrame(name, source, ownerName);
	}
}

export function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
	if (!__DEV__) {
		return '';
	  }
	  if (type == null) {
		return '';
	  }

	// 各种提示情况的判断
	
	return ""
}

