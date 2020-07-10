import {REACT_SCOPE_TYPE} from 'shared/ReactSymbols';

export function createScope() {
  const scopeComponent = {
    $$typeof: REACT_SCOPE_TYPE,
  };
  if (__DEV__) {
    Object.freeze(scopeComponent);
  }
  return scopeComponent;
}
