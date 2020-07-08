import isValidElementType from '../../shared/isValidElementType';
import getComponentName from '../../shared/getComponentName';\
import {
	getIteratorFn,
	REACT_FORWARD_REF_TYPE,
	REACT_MEMO_TYPE,
	REACT_FRAGMENT_TYPE,
	REACT_ELEMENT_TYPE,
  } from '../../shared/ReactSymbols';
import {warnAboutSpreadingKeyToJSX} from 'shared/ReactFeatureFlags';
import checkPropTypes from 'shared/checkPropTypes';
import ReactCurrentOwner from './ReactCurrentOwner';
import {
	isValidElement,
	createElement,
	cloneElement,
	jsxDEV,
  } from './ReactElement'; 

import {setExtraStackFrame} from './ReactDebugCurrentFrame';



