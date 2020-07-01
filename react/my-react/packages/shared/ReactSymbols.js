export let REACT_ELEMENT_TYPE = 0xeac7;
export let REACT_PROTAL_TYPE = 0xeaca;


const MAYBE_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
const FAUX_ITERATOR_SYMBOL = '@@iterator';

export function getIteratorFn(maybeIterable) {
	if (maybeIterable === null || typeof maybeIterable !== "object") {
		return null
	}

	const maybeIterator =  (MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL]) ||
	maybeIterable[FAUX_ITERATOR_SYMBOL];
	if (typeof maybeIterator === 'function') {
		return maybeIterator;
	}
	return null;
}

