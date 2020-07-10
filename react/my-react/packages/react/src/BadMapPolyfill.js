export let hasBadMapPolyfill;


if (__DEV__) {
	hasBadMapPolyfill = false;
	try {
	  const frozenObject = Object.freeze({});
	  /* eslint-disable no-new */
	  new Map([[frozenObject, null]]);
	  new Set([frozenObject]);
	  /* eslint-enable no-new */
	} catch (e) {
	  // TODO: Consider warning about bad polyfills
	  hasBadMapPolyfill = true;
	}
  }