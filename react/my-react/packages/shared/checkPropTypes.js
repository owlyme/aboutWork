const loggedTypeFailures = {};

// 报错提示
import {describeUnknownElementTypeFrameInDEV} from "./ReactComponentStackFrame"

import ReactSharedInternals from './ReactSharedInternals';

const ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;

function setCurrentValidatingElement(element) {
	if (__DEV__) {
		if (element) {
			const owner = element._owner;
			const statck = describeUnknownElementTypeFrameInDEV(
				element.type,
				element._source,
				owner ? owner.type : null
			);
			ReactDebugCurrentFrame.setExtraStackFrame(statck);
		} else {
			ReactDebugCurrentFrame.setExtraStackFrame(null);
		}
	}
}


export default function checkPropTypes(type) {

}


