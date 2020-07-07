import ReactCurrentBatchConfig from "./ReactCurrentBatchConfig"

// Within the scope of the callback, mark all updates as being allowed to suspend.
export function withSuspenseConfig(scope, config) {
	const previousConfig = ReactCurrentBatchConfig.suspense;
	ReactCurrentBatchConfig.suspense = config === undefined ? null : config;
	try {
		scope();
	} finally {
		ReactCurrentBatchConfig.suspense = previousConfig;
	}
}
  