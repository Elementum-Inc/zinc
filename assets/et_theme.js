const scriptRel = "modulepreload";
const assetsURL = function(dep) {
  return "/" + dep;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  if (!deps || deps.length === 0) {
    return baseModule();
  }
  return Promise.all(deps.map((dep) => {
    dep = assetsURL(dep);
    if (dep in seen)
      return;
    seen[dep] = true;
    const isCss = dep.endsWith(".css");
    const cssSelector = isCss ? '[rel="stylesheet"]' : "";
    if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
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
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
}
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
function normalizeStyle(value) {
  if (isArray(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
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
const propertyDelimiterRE = /:(.+)/;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.split(listDelimiterRE).forEach((item) => {
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
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
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
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
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
  return str.replace(camelizeRE, (_, c2) => c2 ? c2.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
const capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
const toHandlerKey = cacheStringFunction((str) => str ? `on${capitalize(str)}` : ``);
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
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
      let i, l2;
      for (i = 0, l2 = this.effects.length; i < l2; i++) {
        this.effects[i].stop();
      }
      for (i = 0, l2 = this.cleanups.length; i < l2; i++) {
        this.cleanups[i]();
      }
      if (this.scopes) {
        for (i = 0, l2 = this.scopes.length; i < l2; i++) {
          this.scopes[i].stop(true);
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
    for (let i = 0; i < deps.length; i++) {
      deps[i].w |= trackOpBit;
    }
  }
};
const finalizeDepMarkers = (effect) => {
  const { deps } = effect;
  if (deps.length) {
    let ptr = 0;
    for (let i = 0; i < deps.length; i++) {
      const dep = deps[i];
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
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect);
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
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || key2 >= newValue) {
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
      for (let i = 0, l2 = this.length; i < l2; i++) {
        track(arr, "get", i + "");
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
const stack = [];
function warn(msg, ...args) {
  pauseTracking();
  const instance = stack.length ? stack[stack.length - 1].component : null;
  const appWarnHandler = instance && instance.appContext.config.warnHandler;
  const trace = getComponentTrace();
  if (appWarnHandler) {
    callWithErrorHandling(appWarnHandler, instance, 11, [
      msg + args.join(""),
      instance && instance.proxy,
      trace.map(({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`).join("\n"),
      trace
    ]);
  } else {
    const warnArgs = [`[Vue warn]: ${msg}`, ...args];
    if (trace.length && true) {
      warnArgs.push(`
`, ...formatTrace(trace));
    }
    console.warn(...warnArgs);
  }
  resetTracking();
}
function getComponentTrace() {
  let currentVNode = stack[stack.length - 1];
  if (!currentVNode) {
    return [];
  }
  const normalizedStack = [];
  while (currentVNode) {
    const last = normalizedStack[0];
    if (last && last.vnode === currentVNode) {
      last.recurseCount++;
    } else {
      normalizedStack.push({
        vnode: currentVNode,
        recurseCount: 0
      });
    }
    const parentInstance = currentVNode.component && currentVNode.component.parent;
    currentVNode = parentInstance && parentInstance.vnode;
  }
  return normalizedStack;
}
function formatTrace(trace) {
  const logs = [];
  trace.forEach((entry, i) => {
    logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
  });
  return logs;
}
function formatTraceEntry({ vnode, recurseCount }) {
  const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
  const isRoot = vnode.component ? vnode.component.parent == null : false;
  const open = ` at <${formatComponentName(vnode.component, vnode.type, isRoot)}`;
  const close = `>` + postfix;
  return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
}
function formatProps(props) {
  const res = [];
  const keys = Object.keys(props);
  keys.slice(0, 3).forEach((key) => {
    res.push(...formatProp(key, props[key]));
  });
  if (keys.length > 3) {
    res.push(` ...`);
  }
  return res;
}
function formatProp(key, value, raw) {
  if (isString(value)) {
    value = JSON.stringify(value);
    return raw ? value : [`${key}=${value}`];
  } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
    return raw ? value : [`${key}=${value}`];
  } else if (isRef(value)) {
    value = formatProp(key, toRaw(value.value), true);
    return raw ? value : [`${key}=Ref<`, value, `>`];
  } else if (isFunction(value)) {
    return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
  } else {
    value = toRaw(value);
    return raw ? value : [`${key}=`, value];
  }
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
  for (let i = 0; i < fn.length; i++) {
    values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
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
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
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
  const i = queue.indexOf(job);
  if (i > flushIndex) {
    queue.splice(i, 1);
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
function flushPreFlushCbs(seen2, i = isFlushing ? flushIndex + 1 : 0) {
  for (; i < queue.length; i++) {
    const cb = queue[i];
    if (cb && cb.pre) {
      queue.splice(i, 1);
      i--;
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
      args = rawArgs.map((a2) => a2.trim());
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
    result = createVNode(Comment);
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
      for (let i = 0; i < dynamicProps.length; i++) {
        const key = dynamicProps[i];
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
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
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
    forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
    getter = () => source.map((s) => {
      if (isRef(s)) {
        return s.value;
      } else if (isReactive(s)) {
        return traverse(s);
      } else if (isFunction(s)) {
        return callWithErrorHandling(s, instance, 2);
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
    return NOOP;
  }
  let oldValue = isMultiSource ? [] : INITIAL_WATCHER_VALUE;
  const job = () => {
    if (!effect.active) {
      return;
    }
    if (cb) {
      const newValue = effect.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v2, i) => hasChanged(v2, oldValue[i])) : hasChanged(newValue, oldValue)) || false) {
        if (cleanup) {
          cleanup();
        }
        callWithAsyncErrorHandling(cb, instance, 3, [
          newValue,
          oldValue === INITIAL_WATCHER_VALUE ? void 0 : oldValue,
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
  return () => {
    effect.stop();
    if (instance && instance.scope) {
      remove(instance.scope.effects, effect);
    }
  };
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
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
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
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], seen2);
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
          if (c2.type !== Comment) {
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
      if (oldInnerChild && oldInnerChild.type !== Comment && (!isSameVNodeType(innerChild, oldInnerChild) || transitionKeyChanged)) {
        const leavingHooks = resolveTransitionHooks(oldInnerChild, rawProps, state, instance);
        setTransitionHooks(oldInnerChild, leavingHooks);
        if (mode === "out-in") {
          state.isLeaving = true;
          leavingHooks.afterLeave = () => {
            state.isLeaving = false;
            instance.update();
          };
          return emptyPlaceholder(child);
        } else if (mode === "in-out" && innerChild.type !== Comment) {
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
  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    const key = parentKey == null ? child.key : String(parentKey) + String(child.key != null ? child.key : i);
    if (child.type === Fragment) {
      if (child.patchFlag & 128)
        keyedFragmentCount++;
      ret = ret.concat(getTransitionRawChildren(child.children, keepComment, key));
    } else if (keepComment || child.type !== Comment) {
      ret.push(key != null ? cloneVNode(child, { key }) : child);
    }
  }
  if (keyedFragmentCount > 1) {
    for (let i = 0; i < ret.length; i++) {
      ret[i].patchFlag = -2;
    }
  }
  return ret;
}
function defineComponent(options) {
  return isFunction(options) ? { setup: options, name: options.name } : options;
}
const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
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
  for (let i = 0; i < directives.length; i++) {
    let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
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
  return vnode;
}
function invokeDirectiveHook(vnode, prevVNode, instance, name) {
  const bindings = vnode.dirs;
  const oldBindings = prevVNode && prevVNode.dirs;
  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i];
    if (oldBindings) {
      binding.oldValue = oldBindings[i].value;
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
    for (let i = 0, l2 = source.length; i < l2; i++) {
      ret[i] = renderItem(source[i], i, void 0, cached && cached[i]);
    }
  } else if (typeof source === "number") {
    ret = new Array(source);
    for (let i = 0; i < source; i++) {
      ret[i] = renderItem(i + 1, i, void 0, cached && cached[i]);
    }
  } else if (isObject(source)) {
    if (source[Symbol.iterator]) {
      ret = Array.from(source, (item, i) => renderItem(item, i, void 0, cached && cached[i]));
    } else {
      const keys = Object.keys(source);
      ret = new Array(keys.length);
      for (let i = 0, l2 = keys.length; i < l2; i++) {
        const key = keys[i];
        ret[i] = renderItem(source[key], key, i, cached && cached[i]);
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
const getPublicInstance = (i) => {
  if (!i)
    return null;
  if (isStatefulComponent(i))
    return getExposeProxy(i) || i.proxy;
  return getPublicInstance(i.parent);
};
const publicPropertiesMap = /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
  $: (i) => i,
  $el: (i) => i.vnode.el,
  $data: (i) => i.data,
  $props: (i) => i.props,
  $attrs: (i) => i.attrs,
  $slots: (i) => i.slots,
  $refs: (i) => i.refs,
  $parent: (i) => getPublicInstance(i.parent),
  $root: (i) => getPublicInstance(i.root),
  $emit: (i) => i.emit,
  $options: (i) => resolveMergedOptions(i),
  $forceUpdate: (i) => i.f || (i.f = () => queueJob(i.update)),
  $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
  $watch: (i) => instanceWatch.bind(i)
});
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
      } else if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
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
    if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
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
    return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || setupState !== EMPTY_OBJ && hasOwn(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
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
    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i];
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
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i];
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
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
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
    for (let i = 0; i < raw.length; i++) {
      const normalizedKey = camelize(raw[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : opt;
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
    rawRef.forEach((r2, i) => setRef(r2, oldRawRef && (isArray(oldRawRef) ? oldRawRef[i] : oldRawRef), parentSuspense, vnode, isUnmount));
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
      case Comment:
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
      for (let i = 0; i < slotScopeIds.length; i++) {
        hostSetScopeId(el, slotScopeIds[i]);
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
    for (let i = start; i < children.length; i++) {
      const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
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
          for (let i = 0; i < propsToUpdate.length; i++) {
            const key = propsToUpdate[i];
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
    for (let i = 0; i < newChildren.length; i++) {
      const oldVNode = oldChildren[i];
      const newVNode = newChildren[i];
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
        const placeholder = instance.subTree = createVNode(Comment);
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
    let i;
    for (i = 0; i < commonLength; i++) {
      const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      patch(c1[i], nextChild, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
    if (oldLength > newLength) {
      unmountChildren(c1, parentComponent, parentSuspense, true, false, commonLength);
    } else {
      mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, commonLength);
    }
  };
  const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      } else {
        break;
      }
      i++;
    }
    while (i <= e1 && i <= e2) {
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
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
        while (i <= e2) {
          patch(null, c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]), container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          i++;
        }
      }
    } else if (i > e2) {
      while (i <= e1) {
        unmount(c1[i], parentComponent, parentSuspense, true);
        i++;
      }
    } else {
      const s1 = i;
      const s2 = i;
      const keyToNewIndexMap = /* @__PURE__ */ new Map();
      for (i = s2; i <= e2; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (nextChild.key != null) {
          keyToNewIndexMap.set(nextChild.key, i);
        }
      }
      let j2;
      let patched = 0;
      const toBePatched = e2 - s2 + 1;
      let moved = false;
      let maxNewIndexSoFar = 0;
      const newIndexToOldIndexMap = new Array(toBePatched);
      for (i = 0; i < toBePatched; i++)
        newIndexToOldIndexMap[i] = 0;
      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i];
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
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
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
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
        if (newIndexToOldIndexMap[i] === 0) {
          patch(null, nextChild, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (moved) {
          if (j2 < 0 || i !== increasingNewIndexSequence[j2]) {
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
      for (let i = 0; i < children.length; i++) {
        move(children[i], container, anchor, moveType);
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
    for (let i = start; i < children.length; i++) {
      unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
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
    for (let i = 0; i < ch1.length; i++) {
      const c1 = ch1[i];
      let c2 = ch2[i];
      if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
        if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
          c2 = ch2[i] = cloneIfMounted(ch2[i]);
          c2.el = c1.el;
        }
        if (!shallow)
          traverseStaticChildren(c1, c2);
      }
    }
  }
}
function getSequence(arr) {
  const p2 = arr.slice();
  const result = [0];
  let i, j2, u2, v2, c2;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j2 = result[result.length - 1];
      if (arr[j2] < arrI) {
        p2[i] = j2;
        result.push(i);
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
          p2[i] = result[u2 - 1];
        }
        result[u2] = i;
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
const Fragment = Symbol(void 0);
const Text = Symbol(void 0);
const Comment = Symbol(void 0);
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
    appContext: null
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
    type = Comment;
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
    anchor: vnode.anchor
  };
  return cloned;
}
function createTextVNode(text = " ", flag = 0) {
  return createVNode(Text, null, text, flag);
}
function createCommentVNode(text = "", asBlock = false) {
  return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
}
function normalizeVNode(child) {
  if (child == null || typeof child === "boolean") {
    return createVNode(Comment);
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
  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i];
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
      }
    }));
  }
}
const classifyRE = /(?:^|[-_])(\w)/g;
const classify = (str) => str.replace(classifyRE, (c2) => c2.toUpperCase()).replace(/[-_]/g, "");
function getComponentName(Component, includeInferred = true) {
  return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
}
function formatComponentName(instance, Component, isRoot = false) {
  let name = getComponentName(Component);
  if (!name && Component.__file) {
    const match = Component.__file.match(/([^/\\]+)\.\w+$/);
    if (match) {
      name = match[1];
    }
  }
  if (!name && instance && instance.parent) {
    const inferFromRegistry = (registry) => {
      for (const key in registry) {
        if (registry[key] === Component) {
          return key;
        }
      }
    };
    name = inferFromRegistry(instance.components || instance.parent.type.components) || inferFromRegistry(instance.appContext.components);
  }
  return name ? classify(name) : isRoot ? `App` : `Anonymous`;
}
function isClassComponent(value) {
  return isFunction(value) && "__vccOpts" in value;
}
const computed = (getterOrOptions, debugOptions) => {
  return computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
};
function h$1(type, propsOrChildren, children) {
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
const version = "3.2.41";
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
  for (let i = 0; i < prefixes.length; i++) {
    const prefixed = prefixes[i] + name;
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
const p$2 = /* @__PURE__ */ Promise.resolve();
const getNow = () => cachedNow || (p$2.then(() => cachedNow = 0), cachedNow = Date.now());
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
const Transition = (props, { slots }) => h$1(BaseTransition, resolveTransitionProps(props), slots);
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
  const transitionDelays = getStyleProperties(TRANSITION + "Delay");
  const transitionDurations = getStyleProperties(TRANSITION + "Duration");
  const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  const animationDelays = getStyleProperties(ANIMATION + "Delay");
  const animationDurations = getStyleProperties(ANIMATION + "Duration");
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
  const hasTransform = type === TRANSITION && /\b(transform|all)(,|$)/.test(styles[TRANSITION + "Property"]);
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
  return Math.max(...durations.map((d2, i) => toMs(d2) + toMs(delays[i])));
}
function toMs(s) {
  return Number(s.slice(0, -1).replace(",", ".")) * 1e3;
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
function u(r2, n2, ...a2) {
  if (r2 in n2) {
    let e2 = n2[r2];
    return typeof e2 == "function" ? e2(...a2) : e2;
  }
  let t2 = new Error(`Tried to handle "${r2}" but there is no handler defined. Only defined handlers are: ${Object.keys(n2).map((e2) => `"${e2}"`).join(", ")}.`);
  throw Error.captureStackTrace && Error.captureStackTrace(t2, u), t2;
}
var R = ((o2) => (o2[o2.None = 0] = "None", o2[o2.RenderStrategy = 1] = "RenderStrategy", o2[o2.Static = 2] = "Static", o2))(R || {}), O$1 = ((e2) => (e2[e2.Unmount = 0] = "Unmount", e2[e2.Hidden = 1] = "Hidden", e2))(O$1 || {});
function P$1({ visible: r2 = true, features: t2 = 0, ourProps: e2, theirProps: o2, ...i }) {
  var a2;
  let n2 = k(o2, e2), s = Object.assign(i, { props: n2 });
  if (r2 || t2 & 2 && n2.static)
    return p$1(s);
  if (t2 & 1) {
    let l2 = (a2 = n2.unmount) == null || a2 ? 0 : 1;
    return u(l2, { [0]() {
      return null;
    }, [1]() {
      return p$1({ ...i, props: { ...n2, hidden: true, style: { display: "none" } } });
    } });
  }
  return p$1(s);
}
function p$1({ props: r2, attrs: t2, slots: e2, slot: o2, name: i }) {
  var y2;
  let { as: n2, ...s } = w$2(r2, ["unmount", "static"]), a2 = (y2 = e2.default) == null ? void 0 : y2.call(e2, o2), l2 = {};
  if (o2) {
    let d2 = false, u2 = [];
    for (let [f2, c2] of Object.entries(o2))
      typeof c2 == "boolean" && (d2 = true), c2 === true && u2.push(f2);
    d2 && (l2["data-headlessui-state"] = u2.join(" "));
  }
  if (n2 === "template") {
    if (a2 = g(a2 != null ? a2 : []), Object.keys(s).length > 0 || Object.keys(t2).length > 0) {
      let [d2, ...u2] = a2 != null ? a2 : [];
      if (!x$1(d2) || u2.length > 0)
        throw new Error(['Passing props on "template"!', "", `The current component <${i} /> is rendering a "template".`, "However we need to passthrough the following props:", Object.keys(s).concat(Object.keys(t2)).sort((f2, c2) => f2.localeCompare(c2)).map((f2) => `  - ${f2}`).join(`
`), "", "You can apply a few solutions:", ['Add an `as="..."` prop, to ensure that we render an actual element instead of a "template".', "Render a single element as the child so that we can forward the props onto that element."].map((f2) => `  - ${f2}`).join(`
`)].join(`
`));
      return cloneVNode(d2, Object.assign({}, s, l2));
    }
    return Array.isArray(a2) && a2.length === 1 ? a2[0] : a2;
  }
  return h$1(n2, Object.assign({}, s, l2), a2);
}
function g(r2) {
  return r2.flatMap((t2) => t2.type === Fragment ? g(t2.children) : [t2]);
}
function k(...r2) {
  if (r2.length === 0)
    return {};
  if (r2.length === 1)
    return r2[0];
  let t2 = {}, e2 = {};
  for (let i of r2)
    for (let n2 in i)
      n2.startsWith("on") && typeof i[n2] == "function" ? (e2[n2] != null || (e2[n2] = []), e2[n2].push(i[n2])) : t2[n2] = i[n2];
  if (t2.disabled || t2["aria-disabled"])
    return Object.assign(t2, Object.fromEntries(Object.keys(e2).map((i) => [i, void 0])));
  for (let i in e2)
    Object.assign(t2, { [i](n2, ...s) {
      let a2 = e2[i];
      for (let l2 of a2) {
        if (n2 instanceof Event && n2.defaultPrevented)
          return;
        l2(n2, ...s);
      }
    } });
  return t2;
}
function w$2(r2, t2 = []) {
  let e2 = Object.assign({}, r2);
  for (let o2 of t2)
    o2 in e2 && delete e2[o2];
  return e2;
}
function x$1(r2) {
  return r2 == null ? false : typeof r2.type == "string" || typeof r2.type == "object" || typeof r2.type == "function";
}
let e$1 = 0;
function n$2() {
  return ++e$1;
}
function t$1() {
  return n$2();
}
var o$1 = ((r2) => (r2.Space = " ", r2.Enter = "Enter", r2.Escape = "Escape", r2.Backspace = "Backspace", r2.Delete = "Delete", r2.ArrowLeft = "ArrowLeft", r2.ArrowUp = "ArrowUp", r2.ArrowRight = "ArrowRight", r2.ArrowDown = "ArrowDown", r2.Home = "Home", r2.End = "End", r2.PageUp = "PageUp", r2.PageDown = "PageDown", r2.Tab = "Tab", r2))(o$1 || {});
function o(n2) {
  var l2;
  return n2 == null || n2.value == null ? null : (l2 = n2.value.$el) != null ? l2 : n2.value;
}
let n$1 = Symbol("Context");
var l = ((e2) => (e2[e2.Open = 0] = "Open", e2[e2.Closed = 1] = "Closed", e2))(l || {});
function p() {
  return inject(n$1, null);
}
function c(o2) {
  provide(n$1, o2);
}
function r(t2, e2) {
  if (t2)
    return t2;
  let n2 = e2 != null ? e2 : "button";
  if (typeof n2 == "string" && n2.toLowerCase() === "button")
    return "button";
}
function b$1(t2, e2) {
  let n2 = ref(r(t2.value.type, t2.value.as));
  return onMounted(() => {
    n2.value = r(t2.value.type, t2.value.as);
  }), watchEffect(() => {
    var o$12;
    n2.value || !o(e2) || o(e2) instanceof HTMLButtonElement && !((o$12 = o(e2)) != null && o$12.hasAttribute("type")) && (n2.value = "button");
  }), n2;
}
const e = typeof window == "undefined" || typeof document == "undefined";
function m$1(r2) {
  if (e)
    return null;
  if (r2 instanceof Node)
    return r2.ownerDocument;
  if (r2 != null && r2.hasOwnProperty("value")) {
    let o$12 = o(r2);
    if (o$12)
      return o$12.ownerDocument;
  }
  return document;
}
let m = ["[contentEditable=true]", "[tabindex]", "a[href]", "area[href]", "button:not([disabled])", "iframe", "input:not([disabled])", "select:not([disabled])", "textarea:not([disabled])"].map((e2) => `${e2}:not([tabindex='-1'])`).join(",");
var M = ((n2) => (n2[n2.First = 1] = "First", n2[n2.Previous = 2] = "Previous", n2[n2.Next = 4] = "Next", n2[n2.Last = 8] = "Last", n2[n2.WrapAround = 16] = "WrapAround", n2[n2.NoScroll = 32] = "NoScroll", n2))(M || {}), N = ((o2) => (o2[o2.Error = 0] = "Error", o2[o2.Overflow = 1] = "Overflow", o2[o2.Success = 2] = "Success", o2[o2.Underflow = 3] = "Underflow", o2))(N || {}), b = ((r2) => (r2[r2.Previous = -1] = "Previous", r2[r2.Next = 1] = "Next", r2))(b || {});
function E$2(e2 = document.body) {
  return e2 == null ? [] : Array.from(e2.querySelectorAll(m));
}
var F = ((r2) => (r2[r2.Strict = 0] = "Strict", r2[r2.Loose = 1] = "Loose", r2))(F || {});
function h(e2, t2 = 0) {
  var r2;
  return e2 === ((r2 = m$1(e2)) == null ? void 0 : r2.body) ? false : u(t2, { [0]() {
    return e2.matches(m);
  }, [1]() {
    let l2 = e2;
    for (; l2 !== null; ) {
      if (l2.matches(m))
        return true;
      l2 = l2.parentElement;
    }
    return false;
  } });
}
let H$1 = ["textarea", "input"].join(",");
function S(e2) {
  var t2, r2;
  return (r2 = (t2 = e2 == null ? void 0 : e2.matches) == null ? void 0 : t2.call(e2, H$1)) != null ? r2 : false;
}
function O(e2, t2 = (r2) => r2) {
  return e2.slice().sort((r2, l2) => {
    let o2 = t2(r2), s = t2(l2);
    if (o2 === null || s === null)
      return 0;
    let n2 = o2.compareDocumentPosition(s);
    return n2 & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : n2 & Node.DOCUMENT_POSITION_PRECEDING ? 1 : 0;
  });
}
function P(e2, t2, r2 = true, l2 = null) {
  var c2;
  let o2 = (c2 = Array.isArray(e2) ? e2.length > 0 ? e2[0].ownerDocument : document : e2 == null ? void 0 : e2.ownerDocument) != null ? c2 : document, s = Array.isArray(e2) ? r2 ? O(e2) : e2 : E$2(e2);
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
      return Math.max(0, s.indexOf(l2)) - 1;
    if (t2 & 4)
      return Math.max(0, s.indexOf(l2)) + 1;
    if (t2 & 8)
      return s.length - 1;
    throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last");
  })(), p2 = t2 & 32 ? { preventScroll: true } : {}, a2 = 0, i = s.length, u2;
  do {
    if (a2 >= i || a2 + i <= 0)
      return 0;
    let f2 = x2 + a2;
    if (t2 & 16)
      f2 = (f2 + i) % i;
    else {
      if (f2 < 0)
        return 3;
      if (f2 >= i)
        return 1;
    }
    u2 = s[f2], u2 == null || u2.focus(p2), a2 += n2;
  } while (u2 !== o2.activeElement);
  return t2 & 6 && S(u2) && u2.select(), u2.hasAttribute("tabindex") || u2.setAttribute("tabindex", "0"), 2;
}
function v(e$12, t2, n2) {
  e || watchEffect((o2) => {
    document.addEventListener(e$12, t2, n2), o2(() => document.removeEventListener(e$12, t2, n2));
  });
}
function y(f2, m2, i = computed(() => true)) {
  function a2(e2, u2) {
    if (!i.value || e2.defaultPrevented)
      return;
    let n2 = u2(e2);
    if (n2 === null || !n2.ownerDocument.documentElement.contains(n2))
      return;
    let c2 = function o2(t2) {
      return typeof t2 == "function" ? o2(t2()) : Array.isArray(t2) || t2 instanceof Set ? t2 : [t2];
    }(f2);
    for (let o$12 of c2) {
      if (o$12 === null)
        continue;
      let t2 = o$12 instanceof HTMLElement ? o$12 : o(o$12);
      if (t2 != null && t2.contains(n2))
        return;
    }
    return !h(n2, F.Loose) && n2.tabIndex !== -1 && e2.preventDefault(), m2(e2, n2);
  }
  let r2 = ref(null);
  v("mousedown", (e2) => {
    var u2, n2;
    i.value && (r2.value = ((n2 = (u2 = e2.composedPath) == null ? void 0 : u2.call(e2)) == null ? void 0 : n2[0]) || e2.target);
  }, true), v("click", (e2) => {
    !r2.value || (a2(e2, () => r2.value), r2.value = null);
  }, true), v("blur", (e2) => a2(e2, () => window.document.activeElement instanceof HTMLIFrameElement ? window.document.activeElement : null), true);
}
var a = ((e2) => (e2[e2.None = 1] = "None", e2[e2.Focusable = 2] = "Focusable", e2[e2.Hidden = 4] = "Hidden", e2))(a || {});
let f = defineComponent({ name: "Hidden", props: { as: { type: [Object, String], default: "div" }, features: { type: Number, default: 1 } }, setup(r2, { slots: t2, attrs: d2 }) {
  return () => {
    let { features: e2, ...o2 } = r2, n2 = { "aria-hidden": (e2 & 2) === 2 ? true : void 0, style: { position: "fixed", top: 1, left: 1, width: 1, height: 0, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", borderWidth: "0", ...(e2 & 4) === 4 && (e2 & 2) !== 2 && { display: "none" } } };
    return P$1({ ourProps: n2, theirProps: o2, slot: {}, attrs: d2, slots: t2, name: "Hidden" });
  };
} });
function w$1(e$12, n2, t2) {
  e || watchEffect((o2) => {
    window.addEventListener(e$12, n2, t2), o2(() => window.removeEventListener(e$12, n2, t2));
  });
}
var d$1 = ((r2) => (r2[r2.Forwards = 0] = "Forwards", r2[r2.Backwards = 1] = "Backwards", r2))(d$1 || {});
function n() {
  let o2 = ref(0);
  return w$1("keydown", (e2) => {
    e2.key === "Tab" && (o2.value = e2.shiftKey ? 1 : 0);
  }), o2;
}
function E$1(n2, e$12, o2, r2) {
  e || watchEffect((t2) => {
    n2 = n2 != null ? n2 : window, n2.addEventListener(e$12, o2, r2), t2(() => n2.removeEventListener(e$12, o2, r2));
  });
}
function t(e2) {
  typeof queueMicrotask == "function" ? queueMicrotask(e2) : Promise.resolve().then(e2).catch((o2) => setTimeout(() => {
    throw o2;
  }));
}
var w = ((n2) => (n2[n2.Open = 0] = "Open", n2[n2.Closed = 1] = "Closed", n2))(w || {});
let x = Symbol("DisclosureContext");
function C(l2) {
  let r2 = inject(x, null);
  if (r2 === null) {
    let n2 = new Error(`<${l2} /> is missing a parent <Disclosure /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(n2, C), n2;
  }
  return r2;
}
let B = Symbol("DisclosurePanelContext");
function H() {
  return inject(B, null);
}
let A = defineComponent({ name: "Disclosure", props: { as: { type: [Object, String], default: "template" }, defaultOpen: { type: [Boolean], default: false } }, setup(l$1, { slots: r2, attrs: n2 }) {
  let d2 = `headlessui-disclosure-button-${t$1()}`, e2 = `headlessui-disclosure-panel-${t$1()}`, o$12 = ref(l$1.defaultOpen ? 0 : 1), i = ref(null), s = ref(null), u$1 = { buttonId: d2, panelId: e2, disclosureState: o$12, panel: i, button: s, toggleDisclosure() {
    o$12.value = u(o$12.value, { [0]: 1, [1]: 0 });
  }, closeDisclosure() {
    o$12.value !== 1 && (o$12.value = 1);
  }, close(a2) {
    u$1.closeDisclosure();
    let c2 = (() => a2 ? a2 instanceof HTMLElement ? a2 : a2.value instanceof HTMLElement ? o(a2) : o(u$1.button) : o(u$1.button))();
    c2 == null || c2.focus();
  } };
  return provide(x, u$1), c(computed(() => u(o$12.value, { [0]: l.Open, [1]: l.Closed }))), () => {
    let { defaultOpen: a2, ...c2 } = l$1, m2 = { open: o$12.value === 0, close: u$1.close };
    return P$1({ theirProps: c2, ourProps: {}, slot: m2, slots: r2, attrs: n2, name: "Disclosure" });
  };
} }), G = defineComponent({ name: "DisclosureButton", props: { as: { type: [Object, String], default: "button" }, disabled: { type: [Boolean], default: false } }, setup(l2, { attrs: r2, slots: n2, expose: d2 }) {
  let e2 = C("DisclosureButton"), o$2 = H(), i = o$2 === null ? false : o$2 === e2.panelId, s = ref(null);
  d2({ el: s, $el: s }), i || watchEffect(() => {
    e2.button.value = s.value;
  });
  let u2 = b$1(computed(() => ({ as: l2.as, type: r2.type })), s);
  function a2() {
    var t2;
    l2.disabled || (i ? (e2.toggleDisclosure(), (t2 = o(e2.button)) == null || t2.focus()) : e2.toggleDisclosure());
  }
  function c2(t2) {
    var D;
    if (!l2.disabled)
      if (i)
        switch (t2.key) {
          case o$1.Space:
          case o$1.Enter:
            t2.preventDefault(), t2.stopPropagation(), e2.toggleDisclosure(), (D = o(e2.button)) == null || D.focus();
            break;
        }
      else
        switch (t2.key) {
          case o$1.Space:
          case o$1.Enter:
            t2.preventDefault(), t2.stopPropagation(), e2.toggleDisclosure();
            break;
        }
  }
  function m2(t2) {
    switch (t2.key) {
      case o$1.Space:
        t2.preventDefault();
        break;
    }
  }
  return () => {
    let t2 = { open: e2.disclosureState.value === 0 }, D = i ? { ref: s, type: u2.value, onClick: a2, onKeydown: c2 } : { id: e2.buttonId, ref: s, type: u2.value, "aria-expanded": l2.disabled ? void 0 : e2.disclosureState.value === 0, "aria-controls": o(e2.panel) ? e2.panelId : void 0, disabled: l2.disabled ? true : void 0, onClick: a2, onKeydown: c2, onKeyup: m2 };
    return P$1({ ourProps: D, theirProps: l2, slot: t2, attrs: r2, slots: n2, name: "DisclosureButton" });
  };
} }), J = defineComponent({ name: "DisclosurePanel", props: { as: { type: [Object, String], default: "div" }, static: { type: Boolean, default: false }, unmount: { type: Boolean, default: true } }, setup(l$1, { attrs: r2, slots: n2, expose: d2 }) {
  let e2 = C("DisclosurePanel");
  d2({ el: e2.panel, $el: e2.panel }), provide(B, e2.panelId);
  let o2 = p(), i = computed(() => o2 !== null ? o2.value === l.Open : e2.disclosureState.value === 0);
  return () => {
    let s = { open: e2.disclosureState.value === 0, close: e2.close }, u2 = { id: e2.panelId, ref: e2.panel };
    return P$1({ ourProps: u2, theirProps: l$1, slot: s, attrs: r2, slots: n2, features: R.RenderStrategy | R.Static, visible: i.value, name: "DisclosurePanel" });
  };
} });
var fe$1 = ((v2) => (v2[v2.Open = 0] = "Open", v2[v2.Closed = 1] = "Closed", v2))(fe$1 || {});
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
function oe$1() {
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
  let u$1 = ref(1), d2 = ref(null), g2 = ref(null), y$1 = ref(null), s = ref(null), c$1 = computed(() => m$1(b2)), h$12 = computed(() => {
    var R2, C2;
    if (!o(d2) || !o(s))
      return false;
    for (let D of document.querySelectorAll("body > *"))
      if (Number(D == null ? void 0 : D.contains(o(d2))) ^ Number(D == null ? void 0 : D.contains(o(s))))
        return true;
    let r2 = E$2(), a2 = r2.indexOf(o(d2)), f2 = (a2 + r2.length - 1) % r2.length, F2 = (a2 + 1) % r2.length, M2 = r2[f2], x2 = r2[F2];
    return !((R2 = o(s)) != null && R2.contains(M2)) && !((C2 = o(s)) != null && C2.contains(x2));
  }), P2 = { popoverState: u$1, buttonId: t2, panelId: e2, panel: s, button: d2, isPortalled: h$12, beforePanelSentinel: g2, afterPanelSentinel: y$1, togglePopover() {
    u$1.value = u(u$1.value, { [0]: 1, [1]: 0 });
  }, closePopover() {
    u$1.value !== 1 && (u$1.value = 1);
  }, close(r2) {
    P2.closePopover();
    let a2 = (() => r2 ? r2 instanceof HTMLElement ? r2 : r2.value instanceof HTMLElement ? o(r2) : o(P2.button) : o(P2.button))();
    a2 == null || a2.focus();
  } };
  provide(ee, P2), c(computed(() => u(u$1.value, { [0]: l.Open, [1]: l.Closed })));
  let I = { buttonId: t2, panelId: e2, close() {
    P2.closePopover();
  } }, l$1 = oe$1(), o$12 = l$1 == null ? void 0 : l$1.registerPopover;
  function i() {
    var r2, a2, f2, F2;
    return (F2 = l$1 == null ? void 0 : l$1.isFocusWithinPopoverGroup()) != null ? F2 : ((r2 = c$1.value) == null ? void 0 : r2.activeElement) && (((a2 = o(d2)) == null ? void 0 : a2.contains(c$1.value.activeElement)) || ((f2 = o(s)) == null ? void 0 : f2.contains(c$1.value.activeElement)));
  }
  return watchEffect(() => o$12 == null ? void 0 : o$12(I)), E$1((p2 = c$1.value) == null ? void 0 : p2.defaultView, "focus", (r2) => {
    var a2, f2;
    u$1.value === 0 && (i() || !d2 || !s || (a2 = o(P2.beforePanelSentinel)) != null && a2.contains(r2.target) || (f2 = o(P2.afterPanelSentinel)) != null && f2.contains(r2.target) || P2.closePopover());
  }, true), y([d2, s], (r2, a2) => {
    var f2;
    P2.closePopover(), h(a2, F.Loose) || (r2.preventDefault(), (f2 = o(d2)) == null || f2.focus());
  }, computed(() => u$1.value === 0)), () => {
    let r2 = { open: u$1.value === 0, close: P2.close };
    return P$1({ theirProps: m2, ourProps: { ref: b2 }, slot: r2, slots: S2, attrs: v2, name: "Popover" });
  };
} }), ke = defineComponent({ name: "PopoverButton", props: { as: { type: [Object, String], default: "button" }, disabled: { type: [Boolean], default: false } }, inheritAttrs: false, setup(m2, { attrs: S2, slots: v2, expose: E2 }) {
  let t2 = V("PopoverButton"), e2 = computed(() => m$1(t2.button));
  E2({ el: t2.button, $el: t2.button });
  let b2 = oe$1(), u$1 = b2 == null ? void 0 : b2.closeOthers, d2 = ve(), g2 = d2 === null ? false : d2 === t2.panelId, y2 = ref(null), s = `headlessui-focus-sentinel-${t$1()}`;
  g2 || watchEffect(() => {
    t2.button.value = y2.value;
  });
  let c2 = b$1(computed(() => ({ as: m2.as, type: S2.type })), y2);
  function h2(o$2) {
    var i, p2, r2, a2, f2;
    if (g2) {
      if (t2.popoverState.value === 1)
        return;
      switch (o$2.key) {
        case o$1.Space:
        case o$1.Enter:
          o$2.preventDefault(), (p2 = (i = o$2.target).click) == null || p2.call(i), t2.closePopover(), (r2 = o(t2.button)) == null || r2.focus();
          break;
      }
    } else
      switch (o$2.key) {
        case o$1.Space:
        case o$1.Enter:
          o$2.preventDefault(), o$2.stopPropagation(), t2.popoverState.value === 1 && (u$1 == null || u$1(t2.buttonId)), t2.togglePopover();
          break;
        case o$1.Escape:
          if (t2.popoverState.value !== 0)
            return u$1 == null ? void 0 : u$1(t2.buttonId);
          if (!o(t2.button) || ((a2 = e2.value) == null ? void 0 : a2.activeElement) && !((f2 = o(t2.button)) != null && f2.contains(e2.value.activeElement)))
            return;
          o$2.preventDefault(), o$2.stopPropagation(), t2.closePopover();
          break;
      }
  }
  function P$2(o2) {
    g2 || o2.key === o$1.Space && o2.preventDefault();
  }
  function I(o$12) {
    var i, p2;
    m2.disabled || (g2 ? (t2.closePopover(), (i = o(t2.button)) == null || i.focus()) : (o$12.preventDefault(), o$12.stopPropagation(), t2.popoverState.value === 1 && (u$1 == null || u$1(t2.buttonId)), t2.togglePopover(), (p2 = o(t2.button)) == null || p2.focus()));
  }
  function l2(o2) {
    o2.preventDefault(), o2.stopPropagation();
  }
  return () => {
    let o$12 = t2.popoverState.value === 0, i = { open: o$12 }, p2 = g2 ? { ref: y2, type: c2.value, onKeydown: h2, onClick: I } : { ref: y2, id: t2.buttonId, type: c2.value, "aria-expanded": m2.disabled ? void 0 : t2.popoverState.value === 0, "aria-controls": o(t2.panel) ? t2.panelId : void 0, disabled: m2.disabled ? true : void 0, onKeydown: h2, onKeyup: P$2, onClick: I, onMousedown: l2 }, r2 = n();
    function a$1() {
      let f2 = o(t2.panel);
      if (!f2)
        return;
      function F2() {
        u(r2.value, { [d$1.Forwards]: () => P(f2, M.First), [d$1.Backwards]: () => P(f2, M.Last) });
      }
      F2();
    }
    return h$1(Fragment, [P$1({ ourProps: p2, theirProps: { ...S2, ...m2 }, slot: i, attrs: S2, slots: v2, name: "PopoverButton" }), o$12 && !g2 && t2.isPortalled.value && h$1(f, { id: s, features: a.Focusable, as: "button", type: "button", onFocus: a$1 })]);
  };
} });
defineComponent({ name: "PopoverOverlay", props: { as: { type: [Object, String], default: "div" }, static: { type: Boolean, default: false }, unmount: { type: Boolean, default: true } }, setup(m2, { attrs: S2, slots: v2 }) {
  let E2 = V("PopoverOverlay"), t2 = `headlessui-popover-overlay-${t$1()}`, e2 = p(), b2 = computed(() => e2 !== null ? e2.value === l.Open : E2.popoverState.value === 0);
  function u2() {
    E2.closePopover();
  }
  return () => {
    let d2 = { open: E2.popoverState.value === 0 };
    return P$1({ ourProps: { id: t2, "aria-hidden": true, onClick: u2 }, theirProps: m2, slot: d2, attrs: S2, slots: v2, features: R.RenderStrategy | R.Static, visible: b2.value, name: "PopoverOverlay" });
  };
} });
let Le = defineComponent({ name: "PopoverPanel", props: { as: { type: [Object, String], default: "div" }, static: { type: Boolean, default: false }, unmount: { type: Boolean, default: true }, focus: { type: Boolean, default: false } }, inheritAttrs: false, setup(m2, { attrs: S2, slots: v2, expose: E2 }) {
  let { focus: t2 } = m2, e2 = V("PopoverPanel"), b2 = computed(() => m$1(e2.panel)), u$1 = `headlessui-focus-sentinel-before-${t$1()}`, d2 = `headlessui-focus-sentinel-after-${t$1()}`;
  E2({ el: e2.panel, $el: e2.panel }), provide(ne, e2.panelId), watchEffect(() => {
    var o$12, i;
    if (!t2 || e2.popoverState.value !== 0 || !e2.panel)
      return;
    let l2 = (o$12 = b2.value) == null ? void 0 : o$12.activeElement;
    (i = o(e2.panel)) != null && i.contains(l2) || P(o(e2.panel), M.First);
  });
  let g2 = p(), y2 = computed(() => g2 !== null ? g2.value === l.Open : e2.popoverState.value === 0);
  function s(l2) {
    var o$2, i;
    switch (l2.key) {
      case o$1.Escape:
        if (e2.popoverState.value !== 0 || !o(e2.panel) || b2.value && !((o$2 = o(e2.panel)) != null && o$2.contains(b2.value.activeElement)))
          return;
        l2.preventDefault(), l2.stopPropagation(), e2.closePopover(), (i = o(e2.button)) == null || i.focus();
        break;
    }
  }
  function c2(l2) {
    var i, p2, r2, a2, f2;
    let o$12 = l2.relatedTarget;
    !o$12 || !o(e2.panel) || (i = o(e2.panel)) != null && i.contains(o$12) || (e2.closePopover(), (((r2 = (p2 = o(e2.beforePanelSentinel)) == null ? void 0 : p2.contains) == null ? void 0 : r2.call(p2, o$12)) || ((f2 = (a2 = o(e2.afterPanelSentinel)) == null ? void 0 : a2.contains) == null ? void 0 : f2.call(a2, o$12))) && o$12.focus({ preventScroll: true }));
  }
  let h2 = n();
  function P$2() {
    let l2 = o(e2.panel);
    if (!l2)
      return;
    function o$12() {
      u(h2.value, { [d$1.Forwards]: () => {
        P(l2, M.Next);
      }, [d$1.Backwards]: () => {
        var i;
        (i = o(e2.button)) == null || i.focus({ preventScroll: true });
      } });
    }
    o$12();
  }
  function I() {
    let l2 = o(e2.panel);
    if (!l2)
      return;
    function o$12() {
      u(h2.value, { [d$1.Forwards]: () => {
        var x2, R2;
        let i = o(e2.button), p2 = o(e2.panel);
        if (!i)
          return;
        let r2 = E$2(), a2 = r2.indexOf(i), f2 = r2.slice(0, a2 + 1), M$1 = [...r2.slice(a2 + 1), ...f2];
        for (let C2 of M$1.slice())
          if (((R2 = (x2 = C2 == null ? void 0 : C2.id) == null ? void 0 : x2.startsWith) == null ? void 0 : R2.call(x2, "headlessui-focus-sentinel-")) || (p2 == null ? void 0 : p2.contains(C2))) {
            let D = M$1.indexOf(C2);
            D !== -1 && M$1.splice(D, 1);
          }
        P(M$1, M.First, false);
      }, [d$1.Backwards]: () => P(l2, M.Previous) });
    }
    o$12();
  }
  return () => {
    let l2 = { open: e2.popoverState.value === 0, close: e2.close }, o2 = { ref: e2.panel, id: e2.panelId, onKeydown: s, onFocusout: t2 && e2.popoverState.value === 0 ? c2 : void 0, tabIndex: -1 };
    return P$1({ ourProps: o2, theirProps: { ...S2, ...w$2(m2, ["focus"]) }, attrs: S2, slot: l2, slots: { ...v2, default: (...i) => {
      var p2;
      return [h$1(Fragment, [y2.value && e2.isPortalled.value && h$1(f, { id: u$1, ref: e2.beforePanelSentinel, features: a.Focusable, as: "button", type: "button", onFocus: P$2 }), (p2 = v2.default) == null ? void 0 : p2.call(v2, ...i), y2.value && e2.isPortalled.value && h$1(f, { id: d2, ref: e2.afterPanelSentinel, features: a.Focusable, as: "button", type: "button", onFocus: I })])];
    } }, features: R.RenderStrategy | R.Static, visible: y2.value, name: "PopoverPanel" });
  };
} }), He = defineComponent({ name: "PopoverGroup", props: { as: { type: [Object, String], default: "div" } }, setup(m2, { attrs: S2, slots: v2, expose: E2 }) {
  let t2 = ref(null), e2 = ref([]), b2 = computed(() => m$1(t2));
  E2({ el: t2, $el: t2 });
  function u2(s) {
    let c2 = e2.value.indexOf(s);
    c2 !== -1 && e2.value.splice(c2, 1);
  }
  function d2(s) {
    return e2.value.push(s), () => {
      u2(s);
    };
  }
  function g2() {
    var h2;
    let s = b2.value;
    if (!s)
      return false;
    let c2 = s.activeElement;
    return (h2 = o(t2)) != null && h2.contains(c2) ? true : e2.value.some((P2) => {
      var I, l2;
      return ((I = s.getElementById(P2.buttonId)) == null ? void 0 : I.contains(c2)) || ((l2 = s.getElementById(P2.panelId)) == null ? void 0 : l2.contains(c2));
    });
  }
  function y2(s) {
    for (let c2 of e2.value)
      c2.buttonId !== s && c2.close();
  }
  return provide(te, { registerPopover: d2, unregisterPopover: u2, isFocusWithinPopoverGroup: g2, closeOthers: y2 }), () => P$1({ ourProps: { ref: t2 }, theirProps: m2, slot: {}, attrs: S2, slots: v2, name: "PopoverGroup" });
} });
let d = defineComponent({ props: { onFocus: { type: Function, required: true } }, setup(t2) {
  let n2 = ref(true);
  return () => n2.value ? h$1(f, { as: "button", type: "button", features: a.Focusable, onFocus(o2) {
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
  let i = inject(j, null);
  if (i === null) {
    let o2 = new Error(`<${l2} /> is missing a parent <TabGroup /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(o2, E), o2;
  }
  return i;
}
let oe = defineComponent({ name: "TabGroup", emits: { change: (l2) => true }, props: { as: { type: [Object, String], default: "template" }, selectedIndex: { type: [Number], default: null }, defaultIndex: { type: [Number], default: 0 }, vertical: { type: [Boolean], default: false }, manual: { type: [Boolean], default: false } }, inheritAttrs: false, setup(l2, { slots: i, attrs: o$12, emit: f2 }) {
  let e2 = ref(null), s = ref([]), n2 = ref([]), c2 = computed(() => l2.selectedIndex !== null), p2 = computed(() => c2.value ? l2.selectedIndex : e2.value), b2 = { selectedIndex: e2, orientation: computed(() => l2.vertical ? "vertical" : "horizontal"), activation: computed(() => l2.manual ? "manual" : "auto"), tabs: s, panels: n2, setSelectedIndex(t2) {
    p2.value !== t2 && f2("change", t2), c2.value || (e2.value = t2);
  }, registerTab(t2) {
    s.value.includes(t2) || s.value.push(t2);
  }, unregisterTab(t2) {
    let r2 = s.value.indexOf(t2);
    r2 !== -1 && s.value.splice(r2, 1);
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
    let t2 = b2.tabs.value.map((y2) => o(y2)).filter(Boolean), r2 = t2.filter((y2) => !y2.hasAttribute("disabled")), d2 = (R2 = l2.selectedIndex) != null ? R2 : l2.defaultIndex;
    if (d2 < 0)
      e2.value = t2.indexOf(r2[0]);
    else if (d2 > b2.tabs.value.length)
      e2.value = t2.indexOf(r2[r2.length - 1]);
    else {
      let y2 = t2.slice(0, d2), u2 = [...t2.slice(d2), ...y2].find((T) => r2.includes(T));
      if (!u2)
        return;
      e2.value = t2.indexOf(u2);
    }
  }), () => {
    let t2 = { selectedIndex: e2.value };
    return h$1(Fragment, [s.value.length <= 0 && h$1(d, { onFocus: () => {
      for (let r2 of s.value) {
        let d2 = o(r2);
        if ((d2 == null ? void 0 : d2.tabIndex) === 0)
          return d2.focus(), true;
      }
      return false;
    } }), P$1({ theirProps: { ...o$12, ...w$2(l2, ["selectedIndex", "defaultIndex", "manual", "vertical", "onChange"]) }, ourProps: {}, slot: t2, slots: i, attrs: o$12, name: "TabGroup" })]);
  };
} }), se = defineComponent({ name: "TabList", props: { as: { type: [Object, String], default: "div" } }, setup(l2, { attrs: i, slots: o2 }) {
  let f2 = E("TabList");
  return () => {
    let e2 = { selectedIndex: f2.selectedIndex.value }, s = { role: "tablist", "aria-orientation": f2.orientation.value };
    return P$1({ ourProps: s, theirProps: l2, slot: e2, attrs: i, slots: o2, name: "TabList" });
  };
} }), de = defineComponent({ name: "Tab", props: { as: { type: [Object, String], default: "button" }, disabled: { type: [Boolean], default: false } }, setup(l2, { attrs: i, slots: o$2, expose: f2 }) {
  let e2 = E("Tab"), s = `headlessui-tabs-tab-${t$1()}`, n2 = ref(null);
  f2({ el: n2, $el: n2 }), onMounted(() => e2.registerTab(n2)), onUnmounted(() => e2.unregisterTab(n2));
  let c2 = computed(() => e2.tabs.value.indexOf(n2)), p2 = computed(() => c2.value === e2.selectedIndex.value);
  function b2(a2) {
    var T;
    let u2 = a2();
    if (u2 === N.Success && e2.activation.value === "auto") {
      let L = (T = m$1(n2)) == null ? void 0 : T.activeElement, M2 = e2.tabs.value.findIndex((B2) => o(B2) === L);
      M2 !== -1 && e2.setSelectedIndex(M2);
    }
    return u2;
  }
  function t$2(a2) {
    let u$1 = e2.tabs.value.map((L) => o(L)).filter(Boolean);
    if (a2.key === o$1.Space || a2.key === o$1.Enter) {
      a2.preventDefault(), a2.stopPropagation(), e2.setSelectedIndex(c2.value);
      return;
    }
    switch (a2.key) {
      case o$1.Home:
      case o$1.PageUp:
        return a2.preventDefault(), a2.stopPropagation(), b2(() => P(u$1, M.First));
      case o$1.End:
      case o$1.PageDown:
        return a2.preventDefault(), a2.stopPropagation(), b2(() => P(u$1, M.Last));
    }
    if (b2(() => u(e2.orientation.value, { vertical() {
      return a2.key === o$1.ArrowUp ? P(u$1, M.Previous | M.WrapAround) : a2.key === o$1.ArrowDown ? P(u$1, M.Next | M.WrapAround) : N.Error;
    }, horizontal() {
      return a2.key === o$1.ArrowLeft ? P(u$1, M.Previous | M.WrapAround) : a2.key === o$1.ArrowRight ? P(u$1, M.Next | M.WrapAround) : N.Error;
    } })) === N.Success)
      return a2.preventDefault();
  }
  let r2 = ref(false);
  function d2() {
    var a2;
    r2.value || (r2.value = true, !l2.disabled && ((a2 = o(n2)) == null || a2.focus(), e2.setSelectedIndex(c2.value), t(() => {
      r2.value = false;
    })));
  }
  function R2(a2) {
    a2.preventDefault();
  }
  let y2 = b$1(computed(() => ({ as: l2.as, type: i.type })), n2);
  return () => {
    var T;
    let a2 = { selected: p2.value }, u2 = { ref: n2, onKeydown: t$2, onMousedown: R2, onClick: d2, id: s, role: "tab", type: y2.value, "aria-controls": (T = o(e2.panels.value[c2.value])) == null ? void 0 : T.id, "aria-selected": p2.value, tabIndex: p2.value ? 0 : -1, disabled: l2.disabled ? true : void 0 };
    return P$1({ ourProps: u2, theirProps: l2, slot: a2, attrs: i, slots: o$2, name: "Tab" });
  };
} }), fe = defineComponent({ name: "TabPanels", props: { as: { type: [Object, String], default: "div" } }, setup(l2, { slots: i, attrs: o2 }) {
  let f2 = E("TabPanels");
  return () => {
    let e2 = { selectedIndex: f2.selectedIndex.value };
    return P$1({ theirProps: l2, ourProps: {}, slot: e2, attrs: o2, slots: i, name: "TabPanels" });
  };
} }), ce = defineComponent({ name: "TabPanel", props: { as: { type: [Object, String], default: "div" }, static: { type: Boolean, default: false }, unmount: { type: Boolean, default: true } }, setup(l2, { attrs: i, slots: o$12, expose: f$1 }) {
  let e2 = E("TabPanel"), s = `headlessui-tabs-panel-${t$1()}`, n2 = ref(null);
  f$1({ el: n2, $el: n2 }), onMounted(() => e2.registerPanel(n2)), onUnmounted(() => e2.unregisterPanel(n2));
  let c2 = computed(() => e2.panels.value.indexOf(n2)), p2 = computed(() => c2.value === e2.selectedIndex.value);
  return () => {
    var r2;
    let b2 = { selected: p2.value }, t2 = { ref: n2, id: s, role: "tabpanel", "aria-labelledby": (r2 = o(e2.tabs.value[c2.value])) == null ? void 0 : r2.id, tabIndex: p2.value ? 0 : -1 };
    return !p2.value && l2.unmount && !l2.static ? h$1(f, { as: "span", ...t2 }) : P$1({ ourProps: t2, theirProps: l2, slot: b2, attrs: i, slots: o$12, features: R.Static | R.RenderStrategy, visible: p2.value, name: "TabPanel" });
  };
} });
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$3 = {
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
const _hoisted_1$3 = ["srcset", "src", "sizes", "alt", "preload", "width", "height"];
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("img", {
    srcset: $options.formattedSrcSet,
    src: $options.formattedSrc,
    sizes: $props.sizes,
    alt: $props.alt,
    preload: $props.preload,
    width: $props.width,
    height: $props.height,
    class: normalizeClass($props.classes)
  }, null, 10, _hoisted_1$3);
}
const ImageTag = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3]]);
const _sfc_main$2 = {
  name: "Mega Menu",
  components: { PopoverGroup: He, Popover: ce$1, PopoverButton: ke, PopoverPanel: Le, TabGroup: oe, TabList: se, Tab: de, TabPanels: fe, TabPanel: ce, Disclosure: A, DisclosureButton: G, DisclosurePanel: J, ImageTag },
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
const _hoisted_1$2 = { class: "icon target" };
const _hoisted_2$2 = ["width", "height"];
const _hoisted_3$2 = /* @__PURE__ */ createBaseVNode("path", { d: "M21 18H3M21 12H3M21 6H3" }, null, -1);
const _hoisted_4$2 = [
  _hoisted_3$2
];
const _hoisted_5$2 = { class: "mobile-header" };
const _hoisted_6$2 = ["onClick"];
const _hoisted_7$2 = { class: "icon target" };
const _hoisted_8$1 = ["width", "height"];
const _hoisted_9$1 = /* @__PURE__ */ createBaseVNode("path", {
  "fill-rule": "evenodd",
  "clip-rule": "evenodd",
  d: "M1 4.51a.5.5 0 000 1h3.5l.01 3.5a.5.5 0 001-.01V5.5l3.5-.01a.5.5 0 00-.01-1H5.5L5.49.99a.5.5 0 00-1 .01v3.5l-3.5.01H1z",
  fill: "currentColor"
}, null, -1);
const _hoisted_10$1 = [
  _hoisted_9$1
];
const _hoisted_11$1 = ["href"];
const _hoisted_12$1 = {
  key: 0,
  class: "icon target expand"
};
const _hoisted_13$1 = ["width", "height"];
const _hoisted_14$1 = /* @__PURE__ */ createBaseVNode("path", {
  "fill-rule": "evenodd",
  "clip-rule": "evenodd",
  d: "M1 4.51a.5.5 0 000 1h3.5l.01 3.5a.5.5 0 001-.01V5.5l3.5-.01a.5.5 0 00-.01-1H5.5L5.49.99a.5.5 0 00-1 .01v3.5l-3.5.01H1z",
  fill: "currentColor"
}, null, -1);
const _hoisted_15$1 = [
  _hoisted_14$1
];
const _hoisted_16$1 = ["href"];
const _hoisted_17$1 = {
  key: 0,
  class: "icon target expand"
};
const _hoisted_18$1 = ["width", "height"];
const _hoisted_19$1 = /* @__PURE__ */ createBaseVNode("path", {
  "fill-rule": "evenodd",
  "clip-rule": "evenodd",
  d: "M1 4.51a.5.5 0 000 1h3.5l.01 3.5a.5.5 0 001-.01V5.5l3.5-.01a.5.5 0 00-.01-1H5.5L5.49.99a.5.5 0 00-1 .01v3.5l-3.5.01H1z",
  fill: "currentColor"
}, null, -1);
const _hoisted_20$1 = [
  _hoisted_19$1
];
const _hoisted_21$1 = {
  key: 0,
  class: "mobile-links"
};
const _hoisted_22$1 = ["href"];
const _hoisted_23$1 = { class: "mobile-footer" };
const _hoisted_24$1 = { href: "/account" };
const _hoisted_25$1 = { class: "icon target" };
const _hoisted_26$1 = ["width", "height", "stroke-width"];
const _hoisted_27$1 = /* @__PURE__ */ createBaseVNode("circle", {
  cx: "12",
  cy: "6",
  r: "4",
  fill: "#000",
  opacity: ".25",
  stroke: "none"
}, null, -1);
const _hoisted_28$1 = /* @__PURE__ */ createBaseVNode("circle", {
  cx: "12",
  cy: "6",
  r: "4"
}, null, -1);
const _hoisted_29 = /* @__PURE__ */ createBaseVNode("path", {
  d: "M17.67 22a2 2 0 0 0 1.92-2.56A7.8 7.8 0 0 0 12 14a7.8 7.8 0 0 0-7.59 5.44A2 2 0 0 0 6.34 22Z",
  fill: "#000",
  opacity: ".25",
  stroke: "none"
}, null, -1);
const _hoisted_30 = /* @__PURE__ */ createBaseVNode("path", { d: "M17.67 22a2 2 0 0 0 1.92-2.56A7.8 7.8 0 0 0 12 14a7.8 7.8 0 0 0-7.59 5.44A2 2 0 0 0 6.34 22Z" }, null, -1);
const _hoisted_31 = [
  _hoisted_27$1,
  _hoisted_28$1,
  _hoisted_29,
  _hoisted_30
];
const _hoisted_32 = { key: 0 };
const _hoisted_33 = { key: 1 };
const _hoisted_34 = { class: "menu__level0" };
const _hoisted_35 = ["href"];
const _hoisted_36 = ["href"];
const _hoisted_37 = ["href"];
const _hoisted_38 = ["href"];
const _hoisted_39 = ["href"];
const _hoisted_40 = { class: "image_content__content" };
const _hoisted_41 = { key: 0 };
const _hoisted_42 = { key: 1 };
const _hoisted_43 = ["html"];
const _hoisted_44 = ["href"];
const _hoisted_45 = ["href"];
const _hoisted_46 = { class: "dropdown" };
const _hoisted_47 = ["href"];
const _hoisted_48 = {
  key: 0,
  class: "icon target expand"
};
const _hoisted_49 = /* @__PURE__ */ createBaseVNode("svg", {
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
const _hoisted_50 = [
  _hoisted_49
];
const _hoisted_51 = ["href"];
const _hoisted_52 = ["href"];
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
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
          createBaseVNode("span", _hoisted_1$2, [
            (openBlock(), createElementBlock("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              viewBox: "0 0 24 24",
              width: $props.iconSize,
              height: $props.iconSize,
              fill: "none",
              stroke: "#000",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }, _hoisted_4$2, 8, _hoisted_2$2))
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
              createBaseVNode("div", _hoisted_5$2, [
                createBaseVNode("button", {
                  name: "menu-close_trigger",
                  "aria-label": "Close Menu",
                  onClick: ($event) => close()
                }, [
                  createBaseVNode("span", _hoisted_7$2, [
                    (openBlock(), createElementBlock("svg", {
                      xmlns: "http://www.w3.org/2000/svg",
                      "aria-hidden": "true",
                      focusable: "false",
                      role: "presentation",
                      fill: "none",
                      viewBox: "0 0 10 10",
                      width: $props.iconSize,
                      height: $props.iconSize
                    }, _hoisted_10$1, 8, _hoisted_8$1))
                  ])
                ], 8, _hoisted_6$2)
              ]),
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
                          }, toDisplayString(link.title), 9, _hoisted_11$1),
                          link.links.length ? (openBlock(), createElementBlock("span", _hoisted_12$1, [
                            (openBlock(), createElementBlock("svg", {
                              xmlns: "http://www.w3.org/2000/svg",
                              "aria-hidden": "true",
                              focusable: "false",
                              role: "presentation",
                              fill: "none",
                              viewBox: "0 0 10 10",
                              width: $props.iconSize,
                              height: $props.iconSize
                            }, _hoisted_15$1, 8, _hoisted_13$1))
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
                                        }, toDisplayString(child.title), 9, _hoisted_16$1),
                                        child.links.length ? (openBlock(), createElementBlock("span", _hoisted_17$1, [
                                          (openBlock(), createElementBlock("svg", {
                                            xmlns: "http://www.w3.org/2000/svg",
                                            "aria-hidden": "true",
                                            focusable: "false",
                                            role: "presentation",
                                            fill: "none",
                                            viewBox: "0 0 10 10",
                                            width: $props.iconSize,
                                            height: $props.iconSize
                                          }, _hoisted_20$1, 8, _hoisted_18$1))
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
              }), 128)),
              $props.mobileLinks.length ? (openBlock(), createElementBlock("div", _hoisted_21$1, [
                (openBlock(true), createElementBlock(Fragment, null, renderList($props.mobileLinks, (link) => {
                  return openBlock(), createElementBlock("a", {
                    key: link.id,
                    href: link.url
                  }, toDisplayString(link.title), 9, _hoisted_22$1);
                }), 128))
              ])) : createCommentVNode("", true),
              createBaseVNode("div", _hoisted_23$1, [
                createBaseVNode("a", _hoisted_24$1, [
                  createTextVNode(" Account "),
                  createBaseVNode("span", _hoisted_25$1, [
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
                    }, _hoisted_31, 8, _hoisted_26$1))
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
                                      block.settings.submenu_title != "" ? (openBlock(), createElementBlock("h4", _hoisted_32, toDisplayString(block.settings.submenu_title), 1)) : (openBlock(), createElementBlock("h4", _hoisted_33, toDisplayString(block.settings.submenu.title), 1)),
                                      createBaseVNode("ul", _hoisted_34, [
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
                                                  ], 8, _hoisted_35)
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
                                              ], 8, _hoisted_36)),
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
                                                                }, toDisplayString(child.title), 9, _hoisted_37)
                                                              ]),
                                                              _: 2
                                                            }, 1024)) : (openBlock(), createElementBlock("a", {
                                                              key: 1,
                                                              href: child.url
                                                            }, toDisplayString(child.title), 9, _hoisted_38)),
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
                                                                        }, toDisplayString(grandchild.title), 9, _hoisted_39)
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
                                      createBaseVNode("div", _hoisted_40, [
                                        block.settings.content_title ? (openBlock(), createElementBlock("h1", _hoisted_41, toDisplayString(block.settings.content_title), 1)) : createCommentVNode("", true),
                                        block.settings.content_subtitle ? (openBlock(), createElementBlock("h3", _hoisted_42, toDisplayString(block.settings.content_subtitle), 1)) : createCommentVNode("", true),
                                        block.settings.content ? (openBlock(), createElementBlock("p", {
                                          key: 2,
                                          html: block.settings.content
                                        }, null, 8, _hoisted_43)) : createCommentVNode("", true),
                                        createBaseVNode("div", {
                                          class: normalizeClass(["buttons", [`color-scheme--${$props.settings.mm_color_scheme}`]])
                                        }, [
                                          block.settings.primary_button_text && block.settings.primary_button_url ? (openBlock(), createElementBlock("a", {
                                            key: 0,
                                            href: block.settings.primary_button_url,
                                            class: "btn round primary btn-outline"
                                          }, toDisplayString(block.settings.primary_button_text), 9, _hoisted_44)) : createCommentVNode("", true),
                                          block.settings.secondary_button_text && block.settings.secondary_button_url ? (openBlock(), createElementBlock("a", {
                                            key: 1,
                                            href: block.settings.secondary_button_url,
                                            class: "btn round secondary btn-outline"
                                          }, toDisplayString(block.settings.secondary_button_text), 9, _hoisted_45)) : createCommentVNode("", true)
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
                                createBaseVNode("ul", _hoisted_46, [
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
                                            }, toDisplayString(child.title), 9, _hoisted_47),
                                            child.links.length ? (openBlock(), createElementBlock("span", _hoisted_48, _hoisted_50)) : createCommentVNode("", true)
                                          ]),
                                          _: 2
                                        }, 1024)) : (openBlock(), createElementBlock("a", {
                                          key: 1,
                                          href: child.url
                                        }, toDisplayString(child.title), 9, _hoisted_51)),
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
                                                    }, toDisplayString(grandchild.title), 9, _hoisted_52)
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
const MegaMenu = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2]]);
const _sfc_main$1 = {
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
const _hoisted_1$1 = {
  key: 0,
  class: "card-wrapper underline-links-hover"
};
const _hoisted_2$1 = {
  key: 0,
  class: "card__media"
};
const _hoisted_3$1 = { class: "media media--transparent" };
const _hoisted_4$1 = { class: "card__content" };
const _hoisted_5$1 = { class: "card__information" };
const _hoisted_6$1 = { class: "card__heading" };
const _hoisted_7$1 = ["href"];
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_image_tag = resolveComponent("image-tag");
  return $props.cardProduct ? (openBlock(), createElementBlock("div", _hoisted_1$1, [
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
        $props.cardProduct.featured_image ? (openBlock(), createElementBlock("div", _hoisted_2$1, [
          createBaseVNode("div", _hoisted_3$1, [
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
      createBaseVNode("div", _hoisted_4$1, [
        createBaseVNode("div", _hoisted_5$1, [
          createBaseVNode("h3", _hoisted_6$1, [
            createBaseVNode("a", {
              href: $props.cardProduct.url,
              class: "full-unstyled-link"
            }, toDisplayString($props.cardProduct.title), 9, _hoisted_7$1)
          ])
        ])
      ])
    ], 2)
  ])) : createCommentVNode("", true);
}
const Card = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1]]);
const _sfc_main = {
  name: "SearchMenu",
  components: { Popover: ce$1, PopoverButton: ke, PopoverPanel: Le, TabGroup: oe, TabList: se, Tab: de, TabPanels: fe, TabPanel: ce, ImageTag, Card },
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
const _hoisted_1 = { class: "icon target align-bottom" };
const _hoisted_2 = ["width", "height", "stroke-width"];
const _hoisted_3 = /* @__PURE__ */ createBaseVNode("circle", {
  cx: "11",
  cy: "11",
  r: "9",
  fill: "#000",
  opacity: ".25",
  stroke: "none"
}, null, -1);
const _hoisted_4 = /* @__PURE__ */ createBaseVNode("circle", {
  cx: "11",
  cy: "11",
  r: "9"
}, null, -1);
const _hoisted_5 = /* @__PURE__ */ createBaseVNode("path", { d: "M17.5 17.5 22 22" }, null, -1);
const _hoisted_6 = [
  _hoisted_3,
  _hoisted_4,
  _hoisted_5
];
const _hoisted_7 = /* @__PURE__ */ createBaseVNode("span", { class: "label" }, "Search", -1);
const _hoisted_8 = {
  action: "/search",
  method: "get",
  role: "search",
  class: "search__form"
};
const _hoisted_9 = /* @__PURE__ */ createBaseVNode("label", {
  for: "q",
  class: "sr-only"
}, "Search: ", -1);
const _hoisted_10 = { class: "icon target" };
const _hoisted_11 = ["onClick", "width", "height"];
const _hoisted_12 = ["stroke-width"];
const _hoisted_13 = ["stroke-width"];
const _hoisted_14 = { class: "search__results--inner" };
const _hoisted_15 = /* @__PURE__ */ createBaseVNode("h1", { class: "sr-only" }, "Search Results", -1);
const _hoisted_16 = {
  key: 0,
  class: "search__trends"
};
const _hoisted_17 = { class: "search__trends-tags" };
const _hoisted_18 = ["href"];
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
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
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
          createBaseVNode("span", _hoisted_1, [
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
            }, _hoisted_6, 8, _hoisted_2))
          ]),
          _hoisted_7
        ]),
        _: 1
      }),
      createVNode(Transition, { name: $props.searchPosition }, {
        default: withCtx(() => [
          createVNode(_component_PopoverPanel, {
            class: normalizeClass(["search__popover", [$props.searchPosition]])
          }, {
            default: withCtx(({ close }) => [
              createBaseVNode("form", _hoisted_8, [
                _hoisted_9,
                withDirectives(createBaseVNode("input", {
                  name: "q",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.query = $event),
                  placeholder: "Search",
                  class: "search__input"
                }, null, 512), [
                  [vModelText, $data.query],
                  [_directive_debounce, $props.predictiveSearchEnabled ? $options.getPredictiveResults() : null, "200"]
                ]),
                createBaseVNode("span", _hoisted_10, [
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
                    }, null, 8, _hoisted_12),
                    createBaseVNode("path", {
                      d: "M22 21.4878L1 1.51221",
                      "stroke-width": $props.iconStrokeWidth
                    }, null, 8, _hoisted_13)
                  ], 8, _hoisted_11))
                ])
              ]),
              createVNode(Transition, { name: "results" }, {
                default: withCtx(() => [
                  $data.query != "" && $props.predictiveSearchEnabled ? (openBlock(), createElementBlock("div", {
                    key: 0,
                    style: normalizeStyle([$props.searchPosition == "below" ? { height: $data.resultsHeight + "px" } : {}]),
                    class: "search__results"
                  }, [
                    createBaseVNode("div", _hoisted_14, [
                      _hoisted_15,
                      $props.trendingSearches ? (openBlock(), createElementBlock("div", _hoisted_16, [
                        createBaseVNode("h2", null, toDisplayString($data.trends.title), 1),
                        createBaseVNode("div", _hoisted_17, [
                          (openBlock(true), createElementBlock(Fragment, null, renderList($data.trends.items, (trend) => {
                            return openBlock(), createElementBlock("a", {
                              key: trend.id,
                              href: trend.url,
                              class: "search__trends-tag btn secondary"
                            }, toDisplayString(trend.title), 9, _hoisted_18);
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
const SearchMenu = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
__vitePreload(() => Promise.resolve({}), true ? [window.__toCdnUrl("assets/et_blog.css")] : void 0);
__vitePreload(() => Promise.resolve({}), true ? [window.__toCdnUrl("assets/et_image-with-text.css")] : void 0);
__vitePreload(() => Promise.resolve({}), true ? [window.__toCdnUrl("assets/et_cards.css")] : void 0);
__vitePreload(() => Promise.resolve({}), true ? [window.__toCdnUrl("assets/et_price.css")] : void 0);
if (window.location.href.includes("/collection/")) {
  __vitePreload(() => Promise.resolve({}), true ? [window.__toCdnUrl("assets/et_collection-hero.css")] : void 0);
  __vitePreload(() => Promise.resolve({}), true ? [window.__toCdnUrl("assets/et_facets.css")] : void 0);
}
if (window.location.href.includes("/search")) {
  __vitePreload(() => Promise.resolve({}), true ? [window.__toCdnUrl("assets/et_search.css")] : void 0);
}
const searchMount = document.querySelector("#searchMenuTop");
const megamenuMount = document.querySelector("#megamenu");
const menuProps = {};
const searchProps = {};
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
}
fetchProps();
const megamenuApp = (component, props) => createApp(component, props);
const searchApp = (component, props) => createApp(component, props);
var megamenuInit = megamenuApp(MegaMenu, menuProps);
var searchInit = searchApp(SearchMenu, searchProps);
megamenuInit.mount(megamenuMount);
searchInit.mount(searchMount);
document.addEventListener("DOMContentLoaded", () => {
  if (JSON.parse(megamenuMount.dataset.settings).enable_sticky_header) {
    const header2 = document.querySelector("#shopify-section-header");
    var ticking = false;
    document.addEventListener("scroll", () => {
      var yPos = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (yPos < window.innerHeight) {
            header2.classList.remove("sticky");
          } else {
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
