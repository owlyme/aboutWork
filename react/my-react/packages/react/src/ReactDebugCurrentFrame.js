const ReactDebugCurrentFrame = {};
let currentExtraStackFrame = null;

export function setExtraStackFrame(stack) {
	if (__DEV__) {
		currentExtraStackFrame = stack;
	}
}

if (__DEV__) {
	ReactDebugCurrentFrame.setExtraStackFrame = function(stack) {
		if (__DEV__) {
			currentExtraStackFrame = stack;
		}
	}
	ReactDebugCurrentFrame.getCurrentStack = null;
	ReactDebugCurrentFrame.getStackAddendum = function() {
		let stack = "";
		if (currentExtraStackFrame) {
			stack += currentExtraStackFrame;
		}
		const impl = ReactDebugCurrentFrame.getCurrentStack;
		if (impl) {
			stack += impl() || ""
		}
		return stack;
	}
}

export default ReactDebugCurrentFrame;