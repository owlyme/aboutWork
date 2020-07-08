let disabledDepth = 0;
let prevLog;
let prevInfo;
let prevWarn;
let prevError;

function disabledLog() {};
disabledLog.__reactDisabledLog = true;

export function disableLogs() {
  if (__DEV__) {
    if (disabledDepth === 0) {
      /* eslint-disable react-internal/no-production-logging */
      prevLog = console.log;
      prevInfo = console.info;
      prevWarn = console.warn;
      prevError = console.error;
      // https://github.com/facebook/react/issues/19099
      const props = {
        configurable: true,
        enumerable: true,
        value: disabledLog,
        writable: true,
      };
      // $FlowFixMe Flow thinks console is immutable.
      Object.defineProperties(console, {
        info: props,
        log: props,
        warn: props,
        error: props,
      });
      /* eslint-enable react-internal/no-production-logging */
    }
    disabledDepth++;
  }
}

export function reenableLogs() {
  if (__DEV__) {
    disabledDepth--;
    if (disabledDepth === 0) {
      /* eslint-disable react-internal/no-production-logging */
      const props = {
        configurable: true,
        enumerable: true,
        writable: true,
      };
      // $FlowFixMe Flow thinks console is immutable.
      Object.defineProperties(console, {
        log: {...props, value: prevLog},
        info: {...props, value: prevInfo},
        warn: {...props, value: prevWarn},
        error: {...props, value: prevError},
      });
      /* eslint-enable react-internal/no-production-logging */
    }
    if (disabledDepth < 0) {
      console.error(
        'disabledDepth fell below zero. ' +
          'This is a bug in React. Please file an issue.',
      );
    }
  }
}

