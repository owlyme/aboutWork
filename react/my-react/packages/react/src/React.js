import ReactVersion from "../../shared/ReactVersion";

import {
	REACT_FRAGMENT_TYPE,
	REACT_DEBUG_TRACTING_MODE_TYPE,
	REACT_PROFILER_TYPE,
	REACT_STRICT_MODE_TYPE,
	REACT_SUSPENSE_TYPE,
	REACT_SUSPENSE_LIST_TYPE,
	REACT_LEGACY_HIDDEN_TYPE
} from "../../shared/ReactSymoble";

import { Component, PureComponent } from "./ReactBaseClasses";
import { createRef } from  "./ReactCreateRef";
import {forEach, map, count, toArray, only} from './ReactChildren';

import {
	createElement as createElementProd,
	createFactory as createFactoryProd,
	cloneElement as cloneElementProd,
	isValidElement,
} from "./ReactElement"
import {createContext} from './ReactContext';
import {lazy} from './ReactLazy';
