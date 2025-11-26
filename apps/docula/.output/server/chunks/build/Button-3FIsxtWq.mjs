import { v as vueExports, g as useTokenStyle, s as serverRenderer_cjs_prodExports } from './server.mjs';

function tryOnScopeDispose(fn) {
  if (vueExports.getCurrentScope()) {
    vueExports.onScopeDispose(fn);
    return true;
  }
  return false;
}
function toValue(r) {
  return typeof r === "function" ? r() : vueExports.unref(r);
}
typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
const toString = Object.prototype.toString;
const isObject = (val) => toString.call(val) === "[object Object]";
const noop = () => {
};
function whenever(source, cb, options) {
  const stop = vueExports.watch(
    source,
    (v, ov, onInvalidate) => {
      if (v) {
        cb(v, ov, onInvalidate);
      }
    },
    {
      ...options,
      once: false
    }
  );
  return stop;
}
const defaultWindow = void 0;
function unrefElement(elRef) {
  var _a;
  const plain = toValue(elRef);
  return (_a = plain == null ? void 0 : plain.$el) != null ? _a : plain;
}
function useEventListener(...args) {
  let target;
  let events2;
  let listeners;
  let options;
  if (typeof args[0] === "string" || Array.isArray(args[0])) {
    [events2, listeners, options] = args;
    target = defaultWindow;
  } else {
    [target, events2, listeners, options] = args;
  }
  if (!target)
    return noop;
  if (!Array.isArray(events2))
    events2 = [events2];
  if (!Array.isArray(listeners))
    listeners = [listeners];
  const cleanups = [];
  const cleanup = () => {
    cleanups.forEach((fn) => fn());
    cleanups.length = 0;
  };
  const register = (el, event, listener, options2) => {
    el.addEventListener(event, listener, options2);
    return () => el.removeEventListener(event, listener, options2);
  };
  const stopWatch = vueExports.watch(
    () => [unrefElement(target), toValue(options)],
    ([el, options2]) => {
      cleanup();
      if (!el)
        return;
      const optionsClone = isObject(options2) ? { ...options2 } : options2;
      cleanups.push(
        ...events2.flatMap((event) => {
          return listeners.map((listener) => register(el, event, listener, optionsClone));
        })
      );
    },
    { immediate: true, flush: "post" }
  );
  const stop = () => {
    stopWatch();
    cleanup();
  };
  tryOnScopeDispose(stop);
  return stop;
}
const DefaultMagicKeysAliasMap = {
  ctrl: "control",
  command: "meta",
  cmd: "meta",
  option: "alt",
  up: "arrowup",
  down: "arrowdown",
  left: "arrowleft",
  right: "arrowright"
};
function useMagicKeys(options = {}) {
  const {
    reactive: useReactive = false,
    target = defaultWindow,
    aliasMap = DefaultMagicKeysAliasMap,
    passive = true,
    onEventFired = noop
  } = options;
  const current = vueExports.reactive(/* @__PURE__ */ new Set());
  const obj = {
    toJSON() {
      return {};
    },
    current
  };
  const refs = useReactive ? vueExports.reactive(obj) : obj;
  const metaDeps = /* @__PURE__ */ new Set();
  const usedKeys = /* @__PURE__ */ new Set();
  function setRefs(key, value) {
    if (key in refs) {
      if (useReactive)
        refs[key] = value;
      else
        refs[key].value = value;
    }
  }
  function reset() {
    current.clear();
    for (const key of usedKeys)
      setRefs(key, false);
  }
  function updateRefs(e, value) {
    var _a, _b;
    const key = (_a = e.key) == null ? void 0 : _a.toLowerCase();
    const code = (_b = e.code) == null ? void 0 : _b.toLowerCase();
    const values = [code, key].filter(Boolean);
    if (key) {
      if (value)
        current.add(key);
      else
        current.delete(key);
    }
    for (const key2 of values) {
      usedKeys.add(key2);
      setRefs(key2, value);
    }
    if (key === "meta" && !value) {
      metaDeps.forEach((key2) => {
        current.delete(key2);
        setRefs(key2, false);
      });
      metaDeps.clear();
    } else if (typeof e.getModifierState === "function" && e.getModifierState("Meta") && value) {
      [...current, ...values].forEach((key2) => metaDeps.add(key2));
    }
  }
  useEventListener(target, "keydown", (e) => {
    updateRefs(e, true);
    return onEventFired(e);
  }, { passive });
  useEventListener(target, "keyup", (e) => {
    updateRefs(e, false);
    return onEventFired(e);
  }, { passive });
  useEventListener("blur", reset, { passive: true });
  useEventListener("focus", reset, { passive: true });
  const proxy = new Proxy(
    refs,
    {
      get(target2, prop, rec) {
        if (typeof prop !== "string")
          return Reflect.get(target2, prop, rec);
        prop = prop.toLowerCase();
        if (prop in aliasMap)
          prop = aliasMap[prop];
        if (!(prop in refs)) {
          if (/[+_-]/.test(prop)) {
            const keys2 = prop.split(/[+_-]/g).map((i) => i.trim());
            refs[prop] = vueExports.computed(() => keys2.every((key) => toValue(proxy[key])));
          } else {
            refs[prop] = vueExports.ref(false);
          }
        }
        const r = Reflect.get(target2, prop, rec);
        return useReactive ? toValue(r) : r;
      }
    }
  );
  return proxy;
}
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "Button",
  __ssrInlineRender: true,
  props: {
    label: {},
    disabled: { type: Boolean },
    type: { default: "button" },
    shortcut: {},
    tokens: {}
  },
  setup(__props) {
    const styles = useTokenStyle(__props.tokens);
    const buttonRef = vueExports.useTemplateRef("button");
    if (__props.shortcut) {
      const keys = useMagicKeys();
      const combo = vueExports.computed(() => keys[`meta+${__props.shortcut}`].value);
      whenever(combo, () => {
        buttonRef.value?.click();
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
        ref: "button",
        disabled: __props.disabled,
        type: __props.type,
        style: vueExports.unref(styles).button,
        class: "f-button"
      }, _attrs))}>`);
      serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "prepend", {}, null, _push, _parent);
      serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "default", {}, () => {
        _push(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.label)}`);
      }, _push, _parent);
      serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "append", {}, null, _push, _parent);
      _push(`</button>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../layers/blocks/app/components/Button.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "Button" });

export { __nuxt_component_1 as _ };
//# sourceMappingURL=Button-3FIsxtWq.mjs.map
