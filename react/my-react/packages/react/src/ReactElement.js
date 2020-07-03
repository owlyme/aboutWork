import getComponentName from '../../shared/getComponentName'; // undo
import invariant from '../../shared/invariant';
import {REACT_ELEMENT_TYPE} from '../../shared/ReactSymbols';

import ReactCurrentOwner from './ReactCurrentOwner';  // undo

const hasOwnProperty = Object.prototype.hasOwnProperty;

// 保留字
const RESERVED_PROPS= {
	key: true,
	ref: true,
	__self: true,
	__source: true
}

// 一些报警辅助
let specialPropKeyWarningShown,
	specialPropRefWaringShown,
	didWarnAboutStringRefs;

if (__DEV__) {
	didWarnAboutStringRefs = {};
}

function hasValidRef(config) {
  if (__DEV__) {
    if (hasOwnProperty.call(config, 'ref')) {
      const getter = Object.getOwnPropertyDescriptor(config, 'ref').get;
      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }
  return config.ref !== undefined;
}

function hasValidKey(config) {
  if (__DEV__) {
    if (hasOwnProperty.call(config, 'key')) {
      const getter = Object.getOwnPropertyDescriptor(config, 'key').get;
      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }
  return config.key !== undefined;
}

function defineKeyPropWarningGetter(props, displayName) {
  const warnAboutAccessingKey = function() {
    if (__DEV__) {
      if (!specialPropKeyWarningShown) {
        specialPropKeyWarningShown = true;
        console.error(
          '%s: `key` is not a prop. Trying to access it will result ' +
            'in `undefined` being returned. If you need to access the same ' +
            'value within the child component, you should pass it as a different ' +
            'prop. (https://fb.me/react-special-props)',
          displayName,
        );
      }
    }
  };
  warnAboutAccessingKey.isReactWarning = true;
  Object.defineProperty(props, 'key', {
    get: warnAboutAccessingKey,
    configurable: true,
  });
}

function defineRefPropWarningGetter(props, displayName) {
  const warnAboutAccessingRef = function() {
    if (__DEV__) {
      if (!specialPropRefWarningShown) {
        specialPropRefWarningShown = true;
        console.error(
          '%s: `ref` is not a prop. Trying to access it will result ' +
            'in `undefined` being returned. If you need to access the same ' +
            'value within the child component, you should pass it as a different ' +
            'prop. (https://fb.me/react-special-props)',
          displayName,
        );
      }
    }
  };
  warnAboutAccessingRef.isReactWarning = true;
  Object.defineProperty(props, 'ref', {
    get: warnAboutAccessingRef,
    configurable: true,
  });
}

function warnIfStringRefCannotBeAutoConverted(config) {
  if (__DEV__) {
    if (
      typeof config.ref === 'string' &&
      ReactCurrentOwner.current &&
      config.__self &&
      ReactCurrentOwner.current.stateNode !== config.__self
    ) {
      const componentName = getComponentName(ReactCurrentOwner.current.type);

      if (!didWarnAboutStringRefs[componentName]) {
        console.error(
          'Component "%s" contains the string ref "%s". ' +
            'Support for string refs will be removed in a future major release. ' +
            'This case cannot be automatically converted to an arrow function. ' +
            'We ask you to manually fix this case by using useRef() or createRef() instead. ' +
            'Learn more about using refs safely here: ' +
            'https://fb.me/react-strict-mode-string-ref',
          componentName,
          config.ref,
        );
        didWarnAboutStringRefs[componentName] = true;
      }
    }
  }
}

const ReactElement = function(type, key, ref, self, source, owner, props) {
	const element = {
		$$typeof: REACT_ELEMENT_TYPE, // react Element 标识符
		// Built-in properties that belong on the element
		type,
		key, 
		ref,
		props,
		// Record the component responsible for creating this element
		_owner: owner,
	};

	if (__DEV__) {
		// 这一段代码可以不看
		// 证标志当前是可变的。 我们将其放在外部后备存储上，以便冻结整个对象。 在常用的开发环境中实现后，可以用WeakMap替换它。
		element._store = {};

		// 为了使ReactElement的比较更容易用于测试目的，我们使验证标志不可枚举（在可能的情况下，它应该包括我们在其中运行测试的每个环境），因此测试框架将忽略它。
		Object.defineProperty(element._store, 'validated', {
			configurable: false,
			enumerable: false,
			writable: true,
			value: false,
		  });

		// self and source are DEV only properties.
		Object.defineProperty(element, '_self', {
			configurable: false,
			enumerable: false,
			writable: false,
			value: self,
      });
    //  为了测试目的，在两个不同位置创建的两个元素应被视为相等，因此我们将其隐藏起来，以免枚举。
    Object.defineProperty(element, '_source', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: source,
    });

    if (Object.freeze) {
      Object.freeze(element.props);
      Object.freeze(element);
    }
	}


	return element
}

/**
 * https://github.com/reactjs/rfcs/pull/107
 * @param {*} type
 * @param {object} props
 * @param {string} key
 */
export function jsx(type, config, maybeKey) {
  let propName;
  const props = {};

  // Reserved names are extracted
  let key = null;
  let ref = null;

  // Currently, key can be spread in as a prop. This causes a potential
  // issue if key is also explicitly declared (ie. <div {...props} key="Hi" />
  // or <div key="Hi" {...props} /> ). We want to deprecate key spread,
  // but as an intermediary step, we will use jsxDEV for everything except
  // <div {...props} key="Hi" />, because we aren't currently able to tell if
  // key is explicitly declared to be undefined or not.
  if (maybeKey !== undefined) {
    key = '' + maybeKey
  }

  if (hasValidKey(config)) {
    key = '' + config.key
  }

  if (hasValidRef(config)) {
    ref = config.ref
  }

  // Remaining properties are added to a new props object
  // 相当与将props 浅拷贝一下，防止子组件对父组件的影响
  for (propName in config) {
    if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
      props[propName] = config[propName]
    }
  }

  // Resolve default props
  // 保留组件初始化的props 默认值
  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;
    for (propName in defaultProps)  {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName]
      }
    }
  }

  return ReactElement(
    type,
    key, 
    ref,
    undefined, // self
    undefined, // source
    ReactCurrentOwner.current, // owner
    props
  )
}

/**
 * https://github.com/reactjs/rfcs/pull/107
 * @param {*} type
 * @param {object} props
 * @param {string} key
 */

 export function jsxDEV(type, config, maybeKey, source, self) {
  let propName;
  const props = {};

  // Reserved names are extracted
  let key = null;
  let ref = null;

  // Currently, key can be spread in as a prop. This causes a potential
  // issue if key is also explicitly declared (ie. <div {...props} key="Hi" />
  // or <div key="Hi" {...props} /> ). We want to deprecate key spread,
  // but as an intermediary step, we will use jsxDEV for everything except
  // <div {...props} key="Hi" />, because we aren't currently able to tell if
  // key is explicitly declared to be undefined or not.
  if (maybeKey !== undefined) {
    key = '' + maybeKey
  }

  if (hasValidKey(config)) {
    key = '' + config.key
  }

  if (hasValidRef(config)) {
    ref = config.ref
  }

  // Remaining properties are added to a new props object
  // 相当与将props 浅拷贝一下，防止子组件对父组件的影响
  for (propName in config) {
    if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
      props[propName] = config[propName]
    }
  }

  // Resolve default props
  // 保留组件初始化的props 默认值
  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;
    for (propName in defaultProps)  {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName]
      }
    }
  }

  if (key || ref) {
    const displayName = typeof type === 'function' ?
      type.displayName || type.name || 'Unkown' :
      type

    if (key) {
      defineKeyPropWarningGetter(props, displayName);
    }
    if (ref) {
      defineRefPropWarningGetter(props, displayName);
    }
  }

  return ReactElement(
    type,
    key, 
    ref,
    self,
    source,
    ReactCurrentOwner.current, // owner
    props
  )
}

/**
 * Create and return a new ReactElement of the given type.
 * See https://reactjs.org/docs/react-api.html#createelement
 */
export function createElement(type, config, children) {
  let propName;
  const porps = {};

  let key = null;
  let ref = null;
  let self = null;
  let source = null;

  // null != undefined => false
  if (config != null) { 
    if (hasValidRef(config)) {
      ref = config.ref
      if (__DEV__) {
        warnIfStringRefCannotBeAutoConverted(config);
      }
    }

    if (hasValidKey(config)) {
      key = "" + config.key
    }

    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null: config.__source;

    // Remaining properties are added to a new props object
    for (propName in config) {
      if (hasOwnProperty.call(config, propName)
        && !RESERVED_PROPS.hasOwnProperty(propName)) {
          porps[propName] = config[propName]
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  const childrenLength = arguments.length -2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength.length > 1) {
    const childArray = Array(childrenLength);
    for (let i = 0; i < childrenLength; i ++) {
      childArray[i] = arguments[i + 2];
    }
    if (__DEV__) {
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }
    props.children = childArray;
  }

  // Resolve default props
  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName]
      }
    }
  }

  if (__DEV__) {
    if (key || ref) {
      const displayName =
        typeof type === 'function'
          ? type.displayName || type.name || 'Unknown'
          : type;
      if (key) {
        defineKeyPropWarningGetter(props, displayName);
      }
      if (ref) {
        defineRefPropWarningGetter(props, displayName);
      }
    }
  }

  return ReactElement(
    type, 
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props
  )
}

/**
 * Return a function that produces ReactElements of a given type.
 * See https://reactjs.org/docs/react-api.html#createfactory
 */

export function createFactory(type) {
  const factory = createElement.bind(null, type);
  // Expose the type on the factory and the prototype so that it can be
  // easily accessed on elements. E.g. `<Foo />.type === Foo`.
  // This should not be named `constructor` since this may not be the function
  // that created the element, and it may not even be a constructor.
  // Legacy hook: remove it
  factory.type = type;

  return factory;
}

export function cloneAndReplaceKey(oldElement, newKey) {
  const newElement = ReactElement(
      oldElement.type, 
      newKey,
      oldElement.ref,
      oldElement._self,
      oldElement._source,
      oldElement._owner, 
      oldElement.props
  )

  return newElement;
}

export function cloneElement(element, config, children) {
  invariant(
    !(element === null || element === undefined),
    'React.cloneElement(...): The argument must be a React element, but you passed %s.',
    element,
  );
  let propName;

  const props = Object.assign({}, element.props);

  let key = element.key;
  let ref = element.ref;
  let self = element._self;
  let source = element._source;
  let owner = element._owner  

  if (config != null) {
    if (hasValidRef(config)) {
      // Silently steal the ref from the parent.
      ref = config.ref;
      owner = ReactCurrentOwner.current;
    }
    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    let defaultProps;
    if (element.type && element.type.defaultProps) {
      defaultProps = element.type.defaultProps
    }
    for (propName in config ) {
      if (hasOwnProperty.call(config. propName) && !RESERVED_PROPS[propName]) {
        if (config[propName] === undefined && defaultProps !== undefined) {
          props[propName] = defaultProps[propName]
        } else {
          props[propName] = config[propName]
        }
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  const childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children
  } else {
    const childArray = Array(childrenLength);
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[2 + i]
    }
    props.children = childArray
  }


  return ReactElement(element.type, key, ref, self, source, owner, props)

}

export function isValidElement(object) {
  return (
    typeof object === "object" &&
    object !== null &&
    object.$$typeof === REACT_ELEMENT_TYPE
  )
}

