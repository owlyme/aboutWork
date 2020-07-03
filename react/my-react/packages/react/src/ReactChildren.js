// See https://reactjs.org/docs/react-api.html
import invariant from '../../shared/invariant';

import {
	getIteratorFn,
	REACT_ELEMENT_TYPE,
	REACT_PORTAL_TYPE,
  } from 'shared/ReactSymbols';

import {isValidElement, cloneAndReplaceKey} from './ReactElement';


const SEPARATOR = "."; // 分隔器
const SUBSEPARATOR = ";" // 子分隔符

// 做一些字符转换
function escape(string) {
	const escapeRegex = /[=:]/g;
	const escaperLookup = {
		'=': '=0',
		':': '=2',
	}
	const escapedString = key.replace(escapeRegex, function(match) {
		return escaperLookup[match];
	})

	return '$' + escapedString;
}

let didWarnAboutMaps = false;

const userProvidedKeyEscapeRegex = /\/+/g;
function escapeUserProvidedKey(text) {
  return text.replace(userProvidedKeyEscapeRegex, '$&/');
}

function getElementKey(element, index) {
	//在这里进行类型检查，因为我们盲目地称呼它。 我们要确保
   //我们不会阻止潜在的未来ES API。
   if (typeof element === 'object' && element !== null && element.key != null) {
		// Explicit key
		return escape('' + element.key);
	}
	// Implicit key determined by the index in the set
	return index.toString(36);
}
 
/**
 * @param {Array} children ReactNodeList
 * @param {array} array React$Node
 * @param {string} escapedPrefix 
 * @param {string} string
 * @param {function} callback
 */
// 将tree 变成数组
function mapIntoArray(children, array, escapedPrefix, string, callback) {
	const type = typeof children;
	
	// 这里是为什么 boolean 和 undefined 在DOM 不显示的处理
	// 不象vue 
	if (type === 'undefined' || type === 'boolean') {
		children = null
	}

	let invokeCallback = false;

	// 对不同型数据类型（子节点）的处理
	if (children === null) {
		invokeCallback = true;
	} else {
		switch (type) {	
			case 'string':
			case 'number':
				invokeCallback = true;
				break;
			case 'object': // array object
				// 判断自己点的特殊属性
				switch(children.$$typeof) {
					case REACT_ELEMENT_TYPE:
					case REACT_PORTAL_TYPE:
						invokeCallback = true;
				}
		}
	}

	if(invokeCallback) {
		const child = children;
		let mppedChild = callback(child)

		const childKey = nameSoFar === '' ? SEPARATOR + getElementKey(child, 0) : nameSoFar;

		if (Array.isArray(mppedChild)) {
			let escapedChildKey = ""
			if (childKey != null) {
				escapedChildKey = escapeUserProvidedKey(childKey) + "/";
			}
			mapIntoArray(mappedChild, array, escapedChildKey, '', c => c);
		} else if (mappedChild != null)  {
			if (isValidElement(mappedChild)) {
				mappedChild = cloneAndReplaceKey(
					mappedChild,
					escapedPrefix + 
					(mappedChild.key && (!child || child.key !== mappedChild.key)
						? escapeUserProvidedKey("" + mappedChild.key) + '/' : "" ) +
					childKey,
				)
			}

			array.push(mappedChild)
		}
		return 1
	}
	
	let child;
	let nextName;
	let subtreeCount = 0; // count of children found in the current subtree
	const nextNamePrefix = 
		nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;


	if (Array.isArray(children)) {
		for (let i = 0; i < child.length; i++) {
			child = children[i];
			nextName = nextNamePrefix + getElementKey(child, i);
			subtreeCount += mapIntoArray(
				child,
				array,
				escapedPrefix,
				nextName,
				callback
			);
		}
	} else {
		// 使用迭代遍历节点个数
		const iteratorFn = getIteratorFn(children);
		if (typeof iteratorFn === "function") {
			// guess 对源码中的ts 看不懂这段是猜想的
			const iterableChildren = {
				entries: children
			}


			if (__DEV__) {
				// Warn about using Maps as children
				if (iteratorFn === iterableChildren.entries) {
				  if (!didWarnAboutMaps) {
					console.warn(
					  'Using Maps as children is not supported. ' +
						'Use an array of keyed ReactElements instead.',
					);
				  }
				  didWarnAboutMaps = true;
				}
			  }
			const iterator = iteratorFn.call(iterableChildren);

			let step;
			let ii = 0;
			while (!(step = iterator.next()).done) {
				child = step.value;
				nextName = nextNamePrefix + getElementKey(child, ii++);
				subtreeCount += mapIntoArray(
				child,
				array,
				escapedPrefix,
				nextName,
				callback,
				);
			}

		} else if (type === 'object') {
			// 字符串加上其他 数据(data)类型是 等于 字符串+ data.toString()
			const childrenString = '' + children 
			invariant(
				false,
				'Objects are not valid as a React child (found: %s). ' +
				  'If you meant to render a collection of children, use an array ' +
				  'instead.',
				childrenString === '[object Object]'
				  ? 'object with keys {' + Object.keys(children).join(', ') + '}'
				  : childrenString,
			  );
		}
	}

	return subtreeCount
}

/**
 * Maps children that are typically specified as `props.children`.
 * The provided mapFunction(child, index) will be called for each leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} func The map function.
 * @param {*} context Context for mapFunction.
 * @return {object} Object containing the ordered map of results.
 */
// 将tree 变成 array
function mapChildren(children, func, context) {
	if (children === null) {
		return children
	}
	const result = [];
	let count = 0;
	
	mapIntoArray(childrenm, result, "", "", function(child) {
		return func.call(context, child, count++)
	})

	return result;
}

/**
 * Count the number of children that are typically specified as
 * `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrencount
 *
 * @param {?*} children Children tree container.
 * @return {number} The number of children.
 */
function countChildren(children) {
	let n = 0;
	mapChildren(children, () => {
	  n++;
	  // Don't return anything
	});
	return n;
}
/**
 * Iterates through children that are typically specified as `props.children`.
 * The provided forEachFunc(child, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} forEachFunc
 * @param {*} forEachContext Context for forEachContext.
 */
function forEachChildren(children, forEachFunc, forEachContext) {
	mapChildren(children, forEachFunc, forEachContext)
}

/**
 * Flatten a children object (typically specified as `props.children`) and
 * return an array with appropriately re-keyed children.
 */
 function toArray(children) {
	 return mapChildren(children, child => child) || []
 }


/**
 * Returns the first child in a collection of children and verifies that there
 * is only one child in the collection.
 * The current implementation of this function assumes that a single child gets
 * passed without a wrapper, but the purpose of this helper function is to
 * abstract away the particular structure of children.
 *
 * @param {?object} children Child collection structure.
 * @return {ReactElement} The first and only `ReactElement` contained in the
 * structure.
 */
function onlyChild(children) {
	invariant(
		isValidElement(children),
		'React.Children.only expected to receive a single React element child.',
	  );
	return children
}


export {
	forEachChildren as forEach,
	mapChildren as map,
	countChildren as count, 
	onlyChild as only,
	toArray
}
