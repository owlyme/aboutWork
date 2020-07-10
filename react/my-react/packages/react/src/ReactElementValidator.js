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
import {describeUnknownElementTypeFrameInDEV} from 'shared/ReactComponentStackFrame';

function setCurrentlyValidatingElement(element) {
  if (__DEV__) {
    if (element) {
      const owner = element._owner;
      const stack = describeUnknownElementTypeFrameInDEV(
        element.type,
        element._source,
        owner ? owner.type : null,
      );
      setExtraStackFrame(stack);
    } else {
      setExtraStackFrame(null);
    }
  }
}
let propTypesMisspellWarnningShow;

if (__DEV__) {
  propTypesMisspellWarningShown = false;
}
const hasOwnProperty = Object.prototype.hasOwnProperty;

function getDeclarationErrorAddendum() {
  if (ReactCurrentOwner.current) {
    const name = getComponentName(ReactCurrentOwner.current.type);
    if (name) {
      return '\n\nCheck the render method of `' + name + '`.';
    }
  }
  return '';
}

function getSourceInfoErrorAddendum(source) {
  if (source !== undefined) {
    const fileName = source.fileName.replace(/^.*[\\\/]/, '');
    const lineNumber = source.lineNumber;
    return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
  }
  return '';
}

function getSourceInfoErrorAddendumForProps(elementProps) {
  if (elementProps !== null && elementProps !== undefined) {
    return getSourceInfoErrorAddendum(elementProps.__source);
  }
  return '';
}

const ownerHasKeyWarning = {};
// 如果没有在子代动态数组上显式设置的键或对象键无效，则发出警告。 这使我们可以跟踪两次更新之间的子项。
function getCurrrentComponentErrorInfo(parentType) {
  let info = getDeclarationErrorAddendum();

  if (!info) {
    const parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;
    if (parentName) {
      info = `\n\nCheck the top-level render call using <${parentName}>.`;
    }
  }

  return info;
}


// 
function validateExplicitKey(element, parentType) {
  if (!element._store || element._store.validated || element.key != null) {
    return;
  }
  element._store.validated = true;
  
  const currentComponentErrorInfo = getCurrrentComponentErrorInfo(parentType);
  if (ownerHasKeyWarning[currentComponentErrorInfo]) {
    return;
  }
  ownerHasKeyUseWarning[currentComponentErrorInfo] = true;
  
  let childOwner = '';
  if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
    childOwner = ` It was passed a child from ${getComponentName(
      element._owner.type,
    )}.`;
  }

  if (__DEV__) {
    setCurrentlyValidatingElement(element);
    console.error(
      'Each child in a list should have a unique "key" prop.' +
        '%s%s See https://fb.me/react-warning-keys for more information.',
      currentComponentErrorInfo,
      childOwner,
    )
  }
}


// 确保每个元素都在静态位置，定义了显式键属性的数组中或在具有有效键属性的对象文字中传递。
function validateChildKeys(node, parentType) {
  if (typeof node !== 'object') {
    return;
  }

  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) {
      const child = node[i];
      if (isValidElement(child)) {
        validateExplicitKey(child, parentType);
      }
    }
  } else if (isValidElement(node)) {
    if (node._store) {
      node._store.validated = true;
    }
  } else if (node) {
    const iteatorFn = getIteratorFn(node);
    if (typeof iteratorFn ==='function') {
      if (iteratorFn !== node.entries) {
        const iterator = iteratorFn.call(node);
        let step;
        while (!(step = iterator.next()).done) {
          if (isValidElement(step.value)) {
            validateExplicitKey(step.value, parentType);
          }
        }
      }
    }
  }
}

function validatePropTypes(element) {
  if (__DEV__) {
    const type = element.type;
    if (type === null || type === undefined || typeof type === "string") {
      return;
    }
    const name = getComponentName(type);
    let propTypes;
    if (typeof type === "function") {
      propTypes = type.propTypes;
    } else if (
      typeof type === 'object' &&
      (
        type.$$typeof === REACT_FORWARD_REF_TYPE ||
        type.$$typeof === REACT_MEMO_TYPE
      )
    ) {
      propTypes = type.propTypes
    } else {
      return;
    }

    if (propTypes) {
      checkPropTypes(propTypes, element.props, 'prop', name, element);
    } else if (type.PropTypes !== undefined && !propTypesMisspellWarnningShow) {
      propTypesMisspellWarningShown = true;
      console.error(
        'Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?',
        name || 'Unknown',
      )
    } 
    if (
      typeof type.getDefaultProps === 'function' && 
      !type.getDefaultProps.isReactClassApproved
    ) {
      console.error(
        'getDefaultProps is only used on classic React.createClass ' +
          'definitions. Use a static property named `defaultProps` instead.',
      );
    }
  }
}

function validateFramentProps(fragment) {
  if (__DEV__) {
    const keys = Object.keys(fragment.props);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key !== 'children' && key !== 'key') {
        setCurrentlyValidatingElement(fragment);
        console.error(
          'Invalid prop `%s` supplied to `React.Fragment`. ' +
              'React.Fragment can only have `key` and `children` props.',
            key,
        )
        setCurrentlyValidatingElement(null);
      }
    }

    if (fragment.ref !== null) {
      setCurrentlyValidatingElement(fragment);
      console.error('Invalid attribute `ref` supplied to `React.Fragment`.');
      setCurrentlyValidatingElement(null);
    }
  }
}

export function jsxWithValidation(
  type,
  props,
  key,
  isStaticChildren,
  source,
  self,
) {
  if (__DEV__) {
    const validType = isValidElementType(type);
    
    if (!validType) {
      let info = '';
      if (
        type === undefined ||
        (
          typeof type === 'object' &&
          type !== null &&
          Object.keys(type).length === 0
        )
      ) {
        info +=  ' You likely forgot to export your component from the file ' +
        "it's defined in, or you might have mixed up default and named imports.";
      }
    }
    
    const sourceInfo = getSourceInfoErrorAddendum(source);
    if (sourceInfo) {
      info += sourceInfo;
    } else {
      info += getDeclarationErrorAddendum();
    }

    let typeString;
    if (type === null) {
      typeString = "null";
    } else if (Array.isArray(type)) {
      typeString = 'array';
    } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
      typeString = `<${getComponentName(type.type) || "Unknow"} /> `;
      info = ' Did you accidentally export a JSX literal instead of a component?'
    } else {
      typeString = typeof type;
    }
    
    console.error(
      'React.jsx: type is invalid -- expected a string (for ' +
        'built-in components) or a class/function (for composite ' +
        'components) but got: %s.%s',
      typeString,
      info,
    );
    
    const element = jsxDEV(type, props, key, source, self);
    if (element == null) {
      return element;
    }
  
    if (validType) {
      const children = props.children;
      if (children !== undefined) {
        if (isStaticChildren) {
          if (Array.isArray(children)) {
            for (let i = 0; i < children.length; i++) {
              validateChildKeys(children[i], type);
            }

            if (Object.freeze) {
              Object.freeze(children);
            }
          } else {
            console.error(
              'React.jsx: Static children should always be an array. ' +
                'You are likely explicitly calling React.jsxs or React.jsxDEV. ' +
                'Use the Babel transform instead.',
            );
          }
        } else {
          validateChildKeys(children, type);
        }
      }
    }

    if (warnAboutSpreadingKeyToJSX) {
      if (hasOwnProperty.call(props, 'key')) {
        console.error(
          'React.jsx: Spreading a key to JSX is a deprecated pattern. ' +
            'Explicitly pass a key after spreading props in your JSX call. ' +
            'E.g. <%s {...props} key={key} />',
          getComponentName(type) || 'ComponentName',
        );
      }
    }

    if (type === REACT_FRAGMENT_TYPE) {
      validateFragmentProps(element);
    } else {
      validatePropTypes(element);
    }

    return element
  }
}

export function jsxWithValidationStatic(type, props, key) {
  if (__DEV__) {
    return jsxWithValidation(type, props, key, true);
  }
}

export function jsxWithValidationDynamic(type, props, key) {
  if (__DEV__) {
    return jsxWithValidation(type, props, key, false);
  }
}

export function createElementWithValidation(type, props, children) {
  const validType = isValidElementType(type);

  if (!validType) {
    let info = '';
    if(
      type === undefined ||
      (typeof type === 'object' &&
        type !== null &&
        Object.keys(type).length === 0)
      ) {
        info +=
        ' You likely forgot to export your component from the file ' +
        "it's defined in, or you might have mixed up default and named imports.";
    }

    const sourceInfo = getSourceInfoErrorAddendumForProps(props);
    if (sourceInfo) {
      info += sourceInfo
    } else {
      info += getDeclarationErrorAddendum()
    }

    
    let typeString;
    if (type === null) {
      typeString = 'null';
    } else if (Array.isArray(type)) {
      typeString = 'array';
    } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
      typeString = `<${getComponentName(type.type) || 'Unknown'} />`;
      info =
        ' Did you accidentally export a JSX literal instead of a component?';
    } else {
      typeString = typeof type;
    }

    if (__DEV__) {
      console.error(
        'React.createElement: type is invalid -- expected a string (for ' +
          'built-in components) or a class/function (for composite ' +
          'components) but got: %s.%s',
        typeString,
        info,
      );
    }
  }
  const element = createElement.apply(this, arguments);
  if (element == null) {
    return element;
  }

  if (validType) {
    for (let i = 2; i < arguments.length; i++) {
      validateChildKeys(arguments[i], type)
    } 
  }

  if (type === REACT_FRAGMENT_TYPE) {
    validateFramentProps(element);
  } else {
    validatePropTypes(element);
  }

  return element

}

let didWarnAboutDeprecatedCreateFactory = false;

export function createFactoryWithValidation(type) {
  const validatedFactory = createElementWithValidation.bind(null, type);
  validatedFactory.type = type;
  if (__DEV__) {
    if (!didWarnAboutDeprecatedCreateFactory) {
      didWarnAboutDeprecatedCreateFactory = true;
      console.warn(
        'React.createFactory() is deprecated and will be removed in ' +
          'a future major release. Consider using JSX ' +
          'or use React.createElement() directly instead.',
      );
    }
    // Legacy hook: remove it
    Object.defineProperty(validatedFactory, 'type', {
      enumerable: false,
      get: function() {
        console.warn(
          'Factory.type is deprecated. Access the class directly ' +
            'before passing it to createFactory.',
        );
        Object.defineProperty(this, 'type', {
          value: type,
        });
        return type;
      },
    });
  }

  return validatedFactory;
}


export function cloneElementWithValidation(element, props, children) {
  const newElement = cloneElement.apply(this, arguments);
  for (let i = 2; i < arguments.length; i++) {
    validateChildKeys(arguments[i], newElement.type);
  }
  validatePropTypes(newElement);
  return newElement;
}