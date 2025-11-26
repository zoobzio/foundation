import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { _ as __nuxt_component_1$1, a as __nuxt_component_2$2, b as __nuxt_component_3$1, u as useDirection, P as Primitive, c as useCollection, g as getActiveElement, d as useId } from './Group-pXYCZuBY.mjs';
import { u as useAppConfig, c as useAsyncData, _ as __nuxt_component_1$2, a as __nuxt_component_5, q as queryCollection, e as queryCollectionNavigation, b as __nuxt_component_0, f as queryCollectionItemSurroundings, d as useTypeahead, h as handleAndDispatchCustomEvent } from './client-D6Jbai72.mjs';
import { v as vueExports, h as useRoute$1, s as serverRenderer_cjs_prodExports, g as useTokenStyle, j as useRuntimeConfig, b as useVModel, c as createContext, i as createEventHook } from './server.mjs';
import { _ as __nuxt_component_0$1, d as defineNuxtLink } from './nuxt-link-Df9NoxNv.mjs';
import { _ as __nuxt_component_3 } from './Section-9Z3cyJCG.mjs';
import { E as pascalCase, F as kebabCase, t as isEqual, f as destr } from '../nitro/nitro.mjs';
import 'perfect-debounce';
import 'node:stream';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'vue/server-renderer';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'better-sqlite3';

function findValuesBetween(array, start, end) {
  const startIndex = array.findIndex((i) => isEqual(i, start));
  const endIndex = array.findIndex((i) => isEqual(i, end));
  if (startIndex === -1 || endIndex === -1) return [];
  const [minIndex, maxIndex] = [startIndex, endIndex].sort((a, b) => a - b);
  return array.slice(minIndex, maxIndex + 1);
}
function useSelectionBehavior(modelValue, props) {
  const firstValue = vueExports.ref();
  const onSelectItem = (val, condition) => {
    if (props.multiple && Array.isArray(modelValue.value)) if (props.selectionBehavior === "replace") {
      modelValue.value = [val];
      firstValue.value = val;
    } else {
      const index = modelValue.value.findIndex((v) => condition(v));
      if (index !== -1) modelValue.value = modelValue.value.filter((_, i) => i !== index);
      else modelValue.value = [...modelValue.value, val];
    }
    else if (props.selectionBehavior === "replace") modelValue.value = { ...val };
    else if (!Array.isArray(modelValue.value) && condition(modelValue.value)) modelValue.value = void 0;
    else modelValue.value = { ...val };
    return modelValue.value;
  };
  function handleMultipleReplace(intent, currentElement, getItems, options) {
    if (!firstValue?.value || !props.multiple || !Array.isArray(modelValue.value)) return;
    const collection = getItems().filter((i) => i.ref.dataset.disabled !== "");
    const lastValue = collection.find((i) => i.ref === currentElement)?.value;
    if (!lastValue) return;
    let value = null;
    switch (intent) {
      case "prev":
      case "next": {
        value = findValuesBetween(options, firstValue.value, lastValue);
        break;
      }
      case "first": {
        value = findValuesBetween(options, firstValue.value, options?.[0]);
        break;
      }
      case "last": {
        value = findValuesBetween(options, firstValue.value, options?.[options.length - 1]);
        break;
      }
    }
    modelValue.value = value;
  }
  return {
    firstValue,
    onSelectItem,
    handleMultipleReplace
  };
}
const ENTRY_FOCUS = "rovingFocusGroup.onEntryFocus";
const EVENT_OPTIONS = {
  bubbles: false,
  cancelable: true
};
const MAP_KEY_TO_FOCUS_INTENT = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function getDirectionAwareKey(key, dir) {
  if (dir !== "rtl") return key;
  return key === "ArrowLeft" ? "ArrowRight" : key === "ArrowRight" ? "ArrowLeft" : key;
}
function getFocusIntent(event, orientation, dir) {
  const key = getDirectionAwareKey(event.key, dir);
  if (orientation === "vertical" && ["ArrowLeft", "ArrowRight"].includes(key)) return void 0;
  if (orientation === "horizontal" && ["ArrowUp", "ArrowDown"].includes(key)) return void 0;
  return MAP_KEY_TO_FOCUS_INTENT[key];
}
function focusFirst(candidates, preventScroll = false) {
  const PREVIOUSLY_FOCUSED_ELEMENT = getActiveElement();
  for (const candidate of candidates) {
    if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
    candidate.focus({ preventScroll });
    if (getActiveElement() !== PREVIOUSLY_FOCUSED_ELEMENT) return;
  }
}
function wrapArray(array, startIndex) {
  return array.map((_, index) => array[(startIndex + index) % array.length]);
}
const [injectRovingFocusGroupContext, provideRovingFocusGroupContext] = createContext("RovingFocusGroup");
var RovingFocusGroup_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "RovingFocusGroup",
  props: {
    orientation: {
      type: String,
      required: false,
      default: void 0
    },
    dir: {
      type: String,
      required: false
    },
    loop: {
      type: Boolean,
      required: false,
      default: false
    },
    currentTabStopId: {
      type: [String, null],
      required: false
    },
    defaultCurrentTabStopId: {
      type: String,
      required: false
    },
    preventScrollOnEntryFocus: {
      type: Boolean,
      required: false,
      default: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    }
  },
  emits: ["entryFocus", "update:currentTabStopId"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { loop, orientation, dir: propDir } = vueExports.toRefs(props);
    const dir = useDirection(propDir);
    const currentTabStopId = useVModel(props, "currentTabStopId", emits, {
      defaultValue: props.defaultCurrentTabStopId,
      passive: props.currentTabStopId === void 0
    });
    const isTabbingBackOut = vueExports.ref(false);
    const isClickFocus = vueExports.ref(false);
    const focusableItemsCount = vueExports.ref(0);
    const { getItems, CollectionSlot } = useCollection({ isProvider: true });
    function handleFocus(event) {
      const isKeyboardFocus = !isClickFocus.value;
      if (event.currentTarget && event.target === event.currentTarget && isKeyboardFocus && !isTabbingBackOut.value) {
        const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS);
        event.currentTarget.dispatchEvent(entryFocusEvent);
        emits("entryFocus", entryFocusEvent);
        if (!entryFocusEvent.defaultPrevented) {
          const items = getItems().map((i) => i.ref).filter((i) => i.dataset.disabled !== "");
          const activeItem = items.find((item) => item.getAttribute("data-active") === "");
          const highlightedItem = items.find((item) => item.getAttribute("data-highlighted") === "");
          const currentItem = items.find((item) => item.id === currentTabStopId.value);
          const candidateItems = [
            activeItem,
            highlightedItem,
            currentItem,
            ...items
          ].filter(Boolean);
          focusFirst(candidateItems, props.preventScrollOnEntryFocus);
        }
      }
      isClickFocus.value = false;
    }
    function handleMouseUp() {
      setTimeout(() => {
        isClickFocus.value = false;
      }, 1);
    }
    __expose({ getItems });
    provideRovingFocusGroupContext({
      loop,
      dir,
      orientation,
      currentTabStopId,
      onItemFocus: (tabStopId) => {
        currentTabStopId.value = tabStopId;
      },
      onItemShiftTab: () => {
        isTabbingBackOut.value = true;
      },
      onFocusableItemAdd: () => {
        focusableItemsCount.value++;
      },
      onFocusableItemRemove: () => {
        focusableItemsCount.value--;
      }
    });
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(CollectionSlot), null, {
        default: vueExports.withCtx(() => [vueExports.createVNode(vueExports.unref(Primitive), {
          tabindex: isTabbingBackOut.value || focusableItemsCount.value === 0 ? -1 : 0,
          "data-orientation": vueExports.unref(orientation),
          as: _ctx.as,
          "as-child": _ctx.asChild,
          dir: vueExports.unref(dir),
          style: { "outline": "none" },
          onMousedown: _cache[0] || (_cache[0] = ($event) => isClickFocus.value = true),
          onMouseup: handleMouseUp,
          onFocus: handleFocus,
          onBlur: _cache[1] || (_cache[1] = ($event) => isTabbingBackOut.value = false)
        }, {
          default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 8, [
          "tabindex",
          "data-orientation",
          "as",
          "as-child",
          "dir"
        ])]),
        _: 3
      });
    };
  }
});
var RovingFocusGroup_default = RovingFocusGroup_vue_vue_type_script_setup_true_lang_default;
var RovingFocusItem_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "RovingFocusItem",
  props: {
    tabStopId: {
      type: String,
      required: false
    },
    focusable: {
      type: Boolean,
      required: false,
      default: true
    },
    active: {
      type: Boolean,
      required: false
    },
    allowShiftKey: {
      type: Boolean,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "span"
    }
  },
  setup(__props) {
    const props = __props;
    const context = injectRovingFocusGroupContext();
    const randomId = useId();
    const id = vueExports.computed(() => props.tabStopId || randomId);
    const isCurrentTabStop = vueExports.computed(() => context.currentTabStopId.value === id.value);
    const { getItems, CollectionItem } = useCollection();
    function handleKeydown(event) {
      if (event.key === "Tab" && event.shiftKey) {
        context.onItemShiftTab();
        return;
      }
      if (event.target !== event.currentTarget) return;
      const focusIntent = getFocusIntent(event, context.orientation.value, context.dir.value);
      if (focusIntent !== void 0) {
        if (event.metaKey || event.ctrlKey || event.altKey || (props.allowShiftKey ? false : event.shiftKey)) return;
        event.preventDefault();
        let candidateNodes = [...getItems().map((i) => i.ref).filter((i) => i.dataset.disabled !== "")];
        if (focusIntent === "last") candidateNodes.reverse();
        else if (focusIntent === "prev" || focusIntent === "next") {
          if (focusIntent === "prev") candidateNodes.reverse();
          const currentIndex = candidateNodes.indexOf(event.currentTarget);
          candidateNodes = context.loop.value ? wrapArray(candidateNodes, currentIndex + 1) : candidateNodes.slice(currentIndex + 1);
        }
        vueExports.nextTick(() => focusFirst(candidateNodes));
      }
    }
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(CollectionItem), null, {
        default: vueExports.withCtx(() => [vueExports.createVNode(vueExports.unref(Primitive), {
          tabindex: isCurrentTabStop.value ? 0 : -1,
          "data-orientation": vueExports.unref(context).orientation.value,
          "data-active": _ctx.active ? "" : void 0,
          "data-disabled": !_ctx.focusable ? "" : void 0,
          as: _ctx.as,
          "as-child": _ctx.asChild,
          onMousedown: _cache[0] || (_cache[0] = (event) => {
            if (!_ctx.focusable) event.preventDefault();
            else vueExports.unref(context).onItemFocus(id.value);
          }),
          onFocus: _cache[1] || (_cache[1] = ($event) => vueExports.unref(context).onItemFocus(id.value)),
          onKeydown: handleKeydown
        }, {
          default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 8, [
          "tabindex",
          "data-orientation",
          "data-active",
          "data-disabled",
          "as",
          "as-child"
        ])]),
        _: 3
      });
    };
  }
});
var RovingFocusItem_default = RovingFocusItem_vue_vue_type_script_setup_true_lang_default;
function flatten(items) {
  return items.reduce((acc, item) => {
    acc.push(item);
    if (item.children) acc.push(...flatten(item.children));
    return acc;
  }, []);
}
const [injectTreeRootContext, provideTreeRootContext] = createContext("TreeRoot");
var TreeRoot_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "TreeRoot",
  props: {
    modelValue: {
      type: null,
      required: false
    },
    defaultValue: {
      type: null,
      required: false
    },
    items: {
      type: Array,
      required: false
    },
    expanded: {
      type: Array,
      required: false
    },
    defaultExpanded: {
      type: Array,
      required: false
    },
    getKey: {
      type: Function,
      required: true
    },
    getChildren: {
      type: Function,
      required: false,
      default: (val) => val.children
    },
    selectionBehavior: {
      type: String,
      required: false,
      default: "toggle"
    },
    multiple: {
      type: Boolean,
      required: false,
      skipCheck: true
    },
    dir: {
      type: String,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false
    },
    propagateSelect: {
      type: Boolean,
      required: false
    },
    bubbleSelect: {
      type: Boolean,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "ul"
    }
  },
  emits: ["update:modelValue", "update:expanded"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { items, multiple, disabled, propagateSelect, dir: propDir, bubbleSelect } = vueExports.toRefs(props);
    const { handleTypeaheadSearch } = useTypeahead();
    const dir = useDirection(propDir);
    const rovingFocusGroupRef = vueExports.ref();
    const isVirtual = vueExports.ref(false);
    const virtualKeydownHook = createEventHook();
    const modelValue = useVModel(props, "modelValue", emits, {
      defaultValue: props.defaultValue ?? (multiple.value ? [] : void 0),
      passive: true,
      deep: true
    });
    const expanded = useVModel(props, "expanded", emits, {
      defaultValue: props.defaultExpanded ?? [],
      passive: props.expanded === void 0,
      deep: true
    });
    const { onSelectItem, handleMultipleReplace } = useSelectionBehavior(modelValue, props);
    const selectedKeys = vueExports.computed(() => {
      if (multiple.value && Array.isArray(modelValue.value)) return modelValue.value.map((i) => props.getKey(i));
      else return [props.getKey(modelValue.value ?? {})];
    });
    function flattenItems(items$1, level = 1, parentItem) {
      return items$1.reduce((acc, item, index) => {
        const key = props.getKey(item);
        const children = props.getChildren(item);
        const isExpanded = expanded.value.includes(key);
        const flattenedItem = {
          _id: key,
          value: item,
          index,
          level,
          parentItem,
          hasChildren: !!children,
          bind: {
            "value": item,
            level,
            "aria-setsize": items$1.length,
            "aria-posinset": index + 1
          }
        };
        acc.push(flattenedItem);
        if (children && isExpanded) acc.push(...flattenItems(children, level + 1, item));
        return acc;
      }, []);
    }
    const expandedItems = vueExports.computed(() => {
      const items$1 = props.items;
      expanded.value.map((i) => i);
      return flattenItems(items$1 ?? []);
    });
    function handleKeydown(event) {
      if (isVirtual.value) virtualKeydownHook.trigger(event);
      else {
        const collections = rovingFocusGroupRef.value?.getItems() ?? [];
        handleTypeaheadSearch(event.key, collections);
      }
    }
    function handleKeydownNavigation(event) {
      if (isVirtual.value) return;
      const intent = MAP_KEY_TO_FOCUS_INTENT[event.key];
      vueExports.nextTick(() => {
        handleMultipleReplace(intent, getActiveElement(), rovingFocusGroupRef.value?.getItems, expandedItems.value.map((i) => i.value));
      });
    }
    function handleBubbleSelect(item) {
      if (item.parentItem != null && Array.isArray(modelValue.value) && props.multiple) {
        const parentItem = expandedItems.value.find((i) => {
          return item.parentItem != null && props.getKey(i.value) === props.getKey(item.parentItem);
        });
        if (parentItem != null) {
          const areAllChilredOfParentSelected = props.getChildren(parentItem.value)?.every((i) => modelValue.value.find((v) => props.getKey(v) === props.getKey(i)));
          if (areAllChilredOfParentSelected) modelValue.value = [...modelValue.value, parentItem.value];
          else modelValue.value = modelValue.value.filter((v) => props.getKey(v) !== props.getKey(parentItem.value));
          handleBubbleSelect(parentItem);
        }
      }
    }
    provideTreeRootContext({
      modelValue,
      selectedKeys,
      onSelect: (val) => {
        const condition = (baseValue) => props.getKey(baseValue ?? {}) === props.getKey(val);
        const exist = props.multiple && Array.isArray(modelValue.value) ? modelValue.value?.findIndex(condition) !== -1 : void 0;
        onSelectItem(val, condition);
        if (props.bubbleSelect && props.multiple && Array.isArray(modelValue.value)) {
          const item = expandedItems.value.find((i) => {
            return props.getKey(i.value) === props.getKey(val);
          });
          if (item != null) handleBubbleSelect(item);
        }
        if (props.propagateSelect && props.multiple && Array.isArray(modelValue.value)) {
          const children = flatten(props.getChildren(val) ?? []);
          if (exist) modelValue.value = [...modelValue.value].filter((i) => !children.some((child) => props.getKey(i ?? {}) === props.getKey(child)));
          else modelValue.value = [...modelValue.value, ...children];
        }
      },
      expanded,
      onToggle(val) {
        const children = val ? props.getChildren(val) : void 0;
        if (!children) return;
        const key = props.getKey(val) ?? val;
        if (expanded.value.includes(key)) expanded.value = expanded.value.filter((val$1) => val$1 !== key);
        else expanded.value.push(key);
      },
      getKey: props.getKey,
      getChildren: props.getChildren,
      items,
      expandedItems,
      disabled,
      multiple,
      dir,
      propagateSelect,
      bubbleSelect,
      isVirtual,
      virtualKeydownHook,
      handleMultipleReplace
    });
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(RovingFocusGroup_default), {
        ref_key: "rovingFocusGroupRef",
        ref: rovingFocusGroupRef,
        "as-child": "",
        orientation: "vertical",
        dir: vueExports.unref(dir)
      }, {
        default: vueExports.withCtx(() => [vueExports.createVNode(vueExports.unref(Primitive), {
          role: "tree",
          as: _ctx.as,
          "as-child": _ctx.asChild,
          "aria-multiselectable": vueExports.unref(multiple) ? true : void 0,
          onKeydown: [handleKeydown, vueExports.withKeys(vueExports.withModifiers(handleKeydownNavigation, ["shift"]), ["up", "down"])]
        }, {
          default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default", {
            flattenItems: expandedItems.value,
            modelValue: vueExports.unref(modelValue),
            expanded: vueExports.unref(expanded)
          })]),
          _: 3
        }, 8, [
          "as",
          "as-child",
          "aria-multiselectable",
          "onKeydown"
        ])]),
        _: 3
      }, 8, ["dir"]);
    };
  }
});
var TreeRoot_default = TreeRoot_vue_vue_type_script_setup_true_lang_default;
const TREE_SELECT = "tree.select";
const TREE_TOGGLE = "tree.toggle";
var TreeItem_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  inheritAttrs: false,
  __name: "TreeItem",
  props: {
    value: {
      type: null,
      required: true
    },
    level: {
      type: Number,
      required: true
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "li"
    }
  },
  emits: ["select", "toggle"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const rootContext = injectTreeRootContext();
    const { getItems } = useCollection();
    const hasChildren = vueExports.computed(() => !!rootContext.getChildren(props.value));
    const isExpanded = vueExports.computed(() => {
      const key = rootContext.getKey(props.value);
      return rootContext.expanded.value.includes(key);
    });
    const isSelected = vueExports.computed(() => {
      const key = rootContext.getKey(props.value);
      return rootContext.selectedKeys.value.includes(key);
    });
    const isIndeterminate = vueExports.computed(() => {
      if (rootContext.bubbleSelect.value && hasChildren.value && Array.isArray(rootContext.modelValue.value)) {
        const children = flatten(rootContext.getChildren(props.value) || []);
        return children.some((child) => rootContext.modelValue.value.find((v) => rootContext.getKey(v) === rootContext.getKey(child))) && !children.every((child) => rootContext.modelValue.value.find((v) => rootContext.getKey(v) === rootContext.getKey(child)));
      } else if (rootContext.propagateSelect.value && isSelected.value && hasChildren.value && Array.isArray(rootContext.modelValue.value)) {
        const children = flatten(rootContext.getChildren(props.value) || []);
        return !children.every((child) => rootContext.modelValue.value.find((v) => rootContext.getKey(v) === rootContext.getKey(child)));
      } else return void 0;
    });
    function handleKeydownRight(ev) {
      if (!hasChildren.value) return;
      if (isExpanded.value) {
        const collection = getItems().map((i) => i.ref);
        const currentElement = getActiveElement();
        const currentIndex = collection.indexOf(currentElement);
        const list = [...collection].slice(currentIndex);
        const nextElement = list.find((el) => Number(el.getAttribute("data-indent")) === props.level + 1);
        if (nextElement) nextElement.focus();
      } else handleToggleCustomEvent(ev);
    }
    function handleKeydownLeft(ev) {
      if (isExpanded.value) handleToggleCustomEvent(ev);
      else {
        const collection = getItems().map((i) => i.ref);
        const currentElement = getActiveElement();
        const currentIndex = collection.indexOf(currentElement);
        const list = [...collection].slice(0, currentIndex).reverse();
        const parentElement = list.find((el) => Number(el.getAttribute("data-indent")) === props.level - 1);
        if (parentElement) parentElement.focus();
      }
    }
    async function handleSelect(ev) {
      emits("select", ev);
      if (ev?.defaultPrevented) return;
      rootContext.onSelect(props.value);
    }
    async function handleToggle(ev) {
      emits("toggle", ev);
      if (ev?.defaultPrevented) return;
      rootContext.onToggle(props.value);
    }
    async function handleSelectCustomEvent(ev) {
      if (!ev) return;
      const eventDetail = {
        originalEvent: ev,
        value: props.value,
        isExpanded: isExpanded.value,
        isSelected: isSelected.value
      };
      handleAndDispatchCustomEvent(TREE_SELECT, handleSelect, eventDetail);
    }
    async function handleToggleCustomEvent(ev) {
      if (!ev) return;
      const eventDetail = {
        originalEvent: ev,
        value: props.value,
        isExpanded: isExpanded.value,
        isSelected: isSelected.value
      };
      handleAndDispatchCustomEvent(TREE_TOGGLE, handleToggle, eventDetail);
    }
    __expose({
      isExpanded,
      isSelected,
      isIndeterminate,
      handleToggle: () => rootContext.onToggle(props.value),
      handleSelect: () => rootContext.onSelect(props.value)
    });
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(RovingFocusItem_default), {
        "as-child": "",
        value: _ctx.value,
        "allow-shift-key": ""
      }, {
        default: vueExports.withCtx(() => [vueExports.createVNode(vueExports.unref(Primitive), vueExports.mergeProps(_ctx.$attrs, {
          role: "treeitem",
          as: _ctx.as,
          "as-child": _ctx.asChild,
          "aria-selected": isSelected.value,
          "aria-expanded": hasChildren.value ? isExpanded.value : void 0,
          "aria-level": _ctx.level,
          "data-indent": _ctx.level,
          "data-selected": isSelected.value ? "" : void 0,
          "data-expanded": isExpanded.value ? "" : void 0,
          onKeydown: [
            vueExports.withKeys(vueExports.withModifiers(handleSelectCustomEvent, ["self", "prevent"]), ["enter", "space"]),
            _cache[0] || (_cache[0] = vueExports.withKeys(vueExports.withModifiers((ev) => vueExports.unref(rootContext).dir.value === "ltr" ? handleKeydownRight(ev) : handleKeydownLeft(ev), ["prevent"]), ["right"])),
            _cache[1] || (_cache[1] = vueExports.withKeys(vueExports.withModifiers((ev) => vueExports.unref(rootContext).dir.value === "ltr" ? handleKeydownLeft(ev) : handleKeydownRight(ev), ["prevent"]), ["left"]))
          ],
          onClick: _cache[2] || (_cache[2] = vueExports.withModifiers((ev) => {
            handleSelectCustomEvent(ev);
            handleToggleCustomEvent(ev);
          }, ["stop"]))
        }), {
          default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default", {
            isExpanded: isExpanded.value,
            isSelected: isSelected.value,
            isIndeterminate: isIndeterminate.value,
            handleSelect: () => vueExports.unref(rootContext).onSelect(_ctx.value),
            handleToggle: () => vueExports.unref(rootContext).onToggle(_ctx.value)
          })]),
          _: 3
        }, 16, [
          "as",
          "as-child",
          "aria-selected",
          "aria-expanded",
          "aria-level",
          "data-indent",
          "data-selected",
          "data-expanded",
          "onKeydown"
        ])]),
        _: 3
      }, 8, ["value"]);
    };
  }
});
var TreeItem_default = TreeItem_vue_vue_type_script_setup_true_lang_default;
function toHast(tree) {
  return {
    type: "root",
    children: tree.value.map(minimarkToHastNode)
  };
}
function minimarkToHastNode(input) {
  if (typeof input === "string") return {
    type: "text",
    value: input
  };
  const [tag, props, ...children] = input;
  return {
    type: "element",
    tag,
    props,
    children: children.map(minimarkToHastNode)
  };
}
const _sfc_main$9 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "Tree",
  __ssrInlineRender: true,
  props: {
    items: {},
    modelValue: {},
    expanded: {},
    multiple: { type: Boolean, default: false },
    selectionBehavior: { default: "toggle" },
    tokens: {}
  },
  emits: ["update:modelValue", "update:expanded"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const styles = useTokenStyle(__props.tokens);
    const getKey = (item) => item.value;
    const getChildren = (item) => item.children;
    const handleUpdate = (value) => {
      emit("update:modelValue", value);
    };
    const handleExpanded = (value) => {
      emit("update:expanded", value);
    };
    const NuxtLinkComponent = defineNuxtLink({});
    return (_ctx, _push, _parent, _attrs) => {
      const _component_TreeRoot = TreeRoot_default;
      const _component_TreeItem = TreeItem_default;
      const _component_Group = __nuxt_component_3$1;
      const _component_Icon = __nuxt_component_2$2;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_TreeRoot, vueExports.mergeProps({
        "model-value": __props.modelValue,
        expanded: __props.expanded,
        items: __props.items,
        multiple: __props.multiple,
        "selection-behavior": __props.selectionBehavior,
        "get-key": getKey,
        "get-children": getChildren,
        style: vueExports.unref(styles)["tree-root"],
        class: "f-tree-root",
        "onUpdate:modelValue": handleUpdate,
        "onUpdate:expanded": handleExpanded
      }, _attrs), {
        default: vueExports.withCtx(({ flattenItems }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            serverRenderer_cjs_prodExports.ssrRenderList(flattenItems, (item) => {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_TreeItem, vueExports.mergeProps({
                key: item._id
              }, { ref_for: true }, item.bind, {
                as: item.hasChildren ? "li" : vueExports.unref(NuxtLinkComponent),
                to: item.hasChildren ? void 0 : item.value.to,
                style: item.hasChildren ? vueExports.unref(styles)["tree-branch"] : vueExports.unref(styles)["tree-leaf"],
                class: item.hasChildren ? "f-tree-branch" : "f-tree-leaf"
              }), {
                default: vueExports.withCtx(({ isExpanded, isSelected }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (item.hasChildren) {
                      _push3(`<span style="${serverRenderer_cjs_prodExports.ssrRenderStyle({
                        ...vueExports.unref(styles)["tree-branch-content"],
                        paddingLeft: `calc(var(--tree-branch-content-padding-left, 1rem) + ${item.level - 1} * 1rem)`
                      })}" class="f-tree-branch-content"${_scopeId2}>`);
                      serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "branch", {
                        item: item.value,
                        isExpanded
                      }, () => {
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Group, { tokens: { group: { gap: "ref-spacing-xs" } } }, {
                          default: vueExports.withCtx((_, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              if (item.value.icon) {
                                _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
                                  alias: item.value.icon
                                }, null, _parent4, _scopeId3));
                              } else {
                                _push4(`<!---->`);
                              }
                              _push4(`<span${_scopeId3}>${serverRenderer_cjs_prodExports.ssrInterpolate(item.value.label)}</span>`);
                            } else {
                              return [
                                item.value.icon ? (vueExports.openBlock(), vueExports.createBlock(_component_Icon, {
                                  key: 0,
                                  alias: item.value.icon
                                }, null, 8, ["alias"])) : vueExports.createCommentVNode("", true),
                                vueExports.createVNode("span", null, vueExports.toDisplayString(item.value.label), 1)
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                        _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
                          alias: isExpanded ? "chevron-down" : "chevron-right"
                        }, null, _parent3, _scopeId2));
                      }, _push3, _parent3, _scopeId2);
                      _push3(`</span>`);
                    } else {
                      _push3(`<span style="${serverRenderer_cjs_prodExports.ssrRenderStyle({
                        ...vueExports.unref(styles)["tree-leaf-content"],
                        paddingLeft: `calc(var(--tree-leaf-content-padding-left, 1rem) + ${item.level - 1} * 1rem)`
                      })}" class="f-tree-leaf-content"${_scopeId2}>`);
                      serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "leaf", {
                        item: item.value,
                        isSelected
                      }, () => {
                        if (item.value.icon) {
                          _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
                            alias: item.value.icon
                          }, null, _parent3, _scopeId2));
                        } else {
                          _push3(`<!---->`);
                        }
                        _push3(`<span${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(item.value.label)}</span>`);
                      }, _push3, _parent3, _scopeId2);
                      _push3(`</span>`);
                    }
                  } else {
                    return [
                      item.hasChildren ? (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 0,
                        style: {
                          ...vueExports.unref(styles)["tree-branch-content"],
                          paddingLeft: `calc(var(--tree-branch-content-padding-left, 1rem) + ${item.level - 1} * 1rem)`
                        },
                        class: "f-tree-branch-content"
                      }, [
                        vueExports.renderSlot(_ctx.$slots, "branch", {
                          item: item.value,
                          isExpanded
                        }, () => [
                          vueExports.createVNode(_component_Group, { tokens: { group: { gap: "ref-spacing-xs" } } }, {
                            default: vueExports.withCtx(() => [
                              item.value.icon ? (vueExports.openBlock(), vueExports.createBlock(_component_Icon, {
                                key: 0,
                                alias: item.value.icon
                              }, null, 8, ["alias"])) : vueExports.createCommentVNode("", true),
                              vueExports.createVNode("span", null, vueExports.toDisplayString(item.value.label), 1)
                            ]),
                            _: 2
                          }, 1024),
                          vueExports.createVNode(_component_Icon, {
                            alias: isExpanded ? "chevron-down" : "chevron-right"
                          }, null, 8, ["alias"])
                        ])
                      ], 4)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 1,
                        style: {
                          ...vueExports.unref(styles)["tree-leaf-content"],
                          paddingLeft: `calc(var(--tree-leaf-content-padding-left, 1rem) + ${item.level - 1} * 1rem)`
                        },
                        class: "f-tree-leaf-content"
                      }, [
                        vueExports.renderSlot(_ctx.$slots, "leaf", {
                          item: item.value,
                          isSelected
                        }, () => [
                          item.value.icon ? (vueExports.openBlock(), vueExports.createBlock(_component_Icon, {
                            key: 0,
                            alias: item.value.icon
                          }, null, 8, ["alias"])) : vueExports.createCommentVNode("", true),
                          vueExports.createVNode("span", null, vueExports.toDisplayString(item.value.label), 1)
                        ])
                      ], 4))
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(flattenItems, (item) => {
                return vueExports.openBlock(), vueExports.createBlock(_component_TreeItem, vueExports.mergeProps({
                  key: item._id
                }, { ref_for: true }, item.bind, {
                  as: item.hasChildren ? "li" : vueExports.unref(NuxtLinkComponent),
                  to: item.hasChildren ? void 0 : item.value.to,
                  style: item.hasChildren ? vueExports.unref(styles)["tree-branch"] : vueExports.unref(styles)["tree-leaf"],
                  class: item.hasChildren ? "f-tree-branch" : "f-tree-leaf"
                }), {
                  default: vueExports.withCtx(({ isExpanded, isSelected }) => [
                    item.hasChildren ? (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 0,
                      style: {
                        ...vueExports.unref(styles)["tree-branch-content"],
                        paddingLeft: `calc(var(--tree-branch-content-padding-left, 1rem) + ${item.level - 1} * 1rem)`
                      },
                      class: "f-tree-branch-content"
                    }, [
                      vueExports.renderSlot(_ctx.$slots, "branch", {
                        item: item.value,
                        isExpanded
                      }, () => [
                        vueExports.createVNode(_component_Group, { tokens: { group: { gap: "ref-spacing-xs" } } }, {
                          default: vueExports.withCtx(() => [
                            item.value.icon ? (vueExports.openBlock(), vueExports.createBlock(_component_Icon, {
                              key: 0,
                              alias: item.value.icon
                            }, null, 8, ["alias"])) : vueExports.createCommentVNode("", true),
                            vueExports.createVNode("span", null, vueExports.toDisplayString(item.value.label), 1)
                          ]),
                          _: 2
                        }, 1024),
                        vueExports.createVNode(_component_Icon, {
                          alias: isExpanded ? "chevron-down" : "chevron-right"
                        }, null, 8, ["alias"])
                      ])
                    ], 4)) : (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      style: {
                        ...vueExports.unref(styles)["tree-leaf-content"],
                        paddingLeft: `calc(var(--tree-leaf-content-padding-left, 1rem) + ${item.level - 1} * 1rem)`
                      },
                      class: "f-tree-leaf-content"
                    }, [
                      vueExports.renderSlot(_ctx.$slots, "leaf", {
                        item: item.value,
                        isSelected
                      }, () => [
                        item.value.icon ? (vueExports.openBlock(), vueExports.createBlock(_component_Icon, {
                          key: 0,
                          alias: item.value.icon
                        }, null, 8, ["alias"])) : vueExports.createCommentVNode("", true),
                        vueExports.createVNode("span", null, vueExports.toDisplayString(item.value.label), 1)
                      ])
                    ], 4))
                  ]),
                  _: 2
                }, 1040, ["as", "to", "style", "class"]);
              }), 128))
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../layers/blocks/app/components/Tree.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$9, { __name: "Tree" });
const _sfc_main$8 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ContentTree",
  __ssrInlineRender: true,
  props: {
    collection: {},
    title: { default: "Navigation" },
    tokens: {}
  },
  async setup(__props) {
    let __temp, __restore;
    useTokenStyle(__props.tokens);
    const { data: navigation } = ([__temp, __restore] = vueExports.withAsyncContext(() => useAsyncData(
      `content-tree-${__props.collection}`,
      () => queryCollectionNavigation(__props.collection)
    )), __temp = await __temp, __restore(), __temp);
    const transformNavigation = (items) => {
      if (!items) return [];
      return items.map((item) => ({
        value: item.path,
        label: item.title,
        to: `/${__props.collection}${item.path}`,
        children: item.children ? transformNavigation(item.children) : void 0
      }));
    };
    const treeItems = vueExports.computed(() => transformNavigation(navigation.value));
    const route = useRoute$1();
    const findNodeByPath = (items, path) => {
      for (const item of items) {
        if (item.to === path) return item;
        if (item.children) {
          const found = findNodeByPath(item.children, path);
          if (found) return found;
        }
      }
      return null;
    };
    const selectedValue = vueExports.computed(() => {
      const currentPath = route.path;
      return findNodeByPath(treeItems.value, currentPath);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Caption = __nuxt_component_0;
      const _component_Tree = __nuxt_component_1;
      _push(`<!--[-->`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Caption, {
        icon: "explore",
        tokens: __props.tokens
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.title)}`);
          } else {
            return [
              vueExports.createTextVNode(vueExports.toDisplayString(__props.title), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Tree, {
        items: vueExports.unref(treeItems),
        tokens: __props.tokens,
        "model-value": vueExports.unref(selectedValue),
        multiple: false,
        "selection-behavior": "replace"
      }, null, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../layers/prose/app/components/ContentTree.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const __nuxt_component_2$1 = Object.assign(_sfc_main$8, { __name: "ContentTree" });
const _sfc_main$7 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "Breadcrumbs",
  __ssrInlineRender: true,
  props: {
    items: {},
    separator: { default: "chevron-right" },
    tokens: {}
  },
  setup(__props) {
    const styles = useTokenStyle(__props.tokens);
    const isLast = (index) => index === __props.items.length - 1;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_2$2;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<nav${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
        "aria-label": "Breadcrumb",
        style: vueExports.unref(styles)["breadcrumbs-root"],
        class: "f-breadcrumbs-root"
      }, _attrs))}><ol style="${serverRenderer_cjs_prodExports.ssrRenderStyle(vueExports.unref(styles)["breadcrumbs-list"])}" class="f-breadcrumbs-list"><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(__props.items, (item, index) => {
        _push(`<li style="${serverRenderer_cjs_prodExports.ssrRenderStyle(vueExports.unref(styles)["breadcrumbs-item"])}" class="f-breadcrumbs-item">`);
        if (isLast(index)) {
          _push(`<span style="${serverRenderer_cjs_prodExports.ssrRenderStyle(vueExports.unref(styles)["breadcrumbs-current"])}" class="f-breadcrumbs-current">`);
          serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "item", {
            item,
            index,
            isLast: true
          }, () => {
            if (item.icon) {
              _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
                alias: item.icon
              }, null, _parent));
            } else {
              _push(`<!---->`);
            }
            _push(` ${serverRenderer_cjs_prodExports.ssrInterpolate(item.label)}`);
          }, _push, _parent);
          _push(`</span>`);
        } else {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
            to: item.to,
            style: vueExports.unref(styles)["breadcrumbs-link"],
            class: "f-breadcrumbs-link"
          }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "item", {
                  item,
                  index,
                  isLast: false
                }, () => {
                  if (item.icon) {
                    _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
                      alias: item.icon
                    }, null, _parent2, _scopeId));
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(` ${serverRenderer_cjs_prodExports.ssrInterpolate(item.label)}`);
                }, _push2, _parent2, _scopeId);
              } else {
                return [
                  vueExports.renderSlot(_ctx.$slots, "item", {
                    item,
                    index,
                    isLast: false
                  }, () => [
                    item.icon ? (vueExports.openBlock(), vueExports.createBlock(_component_Icon, {
                      key: 0,
                      alias: item.icon
                    }, null, 8, ["alias"])) : vueExports.createCommentVNode("", true),
                    vueExports.createTextVNode(" " + vueExports.toDisplayString(item.label), 1)
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        }
        if (!isLast(index)) {
          serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "separator", {}, () => {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
              alias: __props.separator,
              tokens: { icon: { text: "ref-slate-500" } }
            }, null, _parent));
          }, _push, _parent);
        } else {
          _push(`<!---->`);
        }
        _push(`</li>`);
      });
      _push(`<!--]--></ol></nav>`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../layers/blocks/app/components/Breadcrumbs.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main$7, { __name: "Breadcrumbs" });
const htmlTags = [
  "a",
  "abbr",
  "address",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "base",
  "bdi",
  "bdo",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "cite",
  "code",
  "col",
  "colgroup",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "div",
  "dl",
  "dt",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "label",
  "legend",
  "li",
  "link",
  "main",
  "map",
  "mark",
  "math",
  "menu",
  "menuitem",
  "meta",
  "meter",
  "nav",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "param",
  "picture",
  "pre",
  "progress",
  "q",
  "rb",
  "rp",
  "rt",
  "rtc",
  "ruby",
  "s",
  "samp",
  "script",
  "section",
  "select",
  "slot",
  "small",
  "source",
  "span",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "svg",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "u",
  "ul",
  "var",
  "video",
  "wbr"
];
class Schema {
  /**
   * @param {SchemaType['property']} property
   *   Property.
   * @param {SchemaType['normal']} normal
   *   Normal.
   * @param {Space | undefined} [space]
   *   Space.
   * @returns
   *   Schema.
   */
  constructor(property, normal, space) {
    this.normal = normal;
    this.property = property;
    if (space) {
      this.space = space;
    }
  }
}
Schema.prototype.normal = {};
Schema.prototype.property = {};
Schema.prototype.space = void 0;
function merge(definitions, space) {
  const property = {};
  const normal = {};
  for (const definition of definitions) {
    Object.assign(property, definition.property);
    Object.assign(normal, definition.normal);
  }
  return new Schema(property, normal, space);
}
function normalize(value) {
  return value.toLowerCase();
}
class Info {
  /**
   * @param {string} property
   *   Property.
   * @param {string} attribute
   *   Attribute.
   * @returns
   *   Info.
   */
  constructor(property, attribute) {
    this.attribute = attribute;
    this.property = property;
  }
}
Info.prototype.attribute = "";
Info.prototype.booleanish = false;
Info.prototype.boolean = false;
Info.prototype.commaOrSpaceSeparated = false;
Info.prototype.commaSeparated = false;
Info.prototype.defined = false;
Info.prototype.mustUseProperty = false;
Info.prototype.number = false;
Info.prototype.overloadedBoolean = false;
Info.prototype.property = "";
Info.prototype.spaceSeparated = false;
Info.prototype.space = void 0;
let powers = 0;
const boolean = increment();
const booleanish = increment();
const overloadedBoolean = increment();
const number = increment();
const spaceSeparated = increment();
const commaSeparated = increment();
const commaOrSpaceSeparated = increment();
function increment() {
  return 2 ** ++powers;
}
const types = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  boolean,
  booleanish,
  commaOrSpaceSeparated,
  commaSeparated,
  number,
  overloadedBoolean,
  spaceSeparated
}, Symbol.toStringTag, { value: "Module" }));
const checks = (
  /** @type {ReadonlyArray<keyof typeof types>} */
  Object.keys(types)
);
class DefinedInfo extends Info {
  /**
   * @constructor
   * @param {string} property
   *   Property.
   * @param {string} attribute
   *   Attribute.
   * @param {number | null | undefined} [mask]
   *   Mask.
   * @param {Space | undefined} [space]
   *   Space.
   * @returns
   *   Info.
   */
  constructor(property, attribute, mask, space) {
    let index = -1;
    super(property, attribute);
    mark(this, "space", space);
    if (typeof mask === "number") {
      while (++index < checks.length) {
        const check = checks[index];
        mark(this, checks[index], (mask & types[check]) === types[check]);
      }
    }
  }
}
DefinedInfo.prototype.defined = true;
function mark(values, key, value) {
  if (value) {
    values[key] = value;
  }
}
function create(definition) {
  const properties = {};
  const normals = {};
  for (const [property, value] of Object.entries(definition.properties)) {
    const info = new DefinedInfo(
      property,
      definition.transform(definition.attributes || {}, property),
      value,
      definition.space
    );
    if (definition.mustUseProperty && definition.mustUseProperty.includes(property)) {
      info.mustUseProperty = true;
    }
    properties[property] = info;
    normals[normalize(property)] = property;
    normals[normalize(info.attribute)] = property;
  }
  return new Schema(properties, normals, definition.space);
}
const aria = create({
  properties: {
    ariaActiveDescendant: null,
    ariaAtomic: booleanish,
    ariaAutoComplete: null,
    ariaBusy: booleanish,
    ariaChecked: booleanish,
    ariaColCount: number,
    ariaColIndex: number,
    ariaColSpan: number,
    ariaControls: spaceSeparated,
    ariaCurrent: null,
    ariaDescribedBy: spaceSeparated,
    ariaDetails: null,
    ariaDisabled: booleanish,
    ariaDropEffect: spaceSeparated,
    ariaErrorMessage: null,
    ariaExpanded: booleanish,
    ariaFlowTo: spaceSeparated,
    ariaGrabbed: booleanish,
    ariaHasPopup: null,
    ariaHidden: booleanish,
    ariaInvalid: null,
    ariaKeyShortcuts: null,
    ariaLabel: null,
    ariaLabelledBy: spaceSeparated,
    ariaLevel: number,
    ariaLive: null,
    ariaModal: booleanish,
    ariaMultiLine: booleanish,
    ariaMultiSelectable: booleanish,
    ariaOrientation: null,
    ariaOwns: spaceSeparated,
    ariaPlaceholder: null,
    ariaPosInSet: number,
    ariaPressed: booleanish,
    ariaReadOnly: booleanish,
    ariaRelevant: null,
    ariaRequired: booleanish,
    ariaRoleDescription: spaceSeparated,
    ariaRowCount: number,
    ariaRowIndex: number,
    ariaRowSpan: number,
    ariaSelected: booleanish,
    ariaSetSize: number,
    ariaSort: null,
    ariaValueMax: number,
    ariaValueMin: number,
    ariaValueNow: number,
    ariaValueText: null,
    role: null
  },
  transform(_, property) {
    return property === "role" ? property : "aria-" + property.slice(4).toLowerCase();
  }
});
function caseSensitiveTransform(attributes, attribute) {
  return attribute in attributes ? attributes[attribute] : attribute;
}
function caseInsensitiveTransform(attributes, property) {
  return caseSensitiveTransform(attributes, property.toLowerCase());
}
const html$1 = create({
  attributes: {
    acceptcharset: "accept-charset",
    classname: "class",
    htmlfor: "for",
    httpequiv: "http-equiv"
  },
  mustUseProperty: ["checked", "multiple", "muted", "selected"],
  properties: {
    // Standard Properties.
    abbr: null,
    accept: commaSeparated,
    acceptCharset: spaceSeparated,
    accessKey: spaceSeparated,
    action: null,
    allow: null,
    allowFullScreen: boolean,
    allowPaymentRequest: boolean,
    allowUserMedia: boolean,
    alt: null,
    as: null,
    async: boolean,
    autoCapitalize: null,
    autoComplete: spaceSeparated,
    autoFocus: boolean,
    autoPlay: boolean,
    blocking: spaceSeparated,
    capture: null,
    charSet: null,
    checked: boolean,
    cite: null,
    className: spaceSeparated,
    cols: number,
    colSpan: null,
    content: null,
    contentEditable: booleanish,
    controls: boolean,
    controlsList: spaceSeparated,
    coords: number | commaSeparated,
    crossOrigin: null,
    data: null,
    dateTime: null,
    decoding: null,
    default: boolean,
    defer: boolean,
    dir: null,
    dirName: null,
    disabled: boolean,
    download: overloadedBoolean,
    draggable: booleanish,
    encType: null,
    enterKeyHint: null,
    fetchPriority: null,
    form: null,
    formAction: null,
    formEncType: null,
    formMethod: null,
    formNoValidate: boolean,
    formTarget: null,
    headers: spaceSeparated,
    height: number,
    hidden: overloadedBoolean,
    high: number,
    href: null,
    hrefLang: null,
    htmlFor: spaceSeparated,
    httpEquiv: spaceSeparated,
    id: null,
    imageSizes: null,
    imageSrcSet: null,
    inert: boolean,
    inputMode: null,
    integrity: null,
    is: null,
    isMap: boolean,
    itemId: null,
    itemProp: spaceSeparated,
    itemRef: spaceSeparated,
    itemScope: boolean,
    itemType: spaceSeparated,
    kind: null,
    label: null,
    lang: null,
    language: null,
    list: null,
    loading: null,
    loop: boolean,
    low: number,
    manifest: null,
    max: null,
    maxLength: number,
    media: null,
    method: null,
    min: null,
    minLength: number,
    multiple: boolean,
    muted: boolean,
    name: null,
    nonce: null,
    noModule: boolean,
    noValidate: boolean,
    onAbort: null,
    onAfterPrint: null,
    onAuxClick: null,
    onBeforeMatch: null,
    onBeforePrint: null,
    onBeforeToggle: null,
    onBeforeUnload: null,
    onBlur: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onContextLost: null,
    onContextMenu: null,
    onContextRestored: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFormData: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLanguageChange: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadEnd: null,
    onLoadStart: null,
    onMessage: null,
    onMessageError: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRejectionHandled: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onScrollEnd: null,
    onSecurityPolicyViolation: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onSlotChange: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnhandledRejection: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onWheel: null,
    open: boolean,
    optimum: number,
    pattern: null,
    ping: spaceSeparated,
    placeholder: null,
    playsInline: boolean,
    popover: null,
    popoverTarget: null,
    popoverTargetAction: null,
    poster: null,
    preload: null,
    readOnly: boolean,
    referrerPolicy: null,
    rel: spaceSeparated,
    required: boolean,
    reversed: boolean,
    rows: number,
    rowSpan: number,
    sandbox: spaceSeparated,
    scope: null,
    scoped: boolean,
    seamless: boolean,
    selected: boolean,
    shadowRootClonable: boolean,
    shadowRootDelegatesFocus: boolean,
    shadowRootMode: null,
    shape: null,
    size: number,
    sizes: null,
    slot: null,
    span: number,
    spellCheck: booleanish,
    src: null,
    srcDoc: null,
    srcLang: null,
    srcSet: null,
    start: number,
    step: null,
    style: null,
    tabIndex: number,
    target: null,
    title: null,
    translate: null,
    type: null,
    typeMustMatch: boolean,
    useMap: null,
    value: booleanish,
    width: number,
    wrap: null,
    writingSuggestions: null,
    // Legacy.
    // See: https://html.spec.whatwg.org/#other-elements,-attributes-and-apis
    align: null,
    // Several. Use CSS `text-align` instead,
    aLink: null,
    // `<body>`. Use CSS `a:active {color}` instead
    archive: spaceSeparated,
    // `<object>`. List of URIs to archives
    axis: null,
    // `<td>` and `<th>`. Use `scope` on `<th>`
    background: null,
    // `<body>`. Use CSS `background-image` instead
    bgColor: null,
    // `<body>` and table elements. Use CSS `background-color` instead
    border: number,
    // `<table>`. Use CSS `border-width` instead,
    borderColor: null,
    // `<table>`. Use CSS `border-color` instead,
    bottomMargin: number,
    // `<body>`
    cellPadding: null,
    // `<table>`
    cellSpacing: null,
    // `<table>`
    char: null,
    // Several table elements. When `align=char`, sets the character to align on
    charOff: null,
    // Several table elements. When `char`, offsets the alignment
    classId: null,
    // `<object>`
    clear: null,
    // `<br>`. Use CSS `clear` instead
    code: null,
    // `<object>`
    codeBase: null,
    // `<object>`
    codeType: null,
    // `<object>`
    color: null,
    // `<font>` and `<hr>`. Use CSS instead
    compact: boolean,
    // Lists. Use CSS to reduce space between items instead
    declare: boolean,
    // `<object>`
    event: null,
    // `<script>`
    face: null,
    // `<font>`. Use CSS instead
    frame: null,
    // `<table>`
    frameBorder: null,
    // `<iframe>`. Use CSS `border` instead
    hSpace: number,
    // `<img>` and `<object>`
    leftMargin: number,
    // `<body>`
    link: null,
    // `<body>`. Use CSS `a:link {color: *}` instead
    longDesc: null,
    // `<frame>`, `<iframe>`, and `<img>`. Use an `<a>`
    lowSrc: null,
    // `<img>`. Use a `<picture>`
    marginHeight: number,
    // `<body>`
    marginWidth: number,
    // `<body>`
    noResize: boolean,
    // `<frame>`
    noHref: boolean,
    // `<area>`. Use no href instead of an explicit `nohref`
    noShade: boolean,
    // `<hr>`. Use background-color and height instead of borders
    noWrap: boolean,
    // `<td>` and `<th>`
    object: null,
    // `<applet>`
    profile: null,
    // `<head>`
    prompt: null,
    // `<isindex>`
    rev: null,
    // `<link>`
    rightMargin: number,
    // `<body>`
    rules: null,
    // `<table>`
    scheme: null,
    // `<meta>`
    scrolling: booleanish,
    // `<frame>`. Use overflow in the child context
    standby: null,
    // `<object>`
    summary: null,
    // `<table>`
    text: null,
    // `<body>`. Use CSS `color` instead
    topMargin: number,
    // `<body>`
    valueType: null,
    // `<param>`
    version: null,
    // `<html>`. Use a doctype.
    vAlign: null,
    // Several. Use CSS `vertical-align` instead
    vLink: null,
    // `<body>`. Use CSS `a:visited {color}` instead
    vSpace: number,
    // `<img>` and `<object>`
    // Non-standard Properties.
    allowTransparency: null,
    autoCorrect: null,
    autoSave: null,
    disablePictureInPicture: boolean,
    disableRemotePlayback: boolean,
    prefix: null,
    property: null,
    results: number,
    security: null,
    unselectable: null
  },
  space: "html",
  transform: caseInsensitiveTransform
});
const svg = create({
  attributes: {
    accentHeight: "accent-height",
    alignmentBaseline: "alignment-baseline",
    arabicForm: "arabic-form",
    baselineShift: "baseline-shift",
    capHeight: "cap-height",
    className: "class",
    clipPath: "clip-path",
    clipRule: "clip-rule",
    colorInterpolation: "color-interpolation",
    colorInterpolationFilters: "color-interpolation-filters",
    colorProfile: "color-profile",
    colorRendering: "color-rendering",
    crossOrigin: "crossorigin",
    dataType: "datatype",
    dominantBaseline: "dominant-baseline",
    enableBackground: "enable-background",
    fillOpacity: "fill-opacity",
    fillRule: "fill-rule",
    floodColor: "flood-color",
    floodOpacity: "flood-opacity",
    fontFamily: "font-family",
    fontSize: "font-size",
    fontSizeAdjust: "font-size-adjust",
    fontStretch: "font-stretch",
    fontStyle: "font-style",
    fontVariant: "font-variant",
    fontWeight: "font-weight",
    glyphName: "glyph-name",
    glyphOrientationHorizontal: "glyph-orientation-horizontal",
    glyphOrientationVertical: "glyph-orientation-vertical",
    hrefLang: "hreflang",
    horizAdvX: "horiz-adv-x",
    horizOriginX: "horiz-origin-x",
    horizOriginY: "horiz-origin-y",
    imageRendering: "image-rendering",
    letterSpacing: "letter-spacing",
    lightingColor: "lighting-color",
    markerEnd: "marker-end",
    markerMid: "marker-mid",
    markerStart: "marker-start",
    navDown: "nav-down",
    navDownLeft: "nav-down-left",
    navDownRight: "nav-down-right",
    navLeft: "nav-left",
    navNext: "nav-next",
    navPrev: "nav-prev",
    navRight: "nav-right",
    navUp: "nav-up",
    navUpLeft: "nav-up-left",
    navUpRight: "nav-up-right",
    onAbort: "onabort",
    onActivate: "onactivate",
    onAfterPrint: "onafterprint",
    onBeforePrint: "onbeforeprint",
    onBegin: "onbegin",
    onCancel: "oncancel",
    onCanPlay: "oncanplay",
    onCanPlayThrough: "oncanplaythrough",
    onChange: "onchange",
    onClick: "onclick",
    onClose: "onclose",
    onCopy: "oncopy",
    onCueChange: "oncuechange",
    onCut: "oncut",
    onDblClick: "ondblclick",
    onDrag: "ondrag",
    onDragEnd: "ondragend",
    onDragEnter: "ondragenter",
    onDragExit: "ondragexit",
    onDragLeave: "ondragleave",
    onDragOver: "ondragover",
    onDragStart: "ondragstart",
    onDrop: "ondrop",
    onDurationChange: "ondurationchange",
    onEmptied: "onemptied",
    onEnd: "onend",
    onEnded: "onended",
    onError: "onerror",
    onFocus: "onfocus",
    onFocusIn: "onfocusin",
    onFocusOut: "onfocusout",
    onHashChange: "onhashchange",
    onInput: "oninput",
    onInvalid: "oninvalid",
    onKeyDown: "onkeydown",
    onKeyPress: "onkeypress",
    onKeyUp: "onkeyup",
    onLoad: "onload",
    onLoadedData: "onloadeddata",
    onLoadedMetadata: "onloadedmetadata",
    onLoadStart: "onloadstart",
    onMessage: "onmessage",
    onMouseDown: "onmousedown",
    onMouseEnter: "onmouseenter",
    onMouseLeave: "onmouseleave",
    onMouseMove: "onmousemove",
    onMouseOut: "onmouseout",
    onMouseOver: "onmouseover",
    onMouseUp: "onmouseup",
    onMouseWheel: "onmousewheel",
    onOffline: "onoffline",
    onOnline: "ononline",
    onPageHide: "onpagehide",
    onPageShow: "onpageshow",
    onPaste: "onpaste",
    onPause: "onpause",
    onPlay: "onplay",
    onPlaying: "onplaying",
    onPopState: "onpopstate",
    onProgress: "onprogress",
    onRateChange: "onratechange",
    onRepeat: "onrepeat",
    onReset: "onreset",
    onResize: "onresize",
    onScroll: "onscroll",
    onSeeked: "onseeked",
    onSeeking: "onseeking",
    onSelect: "onselect",
    onShow: "onshow",
    onStalled: "onstalled",
    onStorage: "onstorage",
    onSubmit: "onsubmit",
    onSuspend: "onsuspend",
    onTimeUpdate: "ontimeupdate",
    onToggle: "ontoggle",
    onUnload: "onunload",
    onVolumeChange: "onvolumechange",
    onWaiting: "onwaiting",
    onZoom: "onzoom",
    overlinePosition: "overline-position",
    overlineThickness: "overline-thickness",
    paintOrder: "paint-order",
    panose1: "panose-1",
    pointerEvents: "pointer-events",
    referrerPolicy: "referrerpolicy",
    renderingIntent: "rendering-intent",
    shapeRendering: "shape-rendering",
    stopColor: "stop-color",
    stopOpacity: "stop-opacity",
    strikethroughPosition: "strikethrough-position",
    strikethroughThickness: "strikethrough-thickness",
    strokeDashArray: "stroke-dasharray",
    strokeDashOffset: "stroke-dashoffset",
    strokeLineCap: "stroke-linecap",
    strokeLineJoin: "stroke-linejoin",
    strokeMiterLimit: "stroke-miterlimit",
    strokeOpacity: "stroke-opacity",
    strokeWidth: "stroke-width",
    tabIndex: "tabindex",
    textAnchor: "text-anchor",
    textDecoration: "text-decoration",
    textRendering: "text-rendering",
    transformOrigin: "transform-origin",
    typeOf: "typeof",
    underlinePosition: "underline-position",
    underlineThickness: "underline-thickness",
    unicodeBidi: "unicode-bidi",
    unicodeRange: "unicode-range",
    unitsPerEm: "units-per-em",
    vAlphabetic: "v-alphabetic",
    vHanging: "v-hanging",
    vIdeographic: "v-ideographic",
    vMathematical: "v-mathematical",
    vectorEffect: "vector-effect",
    vertAdvY: "vert-adv-y",
    vertOriginX: "vert-origin-x",
    vertOriginY: "vert-origin-y",
    wordSpacing: "word-spacing",
    writingMode: "writing-mode",
    xHeight: "x-height",
    // These were camelcased in Tiny. Now lowercased in SVG 2
    playbackOrder: "playbackorder",
    timelineBegin: "timelinebegin"
  },
  properties: {
    about: commaOrSpaceSeparated,
    accentHeight: number,
    accumulate: null,
    additive: null,
    alignmentBaseline: null,
    alphabetic: number,
    amplitude: number,
    arabicForm: null,
    ascent: number,
    attributeName: null,
    attributeType: null,
    azimuth: number,
    bandwidth: null,
    baselineShift: null,
    baseFrequency: null,
    baseProfile: null,
    bbox: null,
    begin: null,
    bias: number,
    by: null,
    calcMode: null,
    capHeight: number,
    className: spaceSeparated,
    clip: null,
    clipPath: null,
    clipPathUnits: null,
    clipRule: null,
    color: null,
    colorInterpolation: null,
    colorInterpolationFilters: null,
    colorProfile: null,
    colorRendering: null,
    content: null,
    contentScriptType: null,
    contentStyleType: null,
    crossOrigin: null,
    cursor: null,
    cx: null,
    cy: null,
    d: null,
    dataType: null,
    defaultAction: null,
    descent: number,
    diffuseConstant: number,
    direction: null,
    display: null,
    dur: null,
    divisor: number,
    dominantBaseline: null,
    download: boolean,
    dx: null,
    dy: null,
    edgeMode: null,
    editable: null,
    elevation: number,
    enableBackground: null,
    end: null,
    event: null,
    exponent: number,
    externalResourcesRequired: null,
    fill: null,
    fillOpacity: number,
    fillRule: null,
    filter: null,
    filterRes: null,
    filterUnits: null,
    floodColor: null,
    floodOpacity: null,
    focusable: null,
    focusHighlight: null,
    fontFamily: null,
    fontSize: null,
    fontSizeAdjust: null,
    fontStretch: null,
    fontStyle: null,
    fontVariant: null,
    fontWeight: null,
    format: null,
    fr: null,
    from: null,
    fx: null,
    fy: null,
    g1: commaSeparated,
    g2: commaSeparated,
    glyphName: commaSeparated,
    glyphOrientationHorizontal: null,
    glyphOrientationVertical: null,
    glyphRef: null,
    gradientTransform: null,
    gradientUnits: null,
    handler: null,
    hanging: number,
    hatchContentUnits: null,
    hatchUnits: null,
    height: null,
    href: null,
    hrefLang: null,
    horizAdvX: number,
    horizOriginX: number,
    horizOriginY: number,
    id: null,
    ideographic: number,
    imageRendering: null,
    initialVisibility: null,
    in: null,
    in2: null,
    intercept: number,
    k: number,
    k1: number,
    k2: number,
    k3: number,
    k4: number,
    kernelMatrix: commaOrSpaceSeparated,
    kernelUnitLength: null,
    keyPoints: null,
    // SEMI_COLON_SEPARATED
    keySplines: null,
    // SEMI_COLON_SEPARATED
    keyTimes: null,
    // SEMI_COLON_SEPARATED
    kerning: null,
    lang: null,
    lengthAdjust: null,
    letterSpacing: null,
    lightingColor: null,
    limitingConeAngle: number,
    local: null,
    markerEnd: null,
    markerMid: null,
    markerStart: null,
    markerHeight: null,
    markerUnits: null,
    markerWidth: null,
    mask: null,
    maskContentUnits: null,
    maskUnits: null,
    mathematical: null,
    max: null,
    media: null,
    mediaCharacterEncoding: null,
    mediaContentEncodings: null,
    mediaSize: number,
    mediaTime: null,
    method: null,
    min: null,
    mode: null,
    name: null,
    navDown: null,
    navDownLeft: null,
    navDownRight: null,
    navLeft: null,
    navNext: null,
    navPrev: null,
    navRight: null,
    navUp: null,
    navUpLeft: null,
    navUpRight: null,
    numOctaves: null,
    observer: null,
    offset: null,
    onAbort: null,
    onActivate: null,
    onAfterPrint: null,
    onBeforePrint: null,
    onBegin: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnd: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFocusIn: null,
    onFocusOut: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadStart: null,
    onMessage: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onMouseWheel: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRepeat: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onShow: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onZoom: null,
    opacity: null,
    operator: null,
    order: null,
    orient: null,
    orientation: null,
    origin: null,
    overflow: null,
    overlay: null,
    overlinePosition: number,
    overlineThickness: number,
    paintOrder: null,
    panose1: null,
    path: null,
    pathLength: number,
    patternContentUnits: null,
    patternTransform: null,
    patternUnits: null,
    phase: null,
    ping: spaceSeparated,
    pitch: null,
    playbackOrder: null,
    pointerEvents: null,
    points: null,
    pointsAtX: number,
    pointsAtY: number,
    pointsAtZ: number,
    preserveAlpha: null,
    preserveAspectRatio: null,
    primitiveUnits: null,
    propagate: null,
    property: commaOrSpaceSeparated,
    r: null,
    radius: null,
    referrerPolicy: null,
    refX: null,
    refY: null,
    rel: commaOrSpaceSeparated,
    rev: commaOrSpaceSeparated,
    renderingIntent: null,
    repeatCount: null,
    repeatDur: null,
    requiredExtensions: commaOrSpaceSeparated,
    requiredFeatures: commaOrSpaceSeparated,
    requiredFonts: commaOrSpaceSeparated,
    requiredFormats: commaOrSpaceSeparated,
    resource: null,
    restart: null,
    result: null,
    rotate: null,
    rx: null,
    ry: null,
    scale: null,
    seed: null,
    shapeRendering: null,
    side: null,
    slope: null,
    snapshotTime: null,
    specularConstant: number,
    specularExponent: number,
    spreadMethod: null,
    spacing: null,
    startOffset: null,
    stdDeviation: null,
    stemh: null,
    stemv: null,
    stitchTiles: null,
    stopColor: null,
    stopOpacity: null,
    strikethroughPosition: number,
    strikethroughThickness: number,
    string: null,
    stroke: null,
    strokeDashArray: commaOrSpaceSeparated,
    strokeDashOffset: null,
    strokeLineCap: null,
    strokeLineJoin: null,
    strokeMiterLimit: number,
    strokeOpacity: number,
    strokeWidth: null,
    style: null,
    surfaceScale: number,
    syncBehavior: null,
    syncBehaviorDefault: null,
    syncMaster: null,
    syncTolerance: null,
    syncToleranceDefault: null,
    systemLanguage: commaOrSpaceSeparated,
    tabIndex: number,
    tableValues: null,
    target: null,
    targetX: number,
    targetY: number,
    textAnchor: null,
    textDecoration: null,
    textRendering: null,
    textLength: null,
    timelineBegin: null,
    title: null,
    transformBehavior: null,
    type: null,
    typeOf: commaOrSpaceSeparated,
    to: null,
    transform: null,
    transformOrigin: null,
    u1: null,
    u2: null,
    underlinePosition: number,
    underlineThickness: number,
    unicode: null,
    unicodeBidi: null,
    unicodeRange: null,
    unitsPerEm: number,
    values: null,
    vAlphabetic: number,
    vMathematical: number,
    vectorEffect: null,
    vHanging: number,
    vIdeographic: number,
    version: null,
    vertAdvY: number,
    vertOriginX: number,
    vertOriginY: number,
    viewBox: null,
    viewTarget: null,
    visibility: null,
    width: null,
    widths: null,
    wordSpacing: null,
    writingMode: null,
    x: null,
    x1: null,
    x2: null,
    xChannelSelector: null,
    xHeight: number,
    y: null,
    y1: null,
    y2: null,
    yChannelSelector: null,
    z: null,
    zoomAndPan: null
  },
  space: "svg",
  transform: caseSensitiveTransform
});
const xlink = create({
  properties: {
    xLinkActuate: null,
    xLinkArcRole: null,
    xLinkHref: null,
    xLinkRole: null,
    xLinkShow: null,
    xLinkTitle: null,
    xLinkType: null
  },
  space: "xlink",
  transform(_, property) {
    return "xlink:" + property.slice(5).toLowerCase();
  }
});
const xmlns = create({
  attributes: { xmlnsxlink: "xmlns:xlink" },
  properties: { xmlnsXLink: null, xmlns: null },
  space: "xmlns",
  transform: caseInsensitiveTransform
});
const xml = create({
  properties: { xmlBase: null, xmlLang: null, xmlSpace: null },
  space: "xml",
  transform(_, property) {
    return "xml:" + property.slice(3).toLowerCase();
  }
});
const cap = /[A-Z]/g;
const dash = /-[a-z]/g;
const valid = /^data[-\w.:]+$/i;
function find(schema, value) {
  const normal = normalize(value);
  let property = value;
  let Type = Info;
  if (normal in schema.normal) {
    return schema.property[schema.normal[normal]];
  }
  if (normal.length > 4 && normal.slice(0, 4) === "data" && valid.test(value)) {
    if (value.charAt(4) === "-") {
      const rest = value.slice(5).replace(dash, camelcase);
      property = "data" + rest.charAt(0).toUpperCase() + rest.slice(1);
    } else {
      const rest = value.slice(4);
      if (!dash.test(rest)) {
        let dashes = rest.replace(cap, kebab);
        if (dashes.charAt(0) !== "-") {
          dashes = "-" + dashes;
        }
        value = "data" + dashes;
      }
    }
    Type = DefinedInfo;
  }
  return new Type(property, value);
}
function kebab($0) {
  return "-" + $0.toLowerCase();
}
function camelcase($0) {
  return $0.charAt(1).toUpperCase();
}
const html = merge([aria, html$1, xlink, xmlns, xml], "html");
merge([aria, svg, xlink, xmlns, xml], "svg");
const TEXT_TAGS = ["p", "h1", "h2", "h3", "h4", "h5", "h6", "li"];
function isTag(vnode, tag) {
  if (vnode.type === tag) {
    return true;
  }
  if (typeof vnode.type === "object" && vnode.type.tag === tag) {
    return true;
  }
  if (vnode.tag === tag) {
    return true;
  }
  return false;
}
function isText(vnode) {
  return isTag(vnode, "text") || isTag(vnode, Symbol.for("v-txt"));
}
function nodeChildren(node) {
  if (Array.isArray(node.children) || typeof node.children === "string") {
    return node.children;
  }
  if (typeof node.children?.default === "function") {
    return node.children.default();
  }
  return [];
}
function nodeTextContent(node) {
  if (!node) {
    return "";
  }
  if (Array.isArray(node)) {
    return node.map(nodeTextContent).join("");
  }
  if (isText(node)) {
    return node.value || node.children || "";
  }
  const children = nodeChildren(node);
  if (Array.isArray(children)) {
    return children.map(nodeTextContent).filter(Boolean).join("");
  }
  return "";
}
function unwrap(vnode, tags = []) {
  if (Array.isArray(vnode)) {
    return vnode.flatMap((node) => unwrap(node, tags));
  }
  let result = vnode;
  if (tags.some((tag) => tag === "*" || isTag(vnode, tag))) {
    result = nodeChildren(vnode) || vnode;
    if (!Array.isArray(result) && TEXT_TAGS.some((tag) => isTag(vnode, tag))) {
      result = [result];
    }
  }
  return result;
}
function _flatUnwrap(vnodes, tags = []) {
  vnodes = Array.isArray(vnodes) ? vnodes : [vnodes];
  if (!tags.length) {
    return vnodes;
  }
  return vnodes.flatMap((vnode) => _flatUnwrap(unwrap(vnode, [tags[0]]), tags.slice(1))).filter((vnode) => !(isText(vnode) && nodeTextContent(vnode).trim() === ""));
}
function flatUnwrap(vnodes, tags = []) {
  if (typeof tags === "string") {
    tags = tags.split(/[,\s]/).map((tag) => tag.trim()).filter(Boolean);
  }
  if (!tags.length) {
    return vnodes;
  }
  return _flatUnwrap(vnodes, tags).reduce((acc, item) => {
    if (isText(item)) {
      if (typeof acc[acc.length - 1] === "string") {
        acc[acc.length - 1] += item.children;
      } else {
        acc.push(item.children);
      }
    } else {
      acc.push(item);
    }
    return acc;
  }, []);
}
function pick(obj, keys) {
  return keys.reduce((acc, key) => {
    const value = get(obj, key);
    if (value !== void 0) {
      acc[key] = value;
    }
    return acc;
  }, {});
}
function get(obj, key) {
  return key.split(".").reduce((acc, k) => acc && acc[k], obj);
}
const DEFAULT_SLOT = "default";
const rxOn = /^@|^v-on:/;
const rxBind = /^:|^v-bind:/;
const rxModel = /^v-model/;
const nativeInputs = ["select", "textarea", "input"];
const specialParentTags = ["math", "svg"];
const proseComponentMap = Object.fromEntries(["p", "a", "blockquote", "code", "pre", "code", "em", "h1", "h2", "h3", "h4", "h5", "h6", "hr", "img", "ul", "ol", "li", "strong", "table", "thead", "tbody", "td", "th", "tr", "script"].map((t) => [t, `prose-${t}`]));
const dangerousTags = ["script", "base"];
const _sfc_main$6 = vueExports.defineComponent({
  name: "MDCRenderer",
  props: {
    /**
     * Content to render
     */
    body: {
      type: Object,
      required: true
    },
    /**
     * Document meta data
     */
    data: {
      type: Object,
      default: () => ({})
    },
    /**
     * Class(es) to bind to the component
     */
    class: {
      type: [String, Object],
      default: void 0
    },
    /**
     * Root tag to use for rendering
     */
    tag: {
      type: [String, Boolean],
      default: void 0
    },
    /**
     * Whether or not to render Prose components instead of HTML tags
     */
    prose: {
      type: Boolean,
      default: void 0
    },
    /**
     * The map of custom components to use for rendering.
     */
    components: {
      type: Object,
      default: () => ({})
    },
    /**
     * Tags to unwrap separated by spaces
     * Example: 'ul li'
     */
    unwrap: {
      type: [Boolean, String],
      default: false
    }
  },
  async setup(props) {
    const app = vueExports.getCurrentInstance()?.appContext?.app;
    const $nuxt = app?.$nuxt;
    const route = $nuxt?.$route || $nuxt?._route;
    const { mdc } = $nuxt?.$config?.public || {};
    const tags = vueExports.computed(() => ({
      ...mdc?.components?.prose && props.prose !== false ? proseComponentMap : {},
      ...mdc?.components?.map || {},
      ...vueExports.toRaw(props.data?.mdc?.components || {}),
      ...props.components
    }));
    const contentKey = vueExports.computed(() => {
      const components = (props.body?.children || []).map((n) => n.tag || n.type).filter((t) => !htmlTags.includes(t));
      return Array.from(new Set(components)).sort().join(".");
    });
    const runtimeData = vueExports.reactive({
      ...props.data
    });
    vueExports.watch(() => props.data, (newData) => {
      Object.assign(runtimeData, newData);
    });
    await resolveContentComponents(props.body, { tags: tags.value });
    function updateRuntimeData(code, value) {
      const lastIndex = code.split(".").length - 1;
      return code.split(".").reduce((o, k, i) => {
        if (i == lastIndex && o) {
          o[k] = value;
          return o[k];
        }
        return typeof o === "object" ? o[k] : void 0;
      }, runtimeData);
    }
    return { tags, contentKey, route, runtimeData, updateRuntimeData };
  },
  render(ctx) {
    const { tags, tag, body, data, contentKey, route, unwrap: unwrap2, runtimeData, updateRuntimeData } = ctx;
    if (!body) {
      return null;
    }
    const meta = { ...data, tags, $route: route, runtimeData, updateRuntimeData };
    const component = tag !== false ? resolveComponentInstance(tag || meta.component?.name || meta.component || "div") : void 0;
    return component ? vueExports.h(component, { ...meta.component?.props, class: ctx.class, ...this.$attrs, key: contentKey }, { default: defaultSlotRenderer }) : defaultSlotRenderer?.();
    function defaultSlotRenderer() {
      const defaultSlot = _renderSlots(body, vueExports.h, { documentMeta: meta, parentScope: meta, resolveComponent: resolveComponentInstance });
      if (!defaultSlot?.default) {
        return null;
      }
      if (unwrap2) {
        return flatUnwrap(
          defaultSlot.default(),
          typeof unwrap2 === "string" ? unwrap2.split(" ") : ["*"]
        );
      }
      return defaultSlot.default();
    }
  }
});
function _renderNode(node, h2, options, keyInParent) {
  const { documentMeta, parentScope, resolveComponent } = options;
  if (node.type === "text") {
    return h2(vueExports.Text, node.value);
  }
  if (node.type === "comment") {
    return h2(vueExports.Comment, null, node.value);
  }
  const originalTag = node.tag;
  const renderTag = findMappedTag(node, documentMeta.tags);
  if (node.tag === "binding") {
    return renderBinding(node, h2, documentMeta, parentScope);
  }
  const _resolveComponent = isUnresolvableTag(renderTag) ? (component2) => component2 : resolveComponent;
  if (dangerousTags.includes(renderTag)) {
    return h2(
      "pre",
      { class: "mdc-renderer-dangerous-tag" },
      "<" + renderTag + ">" + nodeTextContent(node) + "</" + renderTag + ">"
    );
  }
  const component = _resolveComponent(renderTag);
  if (typeof component === "object") {
    component.tag = originalTag;
  }
  const props = propsToData(node, documentMeta);
  if (keyInParent) {
    props.key = keyInParent;
  }
  return h2(
    component,
    props,
    _renderSlots(
      node,
      h2,
      {
        documentMeta,
        parentScope: { ...parentScope, ...props },
        resolveComponent: _resolveComponent
      }
    )
  );
}
function _renderSlots(node, h2, options) {
  const { documentMeta, parentScope, resolveComponent } = options;
  const children = node.children || [];
  const slotNodes = children.reduce((data, node2) => {
    if (!isTemplate(node2)) {
      data[DEFAULT_SLOT].children.push(node2);
      return data;
    }
    const slotName = getSlotName(node2);
    data[slotName] = data[slotName] || { props: {}, children: [] };
    if (node2.type === "element") {
      data[slotName].props = node2.props;
      data[slotName].children.push(...node2.children || []);
    }
    return data;
  }, {
    [DEFAULT_SLOT]: { props: {}, children: [] }
  });
  const slots = Object.entries(slotNodes).reduce((slots2, [name, { props, children: children2 }]) => {
    if (!children2.length) {
      return slots2;
    }
    slots2[name] = (data = {}) => {
      const scopedProps = pick(data, Object.keys(props || {}));
      let vNodes = children2.map((child, index) => {
        return _renderNode(
          child,
          h2,
          {
            documentMeta,
            parentScope: { ...parentScope, ...scopedProps },
            resolveComponent
          },
          String(child.props?.key || index)
        );
      });
      if (props?.unwrap) {
        vNodes = flatUnwrap(vNodes, props.unwrap);
      }
      return mergeTextNodes(vNodes);
    };
    return slots2;
  }, {});
  return slots;
}
function renderBinding(node, h2, documentMeta, parentScope = {}) {
  const data = {
    ...documentMeta.runtimeData,
    ...parentScope,
    $document: documentMeta,
    $doc: documentMeta
  };
  const splitter = /\.|\[(\d+)\]/;
  const keys = node.props?.value.trim().split(splitter).filter(Boolean);
  const value = keys.reduce((data2, key) => {
    if (data2 && key in data2) {
      if (typeof data2[key] === "function") {
        return data2[key]();
      } else {
        return data2[key];
      }
    }
    return void 0;
  }, data);
  const defaultValue = node.props?.defaultValue;
  return h2(vueExports.Text, value ?? defaultValue ?? "");
}
function propsToData(node, documentMeta) {
  const { tag = "", props = {} } = node;
  return Object.keys(props).reduce(function(data, key) {
    if (key === "__ignoreMap") {
      return data;
    }
    const value = props[key];
    if (rxModel.test(key)) {
      return propsToDataRxModel(key, value, data, documentMeta, { native: nativeInputs.includes(tag) });
    }
    if (key === "v-bind") {
      return propsToDataVBind(key, value, data, documentMeta);
    }
    if (rxOn.test(key)) {
      return propsToDataRxOn(key, value, data, documentMeta);
    }
    if (rxBind.test(key)) {
      return propsToDataRxBind(key, value, data, documentMeta);
    }
    const { attribute } = find(html, key);
    if (Array.isArray(value) && value.every((v) => typeof v === "string")) {
      data[attribute] = value.join(" ");
      return data;
    }
    data[attribute] = value;
    return data;
  }, {});
}
function propsToDataRxModel(key, value, data, documentMeta, { native }) {
  const propName = key.match(/^v-model:([^=]+)/)?.[1] || "modelValue";
  const field = native ? "value" : propName;
  const event = native ? "onInput" : `onUpdate:${propName}`;
  data[field] = evalInContext(value, documentMeta.runtimeData);
  data[event] = (e) => {
    documentMeta.updateRuntimeData(value, native ? e.target?.value : e);
  };
  return data;
}
function propsToDataVBind(_key, value, data, documentMeta) {
  const val = evalInContext(value, documentMeta);
  data = Object.assign(data, val);
  return data;
}
function propsToDataRxOn(key, value, data, documentMeta) {
  key = key.replace(rxOn, "");
  data.on = data.on || {};
  data.on[key] = () => evalInContext(value, documentMeta);
  return data;
}
function propsToDataRxBind(key, value, data, documentMeta) {
  key = key.replace(rxBind, "");
  data[key] = evalInContext(value, documentMeta);
  return data;
}
const resolveComponentInstance = (component) => {
  if (typeof component === "string") {
    if (htmlTags.includes(component)) {
      return component;
    }
    const _component = vueExports.resolveComponent(pascalCase(component), false);
    if (!component || _component?.name === "AsyncComponentWrapper") {
      return _component;
    }
    if (typeof _component === "string") {
      return _component;
    }
    if ("setup" in _component) {
      return vueExports.defineAsyncComponent(() => new Promise((resolve) => resolve(_component)));
    }
    return _component;
  }
  return component;
};
function evalInContext(code, context) {
  const result = code.split(".").reduce((o, k) => typeof o === "object" ? o[k] : void 0, context);
  return typeof result === "undefined" ? destr(code) : result;
}
function getSlotName(node) {
  let name = "";
  for (const propName of Object.keys(node.props || {})) {
    if (!propName.startsWith("#") && !propName.startsWith("v-slot:")) {
      continue;
    }
    name = propName.split(/[:#]/, 2)[1];
    break;
  }
  return name || DEFAULT_SLOT;
}
function isTemplate(node) {
  return node.tag === "template";
}
function isUnresolvableTag(tag) {
  return specialParentTags.includes(tag);
}
function mergeTextNodes(nodes) {
  const mergedNodes = [];
  for (const node of nodes) {
    const previousNode = mergedNodes[mergedNodes.length - 1];
    if (node.type === vueExports.Text && previousNode?.type === vueExports.Text) {
      previousNode.children = previousNode.children + node.children;
    } else {
      mergedNodes.push(node);
    }
  }
  return mergedNodes;
}
async function resolveContentComponents(body, meta) {
  if (!body) {
    return;
  }
  const components = Array.from(new Set(loadComponents(body, meta)));
  await Promise.all(components.map(async (c) => {
    if (c?.render || c?.ssrRender || c?.__ssrInlineRender) {
      return;
    }
    const resolvedComponent = resolveComponentInstance(c);
    if (resolvedComponent?.__asyncLoader && !resolvedComponent.__asyncResolved) {
      await resolvedComponent.__asyncLoader();
    }
  }));
  function loadComponents(node, documentMeta) {
    const tag = node.tag;
    if (node.type === "text" || tag === "binding" || node.type === "comment") {
      return [];
    }
    const renderTag = findMappedTag(node, documentMeta.tags);
    if (isUnresolvableTag(renderTag)) {
      return [];
    }
    const components2 = [];
    if (node.type !== "root" && !htmlTags.includes(renderTag)) {
      components2.push(renderTag);
    }
    for (const child of node.children || []) {
      components2.push(...loadComponents(child, documentMeta));
    }
    return components2;
  }
}
function findMappedTag(node, tags) {
  const tag = node.tag;
  if (!tag || typeof node.props?.__ignoreMap !== "undefined") {
    return tag;
  }
  return tags[tag] || tags[pascalCase(tag)] || tags[kebabCase(node.tag)] || tag;
}
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/@nuxtjs+mdc@0.18.2_magicast@0.5.1/node_modules/@nuxtjs/mdc/dist/runtime/components/MDCRenderer.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const ProseA = () => import('./ProseA-BphFOazn.mjs');
const ProseBlockquote = () => import('./ProseBlockquote-Hqag1Cud.mjs');
const ProseCode = () => import('./ProseCode-B-wrgPv5.mjs');
const ProseEm = () => import('./ProseEm-DEUEvHb9.mjs');
const ProseH1 = () => import('./ProseH1-BmxKl7xv.mjs');
const ProseH2 = () => import('./ProseH2-Dk_SbeVX.mjs');
const ProseH3 = () => import('./ProseH3-CjRfm60M.mjs');
const ProseH4 = () => import('./ProseH4-B6TfEfzG.mjs');
const ProseH5 = () => import('./ProseH5-B6sSTYwx.mjs');
const ProseH6 = () => import('./ProseH6-BDnXBneJ.mjs');
const ProseHr = () => import('./ProseHr-4R_Lm_7d.mjs');
const ProseLi = () => import('./ProseLi-CxStCqMN.mjs');
const ProseOl = () => import('./ProseOl-B7BhMidI.mjs');
const ProseP = () => import('./ProseP-PZXWgkbX.mjs');
const ProsePre = () => import('./ProsePre-Vp4Hmqin.mjs');
const ProseStrong = () => import('./ProseStrong-BkxHe9x1.mjs');
const ProseTable = () => import('./ProseTable-BUMY2JGo.mjs');
const ProseTbody = () => import('./ProseTbody-Yc9GNvVq.mjs');
const ProseTd = () => import('./ProseTd-DXX2XJ6B.mjs');
const ProseTh = () => import('./ProseTh-CHO_DTA8.mjs');
const ProseThead = () => import('./ProseThead-B3riMrH0.mjs');
const ProseTr = () => import('./ProseTr-dRG46Jwq.mjs');
const ProseUl = () => import('./ProseUl-DXAhREWK.mjs');
const globalComponents = ["ProseScript"];
const localComponents = ["ProseA", "ProseBlockquote", "ProseCode", "ProseEm", "ProseH1", "ProseH2", "ProseH3", "ProseH4", "ProseH5", "ProseH6", "ProseHr", "ProseLi", "ProseOl", "ProseP", "ProsePre", "ProseStrong", "ProseTable", "ProseTbody", "ProseTd", "ProseTh", "ProseThead", "ProseTr", "ProseUl"];
const virtual_nuxt__2Fhome_2Fzoobzio_2Fcode_2Ffoundation_2Fapps_2Fblog_2Fnode_modules_2F_cache_2Fnuxt_2F_nuxt_2Fcontent_2Fcomponents = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ProseA,
  ProseBlockquote,
  ProseCode,
  ProseEm,
  ProseH1,
  ProseH2,
  ProseH3,
  ProseH4,
  ProseH5,
  ProseH6,
  ProseHr,
  ProseLi,
  ProseOl,
  ProseP,
  ProsePre,
  ProseStrong,
  ProseTable,
  ProseTbody,
  ProseTd,
  ProseTh,
  ProseThead,
  ProseTr,
  ProseUl,
  globalComponents,
  localComponents
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$5 = {
  __name: "ContentRenderer",
  __ssrInlineRender: true,
  props: {
    /**
     * Content to render
     */
    value: {
      type: Object,
      required: true
    },
    /**
     * Render only the excerpt
     */
    excerpt: {
      type: Boolean,
      default: false
    },
    /**
     * Root tag to use for rendering
     */
    tag: {
      type: String,
      default: "div"
    },
    /**
     * The map of custom components to use for rendering.
     */
    components: {
      type: Object,
      default: () => ({})
    },
    data: {
      type: Object,
      default: () => ({})
    },
    /**
     * Whether or not to render Prose components instead of HTML tags
     */
    prose: {
      type: Boolean,
      default: void 0
    },
    /**
     * Root tag to use for rendering
     */
    class: {
      type: [String, Object],
      default: void 0
    },
    /**
     * Tags to unwrap separated by spaces
     * Example: 'ul li'
     */
    unwrap: {
      type: [Boolean, String],
      default: false
    }
  },
  setup(__props) {
    const renderFunctions = ["render", "ssrRender", "__ssrInlineRender"];
    const props = __props;
    const debug = globalThis._importMeta_.preview;
    const body = vueExports.computed(() => {
      let body2 = props.value.body || props.value;
      if (props.excerpt && props.value.excerpt) {
        body2 = props.value.excerpt;
      }
      if (body2.type === "minimal" || body2.type === "minimark") {
        return toHast({ value: body2.value });
      }
      return body2;
    });
    const isEmpty = vueExports.computed(() => !body.value?.children?.length);
    const data = vueExports.computed(() => {
      const { body: body2, excerpt, ...data2 } = props.value;
      return {
        ...data2,
        ...props.data
      };
    });
    const proseComponentMap2 = Object.fromEntries(["p", "a", "blockquote", "code", "pre", "code", "em", "h1", "h2", "h3", "h4", "h5", "h6", "hr", "img", "ul", "ol", "li", "strong", "table", "thead", "tbody", "td", "th", "tr", "script"].map((t) => [t, `prose-${t}`]));
    const { mdc } = useRuntimeConfig().public || {};
    const propsDataMDC = vueExports.computed(() => props.data.mdc);
    const tags = vueExports.computed(() => ({
      ...mdc?.components?.prose && props.prose !== false ? proseComponentMap2 : {},
      ...mdc?.components?.map || {},
      ...vueExports.toRaw(propsDataMDC.value?.components || {}),
      ...props.components
    }));
    const componentsMap = vueExports.computed(() => {
      return body.value ? resolveContentComponents2(body.value, { tags: tags.value }) : {};
    });
    function resolveVueComponent(component) {
      let _component = component;
      if (typeof component === "string") {
        if (htmlTags.includes(component)) {
          return component;
        }
        if (globalComponents.includes(pascalCase(component))) {
          _component = vueExports.resolveComponent(component, false);
        } else if (localComponents.includes(pascalCase(component))) {
          const loader = () => {
            return Promise.resolve().then(() => virtual_nuxt__2Fhome_2Fzoobzio_2Fcode_2Ffoundation_2Fapps_2Fblog_2Fnode_modules_2F_cache_2Fnuxt_2F_nuxt_2Fcontent_2Fcomponents).then((m) => {
              const comp = m[pascalCase(component)];
              return comp ? comp() : void 0;
            });
          };
          _component = vueExports.defineAsyncComponent(loader);
        }
        if (typeof _component === "string") {
          return _component;
        }
      }
      if (!_component) {
        return _component;
      }
      const componentObject = _component;
      if ("__asyncLoader" in componentObject) {
        return componentObject;
      }
      if ("setup" in componentObject) {
        return vueExports.defineAsyncComponent(() => Promise.resolve(componentObject));
      }
      return componentObject;
    }
    function resolveContentComponents2(body2, meta) {
      if (!body2) {
        return;
      }
      const components = Array.from(new Set(loadComponents(body2, meta)));
      const result = {};
      for (const [tag, component] of components) {
        if (result[tag]) {
          continue;
        }
        if (typeof component === "object" && renderFunctions.some((fn) => Object.hasOwnProperty.call(component, fn))) {
          result[tag] = component;
          continue;
        }
        result[tag] = resolveVueComponent(component);
      }
      return result;
    }
    function loadComponents(node, documentMeta) {
      const tag = node.tag;
      if (node.type === "text" || tag === "binding" || node.type === "comment") {
        return [];
      }
      const renderTag = findMappedTag2(node, documentMeta.tags);
      const components2 = [];
      if (node.type !== "root" && !htmlTags.includes(renderTag)) {
        components2.push([tag, renderTag]);
      }
      for (const child of node.children || []) {
        components2.push(...loadComponents(child, documentMeta));
      }
      return components2;
    }
    function findMappedTag2(node, tags2) {
      const tag = node.tag;
      if (!tag || typeof node.props?.__ignoreMap !== "undefined") {
        return tag;
      }
      return tags2[tag] || tags2[pascalCase(tag)] || tags2[kebabCase(node.tag)] || tag;
    }
    return (_ctx, _push, _parent, _attrs) => {
      if (!isEmpty.value) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_sfc_main$6, vueExports.mergeProps({
          body: body.value,
          data: data.value,
          class: props.class,
          tag: props.tag,
          prose: props.prose,
          unwrap: props.unwrap,
          components: componentsMap.value,
          "data-content-id": vueExports.unref(debug) ? __props.value.id : void 0
        }, _attrs), null, _parent));
      } else {
        serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "empty", {
          body: body.value,
          data: data.value,
          dataContentId: vueExports.unref(debug) ? __props.value.id : void 0
        }, null, _push, _parent);
      }
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/@nuxt+content@3.8.0_better-sqlite3@12.4.1_magicast@0.5.1/node_modules/@nuxt/content/dist/runtime/components/ContentRenderer.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_6 = Object.assign(_sfc_main$5, { __name: "ContentRenderer" });
const _sfc_main$4 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "Chip",
  __ssrInlineRender: true,
  props: {
    label: {},
    tokens: {}
  },
  setup(__props) {
    const styles = useTokenStyle(__props.tokens);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<span${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
        style: vueExports.unref(styles).chip,
        class: "f-chip"
      }, _attrs))}>`);
      serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "default", {}, () => {
        _push(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.label)}`);
      }, _push, _parent);
      _push(`</span>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../layers/blocks/app/components/Chip.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main$4, { __name: "Chip" });
const _sfc_main$3 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "Attribution",
  __ssrInlineRender: true,
  props: {
    author: {},
    published: {},
    tags: {},
    tokens: {}
  },
  setup(__props) {
    const styles = useTokenStyle(__props.tokens);
    const formattedDate = vueExports.computed(() => {
      if (!__props.published) return "";
      const date = new Date(__props.published);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_2$2;
      const _component_Group = __nuxt_component_3$1;
      const _component_Chip = __nuxt_component_2;
      if (__props.author || __props.published || __props.tags?.length) {
        _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
          style: vueExports.unref(styles)["attribution-root"],
          class: "f-attribution-root"
        }, _attrs))}><div style="${serverRenderer_cjs_prodExports.ssrRenderStyle(vueExports.unref(styles)["attribution-container"])}" class="f-attribution-container"><div style="${serverRenderer_cjs_prodExports.ssrRenderStyle(vueExports.unref(styles)["attribution-meta"])}" class="f-attribution-meta">`);
        if (__props.author) {
          _push(`<!--[-->`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, { alias: "user" }, null, _parent));
          _push(`<span style="${serverRenderer_cjs_prodExports.ssrRenderStyle(vueExports.unref(styles)["attribution-author"])}" class="f-attribution-author">${serverRenderer_cjs_prodExports.ssrInterpolate(__props.author)}</span><!--]-->`);
        } else {
          _push(`<!---->`);
        }
        if (__props.published) {
          _push(`<!--[-->`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, { alias: "calendar" }, null, _parent));
          _push(`<span style="${serverRenderer_cjs_prodExports.ssrRenderStyle(vueExports.unref(styles)["attribution-published"])}" class="f-attribution-published">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(formattedDate))}</span><!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (__props.tags?.length) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Group, { tokens: {
            group: {
              gap: "ref-spacing-xs",
              "flex-wrap": "ref-flex-wrap",
              "justify-content": "ref-align-end"
            }
          } }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<!--[-->`);
                serverRenderer_cjs_prodExports.ssrRenderList(__props.tags, (tag) => {
                  _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Chip, {
                    key: tag,
                    label: tag
                  }, null, _parent2, _scopeId));
                });
                _push2(`<!--]-->`);
              } else {
                return [
                  (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(__props.tags, (tag) => {
                    return vueExports.openBlock(), vueExports.createBlock(_component_Chip, {
                      key: tag,
                      label: tag
                    }, null, 8, ["label"]);
                  }), 128))
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../layers/prose/app/components/Attribution.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_7 = Object.assign(_sfc_main$3, { __name: "Attribution" });
const useContentSurround = (collection, path, options) => {
  const route = useRoute$1();
  const pathRef = vueExports.computed(() => vueExports.toValue(path) ?? route.path);
  const { data, pending, error } = useAsyncData(
    `surround-${pathRef.value}`,
    () => queryCollectionItemSurroundings(collection, pathRef.value, {
      fields: ["description"]
    }),
    { watch: [pathRef] }
  );
  const prev = vueExports.computed(() => data.value?.[0] ?? null);
  const next = vueExports.computed(() => data.value?.[1] ?? null);
  return {
    prev,
    next,
    pending,
    error
  };
};
const _sfc_main$2 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "Surround",
  __ssrInlineRender: true,
  props: {
    collection: {},
    path: {},
    prevLabel: { default: "Previous" },
    nextLabel: { default: "Next" },
    tokens: {}
  },
  setup(__props) {
    const { prev, next } = useContentSurround(__props.collection, __props.path);
    const styles = useTokenStyle(__props.tokens);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_Icon = __nuxt_component_2$2;
      if (vueExports.unref(prev) || vueExports.unref(next)) {
        _push(`<nav${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
          style: vueExports.unref(styles)["surround-root"],
          class: "f-surround-root"
        }, _attrs))}>`);
        if (vueExports.unref(prev)) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
            to: `/${__props.collection}${vueExports.unref(prev).path}`,
            style: vueExports.unref(styles)["surround-prev"],
            class: "f-surround-prev"
          }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<span style="${serverRenderer_cjs_prodExports.ssrRenderStyle(vueExports.unref(styles)["surround-label"])}" class="f-surround-label"${_scopeId}>`);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, { alias: "chevron-left" }, null, _parent2, _scopeId));
                _push2(` ${serverRenderer_cjs_prodExports.ssrInterpolate(__props.prevLabel)}</span><span style="${serverRenderer_cjs_prodExports.ssrRenderStyle(vueExports.unref(styles)["surround-title"])}" class="f-surround-title"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(prev).title)}</span>`);
                if (vueExports.unref(prev).description) {
                  _push2(`<span style="${serverRenderer_cjs_prodExports.ssrRenderStyle(vueExports.unref(styles)["surround-prev-description"])}" class="f-surround-prev-description"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(prev).description)}</span>`);
                } else {
                  _push2(`<!---->`);
                }
              } else {
                return [
                  vueExports.createVNode("span", {
                    style: vueExports.unref(styles)["surround-label"],
                    class: "f-surround-label"
                  }, [
                    vueExports.createVNode(_component_Icon, { alias: "chevron-left" }),
                    vueExports.createTextVNode(" " + vueExports.toDisplayString(__props.prevLabel), 1)
                  ], 4),
                  vueExports.createVNode("span", {
                    style: vueExports.unref(styles)["surround-title"],
                    class: "f-surround-title"
                  }, vueExports.toDisplayString(vueExports.unref(prev).title), 5),
                  vueExports.unref(prev).description ? (vueExports.openBlock(), vueExports.createBlock("span", {
                    key: 0,
                    style: vueExports.unref(styles)["surround-prev-description"],
                    class: "f-surround-prev-description"
                  }, vueExports.toDisplayString(vueExports.unref(prev).description), 5)) : vueExports.createCommentVNode("", true)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (vueExports.unref(next)) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
            to: `/${__props.collection}${vueExports.unref(next).path}`,
            style: vueExports.unref(styles)["surround-next"],
            class: "f-surround-next"
          }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<span style="${serverRenderer_cjs_prodExports.ssrRenderStyle(vueExports.unref(styles)["surround-label"])}" class="f-surround-label"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.nextLabel)} `);
                _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, { alias: "chevron-right" }, null, _parent2, _scopeId));
                _push2(`</span><span style="${serverRenderer_cjs_prodExports.ssrRenderStyle(vueExports.unref(styles)["surround-title"])}" class="f-surround-title"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(next).title)}</span>`);
                if (vueExports.unref(next).description) {
                  _push2(`<span style="${serverRenderer_cjs_prodExports.ssrRenderStyle(vueExports.unref(styles)["surround-next-description"])}" class="f-surround-next-description"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(next).description)}</span>`);
                } else {
                  _push2(`<!---->`);
                }
              } else {
                return [
                  vueExports.createVNode("span", {
                    style: vueExports.unref(styles)["surround-label"],
                    class: "f-surround-label"
                  }, [
                    vueExports.createTextVNode(vueExports.toDisplayString(__props.nextLabel) + " ", 1),
                    vueExports.createVNode(_component_Icon, { alias: "chevron-right" })
                  ], 4),
                  vueExports.createVNode("span", {
                    style: vueExports.unref(styles)["surround-title"],
                    class: "f-surround-title"
                  }, vueExports.toDisplayString(vueExports.unref(next).title), 5),
                  vueExports.unref(next).description ? (vueExports.openBlock(), vueExports.createBlock("span", {
                    key: 0,
                    style: vueExports.unref(styles)["surround-next-description"],
                    class: "f-surround-next-description"
                  }, vueExports.toDisplayString(vueExports.unref(next).description), 5)) : vueExports.createCommentVNode("", true)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</nav>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../layers/prose/app/components/Surround.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_8 = Object.assign(_sfc_main$2, { __name: "Surround" });
const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "Toc",
  __ssrInlineRender: true,
  props: {
    links: {},
    title: { default: "On this page" },
    tokens: {}
  },
  setup(__props) {
    const styles = useTokenStyle(__props.tokens);
    const flatLinks = vueExports.computed(() => {
      const flatten2 = (items) => {
        return items.flatMap((item) => [
          { id: item.id, text: item.text, depth: item.depth },
          ...item.children ? flatten2(item.children) : []
        ]);
      };
      return flatten2(__props.links);
    });
    const activeId = vueExports.ref("");
    vueExports.ref(/* @__PURE__ */ new Set());
    const getItemStyle = (depth) => {
      const baseStyle = styles.value["toc-item"] || {};
      const depthPadding = `calc(1rem * ${depth - 2})`;
      return {
        ...baseStyle,
        paddingLeft: `calc(${baseStyle.paddingLeft || "1rem"} + ${depthPadding})`
      };
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Caption = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<nav${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
        style: vueExports.unref(styles)["toc-root"],
        class: "f-toc-root"
      }, _attrs))}>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Caption, {
        icon: "toc",
        tokens: __props.tokens
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.title)}`);
          } else {
            return [
              vueExports.createTextVNode(vueExports.toDisplayString(__props.title), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div style="${serverRenderer_cjs_prodExports.ssrRenderStyle(vueExports.unref(styles)["toc-content"])}" class="f-toc-content"><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(flatLinks), (link) => {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
          key: link.id,
          to: `#${link.id}`,
          "aria-selected": vueExports.unref(activeId) === link.id,
          style: getItemStyle(link.depth),
          class: "f-toc-item"
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "item", { link }, () => {
                _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(link.text)}`);
              }, _push2, _parent2, _scopeId);
            } else {
              return [
                vueExports.renderSlot(_ctx.$slots, "item", { link }, () => [
                  vueExports.createTextVNode(vueExports.toDisplayString(link.text), 1)
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></nav>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../layers/prose/app/components/Toc.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_9 = Object.assign(_sfc_main$1, { __name: "Toc" });
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "[...article]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute$1();
    const appConfig = useAppConfig();
    const collection = vueExports.computed(() => route.params.collection);
    const articlePath = vueExports.computed(() => {
      const segments = route.params.article;
      return "/" + (segments?.join("/") || "");
    });
    const collectionConfig = vueExports.computed(
      () => appConfig.collections?.find(
        (c) => c.key === collection.value
      )
    );
    const { data: content } = ([__temp, __restore] = vueExports.withAsyncContext(() => useAsyncData(
      `content-${collection.value}-${articlePath.value}`,
      () => queryCollection(collection.value).path(articlePath.value).first()
    )), __temp = await __temp, __restore(), __temp);
    const breadcrumbs = vueExports.computed(() => {
      const items = [];
      items.push({
        label: collectionConfig.value?.title || collection.value,
        to: `/${collection.value}`
      });
      if (content.value) {
        items.push({
          label: content.value.title
        });
      }
      return items;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Nav = __nuxt_component_1$1;
      const _component_Aside = __nuxt_component_1$2;
      const _component_ContentTree = __nuxt_component_2$1;
      const _component_Section = __nuxt_component_3;
      const _component_Breadcrumbs = __nuxt_component_4;
      const _component_Article = __nuxt_component_5;
      const _component_ContentRenderer = __nuxt_component_6;
      const _component_Attribution = __nuxt_component_7;
      const _component_Surround = __nuxt_component_8;
      const _component_Toc = __nuxt_component_9;
      _push(`<!--[-->`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Nav, { tokens: {
        nav: {
          "border-right-width": "ref-hairline",
          "border-right-style": "ref-border-style-solid",
          "border-color": "sys-outline"
        }
      } }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Aside, null, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ContentTree, {
                    collection: vueExports.unref(collection)
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_ContentTree, {
                      collection: vueExports.unref(collection)
                    }, null, 8, ["collection"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_Aside, null, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_ContentTree, {
                    collection: vueExports.unref(collection)
                  }, null, 8, ["collection"])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Section, null, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Breadcrumbs, { items: vueExports.unref(breadcrumbs) }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Article, null, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (vueExports.unref(content)) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ContentRenderer, { value: vueExports.unref(content) }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    vueExports.unref(content) ? (vueExports.openBlock(), vueExports.createBlock(_component_ContentRenderer, {
                      key: 0,
                      value: vueExports.unref(content)
                    }, null, 8, ["value"])) : vueExports.createCommentVNode("", true)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (vueExports.unref(content)) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Attribution, {
                author: vueExports.unref(content).author,
                published: vueExports.unref(content).published,
                tags: vueExports.unref(content).tags
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Surround, {
              collection: vueExports.unref(collection),
              path: vueExports.unref(articlePath)
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_Breadcrumbs, { items: vueExports.unref(breadcrumbs) }, null, 8, ["items"]),
              vueExports.createVNode(_component_Article, null, {
                default: vueExports.withCtx(() => [
                  vueExports.unref(content) ? (vueExports.openBlock(), vueExports.createBlock(_component_ContentRenderer, {
                    key: 0,
                    value: vueExports.unref(content)
                  }, null, 8, ["value"])) : vueExports.createCommentVNode("", true)
                ]),
                _: 1
              }),
              vueExports.unref(content) ? (vueExports.openBlock(), vueExports.createBlock(_component_Attribution, {
                key: 0,
                author: vueExports.unref(content).author,
                published: vueExports.unref(content).published,
                tags: vueExports.unref(content).tags
              }, null, 8, ["author", "published", "tags"])) : vueExports.createCommentVNode("", true),
              vueExports.createVNode(_component_Surround, {
                collection: vueExports.unref(collection),
                path: vueExports.unref(articlePath)
              }, null, 8, ["collection", "path"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Nav, { tokens: {
        nav: {
          "border-left-width": "ref-hairline",
          "border-left-style": "ref-border-style-solid",
          "border-color": "sys-outline"
        }
      } }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Aside, null, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (vueExports.unref(content)?.body?.toc?.links) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Toc, {
                      links: vueExports.unref(content).body.toc.links
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    vueExports.unref(content)?.body?.toc?.links ? (vueExports.openBlock(), vueExports.createBlock(_component_Toc, {
                      key: 0,
                      links: vueExports.unref(content).body.toc.links
                    }, null, 8, ["links"])) : vueExports.createCommentVNode("", true)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_Aside, null, {
                default: vueExports.withCtx(() => [
                  vueExports.unref(content)?.body?.toc?.links ? (vueExports.openBlock(), vueExports.createBlock(_component_Toc, {
                    key: 0,
                    links: vueExports.unref(content).body.toc.links
                  }, null, 8, ["links"])) : vueExports.createCommentVNode("", true)
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[collection]/[...article].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_...article_-Dwwloxm1.mjs.map
