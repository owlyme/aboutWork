import {REACT_MEMO_TYPE} from '../../shared/ReactSymbols';
import isValidElementType from '../../shared/isValidElementType';

/**
 * 
 * @param {reactElementType} type 
 * @param {function} compare (oldProps, newProps) => boolean 
 */
export function memo( type, compare ) {	
	if (__DEV__) {
		if (!isValidElementType(type)) {
			console.error(
			  'memo: The first argument must be a component. Instead ' +
				'received: %s',
			  type === null ? 'null' : typeof type,
			);
		  }
	}

	const elementType = {
		$$typeof: REACT_MEMO_TYPE,
		type,
		compare: compare === undefined ? null : compare
	};

	if (__DEV__) {
		let ownName;
		Object.defineProperty(elementType, 'displayName', {
		  enumerable: false,
		  configurable: true,
		  get: function() {
			return ownName;
		  },
		  set: function(name) {
			ownName = name;
			if (type.displayName == null) {
			  type.displayName = name;
			}
		  },
		});
	  }

	  return elementType;
}