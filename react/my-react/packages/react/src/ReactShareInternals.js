import assign from 'object-assign';
import ReactCurrentDispatcher from './ReactCurrentDispatcher';
import ReactCurrentBatchConfig from './ReactCurrentBatchConfig';
import ReactCurrentOwner from './ReactCurrentOwner';
import ReactDebugCurrentFrame from './ReactDebugCurrentFrame';
import IsSomeRendererActing from './IsSomeRendererActing';

const ReactSharedInternals = {
	ReactCurrentDispatcher,
	ReactCurrentBatchConfig,
	ReactCurrentOwner,
	IsSomeRendererActing,
	// Used by renderers to avoid bundling object-assign twice in UMD bundles:
	assign,
  };
  if (__DEV__) {
	ReactSharedInternals.ReactDebugCurrentFrame = ReactDebugCurrentFrame;
  }

export default ReactSharedInternals;