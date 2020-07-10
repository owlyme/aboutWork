export function createMutableSource(source, getVersion) {
	const mutableSoruce = {
		_getVersion: getVersion,
		_source: source,
		_workInProgressVersionPrimary: null,
		_workInProgressVersionSecondary: null
	}

	if (__DEV__) {
		mutableSource._currentPrimaryRenderer = null;
		mutableSource._currentSecondaryRenderer = null;
	}

	return mutableSoruce;
}