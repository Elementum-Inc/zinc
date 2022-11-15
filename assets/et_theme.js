const scriptRel = "modulepreload";
const assetsURL = function(dep, importerUrl) {
  return dep.startsWith(".") ? new URL(dep, importerUrl).href : dep;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  if (!deps || deps.length === 0) {
    return baseModule();
  }
  const links = document.getElementsByTagName("link");
  return Promise.all(deps.map((dep) => {
    dep = assetsURL(dep, importerUrl);
    if (dep in seen)
      return;
    seen[dep] = true;
    const isCss = dep.endsWith(".css");
    const cssSelector = isCss ? '[rel="stylesheet"]' : "";
    const isBaseRelative = !!importerUrl;
    if (isBaseRelative) {
      for (let i2 = links.length - 1; i2 >= 0; i2--) {
        const link2 = links[i2];
        if (link2.href === dep && (!isCss || link2.rel === "stylesheet")) {
          return;
        }
      }
    } else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
      return;
    }
    const link = document.createElement("link");
    link.rel = isCss ? "stylesheet" : scriptRel;
    if (!isCss) {
      link.as = "script";
      link.crossOrigin = "";
    }
    link.href = dep;
    document.head.appendChild(link);
    if (isCss) {
      return new Promise((res, rej) => {
        link.addEventListener("load", res);
        link.addEventListener("error", () => rej(new Error(`Unable to preload CSS for ${dep}`)));
      });
    }
  })).then(() => baseModule());
};
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(script) {
    const fetchOpts = {};
    if (script.integrity)
      fetchOpts.integrity = script.integrity;
    if (script.referrerpolicy)
      fetchOpts.referrerPolicy = script.referrerpolicy;
    if (script.crossorigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (script.crossorigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const windi = "";
const theme = "";
const typography = "";
const colors = "";
const icons = "";
const buttons = "";
const forms = "";
const animations = "";
const header = "";
function makeMap(str, expectsLowerCase) {
  const map = /* @__PURE__ */ Object.create(null);
  const list = str.split(",");
  for (let i2 = 0; i2 < list.length; i2++) {
    map[list[i2]] = true;
  }
  return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
}
function normalizeStyle(value) {
  if (isArray(value)) {
    const res = {};
    for (let i2 = 0; i2 < value.length; i2++) {
      const item = value[i2];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString(value)) {
    return value;
  } else if (isObject(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:([^]+)/;
const styleCommentRE = /\/\*.*?\*\//gs;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray(value)) {
    for (let i2 = 0; i2 < value.length; i2++) {
      const normalized = normalizeClass(value[i2]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
const toDisplayString = (val) => {
  return isString(val) ? val : val == null ? "" : isArray(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (val && val.__v_isRef) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2]) => {
        entries[`${key} =>`] = val2;
        return entries;
      }, {})
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()]
    };
  } else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
    return String(val);
  }
  return val;
};
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const onRE = /^on[^a-z]/;
const isOn = (key) => onRE.test(key);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el) => {
  const i2 = arr.indexOf(el);
  if (i2 > -1) {
    arr.splice(i2, 1);
  }
};
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty.call(val, key);
const isArray = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
);
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_2, c2) => c2 ? c2.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
const capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
const toHandlerKey = cacheStringFunction((str) => str ? `on${capitalize(str)}` : ``);
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, arg) => {
  for (let i2 = 0; i2 < fns.length; i2++) {
    fns[i2](arg);
  }
};
const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  });
};
const toNumber = (val) => {
  const n2 = parseFloat(val);
  return isNaN(n2) ? val : n2;
};
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
let activeEffectScope;
class EffectScope {
  constructor(detached = false) {
    this.detached = detached;
    this.active = true;
    this.effects = [];
    this.cleanups = [];
    this.parent = activeEffectScope;
    if (!detached && activeEffectScope) {
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(this) - 1;
    }
  }
  run(fn) {
    if (this.active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    }
  }
  on() {
    activeEffectScope = this;
  }
  off() {
    activeEffectScope = this.parent;
  }
  stop(fromParent) {
    if (this.active) {
      let i2, l2;
      for (i2 = 0, l2 = this.effects.length; i2 < l2; i2++) {
        this.effects[i2].stop();
      }
      for (i2 = 0, l2 = this.cleanups.length; i2 < l2; i2++) {
        this.cleanups[i2]();
      }
      if (this.scopes) {
        for (i2 = 0, l2 = this.scopes.length; i2 < l2; i2++) {
          this.scopes[i2].stop(true);
        }
      }
      if (!this.detached && this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.parent = void 0;
      this.active = false;
    }
  }
}
function recordEffectScope(effect, scope = activeEffectScope) {
  if (scope && scope.active) {
    scope.effects.push(effect);
  }
}
const createDep = (effects) => {
  const dep = new Set(effects);
  dep.w = 0;
  dep.n = 0;
  return dep;
};
const wasTracked = (dep) => (dep.w & trackOpBit) > 0;
const newTracked = (dep) => (dep.n & trackOpBit) > 0;
const initDepMarkers = ({ deps }) => {
  if (deps.length) {
    for (let i2 = 0; i2 < deps.length; i2++) {
      deps[i2].w |= trackOpBit;
    }
  }
};
const finalizeDepMarkers = (effect) => {
  const { deps } = effect;
  if (deps.length) {
    let ptr = 0;
    for (let i2 = 0; i2 < deps.length; i2++) {
      const dep = deps[i2];
      if (wasTracked(dep) && !newTracked(dep)) {
        dep.delete(effect);
      } else {
        deps[ptr++] = dep;
      }
      dep.w &= ~trackOpBit;
      dep.n &= ~trackOpBit;
    }
    deps.length = ptr;
  }
};
const targetMap = /* @__PURE__ */ new WeakMap();
let effectTrackDepth = 0;
let trackOpBit = 1;
const maxMarkerBits = 30;
let activeEffect;
const ITERATE_KEY = Symbol("");
const MAP_KEY_ITERATE_KEY = Symbol("");
class ReactiveEffect {
  constructor(fn, scheduler = null, scope) {
    this.fn = fn;
    this.scheduler = scheduler;
    this.active = true;
    this.deps = [];
    this.parent = void 0;
    recordEffectScope(this, scope);
  }
  run() {
    if (!this.active) {
      return this.fn();
    }
    let parent = activeEffect;
    let lastShouldTrack = shouldTrack;
    while (parent) {
      if (parent === this) {
        return;
      }
      parent = parent.parent;
    }
    try {
      this.parent = activeEffect;
      activeEffect = this;
      shouldTrack = true;
      trackOpBit = 1 << ++effectTrackDepth;
      if (effectTrackDepth <= maxMarkerBits) {
        initDepMarkers(this);
      } else {
        cleanupEffect(this);
      }
      return this.fn();
    } finally {
      if (effectTrackDepth <= maxMarkerBits) {
        finalizeDepMarkers(this);
      }
      trackOpBit = 1 << --effectTrackDepth;
      activeEffect = this.parent;
      shouldTrack = lastShouldTrack;
      this.parent = void 0;
      if (this.deferStop) {
        this.stop();
      }
    }
  }
  stop() {
    if (activeEffect === this) {
      this.deferStop = true;
    } else if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}
function cleanupEffect(effect) {
  const { deps } = effect;
  if (deps.length) {
    for (let i2 = 0; i2 < deps.length; i2++) {
      deps[i2].delete(effect);
    }
    deps.length = 0;
  }
}
let shouldTrack = true;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function track(target, type, key) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = createDep());
    }
    trackEffects(dep);
  }
}
function trackEffects(dep, debuggerEventExtraInfo) {
  let shouldTrack2 = false;
  if (effectTrackDepth <= maxMarkerBits) {
    if (!newTracked(dep)) {
      dep.n |= trackOpBit;
      shouldTrack2 = !wasTracked(dep);
    }
  } else {
    shouldTrack2 = !dep.has(activeEffect);
  }
  if (shouldTrack2) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let deps = [];
  if (type === "clear") {
    deps = [...depsMap.values()];
  } else if (key === "length" && isArray(target)) {
    const newLength = toNumber(newValue);
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || key2 >= newLength) {
        deps.push(dep);
      }
    });
  } else {
    if (key !== void 0) {
      deps.push(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          deps.push(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  if (deps.length === 1) {
    if (deps[0]) {
      {
        triggerEffects(deps[0]);
      }
    }
  } else {
    const effects = [];
    for (const dep of deps) {
      if (dep) {
        effects.push(...dep);
      }
    }
    {
      triggerEffects(createDep(effects));
    }
  }
}
function triggerEffects(dep, debuggerEventExtraInfo) {
  const effects = isArray(dep) ? dep : [...dep];
  for (const effect of effects) {
    if (effect.computed) {
      triggerEffect(effect);
    }
  }
  for (const effect of effects) {
    if (!effect.computed) {
      triggerEffect(effect);
    }
  }
}
function triggerEffect(effect, debuggerEventExtraInfo) {
  if (effect !== activeEffect || effect.allowRecurse) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
);
const get = /* @__PURE__ */ createGetter();
const shallowGet = /* @__PURE__ */ createGetter(false, true);
const readonlyGet = /* @__PURE__ */ createGetter(true);
const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i2 = 0, l2 = this.length; i2 < l2; i2++) {
        track(arr, "get", i2 + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      const res = toRaw(this)[key].apply(this, args);
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function createGetter(isReadonly2 = false, shallow = false) {
  return function get2(target, key, receiver) {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return shallow;
    } else if (key === "__v_raw" && receiver === (isReadonly2 ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
      return target;
    }
    const targetIsArray = isArray(target);
    if (!isReadonly2 && targetIsArray && hasOwn(arrayInstrumentations, key)) {
      return Reflect.get(arrayInstrumentations, key, receiver);
    }
    const res = Reflect.get(target, key, receiver);
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (shallow) {
      return res;
    }
    if (isRef(res)) {
      return targetIsArray && isIntegerKey(key) ? res : res.value;
    }
    if (isObject(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  };
}
const set = /* @__PURE__ */ createSetter();
const shallowSet = /* @__PURE__ */ createSetter(true);
function createSetter(shallow = false) {
  return function set2(target, key, value, receiver) {
    let oldValue = target[key];
    if (isReadonly(oldValue) && isRef(oldValue) && !isRef(value)) {
      return false;
    }
    if (!shallow) {
      if (!isShallow(value) && !isReadonly(value)) {
        oldValue = toRaw(oldValue);
        value = toRaw(value);
      }
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      }
    }
    const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value);
      }
    }
    return result;
  };
}
function deleteProperty(target, key) {
  const hadKey = hasOwn(target, key);
  target[key];
  const result = Reflect.deleteProperty(target, key);
  if (result && hadKey) {
    trigger(target, "delete", key, void 0);
  }
  return result;
}
function has(target, key) {
  const result = Reflect.has(target, key);
  if (!isSymbol(key) || !builtInSymbols.has(key)) {
    track(target, "has", key);
  }
  return result;
}
function ownKeys(target) {
  track(target, "iterate", isArray(target) ? "length" : ITERATE_KEY);
  return Reflect.ownKeys(target);
}
const mutableHandlers = {
  get,
  set,
  deleteProperty,
  has,
  ownKeys
};
const readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    return true;
  },
  deleteProperty(target, key) {
    return true;
  }
};
const shallowReactiveHandlers = /* @__PURE__ */ extend({}, mutableHandlers, {
  get: shallowGet,
  set: shallowSet
});
const toShallow = (value) => value;
const getProto = (v2) => Reflect.getPrototypeOf(v2);
function get$1(target, key, isReadonly2 = false, isShallow2 = false) {
  target = target["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (key !== rawKey) {
      track(rawTarget, "get", key);
    }
    track(rawTarget, "get", rawKey);
  }
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key);
  }
}
function has$1(key, isReadonly2 = false) {
  const target = this["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (key !== rawKey) {
      track(rawTarget, "has", key);
    }
    track(rawTarget, "has", rawKey);
  }
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly2 = false) {
  target = target["__v_raw"];
  !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add(value) {
  value = toRaw(value);
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger(target, "add", value, value);
  }
  return this;
}
function set$1(key, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  const oldValue = get2.call(target, key);
  target.set(key, value);
  if (!hadKey) {
    trigger(target, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger(target, "set", key, value);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  get2 ? get2.call(target, key) : void 0;
  const result = target.delete(key);
  if (hadKey) {
    trigger(target, "delete", key, void 0);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const result = target.clear();
  if (hadItems) {
    trigger(target, "clear", void 0, void 0);
  }
  return result;
}
function createForEach(isReadonly2, isShallow2) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target = observed["__v_raw"];
    const rawTarget = toRaw(target);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
    return {
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    return type === "delete" ? false : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get$1(this, key);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get$1(this, key, false, true);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get$1(this, key, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get$1(this, key, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations2[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
    shallowInstrumentations2[method] = createIterableMethod(method, false, true);
    shallowReadonlyInstrumentations2[method] = createIterableMethod(method, true, true);
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
const [mutableInstrumentations, readonlyInstrumentations, shallowInstrumentations, shallowReadonlyInstrumentations] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive(target) {
  if (isReadonly(target)) {
    return target;
  }
  return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
}
function shallowReactive(target) {
  return createReactiveObject(target, false, shallowReactiveHandlers, shallowCollectionHandlers, shallowReactiveMap);
}
function readonly(target) {
  return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject(target)) {
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
  proxyMap.set(target, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}
function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
  def(value, "__v_skip", true);
  return value;
}
const toReactive = (value) => isObject(value) ? reactive(value) : value;
const toReadonly = (value) => isObject(value) ? readonly(value) : value;
function trackRefValue(ref2) {
  if (shouldTrack && activeEffect) {
    ref2 = toRaw(ref2);
    {
      trackEffects(ref2.dep || (ref2.dep = createDep()));
    }
  }
}
function triggerRefValue(ref2, newVal) {
  ref2 = toRaw(ref2);
  if (ref2.dep) {
    {
      triggerEffects(ref2.dep);
    }
  }
}
function isRef(r2) {
  return !!(r2 && r2.__v_isRef === true);
}
function ref(value) {
  return createRef(value, false);
}
function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, __v_isShallow) {
    this.__v_isShallow = __v_isShallow;
    this.dep = void 0;
    this.__v_isRef = true;
    this._rawValue = __v_isShallow ? value : toRaw(value);
    this._value = __v_isShallow ? value : toReactive(value);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    const useDirectValue = this.__v_isShallow || isShallow(newVal) || isReadonly(newVal);
    newVal = useDirectValue ? newVal : toRaw(newVal);
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = useDirectValue ? newVal : toReactive(newVal);
      triggerRefValue(this);
    }
  }
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
var _a;
class ComputedRefImpl {
  constructor(getter, _setter, isReadonly2, isSSR) {
    this._setter = _setter;
    this.dep = void 0;
    this.__v_isRef = true;
    this[_a] = false;
    this._dirty = true;
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
        triggerRefValue(this);
      }
    });
    this.effect.computed = this;
    this.effect.active = this._cacheable = !isSSR;
    this["__v_isReadonly"] = isReadonly2;
  }
  get value() {
    const self2 = toRaw(this);
    trackRefValue(self2);
    if (self2._dirty || !self2._cacheable) {
      self2._dirty = false;
      self2._value = self2.effect.run();
    }
    return self2._value;
  }
  set value(newValue) {
    this._setter(newValue);
  }
}
_a = "__v_isReadonly";
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  const onlyGetter = isFunction(getterOrOptions);
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = NOOP;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
  return cRef;
}
function warn(msg, ...args) {
  return;
}
function callWithErrorHandling(fn, instance, type, args) {
  let res;
  try {
    res = args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
  return res;
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError(err, instance, type);
      });
    }
    return res;
  }
  const values = [];
  for (let i2 = 0; i2 < fn.length; i2++) {
    values.push(callWithAsyncErrorHandling(fn[i2], instance, type, args));
  }
  return values;
}
function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = type;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i2 = 0; i2 < errorCapturedHooks.length; i2++) {
          if (errorCapturedHooks[i2](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    const appErrorHandler = instance.appContext.config.errorHandler;
    if (appErrorHandler) {
      callWithErrorHandling(appErrorHandler, null, 10, [err, exposedInstance, errorInfo]);
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev);
}
function logError(err, type, contextVNode, throwInDev = true) {
  {
    console.error(err);
  }
}
let isFlushing = false;
let isFlushPending = false;
const queue = [];
let flushIndex = 0;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
function nextTick(fn) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
}
function findInsertionIndex(id) {
  let start = flushIndex + 1;
  let end = queue.length;
  while (start < end) {
    const middle = start + end >>> 1;
    const middleJobId = getId(queue[middle]);
    middleJobId < id ? start = middle + 1 : end = middle;
  }
  return start;
}
function queueJob(job) {
  if (!queue.length || !queue.includes(job, isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex)) {
    if (job.id == null) {
      queue.push(job);
    } else {
      queue.splice(findInsertionIndex(job.id), 0, job);
    }
    queueFlush();
  }
}
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function invalidateJob(job) {
  const i2 = queue.indexOf(job);
  if (i2 > flushIndex) {
    queue.splice(i2, 1);
  }
}
function queuePostFlushCb(cb) {
  if (!isArray(cb)) {
    if (!activePostFlushCbs || !activePostFlushCbs.includes(cb, cb.allowRecurse ? postFlushIndex + 1 : postFlushIndex)) {
      pendingPostFlushCbs.push(cb);
    }
  } else {
    pendingPostFlushCbs.push(...cb);
  }
  queueFlush();
}
function flushPreFlushCbs(seen2, i2 = isFlushing ? flushIndex + 1 : 0) {
  for (; i2 < queue.length; i2++) {
    const cb = queue[i2];
    if (cb && cb.pre) {
      queue.splice(i2, 1);
      i2--;
      cb();
    }
  }
}
function flushPostFlushCbs(seen2) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)];
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    activePostFlushCbs.sort((a2, b2) => getId(a2) - getId(b2));
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      activePostFlushCbs[postFlushIndex]();
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? Infinity : job.id;
const comparator = (a2, b2) => {
  const diff = getId(a2) - getId(b2);
  if (diff === 0) {
    if (a2.pre && !b2.pre)
      return -1;
    if (b2.pre && !a2.pre)
      return 1;
  }
  return diff;
};
function flushJobs(seen2) {
  isFlushPending = false;
  isFlushing = true;
  queue.sort(comparator);
  const check = NOOP;
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job && job.active !== false) {
        if (false)
          ;
        callWithErrorHandling(job, null, 14);
      }
    }
  } finally {
    flushIndex = 0;
    queue.length = 0;
    flushPostFlushCbs();
    isFlushing = false;
    currentFlushPromise = null;
    if (queue.length || pendingPostFlushCbs.length) {
      flushJobs();
    }
  }
}
function emit$1(instance, event, ...rawArgs) {
  if (instance.isUnmounted)
    return;
  const props = instance.vnode.props || EMPTY_OBJ;
  let args = rawArgs;
  const isModelListener2 = event.startsWith("update:");
  const modelArg = isModelListener2 && event.slice(7);
  if (modelArg && modelArg in props) {
    const modifiersKey = `${modelArg === "modelValue" ? "model" : modelArg}Modifiers`;
    const { number, trim } = props[modifiersKey] || EMPTY_OBJ;
    if (trim) {
      args = rawArgs.map((a2) => isString(a2) ? a2.trim() : a2);
    }
    if (number) {
      args = rawArgs.map(toNumber);
    }
  }
  let handlerName;
  let handler = props[handlerName = toHandlerKey(event)] || props[handlerName = toHandlerKey(camelize(event))];
  if (!handler && isModelListener2) {
    handler = props[handlerName = toHandlerKey(hyphenate(event))];
  }
  if (handler) {
    callWithAsyncErrorHandling(handler, instance, 6, args);
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(onceHandler, instance, 6, args);
  }
}
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, null);
    }
    return null;
  }
  if (isArray(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend(normalized, raw);
  }
  if (isObject(comp)) {
    cache.set(comp, normalized);
  }
  return normalized;
}
function isEmitListener(options, key) {
  if (!options || !isOn(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
}
let currentRenderingInstance = null;
let currentScopeId = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  currentScopeId = instance && instance.type.__scopeId || null;
  return prev;
}
function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
  if (!ctx)
    return fn;
  if (fn._n) {
    return fn;
  }
  const renderFnWithContext = (...args) => {
    if (renderFnWithContext._d) {
      setBlockTracking(-1);
    }
    const prevInstance = setCurrentRenderingInstance(ctx);
    let res;
    try {
      res = fn(...args);
    } finally {
      setCurrentRenderingInstance(prevInstance);
      if (renderFnWithContext._d) {
        setBlockTracking(1);
      }
    }
    return res;
  };
  renderFnWithContext._n = true;
  renderFnWithContext._c = true;
  renderFnWithContext._d = true;
  return renderFnWithContext;
}
function markAttrsAccessed() {
}
function renderComponentRoot(instance) {
  const { type: Component, vnode, proxy, withProxy, props, propsOptions: [propsOptions], slots, attrs, emit, render, renderCache, data, setupState, ctx, inheritAttrs } = instance;
  let result;
  let fallthroughAttrs;
  const prev = setCurrentRenderingInstance(instance);
  try {
    if (vnode.shapeFlag & 4) {
      const proxyToUse = withProxy || proxy;
      result = normalizeVNode(render.call(proxyToUse, proxyToUse, renderCache, props, setupState, data, ctx));
      fallthroughAttrs = attrs;
    } else {
      const render2 = Component;
      if (false)
        ;
      result = normalizeVNode(render2.length > 1 ? render2(props, false ? {
        get attrs() {
          markAttrsAccessed();
          return attrs;
        },
        slots,
        emit
      } : { attrs, slots, emit }) : render2(props, null));
      fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
    }
  } catch (err) {
    blockStack.length = 0;
    handleError(err, instance, 1);
    result = createVNode(Comment$1);
  }
  let root = result;
  if (fallthroughAttrs && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs);
    const { shapeFlag } = root;
    if (keys.length) {
      if (shapeFlag & (1 | 6)) {
        if (propsOptions && keys.some(isModelListener)) {
          fallthroughAttrs = filterModelListeners(fallthroughAttrs, propsOptions);
        }
        root = cloneVNode(root, fallthroughAttrs);
      }
    }
  }
  if (vnode.dirs) {
    root = cloneVNode(root);
    root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
  }
  if (vnode.transition) {
    root.transition = vnode.transition;
  }
  {
    result = root;
  }
  setCurrentRenderingInstance(prev);
  return result;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
const filterModelListeners = (attrs, props) => {
  const res = {};
  for (const key in attrs) {
    if (!isModelListener(key) || !(key.slice(9) in props)) {
      res[key] = attrs[key];
    }
  }
  return res;
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
  const { props: prevProps, children: prevChildren, component } = prevVNode;
  const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
  const emits = component.emitsOptions;
  if (nextVNode.dirs || nextVNode.transition) {
    return true;
  }
  if (optimized && patchFlag >= 0) {
    if (patchFlag & 1024) {
      return true;
    }
    if (patchFlag & 16) {
      if (!prevProps) {
        return !!nextProps;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    } else if (patchFlag & 8) {
      const dynamicProps = nextVNode.dynamicProps;
      for (let i2 = 0; i2 < dynamicProps.length; i2++) {
        const key = dynamicProps[i2];
        if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
          return true;
        }
      }
    }
  } else {
    if (prevChildren || nextChildren) {
      if (!nextChildren || !nextChildren.$stable) {
        return true;
      }
    }
    if (prevProps === nextProps) {
      return false;
    }
    if (!prevProps) {
      return !!nextProps;
    }
    if (!nextProps) {
      return true;
    }
    return hasPropsChanged(prevProps, nextProps, emits);
  }
  return false;
}
function hasPropsChanged(prevProps, nextProps, emitsOptions) {
  const nextKeys = Object.keys(nextProps);
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i2 = 0; i2 < nextKeys.length; i2++) {
    const key = nextKeys[i2];
    if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
      return true;
    }
  }
  return false;
}
function updateHOCHostEl({ vnode, parent }, el) {
  while (parent && parent.subTree === vnode) {
    (vnode = parent.vnode).el = el;
    parent = parent.parent;
  }
}
const isSuspense = (type) => type.__isSuspense;
function queueEffectWithSuspense(fn, suspense) {
  if (suspense && suspense.pendingBranch) {
    if (isArray(fn)) {
      suspense.effects.push(...fn);
    } else {
      suspense.effects.push(fn);
    }
  } else {
    queuePostFlushCb(fn);
  }
}
function provide(key, value) {
  if (!currentInstance)
    ;
  else {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = currentInstance || currentRenderingInstance;
  if (instance) {
    const provides = instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance.proxy) : defaultValue;
    } else
      ;
  }
}
function watchEffect(effect, options) {
  return doWatch(effect, null, options);
}
const INITIAL_WATCHER_VALUE = {};
function watch(source, cb, options) {
  return doWatch(source, cb, options);
}
function doWatch(source, cb, { immediate, deep, flush, onTrack, onTrigger } = EMPTY_OBJ) {
  const instance = currentInstance;
  let getter;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => source;
    deep = true;
  } else if (isArray(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s2) => isReactive(s2) || isShallow(s2));
    getter = () => source.map((s2) => {
      if (isRef(s2)) {
        return s2.value;
      } else if (isReactive(s2)) {
        return traverse(s2);
      } else if (isFunction(s2)) {
        return callWithErrorHandling(s2, instance, 2);
      } else
        ;
    });
  } else if (isFunction(source)) {
    if (cb) {
      getter = () => callWithErrorHandling(source, instance, 2);
    } else {
      getter = () => {
        if (instance && instance.isUnmounted) {
          return;
        }
        if (cleanup) {
          cleanup();
        }
        return callWithAsyncErrorHandling(source, instance, 3, [onCleanup]);
      };
    }
  } else {
    getter = NOOP;
  }
  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }
  let cleanup;
  let onCleanup = (fn) => {
    cleanup = effect.onStop = () => {
      callWithErrorHandling(fn, instance, 4);
    };
  };
  let ssrCleanup;
  if (isInSSRComponentSetup) {
    onCleanup = NOOP;
    if (!cb) {
      getter();
    } else if (immediate) {
      callWithAsyncErrorHandling(cb, instance, 3, [
        getter(),
        isMultiSource ? [] : void 0,
        onCleanup
      ]);
    }
    if (flush === "sync") {
      const ctx = useSSRContext();
      ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
    } else {
      return NOOP;
    }
  }
  let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
  const job = () => {
    if (!effect.active) {
      return;
    }
    if (cb) {
      const newValue = effect.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v2, i2) => hasChanged(v2, oldValue[i2])) : hasChanged(newValue, oldValue)) || false) {
        if (cleanup) {
          cleanup();
        }
        callWithAsyncErrorHandling(cb, instance, 3, [
          newValue,
          oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
          onCleanup
        ]);
        oldValue = newValue;
      }
    } else {
      effect.run();
    }
  };
  job.allowRecurse = !!cb;
  let scheduler;
  if (flush === "sync") {
    scheduler = job;
  } else if (flush === "post") {
    scheduler = () => queuePostRenderEffect(job, instance && instance.suspense);
  } else {
    job.pre = true;
    if (instance)
      job.id = instance.uid;
    scheduler = () => queueJob(job);
  }
  const effect = new ReactiveEffect(getter, scheduler);
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect.run();
    }
  } else if (flush === "post") {
    queuePostRenderEffect(effect.run.bind(effect), instance && instance.suspense);
  } else {
    effect.run();
  }
  const unwatch = () => {
    effect.stop();
    if (instance && instance.scope) {
      remove(instance.scope.effects, effect);
    }
  };
  if (ssrCleanup)
    ssrCleanup.push(unwatch);
  return unwatch;
}
function instanceWatch(source, value, options) {
  const publicThis = this.proxy;
  const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options = value;
  }
  const cur = currentInstance;
  setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  if (cur) {
    setCurrentInstance(cur);
  } else {
    unsetCurrentInstance();
  }
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i2 = 0; i2 < segments.length && cur; i2++) {
      cur = cur[segments[i2]];
    }
    return cur;
  };
}
function traverse(value, seen2) {
  if (!isObject(value) || value["__v_skip"]) {
    return value;
  }
  seen2 = seen2 || /* @__PURE__ */ new Set();
  if (seen2.has(value)) {
    return value;
  }
  seen2.add(value);
  if (isRef(value)) {
    traverse(value.value, seen2);
  } else if (isArray(value)) {
    for (let i2 = 0; i2 < value.length; i2++) {
      traverse(value[i2], seen2);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v2) => {
      traverse(v2, seen2);
    });
  } else if (isPlainObject(value)) {
    for (const key in value) {
      traverse(value[key], seen2);
    }
  }
  return value;
}
function useTransitionState() {
  const state = {
    isMounted: false,
    isLeaving: false,
    isUnmounting: false,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  onMounted(() => {
    state.isMounted = true;
  });
  onBeforeUnmount(() => {
    state.isUnmounting = true;
  });
  return state;
}
const TransitionHookValidator = [Function, Array];
const BaseTransitionImpl = {
  name: `BaseTransition`,
  props: {
    mode: String,
    appear: Boolean,
    persisted: Boolean,
    onBeforeEnter: TransitionHookValidator,
    onEnter: TransitionHookValidator,
    onAfterEnter: TransitionHookValidator,
    onEnterCancelled: TransitionHookValidator,
    onBeforeLeave: TransitionHookValidator,
    onLeave: TransitionHookValidator,
    onAfterLeave: TransitionHookValidator,
    onLeaveCancelled: TransitionHookValidator,
    onBeforeAppear: TransitionHookValidator,
    onAppear: TransitionHookValidator,
    onAfterAppear: TransitionHookValidator,
    onAppearCancelled: TransitionHookValidator
  },
  setup(props, { slots }) {
    const instance = getCurrentInstance();
    const state = useTransitionState();
    let prevTransitionKey;
    return () => {
      const children = slots.default && getTransitionRawChildren(slots.default(), true);
      if (!children || !children.length) {
        return;
      }
      let child = children[0];
      if (children.length > 1) {
        for (const c2 of children) {
          if (c2.type !== Comment$1) {
            child = c2;
            break;
          }
        }
      }
      const rawProps = toRaw(props);
      const { mode } = rawProps;
      if (state.isLeaving) {
        return emptyPlaceholder(child);
      }
      const innerChild = getKeepAliveChild(child);
      if (!innerChild) {
        return emptyPlaceholder(child);
      }
      const enterHooks = resolveTransitionHooks(innerChild, rawProps, state, instance);
      setTransitionHooks(innerChild, enterHooks);
      const oldChild = instance.subTree;
      const oldInnerChild = oldChild && getKeepAliveChild(oldChild);
      let transitionKeyChanged = false;
      const { getTransitionKey } = innerChild.type;
      if (getTransitionKey) {
        const key = getTransitionKey();
        if (prevTransitionKey === void 0) {
          prevTransitionKey = key;
        } else if (key !== prevTransitionKey) {
          prevTransitionKey = key;
          transitionKeyChanged = true;
        }
      }
      if (oldInnerChild && oldInnerChild.type !== Comment$1 && (!isSameVNodeType(innerChild, oldInnerChild) || transitionKeyChanged)) {
        const leavingHooks = resolveTransitionHooks(oldInnerChild, rawProps, state, instance);
        setTransitionHooks(oldInnerChild, leavingHooks);
        if (mode === "out-in") {
          state.isLeaving = true;
          leavingHooks.afterLeave = () => {
            state.isLeaving = false;
            if (instance.update.active !== false) {
              instance.update();
            }
          };
          return emptyPlaceholder(child);
        } else if (mode === "in-out" && innerChild.type !== Comment$1) {
          leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
            const leavingVNodesCache = getLeavingNodesForType(state, oldInnerChild);
            leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
            el._leaveCb = () => {
              earlyRemove();
              el._leaveCb = void 0;
              delete enterHooks.delayedLeave;
            };
            enterHooks.delayedLeave = delayedLeave;
          };
        }
      }
      return child;
    };
  }
};
const BaseTransition = BaseTransitionImpl;
function getLeavingNodesForType(state, vnode) {
  const { leavingVNodes } = state;
  let leavingVNodesCache = leavingVNodes.get(vnode.type);
  if (!leavingVNodesCache) {
    leavingVNodesCache = /* @__PURE__ */ Object.create(null);
    leavingVNodes.set(vnode.type, leavingVNodesCache);
  }
  return leavingVNodesCache;
}
function resolveTransitionHooks(vnode, props, state, instance) {
  const { appear, mode, persisted = false, onBeforeEnter, onEnter, onAfterEnter, onEnterCancelled, onBeforeLeave, onLeave, onAfterLeave, onLeaveCancelled, onBeforeAppear, onAppear, onAfterAppear, onAppearCancelled } = props;
  const key = String(vnode.key);
  const leavingVNodesCache = getLeavingNodesForType(state, vnode);
  const callHook2 = (hook, args) => {
    hook && callWithAsyncErrorHandling(hook, instance, 9, args);
  };
  const callAsyncHook = (hook, args) => {
    const done = args[1];
    callHook2(hook, args);
    if (isArray(hook)) {
      if (hook.every((hook2) => hook2.length <= 1))
        done();
    } else if (hook.length <= 1) {
      done();
    }
  };
  const hooks = {
    mode,
    persisted,
    beforeEnter(el) {
      let hook = onBeforeEnter;
      if (!state.isMounted) {
        if (appear) {
          hook = onBeforeAppear || onBeforeEnter;
        } else {
          return;
        }
      }
      if (el._leaveCb) {
        el._leaveCb(true);
      }
      const leavingVNode = leavingVNodesCache[key];
      if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el._leaveCb) {
        leavingVNode.el._leaveCb();
      }
      callHook2(hook, [el]);
    },
    enter(el) {
      let hook = onEnter;
      let afterHook = onAfterEnter;
      let cancelHook = onEnterCancelled;
      if (!state.isMounted) {
        if (appear) {
          hook = onAppear || onEnter;
          afterHook = onAfterAppear || onAfterEnter;
          cancelHook = onAppearCancelled || onEnterCancelled;
        } else {
          return;
        }
      }
      let called = false;
      const done = el._enterCb = (cancelled) => {
        if (called)
          return;
        called = true;
        if (cancelled) {
          callHook2(cancelHook, [el]);
        } else {
          callHook2(afterHook, [el]);
        }
        if (hooks.delayedLeave) {
          hooks.delayedLeave();
        }
        el._enterCb = void 0;
      };
      if (hook) {
        callAsyncHook(hook, [el, done]);
      } else {
        done();
      }
    },
    leave(el, remove2) {
      const key2 = String(vnode.key);
      if (el._enterCb) {
        el._enterCb(true);
      }
      if (state.isUnmounting) {
        return remove2();
      }
      callHook2(onBeforeLeave, [el]);
      let called = false;
      const done = el._leaveCb = (cancelled) => {
        if (called)
          return;
        called = true;
        remove2();
        if (cancelled) {
          callHook2(onLeaveCancelled, [el]);
        } else {
          callHook2(onAfterLeave, [el]);
        }
        el._leaveCb = void 0;
        if (leavingVNodesCache[key2] === vnode) {
          delete leavingVNodesCache[key2];
        }
      };
      leavingVNodesCache[key2] = vnode;
      if (onLeave) {
        callAsyncHook(onLeave, [el, done]);
      } else {
        done();
      }
    },
    clone(vnode2) {
      return resolveTransitionHooks(vnode2, props, state, instance);
    }
  };
  return hooks;
}
function emptyPlaceholder(vnode) {
  if (isKeepAlive(vnode)) {
    vnode = cloneVNode(vnode);
    vnode.children = null;
    return vnode;
  }
}
function getKeepAliveChild(vnode) {
  return isKeepAlive(vnode) ? vnode.children ? vnode.children[0] : void 0 : vnode;
}
function setTransitionHooks(vnode, hooks) {
  if (vnode.shapeFlag & 6 && vnode.component) {
    setTransitionHooks(vnode.component.subTree, hooks);
  } else if (vnode.shapeFlag & 128) {
    vnode.ssContent.transition = hooks.clone(vnode.ssContent);
    vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
  } else {
    vnode.transition = hooks;
  }
}
function getTransitionRawChildren(children, keepComment = false, parentKey) {
  let ret = [];
  let keyedFragmentCount = 0;
  for (let i2 = 0; i2 < children.length; i2++) {
    let child = children[i2];
    const key = parentKey == null ? child.key : String(parentKey) + String(child.key != null ? child.key : i2);
    if (child.type === Fragment) {
      if (child.patchFlag & 128)
        keyedFragmentCount++;
      ret = ret.concat(getTransitionRawChildren(child.children, keepComment, key));
    } else if (keepComment || child.type !== Comment$1) {
      ret.push(key != null ? cloneVNode(child, { key }) : child);
    }
  }
  if (keyedFragmentCount > 1) {
    for (let i2 = 0; i2 < ret.length; i2++) {
      ret[i2].patchFlag = -2;
    }
  }
  return ret;
}
function defineComponent(options) {
  return isFunction(options) ? { setup: options, name: options.name } : options;
}
const isAsyncWrapper = (i2) => !!i2.type.__asyncLoader;
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target);
  if (target) {
    let current = target.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
  const injected = injectHook(type, hook, keepAliveRoot, true);
  onUnmounted(() => {
    remove(keepAliveRoot[type], injected);
  }, target);
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    const hooks = target[type] || (target[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      if (target.isUnmounted) {
        return;
      }
      pauseTracking();
      setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      unsetCurrentInstance();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  }
}
const createHook = (lifecycle) => (hook, target = currentInstance) => (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, (...args) => hook(...args), target);
const onBeforeMount = createHook("bm");
const onMounted = createHook("m");
const onBeforeUpdate = createHook("bu");
const onUpdated = createHook("u");
const onBeforeUnmount = createHook("bum");
const onUnmounted = createHook("um");
const onServerPrefetch = createHook("sp");
const onRenderTriggered = createHook("rtg");
const onRenderTracked = createHook("rtc");
function onErrorCaptured(hook, target = currentInstance) {
  injectHook("ec", hook, target);
}
function withDirectives(vnode, directives) {
  const internalInstance = currentRenderingInstance;
  if (internalInstance === null) {
    return vnode;
  }
  const instance = getExposeProxy(internalInstance) || internalInstance.proxy;
  const bindings = vnode.dirs || (vnode.dirs = []);
  for (let i2 = 0; i2 < directives.length; i2++) {
    let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i2];
    if (dir) {
      if (isFunction(dir)) {
        dir = {
          mounted: dir,
          updated: dir
        };
      }
      if (dir.deep) {
        traverse(value);
      }
      bindings.push({
        dir,
        instance,
        value,
        oldValue: void 0,
        arg,
        modifiers
      });
    }
  }
  return vnode;
}
function invokeDirectiveHook(vnode, prevVNode, instance, name) {
  const bindings = vnode.dirs;
  const oldBindings = prevVNode && prevVNode.dirs;
  for (let i2 = 0; i2 < bindings.length; i2++) {
    const binding = bindings[i2];
    if (oldBindings) {
      binding.oldValue = oldBindings[i2].value;
    }
    let hook = binding.dir[name];
    if (hook) {
      pauseTracking();
      callWithAsyncErrorHandling(hook, instance, 8, [
        vnode.el,
        binding,
        vnode,
        prevVNode
      ]);
      resetTracking();
    }
  }
}
const COMPONENTS = "components";
const DIRECTIVES = "directives";
function resolveComponent(name, maybeSelfReference) {
  return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
}
const NULL_DYNAMIC_COMPONENT = Symbol();
function resolveDirective(name) {
  return resolveAsset(DIRECTIVES, name);
}
function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
  const instance = currentRenderingInstance || currentInstance;
  if (instance) {
    const Component = instance.type;
    if (type === COMPONENTS) {
      const selfName = getComponentName(Component, false);
      if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) {
        return Component;
      }
    }
    const res = resolve(instance[type] || Component[type], name) || resolve(instance.appContext[type], name);
    if (!res && maybeSelfReference) {
      return Component;
    }
    return res;
  }
}
function resolve(registry, name) {
  return registry && (registry[name] || registry[camelize(name)] || registry[capitalize(camelize(name))]);
}
function renderList(source, renderItem, cache, index) {
  let ret;
  const cached = cache && cache[index];
  if (isArray(source) || isString(source)) {
    ret = new Array(source.length);
    for (let i2 = 0, l2 = source.length; i2 < l2; i2++) {
      ret[i2] = renderItem(source[i2], i2, void 0, cached && cached[i2]);
    }
  } else if (typeof source === "number") {
    ret = new Array(source);
    for (let i2 = 0; i2 < source; i2++) {
      ret[i2] = renderItem(i2 + 1, i2, void 0, cached && cached[i2]);
    }
  } else if (isObject(source)) {
    if (source[Symbol.iterator]) {
      ret = Array.from(source, (item, i2) => renderItem(item, i2, void 0, cached && cached[i2]));
    } else {
      const keys = Object.keys(source);
      ret = new Array(keys.length);
      for (let i2 = 0, l2 = keys.length; i2 < l2; i2++) {
        const key = keys[i2];
        ret[i2] = renderItem(source[key], key, i2, cached && cached[i2]);
      }
    }
  } else {
    ret = [];
  }
  if (cache) {
    cache[index] = ret;
  }
  return ret;
}
const getPublicInstance = (i2) => {
  if (!i2)
    return null;
  if (isStatefulComponent(i2))
    return getExposeProxy(i2) || i2.proxy;
  return getPublicInstance(i2.parent);
};
const publicPropertiesMap = /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
  $: (i2) => i2,
  $el: (i2) => i2.vnode.el,
  $data: (i2) => i2.data,
  $props: (i2) => i2.props,
  $attrs: (i2) => i2.attrs,
  $slots: (i2) => i2.slots,
  $refs: (i2) => i2.refs,
  $parent: (i2) => getPublicInstance(i2.parent),
  $root: (i2) => getPublicInstance(i2.root),
  $emit: (i2) => i2.emit,
  $options: (i2) => resolveMergedOptions(i2),
  $forceUpdate: (i2) => i2.f || (i2.f = () => queueJob(i2.update)),
  $nextTick: (i2) => i2.n || (i2.n = nextTick.bind(i2.proxy)),
  $watch: (i2) => instanceWatch.bind(i2)
});
const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
    let normalizedProps;
    if (key[0] !== "$") {
      const n2 = accessCache[key];
      if (n2 !== void 0) {
        switch (n2) {
          case 1:
            return setupState[key];
          case 2:
            return data[key];
          case 4:
            return ctx[key];
          case 3:
            return props[key];
        }
      } else if (hasSetupBinding(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        accessCache[key] = 2;
        return data[key];
      } else if ((normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)) {
        accessCache[key] = 3;
        return props[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance, "get", key);
      }
      return publicGetter(instance);
    } else if ((cssModule = type.__cssModules) && (cssModule = cssModule[key])) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)) {
      {
        return globalProperties[key];
      }
    } else
      ;
  },
  set({ _: instance }, key, value) {
    const { data, setupState, ctx } = instance;
    if (hasSetupBinding(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
      data[key] = value;
      return true;
    } else if (hasOwn(instance.props, key)) {
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      return false;
    } else {
      {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({ _: { data, setupState, accessCache, ctx, appContext, propsOptions } }, key) {
    let normalizedProps;
    return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
  },
  defineProperty(target, key, descriptor) {
    if (descriptor.get != null) {
      target._.accessCache[key] = 0;
    } else if (hasOwn(descriptor, "value")) {
      this.set(target, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target, key, descriptor);
  }
};
let shouldCacheAccess = true;
function applyOptions(instance) {
  const options = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options.beforeCreate) {
    callHook$1(options.beforeCreate, instance, "bc");
  }
  const {
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    expose,
    inheritAttrs,
    components,
    directives,
    filters
  } = options;
  const checkDuplicateProperties = null;
  if (injectOptions) {
    resolveInjections(injectOptions, ctx, checkDuplicateProperties, instance.appContext.config.unwrapInjectedRef);
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction(methodHandler)) {
        {
          ctx[key] = methodHandler.bind(publicThis);
        }
      }
    }
  }
  if (dataOptions) {
    const data = dataOptions.call(publicThis, publicThis);
    if (!isObject(data))
      ;
    else {
      instance.data = reactive(data);
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get2 = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      const set2 = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP;
      const c2 = computed({
        get: get2,
        set: set2
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c2.value,
        set: (v2) => c2.value = v2
      });
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  if (provideOptions) {
    const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
    Reflect.ownKeys(provides).forEach((key) => {
      provide(key, provides[key]);
    });
  }
  if (created) {
    callHook$1(created, instance, "c");
  }
  function registerLifecycleHook(register, hook) {
    if (isArray(hook)) {
      hook.forEach((_hook) => register(_hook.bind(publicThis)));
    } else if (hook) {
      register(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render && instance.render === NOOP) {
    instance.render = render;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components)
    instance.components = components;
  if (directives)
    instance.directives = directives;
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP, unwrapRef = false) {
  if (isArray(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject(opt)) {
      if ("default" in opt) {
        injected = inject(opt.from || key, opt.default, true);
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }
    if (isRef(injected)) {
      if (unwrapRef) {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => injected.value,
          set: (v2) => injected.value = v2
        });
      } else {
        ctx[key] = injected;
      }
    } else {
      ctx[key] = injected;
    }
  }
}
function callHook$1(hook, instance, type) {
  callWithAsyncErrorHandling(isArray(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy), instance, type);
}
function createWatcher(raw, ctx, publicThis, key) {
  const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString(raw)) {
    const handler = ctx[raw];
    if (isFunction(handler)) {
      watch(getter, handler);
    }
  } else if (isFunction(raw)) {
    watch(getter, raw.bind(publicThis));
  } else if (isObject(raw)) {
    if (isArray(raw)) {
      raw.forEach((r2) => createWatcher(r2, ctx, publicThis, key));
    } else {
      const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction(handler)) {
        watch(getter, handler, raw);
      }
    }
  } else
    ;
}
function resolveMergedOptions(instance) {
  const base = instance.type;
  const { mixins, extends: extendsOptions } = base;
  const { mixins: globalMixins, optionsCache: cache, config: { optionMergeStrategies } } = instance.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach((m2) => mergeOptions(resolved, m2, optionMergeStrategies, true));
    }
    mergeOptions(resolved, base, optionMergeStrategies);
  }
  if (isObject(base)) {
    cache.set(base, resolved);
  }
  return resolved;
}
function mergeOptions(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach((m2) => mergeOptions(to, m2, strats, true));
  }
  for (const key in from) {
    if (asMixin && key === "expose")
      ;
    else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeObjectOptions,
  emits: mergeObjectOptions,
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  beforeCreate: mergeAsArray,
  created: mergeAsArray,
  beforeMount: mergeAsArray,
  mounted: mergeAsArray,
  beforeUpdate: mergeAsArray,
  updated: mergeAsArray,
  beforeDestroy: mergeAsArray,
  beforeUnmount: mergeAsArray,
  destroyed: mergeAsArray,
  unmounted: mergeAsArray,
  activated: mergeAsArray,
  deactivated: mergeAsArray,
  errorCaptured: mergeAsArray,
  serverPrefetch: mergeAsArray,
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  watch: mergeWatchOptions,
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend(isFunction(to) ? to.call(this, this) : to, isFunction(from) ? from.call(this, this) : from);
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray(raw)) {
    const res = {};
    for (let i2 = 0; i2 < raw.length; i2++) {
      res[raw[i2]] = raw[i2];
    }
    return res;
  }
  return raw;
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend(extend(/* @__PURE__ */ Object.create(null), to), from) : from;
}
function mergeWatchOptions(to, from) {
  if (!to)
    return from;
  if (!from)
    return to;
  const merged = extend(/* @__PURE__ */ Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray(to[key], from[key]);
  }
  return merged;
}
function initProps(instance, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = {};
  def(attrs, InternalObjectKey, 1);
  instance.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance, rawProps, props, attrs);
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = void 0;
    }
  }
  if (isStateful) {
    instance.props = isSSR ? props : shallowReactive(props);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props;
    }
  }
  instance.attrs = attrs;
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const { props, attrs, vnode: { patchFlag } } = instance;
  const rawCurrentProps = toRaw(props);
  const [options] = instance.propsOptions;
  let hasAttrsChanged = false;
  if ((optimized || patchFlag > 0) && !(patchFlag & 16)) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i2 = 0; i2 < propsToUpdate.length; i2++) {
        let key = propsToUpdate[i2];
        if (isEmitListener(instance.emitsOptions, key)) {
          continue;
        }
        const value = rawProps[key];
        if (options) {
          if (hasOwn(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key);
            props[camelizedKey] = resolvePropValue(options, rawCurrentProps, camelizedKey, value, instance, false);
          }
        } else {
          if (value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || !hasOwn(rawProps, key) && ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && (rawPrevProps[key] !== void 0 || rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue(options, rawCurrentProps, key, void 0, instance, true);
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger(instance, "set", "$attrs");
  }
}
function setFullProps(instance, rawProps, props, attrs) {
  const [options, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value = rawProps[key];
      let camelKey;
      if (options && hasOwn(options, camelKey = camelize(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i2 = 0; i2 < needCastKeys.length; i2++) {
      const key = needCastKeys[i2];
      props[key] = resolvePropValue(options, rawCurrentProps, key, castValues[key], instance, !hasOwn(castValues, key));
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue(options, props, key, value, instance, isAbsent) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && isFunction(defaultValue)) {
        const { propsDefaults } = instance;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue.call(null, props);
          unsetCurrentInstance();
        }
      } else {
        value = defaultValue;
      }
    }
    if (opt[0]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[1] && (value === "" || value === hyphenate(key))) {
        value = true;
      }
    }
  }
  return value;
}
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw2, appContext, true);
      extend(normalized, props);
      if (keys)
        needCastKeys.push(...keys);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, EMPTY_ARR);
    }
    return EMPTY_ARR;
  }
  if (isArray(raw)) {
    for (let i2 = 0; i2 < raw.length; i2++) {
      const normalizedKey = camelize(raw[i2]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : Object.assign({}, opt);
        if (prop) {
          const booleanIndex = getTypeIndex(Boolean, prop.type);
          const stringIndex = getTypeIndex(String, prop.type);
          prop[0] = booleanIndex > -1;
          prop[1] = stringIndex < 0 || booleanIndex < stringIndex;
          if (booleanIndex > -1 || hasOwn(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  if (isObject(comp)) {
    cache.set(comp, res);
  }
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$") {
    return true;
  }
  return false;
}
function getType(ctor) {
  const match = ctor && ctor.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ctor === null ? "null" : "";
}
function isSameType(a2, b2) {
  return getType(a2) === getType(b2);
}
function getTypeIndex(type, expectedTypes) {
  if (isArray(expectedTypes)) {
    return expectedTypes.findIndex((t2) => isSameType(t2, type));
  } else if (isFunction(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }
  return -1;
}
const isInternalKey = (key) => key[0] === "_" || key === "$stable";
const normalizeSlotValue = (value) => isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
const normalizeSlot = (key, rawSlot, ctx) => {
  if (rawSlot._n) {
    return rawSlot;
  }
  const normalized = withCtx((...args) => {
    if (false)
      ;
    return normalizeSlotValue(rawSlot(...args));
  }, ctx);
  normalized._c = false;
  return normalized;
};
const normalizeObjectSlots = (rawSlots, slots, instance) => {
  const ctx = rawSlots._ctx;
  for (const key in rawSlots) {
    if (isInternalKey(key))
      continue;
    const value = rawSlots[key];
    if (isFunction(value)) {
      slots[key] = normalizeSlot(key, value, ctx);
    } else if (value != null) {
      const normalized = normalizeSlotValue(value);
      slots[key] = () => normalized;
    }
  }
};
const normalizeVNodeSlots = (instance, children) => {
  const normalized = normalizeSlotValue(children);
  instance.slots.default = () => normalized;
};
const initSlots = (instance, children) => {
  if (instance.vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      instance.slots = toRaw(children);
      def(children, "_", type);
    } else {
      normalizeObjectSlots(children, instance.slots = {});
    }
  } else {
    instance.slots = {};
    if (children) {
      normalizeVNodeSlots(instance, children);
    }
  }
  def(instance.slots, InternalObjectKey, 1);
};
const updateSlots = (instance, children, optimized) => {
  const { vnode, slots } = instance;
  let needDeletionCheck = true;
  let deletionComparisonTarget = EMPTY_OBJ;
  if (vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      if (optimized && type === 1) {
        needDeletionCheck = false;
      } else {
        extend(slots, children);
        if (!optimized && type === 1) {
          delete slots._;
        }
      }
    } else {
      needDeletionCheck = !children.$stable;
      normalizeObjectSlots(children, slots);
    }
    deletionComparisonTarget = children;
  } else if (children) {
    normalizeVNodeSlots(instance, children);
    deletionComparisonTarget = { default: 1 };
  }
  if (needDeletionCheck) {
    for (const key in slots) {
      if (!isInternalKey(key) && !(key in deletionComparisonTarget)) {
        delete slots[key];
      }
    }
  }
};
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid = 0;
function createAppAPI(render, hydrate) {
  return function createApp2(rootComponent, rootProps = null) {
    if (!isFunction(rootComponent)) {
      rootComponent = Object.assign({}, rootComponent);
    }
    if (rootProps != null && !isObject(rootProps)) {
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = /* @__PURE__ */ new Set();
    let isMounted = false;
    const app = context.app = {
      _uid: uid++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version,
      get config() {
        return context.config;
      },
      set config(v2) {
      },
      use(plugin, ...options) {
        if (installedPlugins.has(plugin))
          ;
        else if (plugin && isFunction(plugin.install)) {
          installedPlugins.add(plugin);
          plugin.install(app, ...options);
        } else if (isFunction(plugin)) {
          installedPlugins.add(plugin);
          plugin(app, ...options);
        } else
          ;
        return app;
      },
      mixin(mixin) {
        {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          }
        }
        return app;
      },
      component(name, component) {
        if (!component) {
          return context.components[name];
        }
        context.components[name] = component;
        return app;
      },
      directive(name, directive) {
        if (!directive) {
          return context.directives[name];
        }
        context.directives[name] = directive;
        return app;
      },
      mount(rootContainer, isHydrate, isSVG) {
        if (!isMounted) {
          const vnode = createVNode(rootComponent, rootProps);
          vnode.appContext = context;
          if (isHydrate && hydrate) {
            hydrate(vnode, rootContainer);
          } else {
            render(vnode, rootContainer, isSVG);
          }
          isMounted = true;
          app._container = rootContainer;
          rootContainer.__vue_app__ = app;
          return getExposeProxy(vnode.component) || vnode.component.proxy;
        }
      },
      unmount() {
        if (isMounted) {
          render(null, app._container);
          delete app._container.__vue_app__;
        }
      },
      provide(key, value) {
        context.provides[key] = value;
        return app;
      }
    };
    return app;
  };
}
function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
  if (isArray(rawRef)) {
    rawRef.forEach((r2, i2) => setRef(r2, oldRawRef && (isArray(oldRawRef) ? oldRawRef[i2] : oldRawRef), parentSuspense, vnode, isUnmount));
    return;
  }
  if (isAsyncWrapper(vnode) && !isUnmount) {
    return;
  }
  const refValue = vnode.shapeFlag & 4 ? getExposeProxy(vnode.component) || vnode.component.proxy : vnode.el;
  const value = isUnmount ? null : refValue;
  const { i: owner, r: ref2 } = rawRef;
  const oldRef = oldRawRef && oldRawRef.r;
  const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
  const setupState = owner.setupState;
  if (oldRef != null && oldRef !== ref2) {
    if (isString(oldRef)) {
      refs[oldRef] = null;
      if (hasOwn(setupState, oldRef)) {
        setupState[oldRef] = null;
      }
    } else if (isRef(oldRef)) {
      oldRef.value = null;
    }
  }
  if (isFunction(ref2)) {
    callWithErrorHandling(ref2, owner, 12, [value, refs]);
  } else {
    const _isString = isString(ref2);
    const _isRef = isRef(ref2);
    if (_isString || _isRef) {
      const doSet = () => {
        if (rawRef.f) {
          const existing = _isString ? hasOwn(setupState, ref2) ? setupState[ref2] : refs[ref2] : ref2.value;
          if (isUnmount) {
            isArray(existing) && remove(existing, refValue);
          } else {
            if (!isArray(existing)) {
              if (_isString) {
                refs[ref2] = [refValue];
                if (hasOwn(setupState, ref2)) {
                  setupState[ref2] = refs[ref2];
                }
              } else {
                ref2.value = [refValue];
                if (rawRef.k)
                  refs[rawRef.k] = ref2.value;
              }
            } else if (!existing.includes(refValue)) {
              existing.push(refValue);
            }
          }
        } else if (_isString) {
          refs[ref2] = value;
          if (hasOwn(setupState, ref2)) {
            setupState[ref2] = value;
          }
        } else if (_isRef) {
          ref2.value = value;
          if (rawRef.k)
            refs[rawRef.k] = value;
        } else
          ;
      };
      if (value) {
        doSet.id = -1;
        queuePostRenderEffect(doSet, parentSuspense);
      } else {
        doSet();
      }
    }
  }
}
const queuePostRenderEffect = queueEffectWithSuspense;
function createRenderer(options) {
  return baseCreateRenderer(options);
}
function baseCreateRenderer(options, createHydrationFns) {
  const target = getGlobalThis();
  target.__VUE__ = true;
  const { insert: hostInsert, remove: hostRemove, patchProp: hostPatchProp, createElement: hostCreateElement, createText: hostCreateText, createComment: hostCreateComment, setText: hostSetText, setElementText: hostSetElementText, parentNode: hostParentNode, nextSibling: hostNextSibling, setScopeId: hostSetScopeId = NOOP, insertStaticContent: hostInsertStaticContent } = options;
  const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, isSVG = false, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
    if (n1 === n2) {
      return;
    }
    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1);
      unmount(n1, parentComponent, parentSuspense, true);
      n1 = null;
    }
    if (n2.patchFlag === -2) {
      optimized = false;
      n2.dynamicChildren = null;
    }
    const { type, ref: ref2, shapeFlag } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container, anchor);
        break;
      case Comment$1:
        processCommentNode(n1, n2, container, anchor);
        break;
      case Static:
        if (n1 == null) {
          mountStaticNode(n2, container, anchor, isSVG);
        }
        break;
      case Fragment:
        processFragment(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        break;
      default:
        if (shapeFlag & 1) {
          processElement(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (shapeFlag & 6) {
          processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (shapeFlag & 64) {
          type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
        } else if (shapeFlag & 128) {
          type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
        } else
          ;
    }
    if (ref2 != null && parentComponent) {
      setRef(ref2, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
    }
  };
  const processText = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(n2.el = hostCreateText(n2.children), container, anchor);
    } else {
      const el = n2.el = n1.el;
      if (n2.children !== n1.children) {
        hostSetText(el, n2.children);
      }
    }
  };
  const processCommentNode = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(n2.el = hostCreateComment(n2.children || ""), container, anchor);
    } else {
      n2.el = n1.el;
    }
  };
  const mountStaticNode = (n2, container, anchor, isSVG) => {
    [n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container, anchor, isSVG, n2.el, n2.anchor);
  };
  const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostInsert(el, container, nextSibling);
      el = next;
    }
    hostInsert(anchor, container, nextSibling);
  };
  const removeStaticNode = ({ el, anchor }) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostRemove(el);
      el = next;
    }
    hostRemove(anchor);
  };
  const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    isSVG = isSVG || n2.type === "svg";
    if (n1 == null) {
      mountElement(n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    } else {
      patchElement(n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
  };
  const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let el;
    let vnodeHook;
    const { type, props, shapeFlag, transition, dirs } = vnode;
    el = vnode.el = hostCreateElement(vnode.type, isSVG, props && props.is, props);
    if (shapeFlag & 8) {
      hostSetElementText(el, vnode.children);
    } else if (shapeFlag & 16) {
      mountChildren(vnode.children, el, null, parentComponent, parentSuspense, isSVG && type !== "foreignObject", slotScopeIds, optimized);
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "created");
    }
    if (props) {
      for (const key in props) {
        if (key !== "value" && !isReservedProp(key)) {
          hostPatchProp(el, key, null, props[key], isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
        }
      }
      if ("value" in props) {
        hostPatchProp(el, "value", null, props.value);
      }
      if (vnodeHook = props.onVnodeBeforeMount) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }
    }
    setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
    }
    const needCallTransitionHooks = (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
    if (needCallTransitionHooks) {
      transition.beforeEnter(el);
    }
    hostInsert(el, container, anchor);
    if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        needCallTransitionHooks && transition.enter(el);
        dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
      }, parentSuspense);
    }
  };
  const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
    if (scopeId) {
      hostSetScopeId(el, scopeId);
    }
    if (slotScopeIds) {
      for (let i2 = 0; i2 < slotScopeIds.length; i2++) {
        hostSetScopeId(el, slotScopeIds[i2]);
      }
    }
    if (parentComponent) {
      let subTree = parentComponent.subTree;
      if (vnode === subTree) {
        const parentVNode = parentComponent.vnode;
        setScopeId(el, parentVNode, parentVNode.scopeId, parentVNode.slotScopeIds, parentComponent.parent);
      }
    }
  };
  const mountChildren = (children, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, start = 0) => {
    for (let i2 = start; i2 < children.length; i2++) {
      const child = children[i2] = optimized ? cloneIfMounted(children[i2]) : normalizeVNode(children[i2]);
      patch(null, child, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
  };
  const patchElement = (n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    const el = n2.el = n1.el;
    let { patchFlag, dynamicChildren, dirs } = n2;
    patchFlag |= n1.patchFlag & 16;
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    let vnodeHook;
    parentComponent && toggleRecurse(parentComponent, false);
    if (vnodeHook = newProps.onVnodeBeforeUpdate) {
      invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
    }
    if (dirs) {
      invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
    }
    parentComponent && toggleRecurse(parentComponent, true);
    const areChildrenSVG = isSVG && n2.type !== "foreignObject";
    if (dynamicChildren) {
      patchBlockChildren(n1.dynamicChildren, dynamicChildren, el, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds);
    } else if (!optimized) {
      patchChildren(n1, n2, el, null, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds, false);
    }
    if (patchFlag > 0) {
      if (patchFlag & 16) {
        patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
      } else {
        if (patchFlag & 2) {
          if (oldProps.class !== newProps.class) {
            hostPatchProp(el, "class", null, newProps.class, isSVG);
          }
        }
        if (patchFlag & 4) {
          hostPatchProp(el, "style", oldProps.style, newProps.style, isSVG);
        }
        if (patchFlag & 8) {
          const propsToUpdate = n2.dynamicProps;
          for (let i2 = 0; i2 < propsToUpdate.length; i2++) {
            const key = propsToUpdate[i2];
            const prev = oldProps[key];
            const next = newProps[key];
            if (next !== prev || key === "value") {
              hostPatchProp(el, key, prev, next, isSVG, n1.children, parentComponent, parentSuspense, unmountChildren);
            }
          }
        }
      }
      if (patchFlag & 1) {
        if (n1.children !== n2.children) {
          hostSetElementText(el, n2.children);
        }
      }
    } else if (!optimized && dynamicChildren == null) {
      patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
    }
    if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
      }, parentSuspense);
    }
  };
  const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, isSVG, slotScopeIds) => {
    for (let i2 = 0; i2 < newChildren.length; i2++) {
      const oldVNode = oldChildren[i2];
      const newVNode = newChildren[i2];
      const container = oldVNode.el && (oldVNode.type === Fragment || !isSameVNodeType(oldVNode, newVNode) || oldVNode.shapeFlag & (6 | 64)) ? hostParentNode(oldVNode.el) : fallbackContainer;
      patch(oldVNode, newVNode, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, true);
    }
  };
  const patchProps = (el, vnode, oldProps, newProps, parentComponent, parentSuspense, isSVG) => {
    if (oldProps !== newProps) {
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!isReservedProp(key) && !(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
          }
        }
      }
      for (const key in newProps) {
        if (isReservedProp(key))
          continue;
        const next = newProps[key];
        const prev = oldProps[key];
        if (next !== prev && key !== "value") {
          hostPatchProp(el, key, prev, next, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
        }
      }
      if ("value" in newProps) {
        hostPatchProp(el, "value", oldProps.value, newProps.value);
      }
    }
  };
  const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
    const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
    let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
    }
    if (n1 == null) {
      hostInsert(fragmentStartAnchor, container, anchor);
      hostInsert(fragmentEndAnchor, container, anchor);
      mountChildren(n2.children, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    } else {
      if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && n1.dynamicChildren) {
        patchBlockChildren(n1.dynamicChildren, dynamicChildren, container, parentComponent, parentSuspense, isSVG, slotScopeIds);
        if (n2.key != null || parentComponent && n2 === parentComponent.subTree) {
          traverseStaticChildren(n1, n2, true);
        }
      } else {
        patchChildren(n1, n2, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      }
    }
  };
  const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    n2.slotScopeIds = slotScopeIds;
    if (n1 == null) {
      if (n2.shapeFlag & 512) {
        parentComponent.ctx.activate(n2, container, anchor, isSVG, optimized);
      } else {
        mountComponent(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
      }
    } else {
      updateComponent(n1, n2, optimized);
    }
  };
  const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
    const instance = initialVNode.component = createComponentInstance(initialVNode, parentComponent, parentSuspense);
    if (isKeepAlive(initialVNode)) {
      instance.ctx.renderer = internals;
    }
    {
      setupComponent(instance);
    }
    if (instance.asyncDep) {
      parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect);
      if (!initialVNode.el) {
        const placeholder = instance.subTree = createVNode(Comment$1);
        processCommentNode(null, placeholder, container, anchor);
      }
      return;
    }
    setupRenderEffect(instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized);
  };
  const updateComponent = (n1, n2, optimized) => {
    const instance = n2.component = n1.component;
    if (shouldUpdateComponent(n1, n2, optimized)) {
      if (instance.asyncDep && !instance.asyncResolved) {
        updateComponentPreRender(instance, n2, optimized);
        return;
      } else {
        instance.next = n2;
        invalidateJob(instance.update);
        instance.update();
      }
    } else {
      n2.el = n1.el;
      instance.vnode = n2;
    }
  };
  const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
    const componentUpdateFn = () => {
      if (!instance.isMounted) {
        let vnodeHook;
        const { el, props } = initialVNode;
        const { bm, m: m2, parent } = instance;
        const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
        toggleRecurse(instance, false);
        if (bm) {
          invokeArrayFns(bm);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
          invokeVNodeHook(vnodeHook, parent, initialVNode);
        }
        toggleRecurse(instance, true);
        if (el && hydrateNode) {
          const hydrateSubTree = () => {
            instance.subTree = renderComponentRoot(instance);
            hydrateNode(el, instance.subTree, instance, parentSuspense, null);
          };
          if (isAsyncWrapperVNode) {
            initialVNode.type.__asyncLoader().then(
              () => !instance.isUnmounted && hydrateSubTree()
            );
          } else {
            hydrateSubTree();
          }
        } else {
          const subTree = instance.subTree = renderComponentRoot(instance);
          patch(null, subTree, container, anchor, instance, parentSuspense, isSVG);
          initialVNode.el = subTree.el;
        }
        if (m2) {
          queuePostRenderEffect(m2, parentSuspense);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
          const scopedInitialVNode = initialVNode;
          queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode), parentSuspense);
        }
        if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
          instance.a && queuePostRenderEffect(instance.a, parentSuspense);
        }
        instance.isMounted = true;
        initialVNode = container = anchor = null;
      } else {
        let { next, bu, u: u2, parent, vnode } = instance;
        let originNext = next;
        let vnodeHook;
        toggleRecurse(instance, false);
        if (next) {
          next.el = vnode.el;
          updateComponentPreRender(instance, next, optimized);
        } else {
          next = vnode;
        }
        if (bu) {
          invokeArrayFns(bu);
        }
        if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
          invokeVNodeHook(vnodeHook, parent, next, vnode);
        }
        toggleRecurse(instance, true);
        const nextTree = renderComponentRoot(instance);
        const prevTree = instance.subTree;
        instance.subTree = nextTree;
        patch(
          prevTree,
          nextTree,
          hostParentNode(prevTree.el),
          getNextHostNode(prevTree),
          instance,
          parentSuspense,
          isSVG
        );
        next.el = nextTree.el;
        if (originNext === null) {
          updateHOCHostEl(instance, nextTree.el);
        }
        if (u2) {
          queuePostRenderEffect(u2, parentSuspense);
        }
        if (vnodeHook = next.props && next.props.onVnodeUpdated) {
          queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, next, vnode), parentSuspense);
        }
      }
    };
    const effect = instance.effect = new ReactiveEffect(
      componentUpdateFn,
      () => queueJob(update),
      instance.scope
    );
    const update = instance.update = () => effect.run();
    update.id = instance.uid;
    toggleRecurse(instance, true);
    update();
  };
  const updateComponentPreRender = (instance, nextVNode, optimized) => {
    nextVNode.component = instance;
    const prevProps = instance.vnode.props;
    instance.vnode = nextVNode;
    instance.next = null;
    updateProps(instance, nextVNode.props, prevProps, optimized);
    updateSlots(instance, nextVNode.children, optimized);
    pauseTracking();
    flushPreFlushCbs();
    resetTracking();
  };
  const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized = false) => {
    const c1 = n1 && n1.children;
    const prevShapeFlag = n1 ? n1.shapeFlag : 0;
    const c2 = n2.children;
    const { patchFlag, shapeFlag } = n2;
    if (patchFlag > 0) {
      if (patchFlag & 128) {
        patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        return;
      } else if (patchFlag & 256) {
        patchUnkeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        return;
      }
    }
    if (shapeFlag & 8) {
      if (prevShapeFlag & 16) {
        unmountChildren(c1, parentComponent, parentSuspense);
      }
      if (c2 !== c1) {
        hostSetElementText(container, c2);
      }
    } else {
      if (prevShapeFlag & 16) {
        if (shapeFlag & 16) {
          patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else {
          unmountChildren(c1, parentComponent, parentSuspense, true);
        }
      } else {
        if (prevShapeFlag & 8) {
          hostSetElementText(container, "");
        }
        if (shapeFlag & 16) {
          mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        }
      }
    }
  };
  const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    c1 = c1 || EMPTY_ARR;
    c2 = c2 || EMPTY_ARR;
    const oldLength = c1.length;
    const newLength = c2.length;
    const commonLength = Math.min(oldLength, newLength);
    let i2;
    for (i2 = 0; i2 < commonLength; i2++) {
      const nextChild = c2[i2] = optimized ? cloneIfMounted(c2[i2]) : normalizeVNode(c2[i2]);
      patch(c1[i2], nextChild, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
    if (oldLength > newLength) {
      unmountChildren(c1, parentComponent, parentSuspense, true, false, commonLength);
    } else {
      mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, commonLength);
    }
  };
  const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let i2 = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;
    while (i2 <= e1 && i2 <= e2) {
      const n1 = c1[i2];
      const n2 = c2[i2] = optimized ? cloneIfMounted(c2[i2]) : normalizeVNode(c2[i2]);
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      } else {
        break;
      }
      i2++;
    }
    while (i2 <= e1 && i2 <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      } else {
        break;
      }
      e1--;
      e2--;
    }
    if (i2 > e1) {
      if (i2 <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
        while (i2 <= e2) {
          patch(null, c2[i2] = optimized ? cloneIfMounted(c2[i2]) : normalizeVNode(c2[i2]), container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          i2++;
        }
      }
    } else if (i2 > e2) {
      while (i2 <= e1) {
        unmount(c1[i2], parentComponent, parentSuspense, true);
        i2++;
      }
    } else {
      const s1 = i2;
      const s2 = i2;
      const keyToNewIndexMap = /* @__PURE__ */ new Map();
      for (i2 = s2; i2 <= e2; i2++) {
        const nextChild = c2[i2] = optimized ? cloneIfMounted(c2[i2]) : normalizeVNode(c2[i2]);
        if (nextChild.key != null) {
          keyToNewIndexMap.set(nextChild.key, i2);
        }
      }
      let j2;
      let patched = 0;
      const toBePatched = e2 - s2 + 1;
      let moved = false;
      let maxNewIndexSoFar = 0;
      const newIndexToOldIndexMap = new Array(toBePatched);
      for (i2 = 0; i2 < toBePatched; i2++)
        newIndexToOldIndexMap[i2] = 0;
      for (i2 = s1; i2 <= e1; i2++) {
        const prevChild = c1[i2];
        if (patched >= toBePatched) {
          unmount(prevChild, parentComponent, parentSuspense, true);
          continue;
        }
        let newIndex;
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          for (j2 = s2; j2 <= e2; j2++) {
            if (newIndexToOldIndexMap[j2 - s2] === 0 && isSameVNodeType(prevChild, c2[j2])) {
              newIndex = j2;
              break;
            }
          }
        }
        if (newIndex === void 0) {
          unmount(prevChild, parentComponent, parentSuspense, true);
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i2 + 1;
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          patch(prevChild, c2[newIndex], container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          patched++;
        }
      }
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
      j2 = increasingNewIndexSequence.length - 1;
      for (i2 = toBePatched - 1; i2 >= 0; i2--) {
        const nextIndex = s2 + i2;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
        if (newIndexToOldIndexMap[i2] === 0) {
          patch(null, nextChild, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (moved) {
          if (j2 < 0 || i2 !== increasingNewIndexSequence[j2]) {
            move(nextChild, container, anchor, 2);
          } else {
            j2--;
          }
        }
      }
    }
  };
  const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
    const { el, type, transition, children, shapeFlag } = vnode;
    if (shapeFlag & 6) {
      move(vnode.component.subTree, container, anchor, moveType);
      return;
    }
    if (shapeFlag & 128) {
      vnode.suspense.move(container, anchor, moveType);
      return;
    }
    if (shapeFlag & 64) {
      type.move(vnode, container, anchor, internals);
      return;
    }
    if (type === Fragment) {
      hostInsert(el, container, anchor);
      for (let i2 = 0; i2 < children.length; i2++) {
        move(children[i2], container, anchor, moveType);
      }
      hostInsert(vnode.anchor, container, anchor);
      return;
    }
    if (type === Static) {
      moveStaticNode(vnode, container, anchor);
      return;
    }
    const needTransition = moveType !== 2 && shapeFlag & 1 && transition;
    if (needTransition) {
      if (moveType === 0) {
        transition.beforeEnter(el);
        hostInsert(el, container, anchor);
        queuePostRenderEffect(() => transition.enter(el), parentSuspense);
      } else {
        const { leave, delayLeave, afterLeave } = transition;
        const remove3 = () => hostInsert(el, container, anchor);
        const performLeave = () => {
          leave(el, () => {
            remove3();
            afterLeave && afterLeave();
          });
        };
        if (delayLeave) {
          delayLeave(el, remove3, performLeave);
        } else {
          performLeave();
        }
      }
    } else {
      hostInsert(el, container, anchor);
    }
  };
  const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
    const { type, props, ref: ref2, children, dynamicChildren, shapeFlag, patchFlag, dirs } = vnode;
    if (ref2 != null) {
      setRef(ref2, null, parentSuspense, vnode, true);
    }
    if (shapeFlag & 256) {
      parentComponent.ctx.deactivate(vnode);
      return;
    }
    const shouldInvokeDirs = shapeFlag & 1 && dirs;
    const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
    let vnodeHook;
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
      invokeVNodeHook(vnodeHook, parentComponent, vnode);
    }
    if (shapeFlag & 6) {
      unmountComponent(vnode.component, parentSuspense, doRemove);
    } else {
      if (shapeFlag & 128) {
        vnode.suspense.unmount(parentSuspense, doRemove);
        return;
      }
      if (shouldInvokeDirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
      }
      if (shapeFlag & 64) {
        vnode.type.remove(vnode, parentComponent, parentSuspense, optimized, internals, doRemove);
      } else if (dynamicChildren && (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
        unmountChildren(dynamicChildren, parentComponent, parentSuspense, false, true);
      } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
        unmountChildren(children, parentComponent, parentSuspense);
      }
      if (doRemove) {
        remove2(vnode);
      }
    }
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
      }, parentSuspense);
    }
  };
  const remove2 = (vnode) => {
    const { type, el, anchor, transition } = vnode;
    if (type === Fragment) {
      {
        removeFragment(el, anchor);
      }
      return;
    }
    if (type === Static) {
      removeStaticNode(vnode);
      return;
    }
    const performRemove = () => {
      hostRemove(el);
      if (transition && !transition.persisted && transition.afterLeave) {
        transition.afterLeave();
      }
    };
    if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
      const { leave, delayLeave } = transition;
      const performLeave = () => leave(el, performRemove);
      if (delayLeave) {
        delayLeave(vnode.el, performRemove, performLeave);
      } else {
        performLeave();
      }
    } else {
      performRemove();
    }
  };
  const removeFragment = (cur, end) => {
    let next;
    while (cur !== end) {
      next = hostNextSibling(cur);
      hostRemove(cur);
      cur = next;
    }
    hostRemove(end);
  };
  const unmountComponent = (instance, parentSuspense, doRemove) => {
    const { bum, scope, update, subTree, um } = instance;
    if (bum) {
      invokeArrayFns(bum);
    }
    scope.stop();
    if (update) {
      update.active = false;
      unmount(subTree, instance, parentSuspense, doRemove);
    }
    if (um) {
      queuePostRenderEffect(um, parentSuspense);
    }
    queuePostRenderEffect(() => {
      instance.isUnmounted = true;
    }, parentSuspense);
    if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
      parentSuspense.deps--;
      if (parentSuspense.deps === 0) {
        parentSuspense.resolve();
      }
    }
  };
  const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
    for (let i2 = start; i2 < children.length; i2++) {
      unmount(children[i2], parentComponent, parentSuspense, doRemove, optimized);
    }
  };
  const getNextHostNode = (vnode) => {
    if (vnode.shapeFlag & 6) {
      return getNextHostNode(vnode.component.subTree);
    }
    if (vnode.shapeFlag & 128) {
      return vnode.suspense.next();
    }
    return hostNextSibling(vnode.anchor || vnode.el);
  };
  const render = (vnode, container, isSVG) => {
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true);
      }
    } else {
      patch(container._vnode || null, vnode, container, null, null, null, isSVG);
    }
    flushPreFlushCbs();
    flushPostFlushCbs();
    container._vnode = vnode;
  };
  const internals = {
    p: patch,
    um: unmount,
    m: move,
    r: remove2,
    mt: mountComponent,
    mc: mountChildren,
    pc: patchChildren,
    pbc: patchBlockChildren,
    n: getNextHostNode,
    o: options
  };
  let hydrate;
  let hydrateNode;
  if (createHydrationFns) {
    [hydrate, hydrateNode] = createHydrationFns(internals);
  }
  return {
    render,
    hydrate,
    createApp: createAppAPI(render, hydrate)
  };
}
function toggleRecurse({ effect, update }, allowed) {
  effect.allowRecurse = update.allowRecurse = allowed;
}
function traverseStaticChildren(n1, n2, shallow = false) {
  const ch1 = n1.children;
  const ch2 = n2.children;
  if (isArray(ch1) && isArray(ch2)) {
    for (let i2 = 0; i2 < ch1.length; i2++) {
      const c1 = ch1[i2];
      let c2 = ch2[i2];
      if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
        if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
          c2 = ch2[i2] = cloneIfMounted(ch2[i2]);
          c2.el = c1.el;
        }
        if (!shallow)
          traverseStaticChildren(c1, c2);
      }
      if (c2.type === Text) {
        c2.el = c1.el;
      }
    }
  }
}
function getSequence(arr) {
  const p2 = arr.slice();
  const result = [0];
  let i2, j2, u2, v2, c2;
  const len = arr.length;
  for (i2 = 0; i2 < len; i2++) {
    const arrI = arr[i2];
    if (arrI !== 0) {
      j2 = result[result.length - 1];
      if (arr[j2] < arrI) {
        p2[i2] = j2;
        result.push(i2);
        continue;
      }
      u2 = 0;
      v2 = result.length - 1;
      while (u2 < v2) {
        c2 = u2 + v2 >> 1;
        if (arr[result[c2]] < arrI) {
          u2 = c2 + 1;
        } else {
          v2 = c2;
        }
      }
      if (arrI < arr[result[u2]]) {
        if (u2 > 0) {
          p2[i2] = result[u2 - 1];
        }
        result[u2] = i2;
      }
    }
  }
  u2 = result.length;
  v2 = result[u2 - 1];
  while (u2-- > 0) {
    result[u2] = v2;
    v2 = p2[v2];
  }
  return result;
}
const isTeleport = (type) => type.__isTeleport;
const isTeleportDisabled = (props) => props && (props.disabled || props.disabled === "");
const isTargetSVG = (target) => typeof SVGElement !== "undefined" && target instanceof SVGElement;
const resolveTarget = (props, select) => {
  const targetSelector = props && props.to;
  if (isString(targetSelector)) {
    if (!select) {
      return null;
    } else {
      const target = select(targetSelector);
      return target;
    }
  } else {
    return targetSelector;
  }
};
const TeleportImpl = {
  __isTeleport: true,
  process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals) {
    const { mc: mountChildren, pc: patchChildren, pbc: patchBlockChildren, o: { insert, querySelector, createText, createComment } } = internals;
    const disabled = isTeleportDisabled(n2.props);
    let { shapeFlag, children, dynamicChildren } = n2;
    if (n1 == null) {
      const placeholder = n2.el = createText("");
      const mainAnchor = n2.anchor = createText("");
      insert(placeholder, container, anchor);
      insert(mainAnchor, container, anchor);
      const target = n2.target = resolveTarget(n2.props, querySelector);
      const targetAnchor = n2.targetAnchor = createText("");
      if (target) {
        insert(targetAnchor, target);
        isSVG = isSVG || isTargetSVG(target);
      }
      const mount = (container2, anchor2) => {
        if (shapeFlag & 16) {
          mountChildren(children, container2, anchor2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        }
      };
      if (disabled) {
        mount(container, mainAnchor);
      } else if (target) {
        mount(target, targetAnchor);
      }
    } else {
      n2.el = n1.el;
      const mainAnchor = n2.anchor = n1.anchor;
      const target = n2.target = n1.target;
      const targetAnchor = n2.targetAnchor = n1.targetAnchor;
      const wasDisabled = isTeleportDisabled(n1.props);
      const currentContainer = wasDisabled ? container : target;
      const currentAnchor = wasDisabled ? mainAnchor : targetAnchor;
      isSVG = isSVG || isTargetSVG(target);
      if (dynamicChildren) {
        patchBlockChildren(n1.dynamicChildren, dynamicChildren, currentContainer, parentComponent, parentSuspense, isSVG, slotScopeIds);
        traverseStaticChildren(n1, n2, true);
      } else if (!optimized) {
        patchChildren(n1, n2, currentContainer, currentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, false);
      }
      if (disabled) {
        if (!wasDisabled) {
          moveTeleport(n2, container, mainAnchor, internals, 1);
        }
      } else {
        if ((n2.props && n2.props.to) !== (n1.props && n1.props.to)) {
          const nextTarget = n2.target = resolveTarget(n2.props, querySelector);
          if (nextTarget) {
            moveTeleport(n2, nextTarget, null, internals, 0);
          }
        } else if (wasDisabled) {
          moveTeleport(n2, target, targetAnchor, internals, 1);
        }
      }
    }
    updateCssVars(n2);
  },
  remove(vnode, parentComponent, parentSuspense, optimized, { um: unmount, o: { remove: hostRemove } }, doRemove) {
    const { shapeFlag, children, anchor, targetAnchor, target, props } = vnode;
    if (target) {
      hostRemove(targetAnchor);
    }
    if (doRemove || !isTeleportDisabled(props)) {
      hostRemove(anchor);
      if (shapeFlag & 16) {
        for (let i2 = 0; i2 < children.length; i2++) {
          const child = children[i2];
          unmount(child, parentComponent, parentSuspense, true, !!child.dynamicChildren);
        }
      }
    }
  },
  move: moveTeleport,
  hydrate: hydrateTeleport
};
function moveTeleport(vnode, container, parentAnchor, { o: { insert }, m: move }, moveType = 2) {
  if (moveType === 0) {
    insert(vnode.targetAnchor, container, parentAnchor);
  }
  const { el, anchor, shapeFlag, children, props } = vnode;
  const isReorder = moveType === 2;
  if (isReorder) {
    insert(el, container, parentAnchor);
  }
  if (!isReorder || isTeleportDisabled(props)) {
    if (shapeFlag & 16) {
      for (let i2 = 0; i2 < children.length; i2++) {
        move(children[i2], container, parentAnchor, 2);
      }
    }
  }
  if (isReorder) {
    insert(anchor, container, parentAnchor);
  }
}
function hydrateTeleport(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized, { o: { nextSibling, parentNode, querySelector } }, hydrateChildren) {
  const target = vnode.target = resolveTarget(vnode.props, querySelector);
  if (target) {
    const targetNode = target._lpa || target.firstChild;
    if (vnode.shapeFlag & 16) {
      if (isTeleportDisabled(vnode.props)) {
        vnode.anchor = hydrateChildren(nextSibling(node), vnode, parentNode(node), parentComponent, parentSuspense, slotScopeIds, optimized);
        vnode.targetAnchor = targetNode;
      } else {
        vnode.anchor = nextSibling(node);
        let targetAnchor = targetNode;
        while (targetAnchor) {
          targetAnchor = nextSibling(targetAnchor);
          if (targetAnchor && targetAnchor.nodeType === 8 && targetAnchor.data === "teleport anchor") {
            vnode.targetAnchor = targetAnchor;
            target._lpa = vnode.targetAnchor && nextSibling(vnode.targetAnchor);
            break;
          }
        }
        hydrateChildren(targetNode, vnode, target, parentComponent, parentSuspense, slotScopeIds, optimized);
      }
    }
    updateCssVars(vnode);
  }
  return vnode.anchor && nextSibling(vnode.anchor);
}
const Teleport = TeleportImpl;
function updateCssVars(vnode) {
  const ctx = vnode.ctx;
  if (ctx && ctx.ut) {
    let node = vnode.children[0].el;
    while (node !== vnode.targetAnchor) {
      if (node.nodeType === 1)
        node.setAttribute("data-v-owner", ctx.uid);
      node = node.nextSibling;
    }
    ctx.ut();
  }
}
const Fragment = Symbol(void 0);
const Text = Symbol(void 0);
const Comment$1 = Symbol(void 0);
const Static = Symbol(void 0);
const blockStack = [];
let currentBlock = null;
function openBlock(disableTracking = false) {
  blockStack.push(currentBlock = disableTracking ? null : []);
}
function closeBlock() {
  blockStack.pop();
  currentBlock = blockStack[blockStack.length - 1] || null;
}
let isBlockTreeEnabled = 1;
function setBlockTracking(value) {
  isBlockTreeEnabled += value;
}
function setupBlock(vnode) {
  vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
  closeBlock();
  if (isBlockTreeEnabled > 0 && currentBlock) {
    currentBlock.push(vnode);
  }
  return vnode;
}
function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
  return setupBlock(createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, true));
}
function createBlock(type, props, children, patchFlag, dynamicProps) {
  return setupBlock(createVNode(type, props, children, patchFlag, dynamicProps, true));
}
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}
const InternalObjectKey = `__vInternal`;
const normalizeKey = ({ key }) => key != null ? key : null;
const normalizeRef = ({ ref: ref2, ref_key, ref_for }) => {
  return ref2 != null ? isString(ref2) || isRef(ref2) || isFunction(ref2) ? { i: currentRenderingInstance, r: ref2, k: ref_key, f: !!ref_for } : ref2 : null;
};
function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null,
    ctx: currentRenderingInstance
  };
  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children);
    if (shapeFlag & 128) {
      type.normalize(vnode);
    }
  } else if (children) {
    vnode.shapeFlag |= isString(children) ? 8 : 16;
  }
  if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock && (vnode.patchFlag > 0 || shapeFlag & 6) && vnode.patchFlag !== 32) {
    currentBlock.push(vnode);
  }
  return vnode;
}
const createVNode = _createVNode;
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
  if (!type || type === NULL_DYNAMIC_COMPONENT) {
    type = Comment$1;
  }
  if (isVNode(type)) {
    const cloned = cloneVNode(type, props, true);
    if (children) {
      normalizeChildren(cloned, children);
    }
    if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
      if (cloned.shapeFlag & 6) {
        currentBlock[currentBlock.indexOf(type)] = cloned;
      } else {
        currentBlock.push(cloned);
      }
    }
    cloned.patchFlag |= -2;
    return cloned;
  }
  if (isClassComponent(type)) {
    type = type.__vccOpts;
  }
  if (props) {
    props = guardReactiveProps(props);
    let { class: klass, style } = props;
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass);
    }
    if (isObject(style)) {
      if (isProxy(style) && !isArray(style)) {
        style = extend({}, style);
      }
      props.style = normalizeStyle(style);
    }
  }
  const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject(type) ? 4 : isFunction(type) ? 2 : 0;
  return createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, isBlockNode, true);
}
function guardReactiveProps(props) {
  if (!props)
    return null;
  return isProxy(props) || InternalObjectKey in props ? extend({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false) {
  const { props, ref: ref2, patchFlag, children } = vnode;
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
  const cloned = {
    __v_isVNode: true,
    __v_skip: true,
    type: vnode.type,
    props: mergedProps,
    key: mergedProps && normalizeKey(mergedProps),
    ref: extraProps && extraProps.ref ? mergeRef && ref2 ? isArray(ref2) ? ref2.concat(normalizeRef(extraProps)) : [ref2, normalizeRef(extraProps)] : normalizeRef(extraProps) : ref2,
    scopeId: vnode.scopeId,
    slotScopeIds: vnode.slotScopeIds,
    children,
    target: vnode.target,
    targetAnchor: vnode.targetAnchor,
    staticCount: vnode.staticCount,
    shapeFlag: vnode.shapeFlag,
    patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
    dynamicProps: vnode.dynamicProps,
    dynamicChildren: vnode.dynamicChildren,
    appContext: vnode.appContext,
    dirs: vnode.dirs,
    transition: vnode.transition,
    component: vnode.component,
    suspense: vnode.suspense,
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
    el: vnode.el,
    anchor: vnode.anchor,
    ctx: vnode.ctx
  };
  return cloned;
}
function createTextVNode(text = " ", flag = 0) {
  return createVNode(Text, null, text, flag);
}
function createCommentVNode(text = "", asBlock = false) {
  return asBlock ? (openBlock(), createBlock(Comment$1, null, text)) : createVNode(Comment$1, null, text);
}
function normalizeVNode(child) {
  if (child == null || typeof child === "boolean") {
    return createVNode(Comment$1);
  } else if (isArray(child)) {
    return createVNode(
      Fragment,
      null,
      child.slice()
    );
  } else if (typeof child === "object") {
    return cloneIfMounted(child);
  } else {
    return createVNode(Text, null, String(child));
  }
}
function cloneIfMounted(child) {
  return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
  let type = 0;
  const { shapeFlag } = vnode;
  if (children == null) {
    children = null;
  } else if (isArray(children)) {
    type = 16;
  } else if (typeof children === "object") {
    if (shapeFlag & (1 | 64)) {
      const slot = children.default;
      if (slot) {
        slot._c && (slot._d = false);
        normalizeChildren(vnode, slot());
        slot._c && (slot._d = true);
      }
      return;
    } else {
      type = 32;
      const slotFlag = children._;
      if (!slotFlag && !(InternalObjectKey in children)) {
        children._ctx = currentRenderingInstance;
      } else if (slotFlag === 3 && currentRenderingInstance) {
        if (currentRenderingInstance.slots._ === 1) {
          children._ = 1;
        } else {
          children._ = 2;
          vnode.patchFlag |= 1024;
        }
      }
    }
  } else if (isFunction(children)) {
    children = { default: children, _ctx: currentRenderingInstance };
    type = 32;
  } else {
    children = String(children);
    if (shapeFlag & 64) {
      type = 16;
      children = [createTextVNode(children)];
    } else {
      type = 8;
    }
  }
  vnode.children = children;
  vnode.shapeFlag |= type;
}
function mergeProps(...args) {
  const ret = {};
  for (let i2 = 0; i2 < args.length; i2++) {
    const toMerge = args[i2];
    for (const key in toMerge) {
      if (key === "class") {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass([ret.class, toMerge.class]);
        }
      } else if (key === "style") {
        ret.style = normalizeStyle([ret.style, toMerge.style]);
      } else if (isOn(key)) {
        const existing = ret[key];
        const incoming = toMerge[key];
        if (incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming))) {
          ret[key] = existing ? [].concat(existing, incoming) : incoming;
        }
      } else if (key !== "") {
        ret[key] = toMerge[key];
      }
    }
  }
  return ret;
}
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
  callWithAsyncErrorHandling(hook, instance, 7, [
    vnode,
    prevVNode
  ]);
}
const emptyAppContext = createAppContext();
let uid$1 = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid$1++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    next: null,
    subTree: null,
    effect: null,
    update: null,
    scope: new EffectScope(true),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    accessCache: null,
    renderCache: [],
    components: null,
    directives: null,
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    emit: null,
    emitted: null,
    propsDefaults: EMPTY_OBJ,
    inheritAttrs: type.inheritAttrs,
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  {
    instance.ctx = { _: instance };
  }
  instance.root = parent ? parent.root : instance;
  instance.emit = emit$1.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
const setCurrentInstance = (instance) => {
  currentInstance = instance;
  instance.scope.on();
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  currentInstance = null;
};
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false) {
  isInSSRComponentSetup = isSSR;
  const { props, children } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps(instance, props, isStateful, isSSR);
  initSlots(instance, children);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isInSSRComponentSetup = false;
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component = instance.type;
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = markRaw(new Proxy(instance.ctx, PublicInstanceProxyHandlers));
  const { setup } = Component;
  if (setup) {
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    setCurrentInstance(instance);
    pauseTracking();
    const setupResult = callWithErrorHandling(setup, instance, 0, [instance.props, setupContext]);
    resetTracking();
    unsetCurrentInstance();
    if (isPromise(setupResult)) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      if (isSSR) {
        return setupResult.then((resolvedResult) => {
          handleSetupResult(instance, resolvedResult, isSSR);
        }).catch((e2) => {
          handleError(e2, instance, 0);
        });
      } else {
        instance.asyncDep = setupResult;
      }
    } else {
      handleSetupResult(instance, setupResult, isSSR);
    }
  } else {
    finishComponentSetup(instance, isSSR);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction(setupResult)) {
    if (instance.type.__ssrInlineRender) {
      instance.ssrRender = setupResult;
    } else {
      instance.render = setupResult;
    }
  } else if (isObject(setupResult)) {
    instance.setupState = proxyRefs(setupResult);
  } else
    ;
  finishComponentSetup(instance, isSSR);
}
let compile;
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component = instance.type;
  if (!instance.render) {
    if (!isSSR && compile && !Component.render) {
      const template = Component.template || resolveMergedOptions(instance).template;
      if (template) {
        const { isCustomElement, compilerOptions } = instance.appContext.config;
        const { delimiters, compilerOptions: componentCompilerOptions } = Component;
        const finalCompilerOptions = extend(extend({
          isCustomElement,
          delimiters
        }, compilerOptions), componentCompilerOptions);
        Component.render = compile(template, finalCompilerOptions);
      }
    }
    instance.render = Component.render || NOOP;
  }
  {
    setCurrentInstance(instance);
    pauseTracking();
    applyOptions(instance);
    resetTracking();
    unsetCurrentInstance();
  }
}
function createAttrsProxy(instance) {
  return new Proxy(instance.attrs, {
    get(target, key) {
      track(instance, "get", "$attrs");
      return target[key];
    }
  });
}
function createSetupContext(instance) {
  const expose = (exposed) => {
    instance.exposed = exposed || {};
  };
  let attrs;
  {
    return {
      get attrs() {
        return attrs || (attrs = createAttrsProxy(instance));
      },
      slots: instance.slots,
      emit: instance.emit,
      expose
    };
  }
}
function getExposeProxy(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        } else if (key in publicPropertiesMap) {
          return publicPropertiesMap[key](instance);
        }
      },
      has(target, key) {
        return key in target || key in publicPropertiesMap;
      }
    }));
  }
}
function getComponentName(Component, includeInferred = true) {
  return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
}
function isClassComponent(value) {
  return isFunction(value) && "__vccOpts" in value;
}
const computed = (getterOrOptions, debugOptions) => {
  return computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
};
function h$2(type, propsOrChildren, children) {
  const l2 = arguments.length;
  if (l2 === 2) {
    if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren]);
      }
      return createVNode(type, propsOrChildren);
    } else {
      return createVNode(type, null, propsOrChildren);
    }
  } else {
    if (l2 > 3) {
      children = Array.prototype.slice.call(arguments, 2);
    } else if (l2 === 3 && isVNode(children)) {
      children = [children];
    }
    return createVNode(type, propsOrChildren, children);
  }
}
const ssrContextKey = Symbol(``);
const useSSRContext = () => {
  {
    const ctx = inject(ssrContextKey);
    return ctx;
  }
};
const version = "3.2.45";
const svgNS = "http://www.w3.org/2000/svg";
const doc = typeof document !== "undefined" ? document : null;
const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
const nodeOps = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null);
  },
  remove: (child) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },
  createElement: (tag, isSVG, is, props) => {
    const el = isSVG ? doc.createElementNS(svgNS, tag) : doc.createElement(tag, is ? { is } : void 0);
    if (tag === "select" && props && props.multiple != null) {
      el.setAttribute("multiple", props.multiple);
    }
    return el;
  },
  createText: (text) => doc.createTextNode(text),
  createComment: (text) => doc.createComment(text),
  setText: (node, text) => {
    node.nodeValue = text;
  },
  setElementText: (el, text) => {
    el.textContent = text;
  },
  parentNode: (node) => node.parentNode,
  nextSibling: (node) => node.nextSibling,
  querySelector: (selector) => doc.querySelector(selector),
  setScopeId(el, id) {
    el.setAttribute(id, "");
  },
  insertStaticContent(content, parent, anchor, isSVG, start, end) {
    const before = anchor ? anchor.previousSibling : parent.lastChild;
    if (start && (start === end || start.nextSibling)) {
      while (true) {
        parent.insertBefore(start.cloneNode(true), anchor);
        if (start === end || !(start = start.nextSibling))
          break;
      }
    } else {
      templateContainer.innerHTML = isSVG ? `<svg>${content}</svg>` : content;
      const template = templateContainer.content;
      if (isSVG) {
        const wrapper = template.firstChild;
        while (wrapper.firstChild) {
          template.appendChild(wrapper.firstChild);
        }
        template.removeChild(wrapper);
      }
      parent.insertBefore(template, anchor);
    }
    return [
      before ? before.nextSibling : parent.firstChild,
      anchor ? anchor.previousSibling : parent.lastChild
    ];
  }
};
function patchClass(el, value, isSVG) {
  const transitionClasses = el._vtc;
  if (transitionClasses) {
    value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
  }
  if (value == null) {
    el.removeAttribute("class");
  } else if (isSVG) {
    el.setAttribute("class", value);
  } else {
    el.className = value;
  }
}
function patchStyle(el, prev, next) {
  const style = el.style;
  const isCssString = isString(next);
  if (next && !isCssString) {
    for (const key in next) {
      setStyle(style, key, next[key]);
    }
    if (prev && !isString(prev)) {
      for (const key in prev) {
        if (next[key] == null) {
          setStyle(style, key, "");
        }
      }
    }
  } else {
    const currentDisplay = style.display;
    if (isCssString) {
      if (prev !== next) {
        style.cssText = next;
      }
    } else if (prev) {
      el.removeAttribute("style");
    }
    if ("_vod" in el) {
      style.display = currentDisplay;
    }
  }
}
const importantRE = /\s*!important$/;
function setStyle(style, name, val) {
  if (isArray(val)) {
    val.forEach((v2) => setStyle(style, name, v2));
  } else {
    if (val == null)
      val = "";
    if (name.startsWith("--")) {
      style.setProperty(name, val);
    } else {
      const prefixed = autoPrefix(style, name);
      if (importantRE.test(val)) {
        style.setProperty(hyphenate(prefixed), val.replace(importantRE, ""), "important");
      } else {
        style[prefixed] = val;
      }
    }
  }
}
const prefixes = ["Webkit", "Moz", "ms"];
const prefixCache = {};
function autoPrefix(style, rawName) {
  const cached = prefixCache[rawName];
  if (cached) {
    return cached;
  }
  let name = camelize(rawName);
  if (name !== "filter" && name in style) {
    return prefixCache[rawName] = name;
  }
  name = capitalize(name);
  for (let i2 = 0; i2 < prefixes.length; i2++) {
    const prefixed = prefixes[i2] + name;
    if (prefixed in style) {
      return prefixCache[rawName] = prefixed;
    }
  }
  return rawName;
}
const xlinkNS = "http://www.w3.org/1999/xlink";
function patchAttr(el, key, value, isSVG, instance) {
  if (isSVG && key.startsWith("xlink:")) {
    if (value == null) {
      el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    const isBoolean = isSpecialBooleanAttr(key);
    if (value == null || isBoolean && !includeBooleanAttr(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, isBoolean ? "" : value);
    }
  }
}
function patchDOMProp(el, key, value, prevChildren, parentComponent, parentSuspense, unmountChildren) {
  if (key === "innerHTML" || key === "textContent") {
    if (prevChildren) {
      unmountChildren(prevChildren, parentComponent, parentSuspense);
    }
    el[key] = value == null ? "" : value;
    return;
  }
  if (key === "value" && el.tagName !== "PROGRESS" && !el.tagName.includes("-")) {
    el._value = value;
    const newValue = value == null ? "" : value;
    if (el.value !== newValue || el.tagName === "OPTION") {
      el.value = newValue;
    }
    if (value == null) {
      el.removeAttribute(key);
    }
    return;
  }
  let needRemove = false;
  if (value === "" || value == null) {
    const type = typeof el[key];
    if (type === "boolean") {
      value = includeBooleanAttr(value);
    } else if (value == null && type === "string") {
      value = "";
      needRemove = true;
    } else if (type === "number") {
      value = 0;
      needRemove = true;
    }
  }
  try {
    el[key] = value;
  } catch (e2) {
  }
  needRemove && el.removeAttribute(key);
}
function addEventListener(el, event, handler, options) {
  el.addEventListener(event, handler, options);
}
function removeEventListener(el, event, handler, options) {
  el.removeEventListener(event, handler, options);
}
function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
  const invokers = el._vei || (el._vei = {});
  const existingInvoker = invokers[rawName];
  if (nextValue && existingInvoker) {
    existingInvoker.value = nextValue;
  } else {
    const [name, options] = parseName(rawName);
    if (nextValue) {
      const invoker = invokers[rawName] = createInvoker(nextValue, instance);
      addEventListener(el, name, invoker, options);
    } else if (existingInvoker) {
      removeEventListener(el, name, existingInvoker, options);
      invokers[rawName] = void 0;
    }
  }
}
const optionsModifierRE = /(?:Once|Passive|Capture)$/;
function parseName(name) {
  let options;
  if (optionsModifierRE.test(name)) {
    options = {};
    let m2;
    while (m2 = name.match(optionsModifierRE)) {
      name = name.slice(0, name.length - m2[0].length);
      options[m2[0].toLowerCase()] = true;
    }
  }
  const event = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
  return [event, options];
}
let cachedNow = 0;
const p$3 = /* @__PURE__ */ Promise.resolve();
const getNow = () => cachedNow || (p$3.then(() => cachedNow = 0), cachedNow = Date.now());
function createInvoker(initialValue, instance) {
  const invoker = (e2) => {
    if (!e2._vts) {
      e2._vts = Date.now();
    } else if (e2._vts <= invoker.attached) {
      return;
    }
    callWithAsyncErrorHandling(patchStopImmediatePropagation(e2, invoker.value), instance, 5, [e2]);
  };
  invoker.value = initialValue;
  invoker.attached = getNow();
  return invoker;
}
function patchStopImmediatePropagation(e2, value) {
  if (isArray(value)) {
    const originalStop = e2.stopImmediatePropagation;
    e2.stopImmediatePropagation = () => {
      originalStop.call(e2);
      e2._stopped = true;
    };
    return value.map((fn) => (e3) => !e3._stopped && fn && fn(e3));
  } else {
    return value;
  }
}
const nativeOnRE = /^on[a-z]/;
const patchProp = (el, key, prevValue, nextValue, isSVG = false, prevChildren, parentComponent, parentSuspense, unmountChildren) => {
  if (key === "class") {
    patchClass(el, nextValue, isSVG);
  } else if (key === "style") {
    patchStyle(el, prevValue, nextValue);
  } else if (isOn(key)) {
    if (!isModelListener(key)) {
      patchEvent(el, key, prevValue, nextValue, parentComponent);
    }
  } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
    patchDOMProp(el, key, nextValue, prevChildren, parentComponent, parentSuspense, unmountChildren);
  } else {
    if (key === "true-value") {
      el._trueValue = nextValue;
    } else if (key === "false-value") {
      el._falseValue = nextValue;
    }
    patchAttr(el, key, nextValue, isSVG);
  }
};
function shouldSetAsProp(el, key, value, isSVG) {
  if (isSVG) {
    if (key === "innerHTML" || key === "textContent") {
      return true;
    }
    if (key in el && nativeOnRE.test(key) && isFunction(value)) {
      return true;
    }
    return false;
  }
  if (key === "spellcheck" || key === "draggable" || key === "translate") {
    return false;
  }
  if (key === "form") {
    return false;
  }
  if (key === "list" && el.tagName === "INPUT") {
    return false;
  }
  if (key === "type" && el.tagName === "TEXTAREA") {
    return false;
  }
  if (nativeOnRE.test(key) && isString(value)) {
    return false;
  }
  return key in el;
}
const TRANSITION = "transition";
const ANIMATION = "animation";
const Transition = (props, { slots }) => h$2(BaseTransition, resolveTransitionProps(props), slots);
Transition.displayName = "Transition";
const DOMTransitionPropsValidators = {
  name: String,
  type: String,
  css: {
    type: Boolean,
    default: true
  },
  duration: [String, Number, Object],
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  appearFromClass: String,
  appearActiveClass: String,
  appearToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String
};
Transition.props = /* @__PURE__ */ extend({}, BaseTransition.props, DOMTransitionPropsValidators);
const callHook = (hook, args = []) => {
  if (isArray(hook)) {
    hook.forEach((h2) => h2(...args));
  } else if (hook) {
    hook(...args);
  }
};
const hasExplicitCallback = (hook) => {
  return hook ? isArray(hook) ? hook.some((h2) => h2.length > 1) : hook.length > 1 : false;
};
function resolveTransitionProps(rawProps) {
  const baseProps = {};
  for (const key in rawProps) {
    if (!(key in DOMTransitionPropsValidators)) {
      baseProps[key] = rawProps[key];
    }
  }
  if (rawProps.css === false) {
    return baseProps;
  }
  const { name = "v", type, duration, enterFromClass = `${name}-enter-from`, enterActiveClass = `${name}-enter-active`, enterToClass = `${name}-enter-to`, appearFromClass = enterFromClass, appearActiveClass = enterActiveClass, appearToClass = enterToClass, leaveFromClass = `${name}-leave-from`, leaveActiveClass = `${name}-leave-active`, leaveToClass = `${name}-leave-to` } = rawProps;
  const durations = normalizeDuration(duration);
  const enterDuration = durations && durations[0];
  const leaveDuration = durations && durations[1];
  const { onBeforeEnter, onEnter, onEnterCancelled, onLeave, onLeaveCancelled, onBeforeAppear = onBeforeEnter, onAppear = onEnter, onAppearCancelled = onEnterCancelled } = baseProps;
  const finishEnter = (el, isAppear, done) => {
    removeTransitionClass(el, isAppear ? appearToClass : enterToClass);
    removeTransitionClass(el, isAppear ? appearActiveClass : enterActiveClass);
    done && done();
  };
  const finishLeave = (el, done) => {
    el._isLeaving = false;
    removeTransitionClass(el, leaveFromClass);
    removeTransitionClass(el, leaveToClass);
    removeTransitionClass(el, leaveActiveClass);
    done && done();
  };
  const makeEnterHook = (isAppear) => {
    return (el, done) => {
      const hook = isAppear ? onAppear : onEnter;
      const resolve2 = () => finishEnter(el, isAppear, done);
      callHook(hook, [el, resolve2]);
      nextFrame(() => {
        removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass);
        addTransitionClass(el, isAppear ? appearToClass : enterToClass);
        if (!hasExplicitCallback(hook)) {
          whenTransitionEnds(el, type, enterDuration, resolve2);
        }
      });
    };
  };
  return extend(baseProps, {
    onBeforeEnter(el) {
      callHook(onBeforeEnter, [el]);
      addTransitionClass(el, enterFromClass);
      addTransitionClass(el, enterActiveClass);
    },
    onBeforeAppear(el) {
      callHook(onBeforeAppear, [el]);
      addTransitionClass(el, appearFromClass);
      addTransitionClass(el, appearActiveClass);
    },
    onEnter: makeEnterHook(false),
    onAppear: makeEnterHook(true),
    onLeave(el, done) {
      el._isLeaving = true;
      const resolve2 = () => finishLeave(el, done);
      addTransitionClass(el, leaveFromClass);
      forceReflow();
      addTransitionClass(el, leaveActiveClass);
      nextFrame(() => {
        if (!el._isLeaving) {
          return;
        }
        removeTransitionClass(el, leaveFromClass);
        addTransitionClass(el, leaveToClass);
        if (!hasExplicitCallback(onLeave)) {
          whenTransitionEnds(el, type, leaveDuration, resolve2);
        }
      });
      callHook(onLeave, [el, resolve2]);
    },
    onEnterCancelled(el) {
      finishEnter(el, false);
      callHook(onEnterCancelled, [el]);
    },
    onAppearCancelled(el) {
      finishEnter(el, true);
      callHook(onAppearCancelled, [el]);
    },
    onLeaveCancelled(el) {
      finishLeave(el);
      callHook(onLeaveCancelled, [el]);
    }
  });
}
function normalizeDuration(duration) {
  if (duration == null) {
    return null;
  } else if (isObject(duration)) {
    return [NumberOf(duration.enter), NumberOf(duration.leave)];
  } else {
    const n2 = NumberOf(duration);
    return [n2, n2];
  }
}
function NumberOf(val) {
  const res = toNumber(val);
  return res;
}
function addTransitionClass(el, cls) {
  cls.split(/\s+/).forEach((c2) => c2 && el.classList.add(c2));
  (el._vtc || (el._vtc = /* @__PURE__ */ new Set())).add(cls);
}
function removeTransitionClass(el, cls) {
  cls.split(/\s+/).forEach((c2) => c2 && el.classList.remove(c2));
  const { _vtc } = el;
  if (_vtc) {
    _vtc.delete(cls);
    if (!_vtc.size) {
      el._vtc = void 0;
    }
  }
}
function nextFrame(cb) {
  requestAnimationFrame(() => {
    requestAnimationFrame(cb);
  });
}
let endId = 0;
function whenTransitionEnds(el, expectedType, explicitTimeout, resolve2) {
  const id = el._endId = ++endId;
  const resolveIfNotStale = () => {
    if (id === el._endId) {
      resolve2();
    }
  };
  if (explicitTimeout) {
    return setTimeout(resolveIfNotStale, explicitTimeout);
  }
  const { type, timeout, propCount } = getTransitionInfo(el, expectedType);
  if (!type) {
    return resolve2();
  }
  const endEvent = type + "end";
  let ended = 0;
  const end = () => {
    el.removeEventListener(endEvent, onEnd);
    resolveIfNotStale();
  };
  const onEnd = (e2) => {
    if (e2.target === el && ++ended >= propCount) {
      end();
    }
  };
  setTimeout(() => {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(endEvent, onEnd);
}
function getTransitionInfo(el, expectedType) {
  const styles = window.getComputedStyle(el);
  const getStyleProperties = (key) => (styles[key] || "").split(", ");
  const transitionDelays = getStyleProperties(`${TRANSITION}Delay`);
  const transitionDurations = getStyleProperties(`${TRANSITION}Duration`);
  const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  const animationDelays = getStyleProperties(`${ANIMATION}Delay`);
  const animationDurations = getStyleProperties(`${ANIMATION}Duration`);
  const animationTimeout = getTimeout(animationDelays, animationDurations);
  let type = null;
  let timeout = 0;
  let propCount = 0;
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
    propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
  }
  const hasTransform = type === TRANSITION && /\b(transform|all)(,|$)/.test(getStyleProperties(`${TRANSITION}Property`).toString());
  return {
    type,
    timeout,
    propCount,
    hasTransform
  };
}
function getTimeout(delays, durations) {
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }
  return Math.max(...durations.map((d2, i2) => toMs(d2) + toMs(delays[i2])));
}
function toMs(s2) {
  return Number(s2.slice(0, -1).replace(",", ".")) * 1e3;
}
function forceReflow() {
  return document.body.offsetHeight;
}
const getModelAssigner = (vnode) => {
  const fn = vnode.props["onUpdate:modelValue"] || false;
  return isArray(fn) ? (value) => invokeArrayFns(fn, value) : fn;
};
function onCompositionStart(e2) {
  e2.target.composing = true;
}
function onCompositionEnd(e2) {
  const target = e2.target;
  if (target.composing) {
    target.composing = false;
    target.dispatchEvent(new Event("input"));
  }
}
const vModelText = {
  created(el, { modifiers: { lazy, trim, number } }, vnode) {
    el._assign = getModelAssigner(vnode);
    const castToNumber = number || vnode.props && vnode.props.type === "number";
    addEventListener(el, lazy ? "change" : "input", (e2) => {
      if (e2.target.composing)
        return;
      let domValue = el.value;
      if (trim) {
        domValue = domValue.trim();
      }
      if (castToNumber) {
        domValue = toNumber(domValue);
      }
      el._assign(domValue);
    });
    if (trim) {
      addEventListener(el, "change", () => {
        el.value = el.value.trim();
      });
    }
    if (!lazy) {
      addEventListener(el, "compositionstart", onCompositionStart);
      addEventListener(el, "compositionend", onCompositionEnd);
      addEventListener(el, "change", onCompositionEnd);
    }
  },
  mounted(el, { value }) {
    el.value = value == null ? "" : value;
  },
  beforeUpdate(el, { value, modifiers: { lazy, trim, number } }, vnode) {
    el._assign = getModelAssigner(vnode);
    if (el.composing)
      return;
    if (document.activeElement === el && el.type !== "range") {
      if (lazy) {
        return;
      }
      if (trim && el.value.trim() === value) {
        return;
      }
      if ((number || el.type === "number") && toNumber(el.value) === value) {
        return;
      }
    }
    const newValue = value == null ? "" : value;
    if (el.value !== newValue) {
      el.value = newValue;
    }
  }
};
const rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
let renderer;
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions));
}
const createApp = (...args) => {
  const app = ensureRenderer().createApp(...args);
  const { mount } = app;
  app.mount = (containerOrSelector) => {
    const container = normalizeContainer(containerOrSelector);
    if (!container)
      return;
    const component = app._component;
    if (!isFunction(component) && !component.render && !component.template) {
      component.template = container.innerHTML;
    }
    container.innerHTML = "";
    const proxy = mount(container, false, container instanceof SVGElement);
    if (container instanceof Element) {
      container.removeAttribute("v-cloak");
      container.setAttribute("data-v-app", "");
    }
    return proxy;
  };
  return app;
};
function normalizeContainer(container) {
  if (isString(container)) {
    const res = document.querySelector(container);
    return res;
  }
  return container;
}
function u$4(r2, n2, ...a2) {
  if (r2 in n2) {
    let e2 = n2[r2];
    return typeof e2 == "function" ? e2(...a2) : e2;
  }
  let t2 = new Error(`Tried to handle "${r2}" but there is no handler defined. Only defined handlers are: ${Object.keys(n2).map((e2) => `"${e2}"`).join(", ")}.`);
  throw Error.captureStackTrace && Error.captureStackTrace(t2, u$4), t2;
}
var R$1 = ((o2) => (o2[o2.None = 0] = "None", o2[o2.RenderStrategy = 1] = "RenderStrategy", o2[o2.Static = 2] = "Static", o2))(R$1 || {}), O$1 = ((e2) => (e2[e2.Unmount = 0] = "Unmount", e2[e2.Hidden = 1] = "Hidden", e2))(O$1 || {});
function P$3({ visible: r2 = true, features: t2 = 0, ourProps: e2, theirProps: o2, ...i2 }) {
  var a2;
  let n2 = k$1(o2, e2), s2 = Object.assign(i2, { props: n2 });
  if (r2 || t2 & 2 && n2.static)
    return p$2(s2);
  if (t2 & 1) {
    let l2 = (a2 = n2.unmount) == null || a2 ? 0 : 1;
    return u$4(l2, { [0]() {
      return null;
    }, [1]() {
      return p$2({ ...i2, props: { ...n2, hidden: true, style: { display: "none" } } });
    } });
  }
  return p$2(s2);
}
function p$2({ props: r2, attrs: t2, slots: e2, slot: o2, name: i2 }) {
  var y2;
  let { as: n2, ...s2 } = w$4(r2, ["unmount", "static"]), a2 = (y2 = e2.default) == null ? void 0 : y2.call(e2, o2), l2 = {};
  if (o2) {
    let d2 = false, u2 = [];
    for (let [f2, c2] of Object.entries(o2))
      typeof c2 == "boolean" && (d2 = true), c2 === true && u2.push(f2);
    d2 && (l2["data-headlessui-state"] = u2.join(" "));
  }
  if (n2 === "template") {
    if (a2 = g$3(a2 != null ? a2 : []), Object.keys(s2).length > 0 || Object.keys(t2).length > 0) {
      let [d2, ...u2] = a2 != null ? a2 : [];
      if (!x$2(d2) || u2.length > 0)
        throw new Error(['Passing props on "template"!', "", `The current component <${i2} /> is rendering a "template".`, "However we need to passthrough the following props:", Object.keys(s2).concat(Object.keys(t2)).sort((f2, c2) => f2.localeCompare(c2)).map((f2) => `  - ${f2}`).join(`
`), "", "You can apply a few solutions:", ['Add an `as="..."` prop, to ensure that we render an actual element instead of a "template".', "Render a single element as the child so that we can forward the props onto that element."].map((f2) => `  - ${f2}`).join(`
`)].join(`
`));
      return cloneVNode(d2, Object.assign({}, s2, l2));
    }
    return Array.isArray(a2) && a2.length === 1 ? a2[0] : a2;
  }
  return h$2(n2, Object.assign({}, s2, l2), { default: () => a2 });
}
function g$3(r2) {
  return r2.flatMap((t2) => t2.type === Fragment ? g$3(t2.children) : [t2]);
}
function k$1(...r2) {
  if (r2.length === 0)
    return {};
  if (r2.length === 1)
    return r2[0];
  let t2 = {}, e2 = {};
  for (let i2 of r2)
    for (let n2 in i2)
      n2.startsWith("on") && typeof i2[n2] == "function" ? (e2[n2] != null || (e2[n2] = []), e2[n2].push(i2[n2])) : t2[n2] = i2[n2];
  if (t2.disabled || t2["aria-disabled"])
    return Object.assign(t2, Object.fromEntries(Object.keys(e2).map((i2) => [i2, void 0])));
  for (let i2 in e2)
    Object.assign(t2, { [i2](n2, ...s2) {
      let a2 = e2[i2];
      for (let l2 of a2) {
        if (n2 instanceof Event && n2.defaultPrevented)
          return;
        l2(n2, ...s2);
      }
    } });
  return t2;
}
function w$4(r2, t2 = []) {
  let e2 = Object.assign({}, r2);
  for (let o2 of t2)
    o2 in e2 && delete e2[o2];
  return e2;
}
function x$2(r2) {
  return r2 == null ? false : typeof r2.type == "string" || typeof r2.type == "object" || typeof r2.type == "function";
}
let e$2 = 0;
function n$2() {
  return ++e$2;
}
function t$1() {
  return n$2();
}
var o$2 = ((r2) => (r2.Space = " ", r2.Enter = "Enter", r2.Escape = "Escape", r2.Backspace = "Backspace", r2.Delete = "Delete", r2.ArrowLeft = "ArrowLeft", r2.ArrowUp = "ArrowUp", r2.ArrowRight = "ArrowRight", r2.ArrowDown = "ArrowDown", r2.Home = "Home", r2.End = "End", r2.PageUp = "PageUp", r2.PageDown = "PageDown", r2.Tab = "Tab", r2))(o$2 || {});
function o$1(n2) {
  var l2;
  return n2 == null || n2.value == null ? null : (l2 = n2.value.$el) != null ? l2 : n2.value;
}
let n$1 = Symbol("Context");
var l$2 = ((e2) => (e2[e2.Open = 0] = "Open", e2[e2.Closed = 1] = "Closed", e2))(l$2 || {});
function f$1() {
  return p$1() !== null;
}
function p$1() {
  return inject(n$1, null);
}
function c$1(o2) {
  provide(n$1, o2);
}
function r$1(t2, e2) {
  if (t2)
    return t2;
  let n2 = e2 != null ? e2 : "button";
  if (typeof n2 == "string" && n2.toLowerCase() === "button")
    return "button";
}
function b$2(t2, e2) {
  let n2 = ref(r$1(t2.value.type, t2.value.as));
  return onMounted(() => {
    n2.value = r$1(t2.value.type, t2.value.as);
  }), watchEffect(() => {
    var o2;
    n2.value || !o$1(e2) || o$1(e2) instanceof HTMLButtonElement && !((o2 = o$1(e2)) != null && o2.hasAttribute("type")) && (n2.value = "button");
  }), n2;
}
const e$1 = typeof window == "undefined" || typeof document == "undefined";
function m$2(r2) {
  if (e$1)
    return null;
  if (r2 instanceof Node)
    return r2.ownerDocument;
  if (r2 != null && r2.hasOwnProperty("value")) {
    let o2 = o$1(r2);
    if (o2)
      return o2.ownerDocument;
  }
  return document;
}
let m$1 = ["[contentEditable=true]", "[tabindex]", "a[href]", "area[href]", "button:not([disabled])", "iframe", "input:not([disabled])", "select:not([disabled])", "textarea:not([disabled])"].map((e2) => `${e2}:not([tabindex='-1'])`).join(",");
var M = ((n2) => (n2[n2.First = 1] = "First", n2[n2.Previous = 2] = "Previous", n2[n2.Next = 4] = "Next", n2[n2.Last = 8] = "Last", n2[n2.WrapAround = 16] = "WrapAround", n2[n2.NoScroll = 32] = "NoScroll", n2))(M || {}), N = ((o2) => (o2[o2.Error = 0] = "Error", o2[o2.Overflow = 1] = "Overflow", o2[o2.Success = 2] = "Success", o2[o2.Underflow = 3] = "Underflow", o2))(N || {}), b$1 = ((r2) => (r2[r2.Previous = -1] = "Previous", r2[r2.Next = 1] = "Next", r2))(b$1 || {});
function E$2(e2 = document.body) {
  return e2 == null ? [] : Array.from(e2.querySelectorAll(m$1));
}
var F$2 = ((r2) => (r2[r2.Strict = 0] = "Strict", r2[r2.Loose = 1] = "Loose", r2))(F$2 || {});
function h$1(e2, t2 = 0) {
  var r2;
  return e2 === ((r2 = m$2(e2)) == null ? void 0 : r2.body) ? false : u$4(t2, { [0]() {
    return e2.matches(m$1);
  }, [1]() {
    let l2 = e2;
    for (; l2 !== null; ) {
      if (l2.matches(m$1))
        return true;
      l2 = l2.parentElement;
    }
    return false;
  } });
}
function w$3(e2) {
  e2 == null || e2.focus({ preventScroll: true });
}
let H$1 = ["textarea", "input"].join(",");
function S$2(e2) {
  var t2, r2;
  return (r2 = (t2 = e2 == null ? void 0 : e2.matches) == null ? void 0 : t2.call(e2, H$1)) != null ? r2 : false;
}
function O(e2, t2 = (r2) => r2) {
  return e2.slice().sort((r2, l2) => {
    let o2 = t2(r2), s2 = t2(l2);
    if (o2 === null || s2 === null)
      return 0;
    let n2 = o2.compareDocumentPosition(s2);
    return n2 & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : n2 & Node.DOCUMENT_POSITION_PRECEDING ? 1 : 0;
  });
}
function P$2(e2, t2, r2 = true, l2 = null) {
  var c2;
  let o2 = (c2 = Array.isArray(e2) ? e2.length > 0 ? e2[0].ownerDocument : document : e2 == null ? void 0 : e2.ownerDocument) != null ? c2 : document, s2 = Array.isArray(e2) ? r2 ? O(e2) : e2 : E$2(e2);
  l2 = l2 != null ? l2 : o2.activeElement;
  let n2 = (() => {
    if (t2 & 5)
      return 1;
    if (t2 & 10)
      return -1;
    throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last");
  })(), x2 = (() => {
    if (t2 & 1)
      return 0;
    if (t2 & 2)
      return Math.max(0, s2.indexOf(l2)) - 1;
    if (t2 & 4)
      return Math.max(0, s2.indexOf(l2)) + 1;
    if (t2 & 8)
      return s2.length - 1;
    throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last");
  })(), p2 = t2 & 32 ? { preventScroll: true } : {}, a2 = 0, i2 = s2.length, u2;
  do {
    if (a2 >= i2 || a2 + i2 <= 0)
      return 0;
    let f2 = x2 + a2;
    if (t2 & 16)
      f2 = (f2 + i2) % i2;
    else {
      if (f2 < 0)
        return 3;
      if (f2 >= i2)
        return 1;
    }
    u2 = s2[f2], u2 == null || u2.focus(p2), a2 += n2;
  } while (u2 !== o2.activeElement);
  return t2 & 6 && S$2(u2) && u2.select(), u2.hasAttribute("tabindex") || u2.setAttribute("tabindex", "0"), 2;
}
function v$1(e2, t2, n2) {
  e$1 || watchEffect((o2) => {
    document.addEventListener(e2, t2, n2), o2(() => document.removeEventListener(e2, t2, n2));
  });
}
function y(f2, m2, i2 = computed(() => true)) {
  function a2(e2, u2) {
    if (!i2.value || e2.defaultPrevented)
      return;
    let n2 = u2(e2);
    if (n2 === null || !n2.getRootNode().contains(n2))
      return;
    let c2 = function o2(t2) {
      return typeof t2 == "function" ? o2(t2()) : Array.isArray(t2) || t2 instanceof Set ? t2 : [t2];
    }(f2);
    for (let o2 of c2) {
      if (o2 === null)
        continue;
      let t2 = o2 instanceof HTMLElement ? o2 : o$1(o2);
      if (t2 != null && t2.contains(n2))
        return;
    }
    return !h$1(n2, F$2.Loose) && n2.tabIndex !== -1 && e2.preventDefault(), m2(e2, n2);
  }
  let r2 = ref(null);
  v$1("mousedown", (e2) => {
    var u2, n2;
    i2.value && (r2.value = ((n2 = (u2 = e2.composedPath) == null ? void 0 : u2.call(e2)) == null ? void 0 : n2[0]) || e2.target);
  }, true), v$1("click", (e2) => {
    !r2.value || (a2(e2, () => r2.value), r2.value = null);
  }, true), v$1("blur", (e2) => a2(e2, () => window.document.activeElement instanceof HTMLIFrameElement ? window.document.activeElement : null), true);
}
var a = ((e2) => (e2[e2.None = 1] = "None", e2[e2.Focusable = 2] = "Focusable", e2[e2.Hidden = 4] = "Hidden", e2))(a || {});
let f = defineComponent({ name: "Hidden", props: { as: { type: [Object, String], default: "div" }, features: { type: Number, default: 1 } }, setup(r2, { slots: t2, attrs: d2 }) {
  return () => {
    let { features: e2, ...o2 } = r2, n2 = { "aria-hidden": (e2 & 2) === 2 ? true : void 0, style: { position: "fixed", top: 1, left: 1, width: 1, height: 0, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", borderWidth: "0", ...(e2 & 4) === 4 && (e2 & 2) !== 2 && { display: "none" } } };
    return P$3({ ourProps: n2, theirProps: o2, slot: {}, attrs: d2, slots: t2, name: "Hidden" });
  };
} });
function w$2(e2, n2, t2) {
  e$1 || watchEffect((o2) => {
    window.addEventListener(e2, n2, t2), o2(() => window.removeEventListener(e2, n2, t2));
  });
}
var d$3 = ((r2) => (r2[r2.Forwards = 0] = "Forwards", r2[r2.Backwards = 1] = "Backwards", r2))(d$3 || {});
function n() {
  let o2 = ref(0);
  return w$2("keydown", (e2) => {
    e2.key === "Tab" && (o2.value = e2.shiftKey ? 1 : 0);
  }), o2;
}
function E$1(n2, e2, o2, r2) {
  e$1 || watchEffect((t2) => {
    n2 = n2 != null ? n2 : window, n2.addEventListener(e2, o2, r2), t2(() => n2.removeEventListener(e2, o2, r2));
  });
}
function t(e2) {
  typeof queueMicrotask == "function" ? queueMicrotask(e2) : Promise.resolve().then(e2).catch((o2) => setTimeout(() => {
    throw o2;
  }));
}
var h = ((e2) => (e2[e2.None = 1] = "None", e2[e2.InitialFocus = 2] = "InitialFocus", e2[e2.TabLock = 4] = "TabLock", e2[e2.FocusLock = 8] = "FocusLock", e2[e2.RestoreFocus = 16] = "RestoreFocus", e2[e2.All = 30] = "All", e2))(h || {});
let ee$1 = Object.assign(defineComponent({ name: "FocusTrap", props: { as: { type: [Object, String], default: "div" }, initialFocus: { type: Object, default: null }, features: { type: Number, default: 30 }, containers: { type: Object, default: ref(/* @__PURE__ */ new Set()) } }, inheritAttrs: false, setup(u2, { attrs: a$1, slots: t2, expose: r2 }) {
  let n$12 = ref(null);
  r2({ el: n$12, $el: n$12 });
  let o2 = computed(() => m$2(n$12));
  A$1({ ownerDocument: o2 }, computed(() => Boolean(u2.features & 16)));
  let e2 = C$1({ ownerDocument: o2, container: n$12, initialFocus: computed(() => u2.initialFocus) }, computed(() => Boolean(u2.features & 2)));
  _$1({ ownerDocument: o2, container: n$12, containers: u2.containers, previousActiveElement: e2 }, computed(() => Boolean(u2.features & 8)));
  let s2 = n();
  function i2() {
    let l2 = o$1(n$12);
    !l2 || u$4(s2.value, { [d$3.Forwards]: () => P$2(l2, M.First), [d$3.Backwards]: () => P$2(l2, M.Last) });
  }
  return () => {
    let l2 = {}, c2 = { ref: n$12 }, { features: f$12, initialFocus: p2, containers: U, ...y2 } = u2;
    return h$2(Fragment, [Boolean(f$12 & 4) && h$2(f, { as: "button", type: "button", onFocus: i2, features: a.Focusable }), P$3({ ourProps: c2, theirProps: { ...a$1, ...y2 }, slot: l2, attrs: a$1, slots: t2, name: "FocusTrap" }), Boolean(f$12 & 4) && h$2(f, { as: "button", type: "button", onFocus: i2, features: a.Focusable })]);
  };
} }), { features: h });
function A$1({ ownerDocument: u2 }, a2) {
  let t2 = ref(null);
  function r2() {
    var o2;
    t2.value || (t2.value = (o2 = u2.value) == null ? void 0 : o2.activeElement);
  }
  function n2() {
    !t2.value || (w$3(t2.value), t2.value = null);
  }
  onMounted(() => {
    watch(a2, (o2, e2) => {
      o2 !== e2 && (o2 ? r2() : n2());
    }, { immediate: true });
  }), onUnmounted(n2);
}
function C$1({ ownerDocument: u2, container: a2, initialFocus: t$12 }, r2) {
  let n2 = ref(null), o2 = ref(false);
  return onMounted(() => o2.value = true), onUnmounted(() => o2.value = false), onMounted(() => {
    watch([a2, t$12, r2], (e2, s2) => {
      if (e2.every((l2, c2) => (s2 == null ? void 0 : s2[c2]) === l2) || !r2.value)
        return;
      let i2 = o$1(a2);
      !i2 || t(() => {
        var f2, p2;
        if (!o2.value)
          return;
        let l2 = o$1(t$12), c2 = (f2 = u2.value) == null ? void 0 : f2.activeElement;
        if (l2) {
          if (l2 === c2) {
            n2.value = c2;
            return;
          }
        } else if (i2.contains(c2)) {
          n2.value = c2;
          return;
        }
        l2 ? w$3(l2) : P$2(i2, M.First | M.NoScroll) === N.Error && console.warn("There are no focusable elements inside the <FocusTrap />"), n2.value = (p2 = u2.value) == null ? void 0 : p2.activeElement;
      });
    }, { immediate: true, flush: "post" });
  }), n2;
}
function _$1({ ownerDocument: u2, container: a2, containers: t2, previousActiveElement: r2 }, n2) {
  var o2;
  E$1((o2 = u2.value) == null ? void 0 : o2.defaultView, "focus", (e2) => {
    if (!n2.value)
      return;
    let s2 = new Set(t2 == null ? void 0 : t2.value);
    s2.add(a2);
    let i2 = r2.value;
    if (!i2)
      return;
    let l2 = e2.target;
    l2 && l2 instanceof HTMLElement ? x$1(s2, l2) ? (r2.value = l2, w$3(l2)) : (e2.preventDefault(), e2.stopPropagation(), w$3(i2)) : w$3(r2.value);
  }, true);
}
function x$1(u2, a2) {
  var t2;
  for (let r2 of u2)
    if ((t2 = r2.value) != null && t2.contains(a2))
      return true;
  return false;
}
let l$1 = "body > *", i = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Map();
function u$3(t2) {
  t2.setAttribute("aria-hidden", "true"), t2.inert = true;
}
function s$1(t2) {
  let n2 = r.get(t2);
  !n2 || (n2["aria-hidden"] === null ? t2.removeAttribute("aria-hidden") : t2.setAttribute("aria-hidden", n2["aria-hidden"]), t2.inert = n2.inert);
}
function g$2(t2, n2 = ref(true)) {
  watchEffect((d2) => {
    if (!n2.value || !t2.value)
      return;
    let a2 = t2.value, o2 = m$2(a2);
    if (!!o2) {
      i.add(a2);
      for (let e2 of r.keys())
        e2.contains(a2) && (s$1(e2), r.delete(e2));
      o2.querySelectorAll(l$1).forEach((e2) => {
        if (e2 instanceof HTMLElement) {
          for (let f2 of i)
            if (e2.contains(f2))
              return;
          i.size === 1 && (r.set(e2, { "aria-hidden": e2.getAttribute("aria-hidden"), inert: e2.inert }), u$3(e2));
        }
      }), d2(() => {
        if (i.delete(a2), i.size > 0)
          o2.querySelectorAll(l$1).forEach((e2) => {
            if (e2 instanceof HTMLElement && !r.has(e2)) {
              for (let f2 of i)
                if (e2.contains(f2))
                  return;
              r.set(e2, { "aria-hidden": e2.getAttribute("aria-hidden"), inert: e2.inert }), u$3(e2);
            }
          });
        else
          for (let e2 of r.keys())
            s$1(e2), r.delete(e2);
      });
    }
  });
}
let e = Symbol("ForcePortalRootContext");
function u$2() {
  return inject(e, false);
}
let P$1 = defineComponent({ name: "ForcePortalRoot", props: { as: { type: [Object, String], default: "template" }, force: { type: Boolean, default: false } }, setup(o2, { slots: t2, attrs: r2 }) {
  return provide(e, o2.force), () => {
    let { force: f2, ...n2 } = o2;
    return P$3({ theirProps: n2, ourProps: {}, slot: {}, slots: t2, attrs: r2, name: "ForcePortalRoot" });
  };
} });
function c(t2) {
  let r2 = m$2(t2);
  if (!r2) {
    if (t2 === null)
      return null;
    throw new Error(`[Headless UI]: Cannot find ownerDocument for contextElement: ${t2}`);
  }
  let o2 = r2.getElementById("headlessui-portal-root");
  if (o2)
    return o2;
  let e2 = r2.createElement("div");
  return e2.setAttribute("id", "headlessui-portal-root"), r2.body.appendChild(e2);
}
let R = defineComponent({ name: "Portal", props: { as: { type: [Object, String], default: "div" } }, setup(t2, { slots: r2, attrs: o2 }) {
  let e2 = ref(null), p2 = computed(() => m$2(e2)), n2 = u$2(), u2 = inject(g$1, null), l2 = ref(n2 === true || u2 == null ? c(e2.value) : u2.resolveTarget());
  return watchEffect(() => {
    n2 || u2 != null && (l2.value = u2.resolveTarget());
  }), onUnmounted(() => {
    var i2, m2;
    let a2 = (i2 = p2.value) == null ? void 0 : i2.getElementById("headlessui-portal-root");
    !a2 || l2.value === a2 && l2.value.children.length <= 0 && ((m2 = l2.value.parentElement) == null || m2.removeChild(l2.value));
  }), () => {
    if (l2.value === null)
      return null;
    let a2 = { ref: e2, "data-headlessui-portal": "" };
    return h$2(Teleport, { to: l2.value }, P$3({ ourProps: a2, theirProps: t2, slot: {}, attrs: o2, slots: r2, name: "Portal" }));
  };
} }), g$1 = Symbol("PortalGroupContext"), L$1 = defineComponent({ name: "PortalGroup", props: { as: { type: [Object, String], default: "template" }, target: { type: Object, default: null } }, setup(t2, { attrs: r2, slots: o2 }) {
  let e2 = reactive({ resolveTarget() {
    return t2.target;
  } });
  return provide(g$1, e2), () => {
    let { target: p2, ...n2 } = t2;
    return P$3({ theirProps: n2, ourProps: {}, slot: {}, attrs: r2, slots: o2, name: "PortalGroup" });
  };
} });
let u$1 = Symbol("StackContext");
var p = ((e2) => (e2[e2.Add = 0] = "Add", e2[e2.Remove = 1] = "Remove", e2))(p || {});
function v() {
  return inject(u$1, () => {
  });
}
function S$1({ type: o2, enabled: r2, element: e2, onUpdate: i2 }) {
  let a2 = v();
  function t2(...n2) {
    i2 == null || i2(...n2), a2(...n2);
  }
  onMounted(() => {
    watch(r2, (n2, d2) => {
      n2 ? t2(0, o2, e2) : d2 === true && t2(1, o2, e2);
    }, { immediate: true, flush: "sync" });
  }), onUnmounted(() => {
    r2.value && t2(1, o2, e2);
  }), provide(u$1, t2);
}
let u = Symbol("DescriptionContext");
function b() {
  let t2 = inject(u, null);
  if (t2 === null)
    throw new Error("Missing parent");
  return t2;
}
function P({ slot: t2 = ref({}), name: o2 = "Description", props: s2 = {} } = {}) {
  let e2 = ref([]);
  function n2(r2) {
    return e2.value.push(r2), () => {
      let i2 = e2.value.indexOf(r2);
      i2 !== -1 && e2.value.splice(i2, 1);
    };
  }
  return provide(u, { register: n2, slot: t2, name: o2, props: s2 }), computed(() => e2.value.length > 0 ? e2.value.join(" ") : void 0);
}
let S = defineComponent({ name: "Description", props: { as: { type: [Object, String], default: "p" } }, setup(t2, { attrs: o2, slots: s2 }) {
  let e2 = b(), n2 = `headlessui-description-${t$1()}`;
  return onMounted(() => onUnmounted(e2.register(n2))), () => {
    let { name: r2 = "Description", slot: i2 = ref({}), props: l2 = {} } = e2, c2 = t2, d2 = { ...Object.entries(l2).reduce((f2, [a2, g2]) => Object.assign(f2, { [a2]: unref(g2) }), {}), id: n2 };
    return P$3({ ourProps: d2, theirProps: c2, slot: i2.value, attrs: o2, slots: s2, name: r2 });
  };
} });
function s() {
  let a2 = [], i2 = [], t2 = { enqueue(e2) {
    i2.push(e2);
  }, addEventListener(e2, n2, o2, r2) {
    return e2.addEventListener(n2, o2, r2), t2.add(() => e2.removeEventListener(n2, o2, r2));
  }, requestAnimationFrame(...e2) {
    let n2 = requestAnimationFrame(...e2);
    t2.add(() => cancelAnimationFrame(n2));
  }, nextFrame(...e2) {
    t2.requestAnimationFrame(() => {
      t2.requestAnimationFrame(...e2);
    });
  }, setTimeout(...e2) {
    let n2 = setTimeout(...e2);
    t2.add(() => clearTimeout(n2));
  }, add(e2) {
    a2.push(e2);
  }, dispose() {
    for (let e2 of a2.splice(0))
      e2();
  }, async workQueue() {
    for (let e2 of i2.splice(0))
      await e2();
  } };
  return t2;
}
function o() {
  return /iPhone/gi.test(window.navigator.platform) || /Mac/gi.test(window.navigator.platform) && window.navigator.maxTouchPoints > 0;
}
var De = ((t2) => (t2[t2.Open = 0] = "Open", t2[t2.Closed = 1] = "Closed", t2))(De || {});
let j$1 = Symbol("DialogContext");
function T(a2) {
  let u2 = inject(j$1, null);
  if (u2 === null) {
    let t2 = new Error(`<${a2} /> is missing a parent <Dialog /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(t2, T), t2;
  }
  return u2;
}
let k = "DC8F892D-2EBD-447C-A4C8-A03058436FF4", Ne = defineComponent({ name: "Dialog", inheritAttrs: false, props: { as: { type: [Object, String], default: "div" }, static: { type: Boolean, default: false }, unmount: { type: Boolean, default: true }, open: { type: [Boolean, String], default: k }, initialFocus: { type: Object, default: null } }, emits: { close: (a2) => true }, setup(a$1, { emit: u2, attrs: t2, slots: s$12, expose: i2 }) {
  var A2;
  let g2 = ref(false);
  onMounted(() => {
    g2.value = true;
  });
  let r2 = ref(0), d2 = p$1(), S2 = computed(() => a$1.open === k && d2 !== null ? u$4(d2.value, { [l$2.Open]: true, [l$2.Closed]: false }) : a$1.open), x2 = ref(/* @__PURE__ */ new Set()), m2 = ref(null), B2 = ref(null), I = computed(() => m$2(m2));
  if (i2({ el: m2, $el: m2 }), !(a$1.open !== k || d2 !== null))
    throw new Error("You forgot to provide an `open` prop to the `Dialog`.");
  if (typeof S2.value != "boolean")
    throw new Error(`You provided an \`open\` prop to the \`Dialog\`, but the value is not a boolean. Received: ${S2.value === k ? void 0 : a$1.open}`);
  let f$12 = computed(() => g2.value && S2.value ? 0 : 1), H2 = computed(() => f$12.value === 0), C2 = computed(() => r2.value > 1), G2 = inject(j$1, null) !== null, z = computed(() => C2.value ? "parent" : "leaf");
  g$2(m2, computed(() => C2.value ? H2.value : false)), S$1({ type: "Dialog", enabled: computed(() => f$12.value === 0), element: m2, onUpdate: (o2, l2, n2) => {
    if (l2 === "Dialog")
      return u$4(o2, { [p.Add]() {
        x2.value.add(n2), r2.value += 1;
      }, [p.Remove]() {
        x2.value.delete(n2), r2.value -= 1;
      } });
  } });
  let J2 = P({ name: "DialogDescription", slot: computed(() => ({ open: S2.value })) }), Q = `headlessui-dialog-${t$1()}`, E2 = ref(null), O2 = { titleId: E2, panelRef: ref(null), dialogState: f$12, setTitleId(o2) {
    E2.value !== o2 && (E2.value = o2);
  }, close() {
    u2("close", false);
  } };
  return provide(j$1, O2), y(() => {
    var l2, n2, p2;
    return [...Array.from((n2 = (l2 = I.value) == null ? void 0 : l2.querySelectorAll("body > *, [data-headlessui-portal]")) != null ? n2 : []).filter((e2) => !(!(e2 instanceof HTMLElement) || e2.contains(o$1(B2)) || O2.panelRef.value && e2.contains(O2.panelRef.value))), (p2 = O2.panelRef.value) != null ? p2 : m2.value];
  }, (o2, l2) => {
    O2.close(), nextTick(() => l2 == null ? void 0 : l2.focus());
  }, computed(() => f$12.value === 0 && !C2.value)), E$1((A2 = I.value) == null ? void 0 : A2.defaultView, "keydown", (o2) => {
    o2.defaultPrevented || o2.key === o$2.Escape && f$12.value === 0 && (C2.value || (o2.preventDefault(), o2.stopPropagation(), O2.close()));
  }), watchEffect((o$12) => {
    var W;
    if (f$12.value !== 0 || G2)
      return;
    let l2 = I.value;
    if (!l2)
      return;
    let n2 = s();
    function p2(v2, b2, X) {
      let Z = v2.style.getPropertyValue(b2);
      return Object.assign(v2.style, { [b2]: X }), n2.add(() => {
        Object.assign(v2.style, { [b2]: Z });
      });
    }
    let e2 = l2 == null ? void 0 : l2.documentElement, L2 = ((W = l2.defaultView) != null ? W : window).innerWidth - e2.clientWidth;
    if (p2(e2, "overflow", "hidden"), L2 > 0) {
      let v2 = e2.clientWidth - e2.offsetWidth, b2 = L2 - v2;
      p2(e2, "paddingRight", `${b2}px`);
    }
    if (o()) {
      let v2 = window.pageYOffset;
      p2(e2, "position", "fixed"), p2(e2, "marginTop", `-${v2}px`), p2(e2, "width", "100%"), n2.add(() => window.scrollTo(0, v2));
    }
    o$12(n2.dispose);
  }), watchEffect((o2) => {
    if (f$12.value !== 0)
      return;
    let l2 = o$1(m2);
    if (!l2)
      return;
    let n2 = new IntersectionObserver((p2) => {
      for (let e2 of p2)
        e2.boundingClientRect.x === 0 && e2.boundingClientRect.y === 0 && e2.boundingClientRect.width === 0 && e2.boundingClientRect.height === 0 && O2.close();
    });
    n2.observe(l2), o2(() => n2.disconnect());
  }), () => {
    let o2 = { ...t2, ref: m2, id: Q, role: "dialog", "aria-modal": f$12.value === 0 ? true : void 0, "aria-labelledby": E2.value, "aria-describedby": J2.value }, { open: l2, initialFocus: n2, ...p2 } = a$1, e2 = { open: f$12.value === 0 };
    return h$2(P$1, { force: true }, () => [h$2(R, () => h$2(L$1, { target: m2.value }, () => h$2(P$1, { force: false }, () => h$2(ee$1, { initialFocus: n2, containers: x2, features: H2.value ? u$4(z.value, { parent: ee$1.features.RestoreFocus, leaf: ee$1.features.All & ~ee$1.features.FocusLock }) : ee$1.features.None }, () => P$3({ ourProps: o2, theirProps: p2, slot: e2, attrs: t2, slots: s$12, visible: f$12.value === 0, features: R$1.RenderStrategy | R$1.Static, name: "Dialog" }))))), h$2(f, { features: a.Hidden, ref: B2 })]);
  };
} });
defineComponent({ name: "DialogOverlay", props: { as: { type: [Object, String], default: "div" } }, setup(a2, { attrs: u2, slots: t2 }) {
  let s2 = T("DialogOverlay"), i2 = `headlessui-dialog-overlay-${t$1()}`;
  function g2(r2) {
    r2.target === r2.currentTarget && (r2.preventDefault(), r2.stopPropagation(), s2.close());
  }
  return () => P$3({ ourProps: { id: i2, "aria-hidden": true, onClick: g2 }, theirProps: a2, slot: { open: s2.dialogState.value === 0 }, attrs: u2, slots: t2, name: "DialogOverlay" });
} });
defineComponent({ name: "DialogBackdrop", props: { as: { type: [Object, String], default: "div" } }, inheritAttrs: false, setup(a2, { attrs: u2, slots: t2, expose: s2 }) {
  let i2 = T("DialogBackdrop"), g2 = `headlessui-dialog-backdrop-${t$1()}`, r2 = ref(null);
  return s2({ el: r2, $el: r2 }), onMounted(() => {
    if (i2.panelRef.value === null)
      throw new Error("A <DialogBackdrop /> component is being used, but a <DialogPanel /> component is missing.");
  }), () => {
    let d2 = a2, S2 = { id: g2, ref: r2, "aria-hidden": true };
    return h$2(P$1, { force: true }, () => h$2(R, () => P$3({ ourProps: S2, theirProps: { ...u2, ...d2 }, slot: { open: i2.dialogState.value === 0 }, attrs: u2, slots: t2, name: "DialogBackdrop" })));
  };
} });
let _e = defineComponent({ name: "DialogPanel", props: { as: { type: [Object, String], default: "div" } }, setup(a2, { attrs: u2, slots: t2, expose: s2 }) {
  let i2 = T("DialogPanel"), g2 = `headlessui-dialog-panel-${t$1()}`;
  s2({ el: i2.panelRef, $el: i2.panelRef });
  function r2(d2) {
    d2.stopPropagation();
  }
  return () => {
    let d2 = { id: g2, ref: i2.panelRef, onClick: r2 };
    return P$3({ ourProps: d2, theirProps: a2, slot: { open: i2.dialogState.value === 0 }, attrs: u2, slots: t2, name: "DialogPanel" });
  };
} }), Ue = defineComponent({ name: "DialogTitle", props: { as: { type: [Object, String], default: "h2" } }, setup(a2, { attrs: u2, slots: t2 }) {
  let s2 = T("DialogTitle"), i2 = `headlessui-dialog-title-${t$1()}`;
  return onMounted(() => {
    s2.setTitleId(i2), onUnmounted(() => s2.setTitleId(null));
  }), () => P$3({ ourProps: { id: i2 }, theirProps: a2, slot: { open: s2.dialogState.value === 0 }, attrs: u2, slots: t2, name: "DialogTitle" });
} });
S;
var w$1 = ((n2) => (n2[n2.Open = 0] = "Open", n2[n2.Closed = 1] = "Closed", n2))(w$1 || {});
let x = Symbol("DisclosureContext");
function C(l2) {
  let r2 = inject(x, null);
  if (r2 === null) {
    let n2 = new Error(`<${l2} /> is missing a parent <Disclosure /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(n2, C), n2;
  }
  return r2;
}
let B$1 = Symbol("DisclosurePanelContext");
function H() {
  return inject(B$1, null);
}
let A = defineComponent({ name: "Disclosure", props: { as: { type: [Object, String], default: "template" }, defaultOpen: { type: [Boolean], default: false } }, setup(l2, { slots: r2, attrs: n2 }) {
  let d2 = `headlessui-disclosure-button-${t$1()}`, e2 = `headlessui-disclosure-panel-${t$1()}`, o2 = ref(l2.defaultOpen ? 0 : 1), i2 = ref(null), s2 = ref(null), u2 = { buttonId: d2, panelId: e2, disclosureState: o2, panel: i2, button: s2, toggleDisclosure() {
    o2.value = u$4(o2.value, { [0]: 1, [1]: 0 });
  }, closeDisclosure() {
    o2.value !== 1 && (o2.value = 1);
  }, close(a2) {
    u2.closeDisclosure();
    let c2 = (() => a2 ? a2 instanceof HTMLElement ? a2 : a2.value instanceof HTMLElement ? o$1(a2) : o$1(u2.button) : o$1(u2.button))();
    c2 == null || c2.focus();
  } };
  return provide(x, u2), c$1(computed(() => u$4(o2.value, { [0]: l$2.Open, [1]: l$2.Closed }))), () => {
    let { defaultOpen: a2, ...c2 } = l2, m2 = { open: o2.value === 0, close: u2.close };
    return P$3({ theirProps: c2, ourProps: {}, slot: m2, slots: r2, attrs: n2, name: "Disclosure" });
  };
} }), G = defineComponent({ name: "DisclosureButton", props: { as: { type: [Object, String], default: "button" }, disabled: { type: [Boolean], default: false } }, setup(l2, { attrs: r2, slots: n2, expose: d2 }) {
  let e2 = C("DisclosureButton"), o2 = H(), i2 = o2 === null ? false : o2 === e2.panelId, s2 = ref(null);
  d2({ el: s2, $el: s2 }), i2 || watchEffect(() => {
    e2.button.value = s2.value;
  });
  let u2 = b$2(computed(() => ({ as: l2.as, type: r2.type })), s2);
  function a2() {
    var t2;
    l2.disabled || (i2 ? (e2.toggleDisclosure(), (t2 = o$1(e2.button)) == null || t2.focus()) : e2.toggleDisclosure());
  }
  function c2(t2) {
    var D;
    if (!l2.disabled)
      if (i2)
        switch (t2.key) {
          case o$2.Space:
          case o$2.Enter:
            t2.preventDefault(), t2.stopPropagation(), e2.toggleDisclosure(), (D = o$1(e2.button)) == null || D.focus();
            break;
        }
      else
        switch (t2.key) {
          case o$2.Space:
          case o$2.Enter:
            t2.preventDefault(), t2.stopPropagation(), e2.toggleDisclosure();
            break;
        }
  }
  function m2(t2) {
    switch (t2.key) {
      case o$2.Space:
        t2.preventDefault();
        break;
    }
  }
  return () => {
    let t2 = { open: e2.disclosureState.value === 0 }, D = i2 ? { ref: s2, type: u2.value, onClick: a2, onKeydown: c2 } : { id: e2.buttonId, ref: s2, type: u2.value, "aria-expanded": l2.disabled ? void 0 : e2.disclosureState.value === 0, "aria-controls": o$1(e2.panel) ? e2.panelId : void 0, disabled: l2.disabled ? true : void 0, onClick: a2, onKeydown: c2, onKeyup: m2 };
    return P$3({ ourProps: D, theirProps: l2, slot: t2, attrs: r2, slots: n2, name: "DisclosureButton" });
  };
} }), J = defineComponent({ name: "DisclosurePanel", props: { as: { type: [Object, String], default: "div" }, static: { type: Boolean, default: false }, unmount: { type: Boolean, default: true } }, setup(l2, { attrs: r2, slots: n2, expose: d2 }) {
  let e2 = C("DisclosurePanel");
  d2({ el: e2.panel, $el: e2.panel }), provide(B$1, e2.panelId);
  let o2 = p$1(), i2 = computed(() => o2 !== null ? o2.value === l$2.Open : e2.disclosureState.value === 0);
  return () => {
    let s2 = { open: e2.disclosureState.value === 0, close: e2.close }, u2 = { id: e2.panelId, ref: e2.panel };
    return P$3({ ourProps: u2, theirProps: l2, slot: s2, attrs: r2, slots: n2, features: R$1.RenderStrategy | R$1.Static, visible: i2.value, name: "DisclosurePanel" });
  };
} });
var fe$2 = ((v2) => (v2[v2.Open = 0] = "Open", v2[v2.Closed = 1] = "Closed", v2))(fe$2 || {});
let ee = Symbol("PopoverContext");
function V(m2) {
  let S2 = inject(ee, null);
  if (S2 === null) {
    let v2 = new Error(`<${m2} /> is missing a parent <${ce$1.name} /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(v2, V), v2;
  }
  return S2;
}
let te = Symbol("PopoverGroupContext");
function oe$2() {
  return inject(te, null);
}
let ne = Symbol("PopoverPanelContext");
function ve() {
  return inject(ne, null);
}
let ce$1 = defineComponent({ name: "Popover", props: { as: { type: [Object, String], default: "div" } }, setup(m2, { slots: S2, attrs: v2, expose: E2 }) {
  var p2;
  let t2 = `headlessui-popover-button-${t$1()}`, e2 = `headlessui-popover-panel-${t$1()}`, b2 = ref(null);
  E2({ el: b2, $el: b2 });
  let u2 = ref(1), d2 = ref(null), g2 = ref(null), y$1 = ref(null), s2 = ref(null), c2 = computed(() => m$2(b2)), h2 = computed(() => {
    var R2, C2;
    if (!o$1(d2) || !o$1(s2))
      return false;
    for (let D of document.querySelectorAll("body > *"))
      if (Number(D == null ? void 0 : D.contains(o$1(d2))) ^ Number(D == null ? void 0 : D.contains(o$1(s2))))
        return true;
    let r2 = E$2(), a2 = r2.indexOf(o$1(d2)), f2 = (a2 + r2.length - 1) % r2.length, F2 = (a2 + 1) % r2.length, M2 = r2[f2], x2 = r2[F2];
    return !((R2 = o$1(s2)) != null && R2.contains(M2)) && !((C2 = o$1(s2)) != null && C2.contains(x2));
  }), P2 = { popoverState: u2, buttonId: t2, panelId: e2, panel: s2, button: d2, isPortalled: h2, beforePanelSentinel: g2, afterPanelSentinel: y$1, togglePopover() {
    u2.value = u$4(u2.value, { [0]: 1, [1]: 0 });
  }, closePopover() {
    u2.value !== 1 && (u2.value = 1);
  }, close(r2) {
    P2.closePopover();
    let a2 = (() => r2 ? r2 instanceof HTMLElement ? r2 : r2.value instanceof HTMLElement ? o$1(r2) : o$1(P2.button) : o$1(P2.button))();
    a2 == null || a2.focus();
  } };
  provide(ee, P2), c$1(computed(() => u$4(u2.value, { [0]: l$2.Open, [1]: l$2.Closed })));
  let I = { buttonId: t2, panelId: e2, close() {
    P2.closePopover();
  } }, l2 = oe$2(), o2 = l2 == null ? void 0 : l2.registerPopover;
  function i2() {
    var r2, a2, f2, F2;
    return (F2 = l2 == null ? void 0 : l2.isFocusWithinPopoverGroup()) != null ? F2 : ((r2 = c2.value) == null ? void 0 : r2.activeElement) && (((a2 = o$1(d2)) == null ? void 0 : a2.contains(c2.value.activeElement)) || ((f2 = o$1(s2)) == null ? void 0 : f2.contains(c2.value.activeElement)));
  }
  return watchEffect(() => o2 == null ? void 0 : o2(I)), E$1((p2 = c2.value) == null ? void 0 : p2.defaultView, "focus", (r2) => {
    var a2, f2;
    u2.value === 0 && (i2() || !d2 || !s2 || (a2 = o$1(P2.beforePanelSentinel)) != null && a2.contains(r2.target) || (f2 = o$1(P2.afterPanelSentinel)) != null && f2.contains(r2.target) || P2.closePopover());
  }, true), y([d2, s2], (r2, a2) => {
    var f2;
    P2.closePopover(), h$1(a2, F$2.Loose) || (r2.preventDefault(), (f2 = o$1(d2)) == null || f2.focus());
  }, computed(() => u2.value === 0)), () => {
    let r2 = { open: u2.value === 0, close: P2.close };
    return P$3({ theirProps: m2, ourProps: { ref: b2 }, slot: r2, slots: S2, attrs: v2, name: "Popover" });
  };
} }), ke = defineComponent({ name: "PopoverButton", props: { as: { type: [Object, String], default: "button" }, disabled: { type: [Boolean], default: false } }, inheritAttrs: false, setup(m2, { attrs: S2, slots: v2, expose: E2 }) {
  let t2 = V("PopoverButton"), e2 = computed(() => m$2(t2.button));
  E2({ el: t2.button, $el: t2.button });
  let b2 = oe$2(), u2 = b2 == null ? void 0 : b2.closeOthers, d2 = ve(), g2 = d2 === null ? false : d2 === t2.panelId, y2 = ref(null), s2 = `headlessui-focus-sentinel-${t$1()}`;
  g2 || watchEffect(() => {
    t2.button.value = y2.value;
  });
  let c2 = b$2(computed(() => ({ as: m2.as, type: S2.type })), y2);
  function h2(o2) {
    var i2, p2, r2, a2, f2;
    if (g2) {
      if (t2.popoverState.value === 1)
        return;
      switch (o2.key) {
        case o$2.Space:
        case o$2.Enter:
          o2.preventDefault(), (p2 = (i2 = o2.target).click) == null || p2.call(i2), t2.closePopover(), (r2 = o$1(t2.button)) == null || r2.focus();
          break;
      }
    } else
      switch (o2.key) {
        case o$2.Space:
        case o$2.Enter:
          o2.preventDefault(), o2.stopPropagation(), t2.popoverState.value === 1 && (u2 == null || u2(t2.buttonId)), t2.togglePopover();
          break;
        case o$2.Escape:
          if (t2.popoverState.value !== 0)
            return u2 == null ? void 0 : u2(t2.buttonId);
          if (!o$1(t2.button) || ((a2 = e2.value) == null ? void 0 : a2.activeElement) && !((f2 = o$1(t2.button)) != null && f2.contains(e2.value.activeElement)))
            return;
          o2.preventDefault(), o2.stopPropagation(), t2.closePopover();
          break;
      }
  }
  function P2(o2) {
    g2 || o2.key === o$2.Space && o2.preventDefault();
  }
  function I(o2) {
    var i2, p2;
    m2.disabled || (g2 ? (t2.closePopover(), (i2 = o$1(t2.button)) == null || i2.focus()) : (o2.preventDefault(), o2.stopPropagation(), t2.popoverState.value === 1 && (u2 == null || u2(t2.buttonId)), t2.togglePopover(), (p2 = o$1(t2.button)) == null || p2.focus()));
  }
  function l2(o2) {
    o2.preventDefault(), o2.stopPropagation();
  }
  return () => {
    let o2 = t2.popoverState.value === 0, i2 = { open: o2 }, p2 = g2 ? { ref: y2, type: c2.value, onKeydown: h2, onClick: I } : { ref: y2, id: t2.buttonId, type: c2.value, "aria-expanded": m2.disabled ? void 0 : t2.popoverState.value === 0, "aria-controls": o$1(t2.panel) ? t2.panelId : void 0, disabled: m2.disabled ? true : void 0, onKeydown: h2, onKeyup: P2, onClick: I, onMousedown: l2 }, r2 = n();
    function a$1() {
      let f2 = o$1(t2.panel);
      if (!f2)
        return;
      function F2() {
        u$4(r2.value, { [d$3.Forwards]: () => P$2(f2, M.First), [d$3.Backwards]: () => P$2(f2, M.Last) });
      }
      F2();
    }
    return h$2(Fragment, [P$3({ ourProps: p2, theirProps: { ...S2, ...m2 }, slot: i2, attrs: S2, slots: v2, name: "PopoverButton" }), o2 && !g2 && t2.isPortalled.value && h$2(f, { id: s2, features: a.Focusable, as: "button", type: "button", onFocus: a$1 })]);
  };
} });
defineComponent({ name: "PopoverOverlay", props: { as: { type: [Object, String], default: "div" }, static: { type: Boolean, default: false }, unmount: { type: Boolean, default: true } }, setup(m2, { attrs: S2, slots: v2 }) {
  let E2 = V("PopoverOverlay"), t2 = `headlessui-popover-overlay-${t$1()}`, e2 = p$1(), b2 = computed(() => e2 !== null ? e2.value === l$2.Open : E2.popoverState.value === 0);
  function u2() {
    E2.closePopover();
  }
  return () => {
    let d2 = { open: E2.popoverState.value === 0 };
    return P$3({ ourProps: { id: t2, "aria-hidden": true, onClick: u2 }, theirProps: m2, slot: d2, attrs: S2, slots: v2, features: R$1.RenderStrategy | R$1.Static, visible: b2.value, name: "PopoverOverlay" });
  };
} });
let Le = defineComponent({ name: "PopoverPanel", props: { as: { type: [Object, String], default: "div" }, static: { type: Boolean, default: false }, unmount: { type: Boolean, default: true }, focus: { type: Boolean, default: false } }, inheritAttrs: false, setup(m2, { attrs: S2, slots: v2, expose: E2 }) {
  let { focus: t2 } = m2, e2 = V("PopoverPanel"), b2 = computed(() => m$2(e2.panel)), u2 = `headlessui-focus-sentinel-before-${t$1()}`, d2 = `headlessui-focus-sentinel-after-${t$1()}`;
  E2({ el: e2.panel, $el: e2.panel }), provide(ne, e2.panelId), watchEffect(() => {
    var o2, i2;
    if (!t2 || e2.popoverState.value !== 0 || !e2.panel)
      return;
    let l2 = (o2 = b2.value) == null ? void 0 : o2.activeElement;
    (i2 = o$1(e2.panel)) != null && i2.contains(l2) || P$2(o$1(e2.panel), M.First);
  });
  let g2 = p$1(), y2 = computed(() => g2 !== null ? g2.value === l$2.Open : e2.popoverState.value === 0);
  function s2(l2) {
    var o2, i2;
    switch (l2.key) {
      case o$2.Escape:
        if (e2.popoverState.value !== 0 || !o$1(e2.panel) || b2.value && !((o2 = o$1(e2.panel)) != null && o2.contains(b2.value.activeElement)))
          return;
        l2.preventDefault(), l2.stopPropagation(), e2.closePopover(), (i2 = o$1(e2.button)) == null || i2.focus();
        break;
    }
  }
  function c2(l2) {
    var i2, p2, r2, a2, f2;
    let o2 = l2.relatedTarget;
    !o2 || !o$1(e2.panel) || (i2 = o$1(e2.panel)) != null && i2.contains(o2) || (e2.closePopover(), (((r2 = (p2 = o$1(e2.beforePanelSentinel)) == null ? void 0 : p2.contains) == null ? void 0 : r2.call(p2, o2)) || ((f2 = (a2 = o$1(e2.afterPanelSentinel)) == null ? void 0 : a2.contains) == null ? void 0 : f2.call(a2, o2))) && o2.focus({ preventScroll: true }));
  }
  let h2 = n();
  function P2() {
    let l2 = o$1(e2.panel);
    if (!l2)
      return;
    function o2() {
      u$4(h2.value, { [d$3.Forwards]: () => {
        P$2(l2, M.Next);
      }, [d$3.Backwards]: () => {
        var i2;
        (i2 = o$1(e2.button)) == null || i2.focus({ preventScroll: true });
      } });
    }
    o2();
  }
  function I() {
    let l2 = o$1(e2.panel);
    if (!l2)
      return;
    function o2() {
      u$4(h2.value, { [d$3.Forwards]: () => {
        var x2, R2;
        let i2 = o$1(e2.button), p2 = o$1(e2.panel);
        if (!i2)
          return;
        let r2 = E$2(), a2 = r2.indexOf(i2), f2 = r2.slice(0, a2 + 1), M$1 = [...r2.slice(a2 + 1), ...f2];
        for (let C2 of M$1.slice())
          if (((R2 = (x2 = C2 == null ? void 0 : C2.id) == null ? void 0 : x2.startsWith) == null ? void 0 : R2.call(x2, "headlessui-focus-sentinel-")) || (p2 == null ? void 0 : p2.contains(C2))) {
            let D = M$1.indexOf(C2);
            D !== -1 && M$1.splice(D, 1);
          }
        P$2(M$1, M.First, false);
      }, [d$3.Backwards]: () => P$2(l2, M.Previous) });
    }
    o2();
  }
  return () => {
    let l2 = { open: e2.popoverState.value === 0, close: e2.close }, o2 = { ref: e2.panel, id: e2.panelId, onKeydown: s2, onFocusout: t2 && e2.popoverState.value === 0 ? c2 : void 0, tabIndex: -1 };
    return P$3({ ourProps: o2, theirProps: { ...S2, ...w$4(m2, ["focus"]) }, attrs: S2, slot: l2, slots: { ...v2, default: (...i2) => {
      var p2;
      return [h$2(Fragment, [y2.value && e2.isPortalled.value && h$2(f, { id: u2, ref: e2.beforePanelSentinel, features: a.Focusable, as: "button", type: "button", onFocus: P2 }), (p2 = v2.default) == null ? void 0 : p2.call(v2, ...i2), y2.value && e2.isPortalled.value && h$2(f, { id: d2, ref: e2.afterPanelSentinel, features: a.Focusable, as: "button", type: "button", onFocus: I })])];
    } }, features: R$1.RenderStrategy | R$1.Static, visible: y2.value, name: "PopoverPanel" });
  };
} }), He = defineComponent({ name: "PopoverGroup", props: { as: { type: [Object, String], default: "div" } }, setup(m2, { attrs: S2, slots: v2, expose: E2 }) {
  let t2 = ref(null), e2 = ref([]), b2 = computed(() => m$2(t2));
  E2({ el: t2, $el: t2 });
  function u2(s2) {
    let c2 = e2.value.indexOf(s2);
    c2 !== -1 && e2.value.splice(c2, 1);
  }
  function d2(s2) {
    return e2.value.push(s2), () => {
      u2(s2);
    };
  }
  function g2() {
    var h2;
    let s2 = b2.value;
    if (!s2)
      return false;
    let c2 = s2.activeElement;
    return (h2 = o$1(t2)) != null && h2.contains(c2) ? true : e2.value.some((P2) => {
      var I, l2;
      return ((I = s2.getElementById(P2.buttonId)) == null ? void 0 : I.contains(c2)) || ((l2 = s2.getElementById(P2.panelId)) == null ? void 0 : l2.contains(c2));
    });
  }
  function y2(s2) {
    for (let c2 of e2.value)
      c2.buttonId !== s2 && c2.close();
  }
  return provide(te, { registerPopover: d2, unregisterPopover: u2, isFocusWithinPopoverGroup: g2, closeOthers: y2 }), () => P$3({ ourProps: { ref: t2 }, theirProps: m2, slot: {}, attrs: S2, slots: v2, name: "PopoverGroup" });
} });
let d$2 = defineComponent({ props: { onFocus: { type: Function, required: true } }, setup(t2) {
  let n2 = ref(true);
  return () => n2.value ? h$2(f, { as: "button", type: "button", features: a.Focusable, onFocus(o2) {
    o2.preventDefault();
    let e2, a2 = 50;
    function r2() {
      var u2;
      if (a2-- <= 0) {
        e2 && cancelAnimationFrame(e2);
        return;
      }
      if ((u2 = t2.onFocus) != null && u2.call(t2)) {
        n2.value = false, cancelAnimationFrame(e2);
        return;
      }
      e2 = requestAnimationFrame(r2);
    }
    e2 = requestAnimationFrame(r2);
  } }) : null;
} });
let j = Symbol("TabsContext");
function E(l2) {
  let i2 = inject(j, null);
  if (i2 === null) {
    let o2 = new Error(`<${l2} /> is missing a parent <TabGroup /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(o2, E), o2;
  }
  return i2;
}
let oe$1 = defineComponent({ name: "TabGroup", emits: { change: (l2) => true }, props: { as: { type: [Object, String], default: "template" }, selectedIndex: { type: [Number], default: null }, defaultIndex: { type: [Number], default: 0 }, vertical: { type: [Boolean], default: false }, manual: { type: [Boolean], default: false } }, inheritAttrs: false, setup(l2, { slots: i2, attrs: o2, emit: f2 }) {
  let e2 = ref(null), s2 = ref([]), n2 = ref([]), c2 = computed(() => l2.selectedIndex !== null), p2 = computed(() => c2.value ? l2.selectedIndex : e2.value), b2 = { selectedIndex: e2, orientation: computed(() => l2.vertical ? "vertical" : "horizontal"), activation: computed(() => l2.manual ? "manual" : "auto"), tabs: s2, panels: n2, setSelectedIndex(t2) {
    p2.value !== t2 && f2("change", t2), c2.value || (e2.value = t2);
  }, registerTab(t2) {
    s2.value.includes(t2) || s2.value.push(t2);
  }, unregisterTab(t2) {
    let r2 = s2.value.indexOf(t2);
    r2 !== -1 && s2.value.splice(r2, 1);
  }, registerPanel(t2) {
    n2.value.includes(t2) || n2.value.push(t2);
  }, unregisterPanel(t2) {
    let r2 = n2.value.indexOf(t2);
    r2 !== -1 && n2.value.splice(r2, 1);
  } };
  return provide(j, b2), watchEffect(() => {
    var R2;
    if (b2.tabs.value.length <= 0 || l2.selectedIndex === null && e2.value !== null)
      return;
    let t2 = b2.tabs.value.map((y2) => o$1(y2)).filter(Boolean), r2 = t2.filter((y2) => !y2.hasAttribute("disabled")), d2 = (R2 = l2.selectedIndex) != null ? R2 : l2.defaultIndex;
    if (d2 < 0)
      e2.value = t2.indexOf(r2[0]);
    else if (d2 > b2.tabs.value.length)
      e2.value = t2.indexOf(r2[r2.length - 1]);
    else {
      let y2 = t2.slice(0, d2), u2 = [...t2.slice(d2), ...y2].find((T2) => r2.includes(T2));
      if (!u2)
        return;
      e2.value = t2.indexOf(u2);
    }
  }), () => {
    let t2 = { selectedIndex: e2.value };
    return h$2(Fragment, [s2.value.length <= 0 && h$2(d$2, { onFocus: () => {
      for (let r2 of s2.value) {
        let d2 = o$1(r2);
        if ((d2 == null ? void 0 : d2.tabIndex) === 0)
          return d2.focus(), true;
      }
      return false;
    } }), P$3({ theirProps: { ...o2, ...w$4(l2, ["selectedIndex", "defaultIndex", "manual", "vertical", "onChange"]) }, ourProps: {}, slot: t2, slots: i2, attrs: o2, name: "TabGroup" })]);
  };
} }), se$1 = defineComponent({ name: "TabList", props: { as: { type: [Object, String], default: "div" } }, setup(l2, { attrs: i2, slots: o2 }) {
  let f2 = E("TabList");
  return () => {
    let e2 = { selectedIndex: f2.selectedIndex.value }, s2 = { role: "tablist", "aria-orientation": f2.orientation.value };
    return P$3({ ourProps: s2, theirProps: l2, slot: e2, attrs: i2, slots: o2, name: "TabList" });
  };
} }), de = defineComponent({ name: "Tab", props: { as: { type: [Object, String], default: "button" }, disabled: { type: [Boolean], default: false } }, setup(l2, { attrs: i2, slots: o2, expose: f2 }) {
  let e2 = E("Tab"), s2 = `headlessui-tabs-tab-${t$1()}`, n2 = ref(null);
  f2({ el: n2, $el: n2 }), onMounted(() => e2.registerTab(n2)), onUnmounted(() => e2.unregisterTab(n2));
  let c2 = computed(() => e2.tabs.value.indexOf(n2)), p2 = computed(() => c2.value === e2.selectedIndex.value);
  function b2(a2) {
    var T2;
    let u2 = a2();
    if (u2 === N.Success && e2.activation.value === "auto") {
      let L2 = (T2 = m$2(n2)) == null ? void 0 : T2.activeElement, M2 = e2.tabs.value.findIndex((B2) => o$1(B2) === L2);
      M2 !== -1 && e2.setSelectedIndex(M2);
    }
    return u2;
  }
  function t$2(a2) {
    let u2 = e2.tabs.value.map((L2) => o$1(L2)).filter(Boolean);
    if (a2.key === o$2.Space || a2.key === o$2.Enter) {
      a2.preventDefault(), a2.stopPropagation(), e2.setSelectedIndex(c2.value);
      return;
    }
    switch (a2.key) {
      case o$2.Home:
      case o$2.PageUp:
        return a2.preventDefault(), a2.stopPropagation(), b2(() => P$2(u2, M.First));
      case o$2.End:
      case o$2.PageDown:
        return a2.preventDefault(), a2.stopPropagation(), b2(() => P$2(u2, M.Last));
    }
    if (b2(() => u$4(e2.orientation.value, { vertical() {
      return a2.key === o$2.ArrowUp ? P$2(u2, M.Previous | M.WrapAround) : a2.key === o$2.ArrowDown ? P$2(u2, M.Next | M.WrapAround) : N.Error;
    }, horizontal() {
      return a2.key === o$2.ArrowLeft ? P$2(u2, M.Previous | M.WrapAround) : a2.key === o$2.ArrowRight ? P$2(u2, M.Next | M.WrapAround) : N.Error;
    } })) === N.Success)
      return a2.preventDefault();
  }
  let r2 = ref(false);
  function d2() {
    var a2;
    r2.value || (r2.value = true, !l2.disabled && ((a2 = o$1(n2)) == null || a2.focus(), e2.setSelectedIndex(c2.value), t(() => {
      r2.value = false;
    })));
  }
  function R2(a2) {
    a2.preventDefault();
  }
  let y2 = b$2(computed(() => ({ as: l2.as, type: i2.type })), n2);
  return () => {
    var T2;
    let a2 = { selected: p2.value }, u2 = { ref: n2, onKeydown: t$2, onMousedown: R2, onClick: d2, id: s2, role: "tab", type: y2.value, "aria-controls": (T2 = o$1(e2.panels.value[c2.value])) == null ? void 0 : T2.id, "aria-selected": p2.value, tabIndex: p2.value ? 0 : -1, disabled: l2.disabled ? true : void 0 };
    return P$3({ ourProps: u2, theirProps: l2, slot: a2, attrs: i2, slots: o2, name: "Tab" });
  };
} }), fe$1 = defineComponent({ name: "TabPanels", props: { as: { type: [Object, String], default: "div" } }, setup(l2, { slots: i2, attrs: o2 }) {
  let f2 = E("TabPanels");
  return () => {
    let e2 = { selectedIndex: f2.selectedIndex.value };
    return P$3({ theirProps: l2, ourProps: {}, slot: e2, attrs: o2, slots: i2, name: "TabPanels" });
  };
} }), ce = defineComponent({ name: "TabPanel", props: { as: { type: [Object, String], default: "div" }, static: { type: Boolean, default: false }, unmount: { type: Boolean, default: true } }, setup(l2, { attrs: i2, slots: o2, expose: f$12 }) {
  let e2 = E("TabPanel"), s2 = `headlessui-tabs-panel-${t$1()}`, n2 = ref(null);
  f$12({ el: n2, $el: n2 }), onMounted(() => e2.registerPanel(n2)), onUnmounted(() => e2.unregisterPanel(n2));
  let c2 = computed(() => e2.panels.value.indexOf(n2)), p2 = computed(() => c2.value === e2.selectedIndex.value);
  return () => {
    var r2;
    let b2 = { selected: p2.value }, t2 = { ref: n2, id: s2, role: "tabpanel", "aria-labelledby": (r2 = o$1(e2.tabs.value[c2.value])) == null ? void 0 : r2.id, tabIndex: p2.value ? 0 : -1 };
    return !p2.value && l2.unmount && !l2.static ? h$2(f, { as: "span", ...t2 }) : P$3({ ourProps: t2, theirProps: l2, slot: b2, attrs: i2, slots: o2, features: R$1.Static | R$1.RenderStrategy, visible: p2.value, name: "TabPanel" });
  };
} });
function l(r2) {
  let e2 = { called: false };
  return (...t2) => {
    if (!e2.called)
      return e2.called = true, r2(...t2);
  };
}
function m(e2, ...t2) {
  e2 && t2.length > 0 && e2.classList.add(...t2);
}
function d$1(e2, ...t2) {
  e2 && t2.length > 0 && e2.classList.remove(...t2);
}
var g = ((i2) => (i2.Finished = "finished", i2.Cancelled = "cancelled", i2))(g || {});
function F$1(e2, t2) {
  let i2 = s();
  if (!e2)
    return i2.dispose;
  let { transitionDuration: n2, transitionDelay: a2 } = getComputedStyle(e2), [l2, s$12] = [n2, a2].map((o2) => {
    let [u2 = 0] = o2.split(",").filter(Boolean).map((r2) => r2.includes("ms") ? parseFloat(r2) : parseFloat(r2) * 1e3).sort((r2, c2) => c2 - r2);
    return u2;
  });
  return l2 !== 0 ? i2.setTimeout(() => t2("finished"), l2 + s$12) : t2("finished"), i2.add(() => t2("cancelled")), i2.dispose;
}
function L(e2, t2, i2, n2, a2, l$12) {
  let s$12 = s(), o2 = l$12 !== void 0 ? l(l$12) : () => {
  };
  return d$1(e2, ...a2), m(e2, ...t2, ...i2), s$12.nextFrame(() => {
    d$1(e2, ...i2), m(e2, ...n2), s$12.add(F$1(e2, (u2) => (d$1(e2, ...n2, ...t2), m(e2, ...a2), o2(u2))));
  }), s$12.add(() => d$1(e2, ...t2, ...i2, ...n2, ...a2)), s$12.add(() => o2("cancelled")), s$12.dispose;
}
function d(e2 = "") {
  return e2.split(" ").filter((t2) => t2.trim().length > 1);
}
let B = Symbol("TransitionContext");
var ae = ((a2) => (a2.Visible = "visible", a2.Hidden = "hidden", a2))(ae || {});
function le() {
  return inject(B, null) !== null;
}
function ie() {
  let e2 = inject(B, null);
  if (e2 === null)
    throw new Error("A <TransitionChild /> is used but it is missing a parent <TransitionRoot />.");
  return e2;
}
function se() {
  let e2 = inject(F, null);
  if (e2 === null)
    throw new Error("A <TransitionChild /> is used but it is missing a parent <TransitionRoot />.");
  return e2;
}
let F = Symbol("NestingContext");
function w(e2) {
  return "children" in e2 ? w(e2.children) : e2.value.filter(({ state: t2 }) => t2 === "visible").length > 0;
}
function K(e2) {
  let t2 = ref([]), a2 = ref(false);
  onMounted(() => a2.value = true), onUnmounted(() => a2.value = false);
  function s2(r2, n2 = O$1.Hidden) {
    let l2 = t2.value.findIndex(({ id: i2 }) => i2 === r2);
    l2 !== -1 && (u$4(n2, { [O$1.Unmount]() {
      t2.value.splice(l2, 1);
    }, [O$1.Hidden]() {
      t2.value[l2].state = "hidden";
    } }), !w(t2) && a2.value && (e2 == null || e2()));
  }
  function v2(r2) {
    let n2 = t2.value.find(({ id: l2 }) => l2 === r2);
    return n2 ? n2.state !== "visible" && (n2.state = "visible") : t2.value.push({ id: r2, state: "visible" }), () => s2(r2, O$1.Unmount);
  }
  return { children: t2, register: v2, unregister: s2 };
}
let _ = R$1.RenderStrategy, oe = defineComponent({ props: { as: { type: [Object, String], default: "div" }, show: { type: [Boolean], default: null }, unmount: { type: [Boolean], default: true }, appear: { type: [Boolean], default: false }, enter: { type: [String], default: "" }, enterFrom: { type: [String], default: "" }, enterTo: { type: [String], default: "" }, entered: { type: [String], default: "" }, leave: { type: [String], default: "" }, leaveFrom: { type: [String], default: "" }, leaveTo: { type: [String], default: "" } }, emits: { beforeEnter: () => true, afterEnter: () => true, beforeLeave: () => true, afterLeave: () => true }, setup(e2, { emit: t2, attrs: a2, slots: s2, expose: v2 }) {
  if (!le() && f$1())
    return () => h$2(fe, { ...e2, onBeforeEnter: () => t2("beforeEnter"), onAfterEnter: () => t2("afterEnter"), onBeforeLeave: () => t2("beforeLeave"), onAfterLeave: () => t2("afterLeave") }, s2);
  let r2 = ref(null), n2 = ref("visible"), l2 = computed(() => e2.unmount ? O$1.Unmount : O$1.Hidden);
  v2({ el: r2, $el: r2 });
  let { show: i2, appear: x2 } = ie(), { register: g$12, unregister: p2 } = se(), R2 = { value: true }, m2 = t$1(), S2 = { value: false }, N2 = K(() => {
    S2.value || (n2.value = "hidden", p2(m2), t2("afterLeave"));
  });
  onMounted(() => {
    let o2 = g$12(m2);
    onUnmounted(o2);
  }), watchEffect(() => {
    if (l2.value === O$1.Hidden && !!m2) {
      if (i2 && n2.value !== "visible") {
        n2.value = "visible";
        return;
      }
      u$4(n2.value, { ["hidden"]: () => p2(m2), ["visible"]: () => g$12(m2) });
    }
  });
  let k2 = d(e2.enter), $ = d(e2.enterFrom), q = d(e2.enterTo), O2 = d(e2.entered), z = d(e2.leave), G2 = d(e2.leaveFrom), J2 = d(e2.leaveTo);
  onMounted(() => {
    watchEffect(() => {
      if (n2.value === "visible") {
        let o2 = o$1(r2);
        if (o2 instanceof Comment && o2.data === "")
          throw new Error("Did you forget to passthrough the `ref` to the actual DOM node?");
      }
    });
  });
  function Q(o2) {
    let c2 = R2.value && !x2.value, u2 = o$1(r2);
    !u2 || !(u2 instanceof HTMLElement) || c2 || (S2.value = true, i2.value && t2("beforeEnter"), i2.value || t2("beforeLeave"), o2(i2.value ? L(u2, k2, $, q, O2, (C2) => {
      S2.value = false, C2 === g.Finished && t2("afterEnter");
    }) : L(u2, z, G2, J2, O2, (C2) => {
      S2.value = false, C2 === g.Finished && (w(N2) || (n2.value = "hidden", p2(m2), t2("afterLeave")));
    })));
  }
  return onMounted(() => {
    watch([i2], (o2, c2, u2) => {
      Q(u2), R2.value = false;
    }, { immediate: true });
  }), provide(F, N2), c$1(computed(() => u$4(n2.value, { ["visible"]: l$2.Open, ["hidden"]: l$2.Closed }))), () => {
    let { appear: o2, show: c2, enter: u2, enterFrom: C2, enterTo: de2, entered: ve2, leave: pe, leaveFrom: me, leaveTo: Te, ...W } = e2;
    return P$3({ theirProps: W, ourProps: { ref: r2 }, slot: {}, slots: s2, attrs: a2, features: _, visible: n2.value === "visible", name: "TransitionChild" });
  };
} }), ue = oe, fe = defineComponent({ inheritAttrs: false, props: { as: { type: [Object, String], default: "div" }, show: { type: [Boolean], default: null }, unmount: { type: [Boolean], default: true }, appear: { type: [Boolean], default: false }, enter: { type: [String], default: "" }, enterFrom: { type: [String], default: "" }, enterTo: { type: [String], default: "" }, entered: { type: [String], default: "" }, leave: { type: [String], default: "" }, leaveFrom: { type: [String], default: "" }, leaveTo: { type: [String], default: "" } }, emits: { beforeEnter: () => true, afterEnter: () => true, beforeLeave: () => true, afterLeave: () => true }, setup(e2, { emit: t2, attrs: a2, slots: s2 }) {
  let v2 = p$1(), r2 = computed(() => e2.show === null && v2 !== null ? u$4(v2.value, { [l$2.Open]: true, [l$2.Closed]: false }) : e2.show);
  watchEffect(() => {
    if (![true, false].includes(r2.value))
      throw new Error('A <Transition /> is used but it is missing a `:show="true | false"` prop.');
  });
  let n2 = ref(r2.value ? "visible" : "hidden"), l2 = K(() => {
    n2.value = "hidden";
  }), i2 = ref(true), x2 = { show: r2, appear: computed(() => e2.appear || !i2.value) };
  return onMounted(() => {
    watchEffect(() => {
      i2.value = false, r2.value ? n2.value = "visible" : w(l2) || (n2.value = "hidden");
    });
  }), provide(F, l2), provide(B, x2), () => {
    let g2 = w$4(e2, ["show", "appear", "unmount", "onBeforeEnter", "onBeforeLeave", "onAfterEnter", "onAfterLeave"]), p2 = { unmount: e2.unmount };
    return P$3({ ourProps: { ...p2, as: "template" }, theirProps: {}, slot: {}, slots: { ...s2, default: () => [h$2(ue, { onBeforeEnter: () => t2("beforeEnter"), onAfterEnter: () => t2("afterEnter"), onBeforeLeave: () => t2("beforeLeave"), onAfterLeave: () => t2("afterLeave"), ...a2, ...p2, ...g2 }, s2.default)] }, attrs: {}, features: _, visible: n2.value === "visible", name: "Transition" });
  };
} });
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$4 = {
  name: "ImageTag",
  props: {
    src: {
      type: Object,
      required: true
    },
    height: String,
    width: {
      type: String,
      default(rawProps) {
        return rawProps.src.width;
      }
    },
    sizes: String,
    srcsetWidths: {
      type: Array,
      default(rawProps) {
        return [rawProps.width];
      }
    },
    srcset: String,
    preload: {
      type: Boolean,
      default: false
    },
    alt: {
      type: String,
      default(rawProps) {
        return rawProps.src.alt;
      }
    },
    classes: String
  },
  computed: {
    formattedSrc() {
      return `${this.src.url ? this.src.url : this.src.src}&width=${this.width}`;
    },
    formattedSrcSet() {
      var srcset = "";
      this.srcsetWidths.forEach((w2) => {
        srcset += `${this.src.url ? this.src.url : this.src.src}&width=${w2} ${w2}w,`;
      });
      return srcset;
    }
  }
};
const _hoisted_1$4 = ["srcset", "src", "sizes", "alt", "preload", "width", "height"];
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("img", {
    srcset: $options.formattedSrcSet,
    src: $options.formattedSrc,
    sizes: $props.sizes,
    alt: $props.alt,
    preload: $props.preload,
    width: $props.width,
    height: $props.height,
    class: normalizeClass($props.classes)
  }, null, 10, _hoisted_1$4);
}
const ImageTag = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4]]);
const _sfc_main$3 = {
  name: "Mega Menu",
  components: { PopoverGroup: He, Popover: ce$1, PopoverButton: ke, PopoverPanel: Le, TabGroup: oe$1, TabList: se$1, Tab: de, TabPanels: fe$1, TabPanel: ce, Disclosure: A, DisclosureButton: G, DisclosurePanel: J, ImageTag },
  data() {
    return {
      screen: window.innerWidth
    };
  },
  props: {
    iconSize: Number,
    iconStrokeWidth: Number,
    settings: Object,
    blocks: Array,
    topMenu: Object,
    mobileLinks: Object
  },
  computed: {},
  watch: {},
  methods: {
    blocksByParent(parentHandle) {
      return this.blocks.filter((b2) => b2.title == parentHandle);
    }
  },
  mounted() {
    window.addEventListener("resize", () => {
      this.screen = window.innerWidth;
    });
    window.addEventListener("deviceorientation", () => {
      this.screen = window.innerWidth;
    });
    this.blocks.forEach((block) => {
      var match = this.topMenu.find((item) => item.title.toLowerCase() == block.settings.title.toLowerCase());
      if (match != void 0) {
        var pos = this.topMenu.indexOf(match);
        this.topMenu[pos].blocks.push(block);
      }
    });
    const header2 = document.querySelector("header");
    const menuTrigger = document.querySelector(".header__menu-trigger");
    const topLinks = Array.from(document.querySelectorAll(".header__menu-top .top-link > a"));
    var observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName == "aria-expanded") {
          var activeTopLink = topLinks.find((t2) => t2.getAttribute("aria-expanded") == "true") || false;
          var triggerVisible = window.getComputedStyle(menuTrigger).display == "none" ? false : true;
          if (activeTopLink) {
            var isDropdown = activeTopLink.nextElementSibling.classList.contains("header__menu-dropdown");
          }
          console.log("top links", topLinks);
          console.log("top link", activeTopLink);
          console.log("dropdown?", isDropdown);
          if (menuTrigger.getAttribute("aria-expanded") == "true" && window.innerWidth < 1024 || activeTopLink && !isDropdown && activeTopLink.getAttribute("aria-expanded") == "true") {
            console.log("hello??????????");
            document.body.classList.add("menu--opened");
            header2.classList.add("menu--opened");
          } else if (menuTrigger.getAttribute("aria-expanded") == "false" || !triggerVisible && !activeTopLink) {
            document.body.classList.remove("menu--opened");
            header2.classList.remove("menu--opened");
          }
        }
      });
    });
    observer.observe(menuTrigger, {
      attributes: true
    });
    topLinks.forEach((topLink) => {
      observer.observe(topLink, {
        attributes: true
      });
    });
  }
};
const _hoisted_1$3 = { class: "icon target" };
const _hoisted_2$3 = ["width", "height"];
const _hoisted_3$3 = /* @__PURE__ */ createBaseVNode("path", { d: "M21 18H3M21 12H3M21 6H3" }, null, -1);
const _hoisted_4$3 = [
  _hoisted_3$3
];
const _hoisted_5$3 = { class: "mobile-header" };
const _hoisted_6$3 = ["onClick"];
const _hoisted_7$3 = { class: "icon target" };
const _hoisted_8$2 = ["width", "height"];
const _hoisted_9$2 = /* @__PURE__ */ createBaseVNode("path", {
  "fill-rule": "evenodd",
  "clip-rule": "evenodd",
  d: "M1 4.51a.5.5 0 000 1h3.5l.01 3.5a.5.5 0 001-.01V5.5l3.5-.01a.5.5 0 00-.01-1H5.5L5.49.99a.5.5 0 00-1 .01v3.5l-3.5.01H1z",
  fill: "currentColor"
}, null, -1);
const _hoisted_10$2 = [
  _hoisted_9$2
];
const _hoisted_11$2 = { class: "submenus" };
const _hoisted_12$2 = ["href"];
const _hoisted_13$2 = {
  key: 0,
  class: "icon target expand"
};
const _hoisted_14$2 = ["width", "height"];
const _hoisted_15$2 = /* @__PURE__ */ createBaseVNode("path", {
  "fill-rule": "evenodd",
  "clip-rule": "evenodd",
  d: "M1 4.51a.5.5 0 000 1h3.5l.01 3.5a.5.5 0 001-.01V5.5l3.5-.01a.5.5 0 00-.01-1H5.5L5.49.99a.5.5 0 00-1 .01v3.5l-3.5.01H1z",
  fill: "currentColor"
}, null, -1);
const _hoisted_16$2 = [
  _hoisted_15$2
];
const _hoisted_17$2 = ["href"];
const _hoisted_18$2 = {
  key: 0,
  class: "icon target expand"
};
const _hoisted_19$1 = ["width", "height"];
const _hoisted_20$1 = /* @__PURE__ */ createBaseVNode("path", {
  "fill-rule": "evenodd",
  "clip-rule": "evenodd",
  d: "M1 4.51a.5.5 0 000 1h3.5l.01 3.5a.5.5 0 001-.01V5.5l3.5-.01a.5.5 0 00-.01-1H5.5L5.49.99a.5.5 0 00-1 .01v3.5l-3.5.01H1z",
  fill: "currentColor"
}, null, -1);
const _hoisted_21$1 = [
  _hoisted_20$1
];
const _hoisted_22$1 = {
  key: 0,
  class: "mobile-links"
};
const _hoisted_23$1 = ["href"];
const _hoisted_24$1 = { class: "mobile-footer" };
const _hoisted_25$1 = { href: "/account" };
const _hoisted_26$1 = { class: "icon target" };
const _hoisted_27$1 = ["width", "height", "stroke-width"];
const _hoisted_28$1 = /* @__PURE__ */ createBaseVNode("circle", {
  cx: "12",
  cy: "6",
  r: "4",
  fill: "#000",
  opacity: ".25",
  stroke: "none"
}, null, -1);
const _hoisted_29 = /* @__PURE__ */ createBaseVNode("circle", {
  cx: "12",
  cy: "6",
  r: "4"
}, null, -1);
const _hoisted_30 = /* @__PURE__ */ createBaseVNode("path", {
  d: "M17.67 22a2 2 0 0 0 1.92-2.56A7.8 7.8 0 0 0 12 14a7.8 7.8 0 0 0-7.59 5.44A2 2 0 0 0 6.34 22Z",
  fill: "#000",
  opacity: ".25",
  stroke: "none"
}, null, -1);
const _hoisted_31 = /* @__PURE__ */ createBaseVNode("path", { d: "M17.67 22a2 2 0 0 0 1.92-2.56A7.8 7.8 0 0 0 12 14a7.8 7.8 0 0 0-7.59 5.44A2 2 0 0 0 6.34 22Z" }, null, -1);
const _hoisted_32 = [
  _hoisted_28$1,
  _hoisted_29,
  _hoisted_30,
  _hoisted_31
];
const _hoisted_33 = { key: 0 };
const _hoisted_34 = { key: 1 };
const _hoisted_35 = { class: "menu__level0" };
const _hoisted_36 = ["href"];
const _hoisted_37 = ["href"];
const _hoisted_38 = ["href"];
const _hoisted_39 = ["href"];
const _hoisted_40 = ["href"];
const _hoisted_41 = { class: "image_content__content" };
const _hoisted_42 = { key: 0 };
const _hoisted_43 = { key: 1 };
const _hoisted_44 = ["html"];
const _hoisted_45 = ["href"];
const _hoisted_46 = ["href"];
const _hoisted_47 = { class: "dropdown" };
const _hoisted_48 = ["href"];
const _hoisted_49 = {
  key: 0,
  class: "icon target expand"
};
const _hoisted_50 = /* @__PURE__ */ createBaseVNode("svg", {
  "aria-hidden": "true",
  focusable: "false",
  role: "presentation",
  class: "icon icon-caret",
  viewBox: "0 0 10 6"
}, [
  /* @__PURE__ */ createBaseVNode("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    d: "M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z",
    fill: "currentColor"
  })
], -1);
const _hoisted_51 = [
  _hoisted_50
];
const _hoisted_52 = ["href"];
const _hoisted_53 = ["href"];
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_PopoverButton = resolveComponent("PopoverButton");
  const _component_DisclosureButton = resolveComponent("DisclosureButton");
  const _component_DisclosurePanel = resolveComponent("DisclosurePanel");
  const _component_Disclosure = resolveComponent("Disclosure");
  const _component_PopoverPanel = resolveComponent("PopoverPanel");
  const _component_image_tag = resolveComponent("image-tag");
  const _component_Popover = resolveComponent("Popover");
  const _component_PopoverGroup = resolveComponent("PopoverGroup");
  return openBlock(), createBlock(_component_Popover, null, {
    default: withCtx(() => [
      createVNode(_component_PopoverButton, {
        class: normalizeClass(["header__menu-trigger", { "hide-desktop": !$props.settings.collapse_menu_desktop }]),
        name: "menu-open__trigger",
        "aria-label": "Open  Menu"
      }, {
        default: withCtx(() => [
          createBaseVNode("span", _hoisted_1$3, [
            (openBlock(), createElementBlock("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              viewBox: "0 0 24 24",
              width: $props.iconSize,
              height: $props.iconSize,
              fill: "none",
              stroke: "#000",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }, _hoisted_4$3, 8, _hoisted_2$3))
          ])
        ]),
        _: 1
      }, 8, ["class"]),
      $data.screen < 1024 ? (openBlock(), createBlock(Transition, {
        key: 0,
        name: "slideRight"
      }, {
        default: withCtx(() => [
          createVNode(_component_PopoverPanel, {
            as: "nav",
            class: normalizeClass(["header__menu-collapsed", [`color-scheme--${$props.settings.mm_color_scheme}`]])
          }, {
            default: withCtx(({ close }) => [
              createBaseVNode("div", _hoisted_5$3, [
                createBaseVNode("button", {
                  name: "menu-close_trigger",
                  "aria-label": "Close Menu",
                  onClick: ($event) => close()
                }, [
                  createBaseVNode("span", _hoisted_7$3, [
                    (openBlock(), createElementBlock("svg", {
                      xmlns: "http://www.w3.org/2000/svg",
                      "aria-hidden": "true",
                      focusable: "false",
                      role: "presentation",
                      fill: "none",
                      viewBox: "0 0 10 10",
                      width: $props.iconSize,
                      height: $props.iconSize
                    }, _hoisted_10$2, 8, _hoisted_8$2))
                  ])
                ], 8, _hoisted_6$3)
              ]),
              createBaseVNode("div", _hoisted_11$2, [
                (openBlock(true), createElementBlock(Fragment, null, renderList($props.topMenu, (link, index) => {
                  return openBlock(), createBlock(_component_Disclosure, {
                    key: link.id
                  }, {
                    default: withCtx(({ open }) => [
                      createBaseVNode("div", {
                        class: normalizeClass(["submenu", open ? "opened" : ""])
                      }, [
                        createVNode(_component_DisclosureButton, {
                          name: [`top-link_trigger_${index}`],
                          class: "submenu__top-link"
                        }, {
                          default: withCtx(() => [
                            createBaseVNode("a", {
                              href: link.url
                            }, toDisplayString(link.title), 9, _hoisted_12$2),
                            link.links.length ? (openBlock(), createElementBlock("span", _hoisted_13$2, [
                              (openBlock(), createElementBlock("svg", {
                                xmlns: "http://www.w3.org/2000/svg",
                                "aria-hidden": "true",
                                focusable: "false",
                                role: "presentation",
                                fill: "none",
                                viewBox: "0 0 10 10",
                                width: $props.iconSize,
                                height: $props.iconSize
                              }, _hoisted_16$2, 8, _hoisted_14$2))
                            ])) : createCommentVNode("", true)
                          ]),
                          _: 2
                        }, 1032, ["name"]),
                        link.links.length ? (openBlock(), createBlock(Transition, {
                          key: 0,
                          name: "slideDown"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_DisclosurePanel, { class: "submenu__links" }, {
                              default: withCtx(() => [
                                (openBlock(true), createElementBlock(Fragment, null, renderList(link.links, (child, index2) => {
                                  return openBlock(), createBlock(_component_Disclosure, {
                                    as: "div",
                                    key: index2 + 1
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_DisclosureButton, {
                                        name: [`level1-link_trigger_${index2}`],
                                        class: "submenu__level1"
                                      }, {
                                        default: withCtx(() => [
                                          createBaseVNode("a", {
                                            href: child.url
                                          }, toDisplayString(child.title), 9, _hoisted_17$2),
                                          child.links.length ? (openBlock(), createElementBlock("span", _hoisted_18$2, [
                                            (openBlock(), createElementBlock("svg", {
                                              xmlns: "http://www.w3.org/2000/svg",
                                              "aria-hidden": "true",
                                              focusable: "false",
                                              role: "presentation",
                                              fill: "none",
                                              viewBox: "0 0 10 10",
                                              width: $props.iconSize,
                                              height: $props.iconSize
                                            }, _hoisted_21$1, 8, _hoisted_19$1))
                                          ])) : createCommentVNode("", true)
                                        ]),
                                        _: 2
                                      }, 1032, ["name"]),
                                      child.links.length ? (openBlock(), createBlock(Transition, {
                                        key: 0,
                                        name: "slideDown"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_DisclosurePanel, null, {
                                            default: withCtx(() => [
                                              createBaseVNode("ul", null, [
                                                (openBlock(true), createElementBlock(Fragment, null, renderList(child.links, (grandchild) => {
                                                  return openBlock(), createElementBlock("li", {
                                                    key: grandchild.id,
                                                    class: "submenu__level2"
                                                  }, toDisplayString(grandchild.title), 1);
                                                }), 128))
                                              ])
                                            ]),
                                            _: 2
                                          }, 1024)
                                        ]),
                                        _: 2
                                      }, 1024)) : createCommentVNode("", true)
                                    ]),
                                    _: 2
                                  }, 1024);
                                }), 128))
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 2
                        }, 1024)) : createCommentVNode("", true)
                      ], 2)
                    ]),
                    _: 2
                  }, 1024);
                }), 128))
              ]),
              $props.mobileLinks.length ? (openBlock(), createElementBlock("div", _hoisted_22$1, [
                (openBlock(true), createElementBlock(Fragment, null, renderList($props.mobileLinks, (link) => {
                  return openBlock(), createElementBlock("a", {
                    key: link.id,
                    href: link.url
                  }, toDisplayString(link.title), 9, _hoisted_23$1);
                }), 128))
              ])) : createCommentVNode("", true),
              createBaseVNode("div", _hoisted_24$1, [
                createBaseVNode("a", _hoisted_25$1, [
                  createTextVNode(" Account "),
                  createBaseVNode("span", _hoisted_26$1, [
                    (openBlock(), createElementBlock("svg", {
                      xmlns: "http://www.w3.org/2000/svg",
                      viewBox: "0 0 24 24",
                      width: $props.iconSize,
                      height: $props.iconSize,
                      fill: "none",
                      stroke: "#000",
                      "stroke-width": $props.iconStrokeWidth,
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round"
                    }, _hoisted_32, 8, _hoisted_27$1))
                  ])
                ])
              ])
            ]),
            _: 1
          }, 8, ["class"])
        ]),
        _: 1
      })) : (openBlock(), createBlock(Transition, {
        key: 1,
        name: "slideRight"
      }, {
        default: withCtx(() => [
          createVNode(_component_PopoverPanel, {
            static: !$props.settings.collapse_menu_desktop
          }, {
            default: withCtx(() => [
              createVNode(_component_PopoverGroup, {
                as: "nav",
                class: normalizeClass(["header__menu-top", [`color-scheme--${$props.settings.mm_color_scheme}`, $props.settings.collapse_menu_desktop ? "collapsed" : ""]])
              }, {
                default: withCtx(() => [
                  (openBlock(true), createElementBlock(Fragment, null, renderList($props.topMenu, (link) => {
                    return openBlock(), createBlock(_component_Popover, {
                      key: link.id,
                      class: "top-link"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_PopoverButton, {
                          as: "a",
                          href: link.url
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(link.title), 1)
                          ]),
                          _: 2
                        }, 1032, ["href"]),
                        createVNode(Transition, { name: "slideDown" }, {
                          default: withCtx(() => [
                            link.blocks.length ? (openBlock(), createBlock(_component_PopoverPanel, {
                              key: 0,
                              class: normalizeClass(["header__menu-content", [$props.settings.mm_type]])
                            }, {
                              default: withCtx(() => [
                                (openBlock(true), createElementBlock(Fragment, null, renderList(link.blocks, (block) => {
                                  return openBlock(), createElementBlock("div", {
                                    key: block.id,
                                    class: normalizeClass(["submenu-block", [block.type, block.type == "menu" ? `images-${block.settings.submenu_item_image}` : ""]])
                                  }, [
                                    block.type == "menu" ? (openBlock(), createElementBlock("div", {
                                      key: 0,
                                      class: normalizeClass([`images-${block.settings.submenu_item_image}__inner`, `${block.type}__inner`, `color-scheme--${$props.settings.mm_color_scheme}`])
                                    }, [
                                      block.settings.submenu_title != "" ? (openBlock(), createElementBlock("h4", _hoisted_33, toDisplayString(block.settings.submenu_title), 1)) : (openBlock(), createElementBlock("h4", _hoisted_34, toDisplayString(block.settings.submenu.title), 1)),
                                      createBaseVNode("ul", _hoisted_35, [
                                        (openBlock(true), createElementBlock(Fragment, null, renderList(block.settings.submenu, (link2) => {
                                          return openBlock(), createBlock(_component_Disclosure, {
                                            as: "li",
                                            key: link2.id,
                                            class: "menu__top-link"
                                          }, {
                                            default: withCtx(() => [
                                              link2.links.length ? (openBlock(), createBlock(_component_DisclosureButton, { key: 0 }, {
                                                default: withCtx(() => [
                                                  createVNode(Transition, {
                                                    name: "fade",
                                                    appear: ""
                                                  }, {
                                                    default: withCtx(() => [
                                                      link2.object && link2.object.image && block.settings.submenu_item_image != "none" ? (openBlock(), createBlock(_component_image_tag, {
                                                        key: 0,
                                                        src: link2.object.image,
                                                        width: "320",
                                                        sizes: "320px",
                                                        srcsetWidths: [320],
                                                        class: "menu__image"
                                                      }, null, 8, ["src"])) : createCommentVNode("", true)
                                                    ]),
                                                    _: 2
                                                  }, 1024),
                                                  createBaseVNode("a", {
                                                    href: link2.url
                                                  }, [
                                                    createBaseVNode("span", null, toDisplayString(link2.title), 1)
                                                  ], 8, _hoisted_36)
                                                ]),
                                                _: 2
                                              }, 1024)) : (openBlock(), createElementBlock("a", {
                                                key: 1,
                                                href: link2.url
                                              }, [
                                                createVNode(Transition, {
                                                  name: "fade",
                                                  appear: ""
                                                }, {
                                                  default: withCtx(() => [
                                                    link2.object && link2.object.image && block.settings.submenu_item_image != "none" ? (openBlock(), createBlock(_component_image_tag, {
                                                      key: 0,
                                                      src: link2.object.image,
                                                      width: "320",
                                                      sizes: "320px",
                                                      srcsetWidths: [320],
                                                      class: "menu__image"
                                                    }, null, 8, ["src"])) : createCommentVNode("", true)
                                                  ]),
                                                  _: 2
                                                }, 1024),
                                                createBaseVNode("span", null, toDisplayString(link2.title), 1)
                                              ], 8, _hoisted_37)),
                                              link2.links.length ? (openBlock(), createBlock(Transition, {
                                                key: 2,
                                                name: "slideDown"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_DisclosurePanel, {
                                                    as: "ul",
                                                    class: "menu__level1"
                                                  }, {
                                                    default: withCtx(() => [
                                                      (openBlock(true), createElementBlock(Fragment, null, renderList(link2.links, (child) => {
                                                        return openBlock(), createBlock(_component_Disclosure, {
                                                          as: "li",
                                                          key: child.id
                                                        }, {
                                                          default: withCtx(() => [
                                                            child.links.length ? (openBlock(), createBlock(_component_DisclosureButton, { key: 0 }, {
                                                              default: withCtx(() => [
                                                                createBaseVNode("a", {
                                                                  href: child.url
                                                                }, toDisplayString(child.title), 9, _hoisted_38)
                                                              ]),
                                                              _: 2
                                                            }, 1024)) : (openBlock(), createElementBlock("a", {
                                                              key: 1,
                                                              href: child.url
                                                            }, toDisplayString(child.title), 9, _hoisted_39)),
                                                            child.links.length ? (openBlock(), createBlock(Transition, {
                                                              key: 2,
                                                              name: "slideDown"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(_component_DisclosurePanel, {
                                                                  as: "ul",
                                                                  class: "menu__level2"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    (openBlock(true), createElementBlock(Fragment, null, renderList(child.links, (grandchild) => {
                                                                      return openBlock(), createElementBlock("li", {
                                                                        key: grandchild.id
                                                                      }, [
                                                                        createBaseVNode("a", {
                                                                          href: grandchild.url
                                                                        }, toDisplayString(grandchild.title), 9, _hoisted_40)
                                                                      ]);
                                                                    }), 128))
                                                                  ]),
                                                                  _: 2
                                                                }, 1024)
                                                              ]),
                                                              _: 2
                                                            }, 1024)) : createCommentVNode("", true)
                                                          ]),
                                                          _: 2
                                                        }, 1024);
                                                      }), 128))
                                                    ]),
                                                    _: 2
                                                  }, 1024)
                                                ]),
                                                _: 2
                                              }, 1024)) : createCommentVNode("", true)
                                            ]),
                                            _: 2
                                          }, 1024);
                                        }), 128))
                                      ])
                                    ], 2)) : block.type == "image_content" ? (openBlock(), createElementBlock("div", {
                                      key: 1,
                                      class: normalizeClass([`${block.type}__inner`])
                                    }, [
                                      block.settings.image ? (openBlock(), createBlock(_component_image_tag, {
                                        key: 0,
                                        src: block.settings.image,
                                        width: "960",
                                        sizes: "(min-width: 1440px) 960px, (min-width: 1280px) 640px, 320px",
                                        srcsetWidths: [960, 640, 320],
                                        class: "image_content__image"
                                      }, null, 8, ["src"])) : createCommentVNode("", true),
                                      createBaseVNode("div", _hoisted_41, [
                                        block.settings.content_title ? (openBlock(), createElementBlock("h1", _hoisted_42, toDisplayString(block.settings.content_title), 1)) : createCommentVNode("", true),
                                        block.settings.content_subtitle ? (openBlock(), createElementBlock("h3", _hoisted_43, toDisplayString(block.settings.content_subtitle), 1)) : createCommentVNode("", true),
                                        block.settings.content ? (openBlock(), createElementBlock("p", {
                                          key: 2,
                                          html: block.settings.content
                                        }, null, 8, _hoisted_44)) : createCommentVNode("", true),
                                        createBaseVNode("div", {
                                          class: normalizeClass(["buttons", [`color-scheme--${$props.settings.mm_color_scheme}`]])
                                        }, [
                                          block.settings.primary_button_text && block.settings.primary_button_url ? (openBlock(), createElementBlock("a", {
                                            key: 0,
                                            href: block.settings.primary_button_url,
                                            class: "btn round primary btn-outline"
                                          }, toDisplayString(block.settings.primary_button_text), 9, _hoisted_45)) : createCommentVNode("", true),
                                          block.settings.secondary_button_text && block.settings.secondary_button_url ? (openBlock(), createElementBlock("a", {
                                            key: 1,
                                            href: block.settings.secondary_button_url,
                                            class: "btn round secondary btn-outline"
                                          }, toDisplayString(block.settings.secondary_button_text), 9, _hoisted_46)) : createCommentVNode("", true)
                                        ], 2)
                                      ])
                                    ], 2)) : createCommentVNode("", true)
                                  ], 2);
                                }), 128))
                              ]),
                              _: 2
                            }, 1032, ["class"])) : link.links.length ? (openBlock(), createBlock(_component_PopoverPanel, {
                              key: 1,
                              class: normalizeClass(["header__menu-dropdown", [`color-scheme--${$props.settings.mm_color_scheme}`]])
                            }, {
                              default: withCtx(() => [
                                createBaseVNode("ul", _hoisted_47, [
                                  (openBlock(true), createElementBlock(Fragment, null, renderList(link.links, (child) => {
                                    return openBlock(), createBlock(_component_Disclosure, {
                                      as: "li",
                                      key: child.id,
                                      class: "dropdown__level1"
                                    }, {
                                      default: withCtx(() => [
                                        child.links.length ? (openBlock(), createBlock(_component_DisclosureButton, { key: 0 }, {
                                          default: withCtx(() => [
                                            createBaseVNode("a", {
                                              href: child.url
                                            }, toDisplayString(child.title), 9, _hoisted_48),
                                            child.links.length ? (openBlock(), createElementBlock("span", _hoisted_49, _hoisted_51)) : createCommentVNode("", true)
                                          ]),
                                          _: 2
                                        }, 1024)) : (openBlock(), createElementBlock("a", {
                                          key: 1,
                                          href: child.url
                                        }, toDisplayString(child.title), 9, _hoisted_52)),
                                        child.links.length ? (openBlock(), createBlock(Transition, {
                                          key: 2,
                                          name: "slideDown"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_DisclosurePanel, { as: "ul" }, {
                                              default: withCtx(() => [
                                                (openBlock(true), createElementBlock(Fragment, null, renderList(child.links, (grandchild) => {
                                                  return openBlock(), createElementBlock("li", {
                                                    key: grandchild.id,
                                                    class: "dropdown__level2"
                                                  }, [
                                                    createBaseVNode("a", {
                                                      href: grandchild.url
                                                    }, toDisplayString(grandchild.title), 9, _hoisted_53)
                                                  ]);
                                                }), 128))
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ]),
                                          _: 2
                                        }, 1024)) : createCommentVNode("", true)
                                      ]),
                                      _: 2
                                    }, 1024);
                                  }), 128))
                                ])
                              ]),
                              _: 2
                            }, 1032, ["class"])) : createCommentVNode("", true)
                          ]),
                          _: 2
                        }, 1024)
                      ]),
                      _: 2
                    }, 1024);
                  }), 128))
                ]),
                _: 1
              }, 8, ["class"])
            ]),
            _: 1
          }, 8, ["static"])
        ]),
        _: 1
      }))
    ]),
    _: 1
  });
}
const MegaMenu = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3]]);
const _sfc_main$2 = {
  name: "Card",
  components: { ImageTag },
  props: {
    cardProduct: Object,
    cardColorScheme: String,
    cardAspectRatio: String,
    cardImageFit: String,
    showSecondaryImage: Boolean,
    cardAnimate: Boolean,
    cardAnimation: String,
    cardBorder: Boolean
  }
};
const _hoisted_1$2 = {
  key: 0,
  class: "card-wrapper underline-links-hover"
};
const _hoisted_2$2 = {
  key: 0,
  class: "card__media"
};
const _hoisted_3$2 = { class: "media media--transparent" };
const _hoisted_4$2 = { class: "card__content" };
const _hoisted_5$2 = { class: "card__information" };
const _hoisted_6$2 = { class: "card__heading" };
const _hoisted_7$2 = ["href"];
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_image_tag = resolveComponent("image-tag");
  return $props.cardProduct ? (openBlock(), createElementBlock("div", _hoisted_1$2, [
    createBaseVNode("div", {
      class: normalizeClass(["card gradient", [
        `color-scheme--${$props.cardColorScheme}`,
        $props.cardProduct.featured_image ? "card--media" : "card--text",
        $props.cardAnimate ? $props.cardAnimation : "",
        $props.cardBorder ? "border border-scheme-fg" : ""
      ]])
    }, [
      createBaseVNode("div", {
        class: normalizeClass(["card__inner gradient", $props.cardAspectRatio])
      }, [
        $props.cardProduct.featured_image ? (openBlock(), createElementBlock("div", _hoisted_2$2, [
          createBaseVNode("div", _hoisted_3$2, [
            createVNode(_component_image_tag, {
              src: $props.cardProduct.featured_image,
              width: "300",
              sizes: "(min-width: 1280px) calc((100vw - 130px) / 4), (min-width: 750px) calc((100vw - 120px) / 3), calc((100vw - 35px) / 2)",
              srcsetWidths: [
                $props.cardProduct.featured_image.width >= 165 ? 165 : "",
                $props.cardProduct.featured_image.width >= 360 ? 360 : "",
                $props.cardProduct.featured_image.width >= 533 ? 533 : "",
                $props.cardProduct.featured_image.width >= 720 ? 720 : "",
                $props.cardProduct.featured_image.width >= 940 ? 940 : "",
                $props.cardProduct.featured_image.width >= 1066 ? 1066 : ""
              ],
              alt: $props.cardProduct.featured_image.alt,
              class: normalizeClass(["card__image", [$props.cardAspectRatio, $props.cardImageFit]])
            }, null, 8, ["src", "srcsetWidths", "alt", "class"])
          ])
        ])) : createCommentVNode("", true)
      ], 2),
      createBaseVNode("div", _hoisted_4$2, [
        createBaseVNode("div", _hoisted_5$2, [
          createBaseVNode("h3", _hoisted_6$2, [
            createBaseVNode("a", {
              href: $props.cardProduct.url,
              class: "full-unstyled-link"
            }, toDisplayString($props.cardProduct.title), 9, _hoisted_7$2)
          ])
        ])
      ])
    ], 2)
  ])) : createCommentVNode("", true);
}
const Card = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2]]);
const _sfc_main$1 = {
  name: "SearchMenu",
  components: { Popover: ce$1, PopoverButton: ke, PopoverPanel: Le, TabGroup: oe$1, TabList: se$1, Tab: de, TabPanels: fe$1, TabPanel: ce, ImageTag, Card },
  directives: { debounce },
  data() {
    return {
      query: "",
      trends: null,
      results: null,
      resultsHeight: 0
    };
  },
  props: {
    iconSize: Number,
    iconStrokeWidth: Number,
    searchPosition: String,
    predictiveSearchEnabled: Boolean,
    predictiveShowNumber: Boolean,
    predictiveShowPages: Boolean,
    predictiveShowArticles: Boolean,
    trendingSearches: String,
    cardStyle: String,
    cardAlignment: String,
    cardColorScheme: String,
    cardBorder: Boolean,
    cardRadius: Number,
    cardImageAspect: String,
    cardImageFit: String,
    cardAnimate: Boolean,
    cardAnimation: String,
    cardShowInfoOnHover: Boolean,
    settings: Object
  },
  computed: {
    resultsLength() {
      if (this.results) {
        return this.results.products.length + this.results.pages.length + this.results.articles.length;
      } else {
        return 0;
      }
    }
  },
  methods: {
    tryClose(close) {
      if (this.query != "") {
        document.querySelector('[name="q"]').value = "";
        this.query = "";
      } else {
        close();
      }
    },
    calculateResultsOffset() {
      var header2 = document.querySelector("header");
      var searchForm = document.querySelector(".search__form");
      var total = header2.offsetHeight + searchForm.offsetHeight;
      return total;
    },
    async getPredictiveResults() {
      if (this.query && this.query.length > 0) {
        var resourceTypes = ["product", "collection"];
        if (this.predictiveShowArticles) {
          resourceTypes.push("article");
        }
        if (this.predictiveShowPages) {
          resourceTypes.push("page");
        }
        var searchUrl = `${window.routes.predictive_search_url}.json?q=${encodeURIComponent(this.query)}&resources[type]=${encodeURIComponent(resourceTypes.concat(","))}&resources[limit]=4`;
        var search = await fetch(searchUrl).then((response) => response.json()).then((data) => {
          return data;
        });
        if (search.resources && search.resources.results) {
          this.results = search.resources.results;
        } else {
          this.results = null;
        }
      } else {
        this.results = null;
      }
    },
    async getTrends(handle) {
      try {
        const GET_MENU = {
          query: `
              query {
                menu(handle: "${handle}") {
                  title
                  items {
                    id
                    title
                    url
                  }
                }
              }
            `
        };
        let res = await fetch("/api/2022-07/graphql.json", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": "1c34b11ba2613f92ad45fe82bace6f83"
          },
          body: JSON.stringify(GET_MENU)
        });
        let json = await res.json();
        this.trends = json.data.menu;
      } catch (error) {
        console.error("Error occurred fetching search trends, please investigate.", error);
      }
    }
  },
  mounted() {
    const header2 = document.querySelector("header");
    const searchButton = document.querySelector("#searchMenuTop .header__icon-link");
    var observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName == "aria-expanded") {
          if (searchButton.getAttribute("aria-expanded") == "true") {
            document.body.classList.add("search--opened");
            header2.classList.add("search--opened");
            if (this.searchPosition == "below") {
              this.resultsHeight = window.innerHeight - this.calculateResultsOffset();
            }
          } else if (searchButton.getAttribute("aria-expanded") == "false") {
            document.body.classList.remove("search--opened");
            header2.classList.remove("search--opened");
          }
        }
      });
    });
    try {
      observer.observe(searchButton, {
        attributes: true
      });
    } catch (e2) {
      console.error("Error during observer creation.");
    }
    if (this.trendingSearches) {
      this.getTrends(this.trendingSearches);
    }
  }
};
const _hoisted_1$1 = { class: "icon target align-bottom" };
const _hoisted_2$1 = ["width", "height", "stroke-width"];
const _hoisted_3$1 = /* @__PURE__ */ createBaseVNode("circle", {
  cx: "11",
  cy: "11",
  r: "9",
  fill: "#000",
  opacity: ".25",
  stroke: "none"
}, null, -1);
const _hoisted_4$1 = /* @__PURE__ */ createBaseVNode("circle", {
  cx: "11",
  cy: "11",
  r: "9"
}, null, -1);
const _hoisted_5$1 = /* @__PURE__ */ createBaseVNode("path", { d: "M17.5 17.5 22 22" }, null, -1);
const _hoisted_6$1 = [
  _hoisted_3$1,
  _hoisted_4$1,
  _hoisted_5$1
];
const _hoisted_7$1 = /* @__PURE__ */ createBaseVNode("span", { class: "label" }, "Search", -1);
const _hoisted_8$1 = {
  action: "/search",
  method: "get",
  role: "search",
  class: "search__form"
};
const _hoisted_9$1 = /* @__PURE__ */ createBaseVNode("label", {
  for: "q",
  class: "sr-only"
}, "Search: ", -1);
const _hoisted_10$1 = { class: "icon target" };
const _hoisted_11$1 = ["onClick", "width", "height"];
const _hoisted_12$1 = ["stroke-width"];
const _hoisted_13$1 = ["stroke-width"];
const _hoisted_14$1 = { class: "search__results--inner" };
const _hoisted_15$1 = /* @__PURE__ */ createBaseVNode("h1", { class: "sr-only" }, "Search Results", -1);
const _hoisted_16$1 = {
  key: 0,
  class: "search__trends"
};
const _hoisted_17$1 = { class: "search__trends-tags" };
const _hoisted_18$1 = ["href"];
const _hoisted_19 = {
  key: 1,
  class: "search__results--loaded"
};
const _hoisted_20 = { class: "search__products shopify-grid product-grid grid--2-col-tablet-down grid--4-col-desktop" };
const _hoisted_21 = { class: "search__articles" };
const _hoisted_22 = ["href"];
const _hoisted_23 = { class: "search__pages" };
const _hoisted_24 = ["href"];
const _hoisted_25 = { class: "search__more" };
const _hoisted_26 = {
  action: "/search",
  method: "get",
  role: "search"
};
const _hoisted_27 = /* @__PURE__ */ createBaseVNode("button", {
  class: "btn",
  type: "submit"
}, "View More", -1);
const _hoisted_28 = {
  key: 2,
  class: "search__no-results"
};
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_PopoverButton = resolveComponent("PopoverButton");
  const _component_Tab = resolveComponent("Tab");
  const _component_TabList = resolveComponent("TabList");
  const _component_card = resolveComponent("card");
  const _component_TabPanel = resolveComponent("TabPanel");
  const _component_image_tag = resolveComponent("image-tag");
  const _component_TabPanels = resolveComponent("TabPanels");
  const _component_TabGroup = resolveComponent("TabGroup");
  const _component_PopoverPanel = resolveComponent("PopoverPanel");
  const _component_Popover = resolveComponent("Popover");
  const _directive_debounce = resolveDirective("debounce");
  return openBlock(), createBlock(_component_Popover, { class: "header__search search" }, {
    default: withCtx(() => [
      createVNode(_component_PopoverButton, { class: "header__icon-link" }, {
        default: withCtx(() => [
          createBaseVNode("span", _hoisted_1$1, [
            (openBlock(), createElementBlock("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              viewBox: "0 0 24 24",
              width: $props.iconSize,
              height: $props.iconSize,
              fill: "none",
              stroke: "#000",
              "stroke-width": $props.iconStrokeWidth,
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }, _hoisted_6$1, 8, _hoisted_2$1))
          ]),
          _hoisted_7$1
        ]),
        _: 1
      }),
      createVNode(Transition, { name: $props.searchPosition }, {
        default: withCtx(() => [
          createVNode(_component_PopoverPanel, {
            class: normalizeClass(["search__popover", [$props.searchPosition]])
          }, {
            default: withCtx(({ close }) => [
              createBaseVNode("form", _hoisted_8$1, [
                _hoisted_9$1,
                withDirectives(createBaseVNode("input", {
                  name: "q",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.query = $event),
                  placeholder: "Search",
                  class: "search__input"
                }, null, 512), [
                  [vModelText, $data.query],
                  [_directive_debounce, $props.predictiveSearchEnabled ? $options.getPredictiveResults() : null, "200"]
                ]),
                createBaseVNode("span", _hoisted_10$1, [
                  (openBlock(), createElementBlock("svg", {
                    onClick: ($event) => $options.tryClose(close),
                    width: $props.iconSize * 0.75,
                    height: $props.iconSize * 0.75,
                    viewBox: "0 0 23 23",
                    fill: "none",
                    xmlns: "http://www.w3.org/2000/svg"
                  }, [
                    createBaseVNode("path", {
                      d: "M21.4878 1L1.51221 22",
                      "stroke-width": $props.iconStrokeWidth
                    }, null, 8, _hoisted_12$1),
                    createBaseVNode("path", {
                      d: "M22 21.4878L1 1.51221",
                      "stroke-width": $props.iconStrokeWidth
                    }, null, 8, _hoisted_13$1)
                  ], 8, _hoisted_11$1))
                ])
              ]),
              createVNode(Transition, { name: "results" }, {
                default: withCtx(() => [
                  $data.query != "" && $props.predictiveSearchEnabled ? (openBlock(), createElementBlock("div", {
                    key: 0,
                    style: normalizeStyle([$props.searchPosition == "below" ? { height: $data.resultsHeight + "px" } : {}]),
                    class: "search__results"
                  }, [
                    createBaseVNode("div", _hoisted_14$1, [
                      _hoisted_15$1,
                      $props.trendingSearches ? (openBlock(), createElementBlock("div", _hoisted_16$1, [
                        createBaseVNode("h2", null, toDisplayString($data.trends.title), 1),
                        createBaseVNode("div", _hoisted_17$1, [
                          (openBlock(true), createElementBlock(Fragment, null, renderList($data.trends.items, (trend) => {
                            return openBlock(), createElementBlock("a", {
                              key: trend.id,
                              href: trend.url,
                              class: "search__trends-tag btn secondary"
                            }, toDisplayString(trend.title), 9, _hoisted_18$1);
                          }), 128))
                        ])
                      ])) : createCommentVNode("", true),
                      $options.resultsLength > 0 ? (openBlock(), createElementBlock("div", _hoisted_19, [
                        createVNode(_component_TabGroup, null, {
                          default: withCtx(() => [
                            createVNode(_component_TabList, { class: "search__tabs" }, {
                              default: withCtx(() => [
                                $data.results.products.length ? (openBlock(), createBlock(_component_Tab, { key: 0 }, {
                                  default: withCtx(() => [
                                    createTextVNode("Products")
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true),
                                $props.predictiveShowArticles && $data.results.articles.length ? (openBlock(), createBlock(_component_Tab, { key: 1 }, {
                                  default: withCtx(() => [
                                    createTextVNode("Articles")
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true),
                                $props.predictiveShowPages && $data.results.pages.length ? (openBlock(), createBlock(_component_Tab, { key: 2 }, {
                                  default: withCtx(() => [
                                    createTextVNode("Pages")
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true)
                              ]),
                              _: 1
                            }),
                            createVNode(_component_TabPanels, null, {
                              default: withCtx(() => [
                                createVNode(Transition, { name: "fade" }, {
                                  default: withCtx(() => [
                                    $data.results.products.length ? (openBlock(), createBlock(_component_TabPanel, { key: 0 }, {
                                      default: withCtx(() => [
                                        createBaseVNode("div", _hoisted_20, [
                                          (openBlock(true), createElementBlock(Fragment, null, renderList($data.results.products, (product) => {
                                            return openBlock(), createBlock(_component_card, {
                                              key: product.id,
                                              class: "grid__item",
                                              cardProduct: product,
                                              cardColorScheme: $props.cardColorScheme,
                                              cardAspectRatio: $props.cardImageAspect,
                                              cardImageFit: $props.cardImageFit,
                                              cardAnimate: $props.cardAnimate,
                                              cardAnimation: $props.cardAnimation,
                                              cardBorder: $props.cardBorder
                                            }, null, 8, ["cardProduct", "cardColorScheme", "cardAspectRatio", "cardImageFit", "cardAnimate", "cardAnimation", "cardBorder"]);
                                          }), 128))
                                        ])
                                      ]),
                                      _: 1
                                    })) : createCommentVNode("", true)
                                  ]),
                                  _: 1
                                }),
                                createVNode(Transition, { name: "fade" }, {
                                  default: withCtx(() => [
                                    $props.predictiveShowArticles && $data.results.articles.length ? (openBlock(), createBlock(_component_TabPanel, { key: 0 }, {
                                      default: withCtx(() => [
                                        createBaseVNode("div", _hoisted_21, [
                                          (openBlock(true), createElementBlock(Fragment, null, renderList($data.results.articles, (article) => {
                                            return openBlock(), createElementBlock("div", {
                                              key: article.id
                                            }, [
                                              createBaseVNode("a", {
                                                href: article.url
                                              }, [
                                                article.featured_image ? (openBlock(), createBlock(_component_image_tag, {
                                                  key: 0,
                                                  src: article.featured_image,
                                                  width: "300",
                                                  sizes: "(min-width: 1280px) 300px, (min-width: 768px) 225px, 150px",
                                                  srcsetWidths: [150, 225, 300]
                                                }, null, 8, ["src"])) : createCommentVNode("", true),
                                                createBaseVNode("h3", null, toDisplayString(article.title), 1)
                                              ], 8, _hoisted_22)
                                            ]);
                                          }), 128))
                                        ])
                                      ]),
                                      _: 1
                                    })) : createCommentVNode("", true)
                                  ]),
                                  _: 1
                                }),
                                createVNode(Transition, { name: "fade" }, {
                                  default: withCtx(() => [
                                    $props.predictiveShowPages && $data.results.pages.length ? (openBlock(), createBlock(_component_TabPanel, { key: 0 }, {
                                      default: withCtx(() => [
                                        createBaseVNode("div", _hoisted_23, [
                                          (openBlock(true), createElementBlock(Fragment, null, renderList($data.results.pages, (page) => {
                                            return openBlock(), createElementBlock("div", {
                                              key: page.id
                                            }, [
                                              createBaseVNode("a", {
                                                href: page.url
                                              }, [
                                                page.featured_image ? (openBlock(), createBlock(_component_image_tag, {
                                                  key: 0,
                                                  src: page.featured_image,
                                                  width: "300",
                                                  sizes: "(min-width: 1280px) 300px, (min-width: 768px) 225px, 150px",
                                                  srcsetWidths: [150, 225, 300]
                                                }, null, 8, ["src"])) : createCommentVNode("", true),
                                                createBaseVNode("h3", null, toDisplayString(page.title), 1)
                                              ], 8, _hoisted_24)
                                            ]);
                                          }), 128))
                                        ])
                                      ]),
                                      _: 1
                                    })) : createCommentVNode("", true)
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createBaseVNode("div", _hoisted_25, [
                          createBaseVNode("form", _hoisted_26, [
                            withDirectives(createBaseVNode("input", {
                              name: "q",
                              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.query = $event),
                              type: "hidden"
                            }, null, 512), [
                              [vModelText, $data.query]
                            ]),
                            _hoisted_27
                          ])
                        ])
                      ])) : (openBlock(), createElementBlock("div", _hoisted_28, " No results found. "))
                    ])
                  ], 4)) : createCommentVNode("", true)
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["class"])
        ]),
        _: 1
      }, 8, ["name"])
    ]),
    _: 1
  });
}
const SearchMenu = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1]]);
const _sfc_main = {
  name: "Modal",
  components: {
    TransitionRoot: fe,
    TransitionChild: oe,
    Dialog: Ne,
    DialogPanel: _e,
    DialogTitle: Ue
  },
  data() {
    return {
      screen: window.innerWidth,
      isOpen: true
    };
  },
  props: {
    settings: Object,
    blocks: Array,
    iconSize: Number,
    iconStrokeWidth: Number
  },
  methods: {
    blocksByParent(parentHandle) {
      return this.blocks.filter((b2) => b2.title == parentHandle);
    }
  },
  mounted() {
    window.addEventListener("deviceorientation", () => {
      this.screen = window.innerWidth;
    });
  }
};
const _hoisted_1 = /* @__PURE__ */ createBaseVNode("div", { class: "section-modal__overlay" }, null, -1);
const _hoisted_2 = { class: "section-modal-wrapper" };
const _hoisted_3 = { class: "section-modal-wrapper__inner" };
const _hoisted_4 = { class: "section-modal" };
const _hoisted_5 = { class: "section-modal__close" };
const _hoisted_6 = /* @__PURE__ */ createBaseVNode("span", { class: "sr-only" }, "Close", -1);
const _hoisted_7 = ["height", "width", "stroke-width"];
const _hoisted_8 = /* @__PURE__ */ createBaseVNode("path", {
  d: "M.865 15.978a.5.5 0 00.707.707l7.433-7.431 7.579 7.282a.501.501 0 00.846-.37.5.5 0 00-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 10-.707-.708L8.991 7.853 1.413.573a.5.5 0 10-.693.72l7.563 7.268-7.418 7.417z",
  fill: "currentColor"
}, null, -1);
const _hoisted_9 = [
  _hoisted_8
];
const _hoisted_10 = /* @__PURE__ */ createBaseVNode("div", { class: "mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center sm:mx-0 sm:h-10 sm:w-10" }, null, -1);
const _hoisted_11 = {
  key: 0,
  class: "section-modal__content"
};
const _hoisted_12 = {
  key: 1,
  class: "section-modal__content"
};
const _hoisted_13 = { key: 1 };
const _hoisted_14 = ["html"];
const _hoisted_15 = ["html"];
const _hoisted_16 = {
  key: 2,
  class: "section-modal__buttons"
};
const _hoisted_17 = ["href"];
const _hoisted_18 = ["href"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_TransitionChild = resolveComponent("TransitionChild");
  const _component_DialogTitle = resolveComponent("DialogTitle");
  const _component_DialogPanel = resolveComponent("DialogPanel");
  const _component_Dialog = resolveComponent("Dialog");
  const _component_TransitionRoot = resolveComponent("TransitionRoot");
  return openBlock(), createBlock(_component_TransitionRoot, {
    as: "template",
    show: $data.isOpen,
    open: true
  }, {
    default: withCtx(() => [
      createVNode(_component_Dialog, {
        as: "div",
        class: "section-modal-container",
        onClose: _cache[1] || (_cache[1] = ($event) => $data.isOpen = false)
      }, {
        default: withCtx(() => [
          createVNode(_component_TransitionChild, {
            as: "template",
            enter: "ease-out duration-600",
            "enter-from": "opacity-0",
            "enter-to": "opacity-100",
            leave: "ease-in duration-200",
            "leave-from": "opacity-100",
            "leave-to": "opacity-0"
          }, {
            default: withCtx(() => [
              _hoisted_1
            ]),
            _: 1
          }),
          createBaseVNode("div", _hoisted_2, [
            createBaseVNode("div", _hoisted_3, [
              createVNode(_component_TransitionChild, {
                as: "template",
                enter: "ease-out duration-300",
                "enter-from": "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
                "enter-to": "opacity-100 translate-y-0 sm:scale-100",
                leave: "ease-in duration-200",
                "leave-from": "opacity-100 translate-y-0 sm:scale-100",
                "leave-to": "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              }, {
                default: withCtx(() => [
                  createBaseVNode("div", _hoisted_4, [
                    createVNode(_component_DialogPanel, { class: "section-modal__inner" }, {
                      default: withCtx(() => [
                        createBaseVNode("div", _hoisted_5, [
                          createBaseVNode("button", {
                            type: "button",
                            class: "hover:text-gray-500",
                            onClick: _cache[0] || (_cache[0] = ($event) => $data.isOpen = false)
                          }, [
                            _hoisted_6,
                            (openBlock(), createElementBlock("svg", {
                              xmlns: "http://www.w3.org/2000/svg",
                              "aria-hidden": "true",
                              focusable: "false",
                              role: "presentation",
                              class: "stroke-scheme-text",
                              fill: "none",
                              viewBox: "0 0 18 17",
                              height: $props.iconSize,
                              width: $props.iconSize,
                              "stroke-width": $props.iconStrokeWidth
                            }, _hoisted_9, 8, _hoisted_7))
                          ])
                        ]),
                        createBaseVNode("div", null, [
                          _hoisted_10,
                          (openBlock(true), createElementBlock(Fragment, null, renderList($props.blocks, (block) => {
                            return openBlock(), createElementBlock("div", {
                              class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left",
                              key: block
                            }, [
                              block.type == "email_form" ? (openBlock(), createElementBlock("div", _hoisted_11)) : block.type == "modal_content" ? (openBlock(), createElementBlock("div", _hoisted_12, [
                                block.settings.modal_content_title ? (openBlock(), createBlock(_component_DialogTitle, {
                                  key: 0,
                                  as: "h2",
                                  class: "section-modal__heading"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(block.settings.modal_content_title), 1)
                                  ]),
                                  _: 2
                                }, 1024)) : createCommentVNode("", true),
                                block.settings.modal_content_subtitle ? (openBlock(), createElementBlock("h4", _hoisted_13, toDisplayString(block.settings.modal_content_subtitle), 1)) : createCommentVNode("", true),
                                createBaseVNode("div", {
                                  class: "mt-2",
                                  html: block.settings.modal_content_body
                                }, [
                                  createBaseVNode("p", {
                                    html: block.settings.modal_content_body
                                  }, " Test Body ", 8, _hoisted_15)
                                ], 8, _hoisted_14),
                                block.settings.modal_content_primary_cta_url || block.settings.modal_content_secondary_cta_url ? (openBlock(), createElementBlock("div", _hoisted_16, [
                                  block.settings.modal_content_primary_cta_url ? (openBlock(), createElementBlock("a", {
                                    key: 0,
                                    href: block.settings.modal_content_primary_cta_url,
                                    class: "btn primary"
                                  }, toDisplayString(block.settings.modal_content_primary_cta_text), 9, _hoisted_17)) : createCommentVNode("", true),
                                  block.settings.modal_content_secondary_cta_url ? (openBlock(), createElementBlock("a", {
                                    key: 1,
                                    href: block.settings.modal_content_secondary_cta_url,
                                    class: "btn secondary"
                                  }, toDisplayString(block.settings.modal_content_secondary_cta_text), 9, _hoisted_18)) : createCommentVNode("", true)
                                ])) : createCommentVNode("", true)
                              ])) : createCommentVNode("", true),
                              createTextVNode(" No thanks ")
                            ]);
                          }), 128))
                        ])
                      ]),
                      _: 1
                    })
                  ])
                ]),
                _: 1
              })
            ])
          ])
        ]),
        _: 1
      })
    ]),
    _: 1
  }, 8, ["show"]);
}
const Modal = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
__vitePreload(() => Promise.resolve({}), true ? [window.__toCdnUrl("assets/et_blog.css")] : void 0, import.meta.url);
__vitePreload(() => Promise.resolve({}), true ? [window.__toCdnUrl("assets/et_image-with-text.css")] : void 0, import.meta.url);
__vitePreload(() => Promise.resolve({}), true ? [window.__toCdnUrl("assets/et_hero.css")] : void 0, import.meta.url);
__vitePreload(() => Promise.resolve({}), true ? [window.__toCdnUrl("assets/et_modal.css")] : void 0, import.meta.url);
__vitePreload(() => Promise.resolve({}), true ? [window.__toCdnUrl("assets/et_cards.css")] : void 0, import.meta.url);
__vitePreload(() => Promise.resolve({}), true ? [window.__toCdnUrl("assets/et_price.css")] : void 0, import.meta.url);
if (window.location.href.includes("/collection/")) {
  __vitePreload(() => Promise.resolve({}), true ? [window.__toCdnUrl("assets/et_facets.css")] : void 0, import.meta.url);
}
if (window.location.href.includes("/search")) {
  __vitePreload(() => Promise.resolve({}), true ? [window.__toCdnUrl("assets/et_search.css")] : void 0, import.meta.url);
}
const searchMount = document.querySelector("#searchMenuTop");
const megamenuMount = document.querySelector("#megamenu");
const modalMount = document.querySelector("#modal");
const menuProps = {};
const searchProps = {};
const modalProps = {};
function fetchProps() {
  const megamenuSettings = JSON.parse(megamenuMount.dataset.settings);
  const megamenuBlocks = JSON.parse(megamenuMount.dataset.blocks);
  const topMenu = JSON.parse(megamenuMount.dataset.topmenu);
  const mobileLinks = JSON.parse(megamenuMount.dataset.mobilelinks);
  topMenu.forEach((m2) => m2.blocks = []);
  menuProps.iconSize = window.themeSettings.icon_size;
  menuProps.iconStrokeWidth = window.themeSettings.icon_stroke_width;
  menuProps.settings = megamenuSettings;
  menuProps.blocks = megamenuBlocks;
  menuProps.topMenu = topMenu;
  menuProps.mobileLinks = mobileLinks;
  const searchSettings = JSON.parse(searchMount.dataset.settings);
  searchProps.searchPosition = window.themeSettings.search_open_position;
  searchProps.trendingSearches = window.themeSettings.search_trends;
  searchProps.predictiveSearchEnabled = window.themeSettings.predictive_search_enabled;
  searchProps.predictiveShowNumber = window.themeSettings.predictive_search_show_number;
  searchProps.predictiveShowPages = window.themeSettings.predictive_search_show_pages;
  searchProps.predictiveShowArticles = window.themeSettings.predictive_search_show_articles;
  searchProps.iconSize = window.themeSettings.icon_size;
  searchProps.iconStrokeWidth = window.themeSettings.icon_stroke_width;
  searchProps.cardColorScheme = window.themeSettings.card_color_scheme;
  searchProps.cardBorder = window.themeSettings.card_border;
  searchProps.cardImageAspect = window.themeSettings.card_image_aspect;
  searchProps.cardImageFit = window.themeSettings.card_image_fit;
  searchProps.cardAnimate = window.themeSettings.card_hover_animate;
  searchProps.cardAnimation = window.themeSettings.card_hover_animation;
  searchProps.settings = searchSettings;
  modalProps.settings = JSON.parse(modalMount.dataset.settings);
  modalProps.blocks = JSON.parse(modalMount.dataset.blocks);
  modalProps.iconSize = window.themeSettings.icon_size;
  modalProps.iconStrokeWidth = window.themeSettings.icon_stroke_width;
}
fetchProps();
const megamenuApp = (component, props) => createApp(component, props);
const searchApp = (component, props) => createApp(component, props);
const modalApp = (component, props) => createApp(component, props);
var megamenuInit = megamenuApp(MegaMenu, menuProps);
var searchInit = searchApp(SearchMenu, searchProps);
var modalInit = modalApp(Modal, modalProps);
megamenuInit.mount(megamenuMount);
searchInit.mount(searchMount);
modalInit.mount(modalMount);
document.addEventListener("DOMContentLoaded", () => {
  if (JSON.parse(megamenuMount.dataset.settings).enable_sticky_header) {
    const body = document.querySelector("body");
    const header2 = document.querySelector("#shopify-section-header");
    var ticking = false;
    document.addEventListener("scroll", () => {
      var yPos = window.scrollY * 0.75;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (yPos < window.innerHeight) {
            body.classList.remove("sticky-header-active");
            header2.classList.remove("sticky");
          } else {
            body.classList.add("sticky-header-active");
            header2.classList.add("sticky");
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }
});
if (Shopify.designMode) {
  document.addEventListener("shopify:section:load", (event) => {
    if (event.detail.sectionId == "header") {
      console.info("testing, hullo there", event);
      searchInit.unmount();
      console.log("unmounted");
      searchInit.mount();
      console.log("remounted");
    }
  });
}
