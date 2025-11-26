import { _ as __nuxt_component_1, a as __nuxt_component_2$1, b as __nuxt_component_3$2, u as useDirection, c as useCollection, P as Primitive, d as useId, g as getActiveElement, e as usePrimitiveElement } from './Group-pXYCZuBY.mjs';
import { u as useAppConfig, _ as __nuxt_component_1$1, a as __nuxt_component_5$1, b as __nuxt_component_0$2, c as useAsyncData, q as queryCollection, d as useTypeahead, h as handleAndDispatchCustomEvent } from './client-D6Jbai72.mjs';
import { v as vueExports, h as useRoute$1, s as serverRenderer_cjs_prodExports, g as useTokenStyle, b as useVModel, d as useForwardExpose, f as useFocusWithin, c as createContext, t as toValue, a as unrefElement, e as useResizeObserver } from './server.mjs';
import { u as useArrowNavigation, P as PopperRoot_default, a as PopperAnchor_default, b as useForwardPropsEmits, c as Presence_default, V as VisuallyHidden_default, d as useBodyScrollLock, e as useHideOthers, f as useForwardProps, F as FocusScope_default, D as DismissableLayer_default, g as focusFirst, h as PopperContent_default } from './PopperContent-BW9NCRPQ.mjs';
import { _ as __nuxt_component_3$1 } from './Section-9Z3cyJCG.mjs';
import { _ as __nuxt_component_0 } from './H1-Cdbb55Nq.mjs';
import { _ as __nuxt_component_0$1 } from './P-DDZ97RQ5.mjs';
import { _ as __nuxt_component_0$3 } from './nuxt-link-Df9NoxNv.mjs';
import { t as isEqual } from '../nitro/nitro.mjs';
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

function clamp(value, min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY) {
  return Math.min(max, Math.max(min, value));
}
function isNullish(value) {
  return value === null || value === void 0;
}
function useFocusGuards() {
  vueExports.watchEffect((cleanupFn) => {
    return;
  });
}
function useFormControl(el) {
  return vueExports.computed(() => toValue(el) ? Boolean(unrefElement(el)?.closest("form")) : true);
}
var VisuallyHiddenInputBubble_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  inheritAttrs: false,
  __name: "VisuallyHiddenInputBubble",
  props: {
    name: {
      type: String,
      required: true
    },
    value: {
      type: null,
      required: true
    },
    checked: {
      type: Boolean,
      required: false,
      default: void 0
    },
    required: {
      type: Boolean,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false
    },
    feature: {
      type: String,
      required: false,
      default: "fully-hidden"
    }
  },
  setup(__props) {
    const props = __props;
    const { primitiveElement, currentElement } = usePrimitiveElement();
    const valueState = vueExports.computed(() => props.checked ?? props.value);
    vueExports.watch(valueState, (cur, prev) => {
      if (!currentElement.value) return;
      const input = currentElement.value;
      const inputProto = (void 0).HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(inputProto, "value");
      const setValue = descriptor.set;
      if (setValue && cur !== prev) {
        const inputEvent = new Event("input", { bubbles: true });
        const changeEvent = new Event("change", { bubbles: true });
        setValue.call(input, cur);
        input.dispatchEvent(inputEvent);
        input.dispatchEvent(changeEvent);
      }
    });
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(VisuallyHidden_default, vueExports.mergeProps({
        ref_key: "primitiveElement",
        ref: primitiveElement
      }, {
        ...props,
        ..._ctx.$attrs
      }, { as: "input" }), null, 16);
    };
  }
});
var VisuallyHiddenInputBubble_default = VisuallyHiddenInputBubble_vue_vue_type_script_setup_true_lang_default;
var VisuallyHiddenInput_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  inheritAttrs: false,
  __name: "VisuallyHiddenInput",
  props: {
    name: {
      type: String,
      required: true
    },
    value: {
      type: null,
      required: true
    },
    checked: {
      type: Boolean,
      required: false,
      default: void 0
    },
    required: {
      type: Boolean,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false
    },
    feature: {
      type: String,
      required: false,
      default: "fully-hidden"
    }
  },
  setup(__props) {
    const props = __props;
    const isFormArrayEmptyAndRequired = vueExports.computed(() => typeof props.value === "object" && Array.isArray(props.value) && props.value.length === 0 && props.required);
    const parsedValue = vueExports.computed(() => {
      if (typeof props.value === "string" || typeof props.value === "number" || typeof props.value === "boolean" || props.value === null || props.value === void 0) return [{
        name: props.name,
        value: props.value
      }];
      else if (typeof props.value === "object" && Array.isArray(props.value)) return props.value.flatMap((obj, index) => {
        if (typeof obj === "object") return Object.entries(obj).map(([key, value]) => ({
          name: `${props.name}[${index}][${key}]`,
          value
        }));
        else return {
          name: `${props.name}[${index}]`,
          value: obj
        };
      });
      else if (props.value !== null && typeof props.value === "object" && !Array.isArray(props.value)) return Object.entries(props.value).map(([key, value]) => ({
        name: `${props.name}[${key}]`,
        value
      }));
      return [];
    });
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createElementBlock(vueExports.Fragment, null, [vueExports.createCommentVNode(" We render single input if it's required "), isFormArrayEmptyAndRequired.value ? (vueExports.openBlock(), vueExports.createBlock(VisuallyHiddenInputBubble_default, vueExports.mergeProps({ key: _ctx.name }, {
        ...props,
        ..._ctx.$attrs
      }, {
        name: _ctx.name,
        value: _ctx.value
      }), null, 16, ["name", "value"])) : (vueExports.openBlock(true), vueExports.createElementBlock(vueExports.Fragment, { key: 1 }, vueExports.renderList(parsedValue.value, (parsed) => {
        return vueExports.openBlock(), vueExports.createBlock(VisuallyHiddenInputBubble_default, vueExports.mergeProps({ key: parsed.name }, { ref_for: true }, {
          ...props,
          ..._ctx.$attrs
        }, {
          name: parsed.name,
          value: parsed.value
        }), null, 16, ["name", "value"]);
      }), 128))], 2112);
    };
  }
});
var VisuallyHiddenInput_default = VisuallyHiddenInput_vue_vue_type_script_setup_true_lang_default;
const OPEN_KEYS = [
  " ",
  "Enter",
  "ArrowUp",
  "ArrowDown"
];
const SELECTION_KEYS = [" ", "Enter"];
const CONTENT_MARGIN = 10;
function valueComparator(value, currentValue, comparator) {
  if (value === void 0) return false;
  else if (Array.isArray(value)) return value.some((val) => compare(val, currentValue, comparator));
  else return compare(value, currentValue, comparator);
}
function compare(value, currentValue, comparator) {
  if (value === void 0 || currentValue === void 0) return false;
  if (typeof value === "string") return value === currentValue;
  if (typeof comparator === "function") return comparator(value, currentValue);
  if (typeof comparator === "string") return value?.[comparator] === currentValue?.[comparator];
  return isEqual(value, currentValue);
}
function shouldShowPlaceholder(value) {
  return value === void 0 || value === null || value === "" || Array.isArray(value) && value.length === 0;
}
const _hoisted_1$1 = {
  key: 0,
  value: ""
};
const [injectSelectRootContext, provideSelectRootContext] = createContext("SelectRoot");
var SelectRoot_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  inheritAttrs: false,
  __name: "SelectRoot",
  props: {
    open: {
      type: Boolean,
      required: false,
      default: void 0
    },
    defaultOpen: {
      type: Boolean,
      required: false
    },
    defaultValue: {
      type: null,
      required: false
    },
    modelValue: {
      type: null,
      required: false,
      default: void 0
    },
    by: {
      type: [String, Function],
      required: false
    },
    dir: {
      type: String,
      required: false
    },
    multiple: {
      type: Boolean,
      required: false
    },
    autocomplete: {
      type: String,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false
    },
    name: {
      type: String,
      required: false
    },
    required: {
      type: Boolean,
      required: false
    }
  },
  emits: ["update:modelValue", "update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { required, disabled, multiple, dir: propDir } = vueExports.toRefs(props);
    const modelValue = useVModel(props, "modelValue", emits, {
      defaultValue: props.defaultValue ?? (multiple.value ? [] : void 0),
      passive: props.modelValue === void 0,
      deep: true
    });
    const open = useVModel(props, "open", emits, {
      defaultValue: props.defaultOpen,
      passive: props.open === void 0
    });
    const triggerElement = vueExports.ref();
    const valueElement = vueExports.ref();
    const triggerPointerDownPosRef = vueExports.ref({
      x: 0,
      y: 0
    });
    const isEmptyModelValue = vueExports.computed(() => {
      if (multiple.value && Array.isArray(modelValue.value)) return modelValue.value?.length === 0;
      else return isNullish(modelValue.value);
    });
    useCollection({ isProvider: true });
    const dir = useDirection(propDir);
    const isFormControl = useFormControl(triggerElement);
    const optionsSet = vueExports.ref(/* @__PURE__ */ new Set());
    const nativeSelectKey = vueExports.computed(() => {
      return Array.from(optionsSet.value).map((option) => option.value).join(";");
    });
    function handleValueChange(value) {
      if (multiple.value) {
        const array = Array.isArray(modelValue.value) ? [...modelValue.value] : [];
        const index = array.findIndex((i) => compare(i, value, props.by));
        index === -1 ? array.push(value) : array.splice(index, 1);
        modelValue.value = [...array];
      } else modelValue.value = value;
    }
    function getOption(value) {
      return Array.from(optionsSet.value).find((option) => valueComparator(value, option.value, props.by));
    }
    provideSelectRootContext({
      triggerElement,
      onTriggerChange: (node) => {
        triggerElement.value = node;
      },
      valueElement,
      onValueElementChange: (node) => {
        valueElement.value = node;
      },
      contentId: "",
      modelValue,
      onValueChange: handleValueChange,
      by: props.by,
      open,
      multiple,
      required,
      onOpenChange: (value) => {
        open.value = value;
      },
      dir,
      triggerPointerDownPosRef,
      disabled,
      isEmptyModelValue,
      optionsSet,
      onOptionAdd: (option) => {
        const existingOption = getOption(option.value);
        if (existingOption) optionsSet.value.delete(existingOption);
        optionsSet.value.add(option);
      },
      onOptionRemove: (option) => {
        const existingOption = getOption(option.value);
        if (existingOption) optionsSet.value.delete(existingOption);
      }
    });
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(PopperRoot_default), null, {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default", {
          modelValue: vueExports.unref(modelValue),
          open: vueExports.unref(open)
        }), vueExports.unref(isFormControl) ? (vueExports.openBlock(), vueExports.createBlock(BubbleSelect_default, {
          key: nativeSelectKey.value,
          "aria-hidden": "true",
          tabindex: "-1",
          multiple: vueExports.unref(multiple),
          required: vueExports.unref(required),
          name: _ctx.name,
          autocomplete: _ctx.autocomplete,
          disabled: vueExports.unref(disabled),
          value: vueExports.unref(modelValue)
        }, {
          default: vueExports.withCtx(() => [vueExports.unref(isNullish)(vueExports.unref(modelValue)) ? (vueExports.openBlock(), vueExports.createElementBlock("option", _hoisted_1$1)) : vueExports.createCommentVNode("v-if", true), (vueExports.openBlock(true), vueExports.createElementBlock(vueExports.Fragment, null, vueExports.renderList(Array.from(optionsSet.value), (option) => {
            return vueExports.openBlock(), vueExports.createElementBlock("option", vueExports.mergeProps({ key: option.value ?? "" }, { ref_for: true }, option), null, 16);
          }), 128))]),
          _: 1
        }, 8, [
          "multiple",
          "required",
          "name",
          "autocomplete",
          "disabled",
          "value"
        ])) : vueExports.createCommentVNode("v-if", true)]),
        _: 3
      });
    };
  }
});
var SelectRoot_default = SelectRoot_vue_vue_type_script_setup_true_lang_default;
var BubbleSelect_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "BubbleSelect",
  props: {
    autocomplete: {
      type: String,
      required: false
    },
    autofocus: {
      type: Boolean,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false
    },
    form: {
      type: String,
      required: false
    },
    multiple: {
      type: Boolean,
      required: false
    },
    name: {
      type: String,
      required: false
    },
    required: {
      type: Boolean,
      required: false
    },
    size: {
      type: Number,
      required: false
    },
    value: {
      type: null,
      required: false
    }
  },
  setup(__props) {
    const props = __props;
    const selectElement = vueExports.ref();
    const rootContext = injectSelectRootContext();
    vueExports.watch(() => props.value, (cur, prev) => {
      const selectProto = (void 0).HTMLSelectElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(selectProto, "value");
      const setValue = descriptor.set;
      if (cur !== prev && setValue && selectElement.value) {
        const event = new Event("change", { bubbles: true });
        setValue.call(selectElement.value, cur);
        selectElement.value.dispatchEvent(event);
      }
    });
    function handleInput(event) {
      rootContext.onValueChange(event.target.value);
    }
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(VisuallyHidden_default), { "as-child": "" }, {
        default: vueExports.withCtx(() => [vueExports.createElementVNode("select", vueExports.mergeProps({
          ref_key: "selectElement",
          ref: selectElement
        }, props, { onInput: handleInput }), [vueExports.renderSlot(_ctx.$slots, "default")], 16)]),
        _: 3
      });
    };
  }
});
var BubbleSelect_default = BubbleSelect_vue_vue_type_script_setup_true_lang_default;
var SelectPopperPosition_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "SelectPopperPosition",
  props: {
    side: {
      type: null,
      required: false
    },
    sideOffset: {
      type: Number,
      required: false
    },
    sideFlip: {
      type: Boolean,
      required: false
    },
    align: {
      type: null,
      required: false,
      default: "start"
    },
    alignOffset: {
      type: Number,
      required: false
    },
    alignFlip: {
      type: Boolean,
      required: false
    },
    avoidCollisions: {
      type: Boolean,
      required: false
    },
    collisionBoundary: {
      type: null,
      required: false
    },
    collisionPadding: {
      type: [Number, Object],
      required: false,
      default: CONTENT_MARGIN
    },
    arrowPadding: {
      type: Number,
      required: false
    },
    sticky: {
      type: String,
      required: false
    },
    hideWhenDetached: {
      type: Boolean,
      required: false
    },
    positionStrategy: {
      type: String,
      required: false
    },
    updatePositionStrategy: {
      type: String,
      required: false
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: false
    },
    prioritizePosition: {
      type: Boolean,
      required: false
    },
    reference: {
      type: null,
      required: false
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
  setup(__props) {
    const props = __props;
    const forwarded = useForwardProps(props);
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(PopperContent_default), vueExports.mergeProps(vueExports.unref(forwarded), { style: {
        "boxSizing": "border-box",
        "--reka-select-content-transform-origin": "var(--reka-popper-transform-origin)",
        "--reka-select-content-available-width": "var(--reka-popper-available-width)",
        "--reka-select-content-available-height": "var(--reka-popper-available-height)",
        "--reka-select-trigger-width": "var(--reka-popper-anchor-width)",
        "--reka-select-trigger-height": "var(--reka-popper-anchor-height)"
      } }), {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var SelectPopperPosition_default = SelectPopperPosition_vue_vue_type_script_setup_true_lang_default;
const SelectContentDefaultContextValue = {
  onViewportChange: () => {
  },
  itemTextRefCallback: () => {
  },
  itemRefCallback: () => {
  }
};
const [injectSelectContentContext, provideSelectContentContext] = createContext("SelectContent");
var SelectContentImpl_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "SelectContentImpl",
  props: {
    position: {
      type: String,
      required: false,
      default: "item-aligned"
    },
    bodyLock: {
      type: Boolean,
      required: false,
      default: true
    },
    side: {
      type: null,
      required: false
    },
    sideOffset: {
      type: Number,
      required: false
    },
    sideFlip: {
      type: Boolean,
      required: false
    },
    align: {
      type: null,
      required: false,
      default: "start"
    },
    alignOffset: {
      type: Number,
      required: false
    },
    alignFlip: {
      type: Boolean,
      required: false
    },
    avoidCollisions: {
      type: Boolean,
      required: false
    },
    collisionBoundary: {
      type: null,
      required: false
    },
    collisionPadding: {
      type: [Number, Object],
      required: false
    },
    arrowPadding: {
      type: Number,
      required: false
    },
    sticky: {
      type: String,
      required: false
    },
    hideWhenDetached: {
      type: Boolean,
      required: false
    },
    positionStrategy: {
      type: String,
      required: false
    },
    updatePositionStrategy: {
      type: String,
      required: false
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: false
    },
    prioritizePosition: {
      type: Boolean,
      required: false
    },
    reference: {
      type: null,
      required: false
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
  emits: [
    "closeAutoFocus",
    "escapeKeyDown",
    "pointerDownOutside"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const rootContext = injectSelectRootContext();
    useFocusGuards();
    useBodyScrollLock(props.bodyLock);
    const { CollectionSlot, getItems } = useCollection();
    const content = vueExports.ref();
    useHideOthers(content);
    const { search, handleTypeaheadSearch } = useTypeahead();
    const viewport = vueExports.ref();
    const selectedItem = vueExports.ref();
    const selectedItemText = vueExports.ref();
    const isPositioned = vueExports.ref(false);
    const firstValidItemFoundRef = vueExports.ref(false);
    const firstSelectedItemInArrayFoundRef = vueExports.ref(false);
    function focusSelectedItem() {
      if (selectedItem.value && content.value) focusFirst([selectedItem.value, content.value]);
    }
    vueExports.watch(isPositioned, () => {
      focusSelectedItem();
    });
    const { onOpenChange, triggerPointerDownPosRef } = rootContext;
    vueExports.watchEffect((cleanupFn) => {
      if (!content.value) return;
      let pointerMoveDelta = {
        x: 0,
        y: 0
      };
      const handlePointerMove = (event) => {
        pointerMoveDelta = {
          x: Math.abs(Math.round(event.pageX) - (triggerPointerDownPosRef.value?.x ?? 0)),
          y: Math.abs(Math.round(event.pageY) - (triggerPointerDownPosRef.value?.y ?? 0))
        };
      };
      const handlePointerUp = (event) => {
        if (event.pointerType === "touch") return;
        if (pointerMoveDelta.x <= 10 && pointerMoveDelta.y <= 10) event.preventDefault();
        else if (!content.value?.contains(event.target)) onOpenChange(false);
        (void 0).removeEventListener("pointermove", handlePointerMove);
        triggerPointerDownPosRef.value = null;
      };
      if (triggerPointerDownPosRef.value !== null) {
        (void 0).addEventListener("pointermove", handlePointerMove);
        (void 0).addEventListener("pointerup", handlePointerUp, {
          capture: true,
          once: true
        });
      }
      cleanupFn(() => {
        (void 0).removeEventListener("pointermove", handlePointerMove);
        (void 0).removeEventListener("pointerup", handlePointerUp, { capture: true });
      });
    });
    function handleKeyDown(event) {
      const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
      if (event.key === "Tab") event.preventDefault();
      if (!isModifierKey && event.key.length === 1) handleTypeaheadSearch(event.key, getItems());
      if ([
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End"
      ].includes(event.key)) {
        const collectionItems = getItems().map((i) => i.ref);
        let candidateNodes = [...collectionItems];
        if (["ArrowUp", "End"].includes(event.key)) candidateNodes = candidateNodes.slice().reverse();
        if (["ArrowUp", "ArrowDown"].includes(event.key)) {
          const currentElement = event.target;
          const currentIndex = candidateNodes.indexOf(currentElement);
          candidateNodes = candidateNodes.slice(currentIndex + 1);
        }
        setTimeout(() => focusFirst(candidateNodes));
        event.preventDefault();
      }
    }
    const pickedProps = vueExports.computed(() => {
      if (props.position === "popper") return props;
      else return {};
    });
    const forwardedProps = useForwardProps(pickedProps.value);
    provideSelectContentContext({
      content,
      viewport,
      onViewportChange: (node) => {
        viewport.value = node;
      },
      itemRefCallback: (node, value, disabled) => {
        const isFirstValidItem = !firstValidItemFoundRef.value && !disabled;
        const isSelectedItem = valueComparator(rootContext.modelValue.value, value, rootContext.by);
        if (rootContext.multiple.value) {
          if (firstSelectedItemInArrayFoundRef.value) return;
          if (isSelectedItem || isFirstValidItem) {
            selectedItem.value = node;
            if (isSelectedItem) firstSelectedItemInArrayFoundRef.value = true;
          }
        } else if (isSelectedItem || isFirstValidItem) selectedItem.value = node;
        if (isFirstValidItem) firstValidItemFoundRef.value = true;
      },
      selectedItem,
      selectedItemText,
      onItemLeave: () => {
        content.value?.focus();
      },
      itemTextRefCallback: (node, value, disabled) => {
        const isFirstValidItem = !firstValidItemFoundRef.value && !disabled;
        const isSelectedItem = valueComparator(rootContext.modelValue.value, value, rootContext.by);
        if (isSelectedItem || isFirstValidItem) selectedItemText.value = node;
      },
      focusSelectedItem,
      position: props.position,
      isPositioned,
      searchRef: search
    });
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(CollectionSlot), null, {
        default: vueExports.withCtx(() => [vueExports.createVNode(vueExports.unref(FocusScope_default), {
          "as-child": "",
          onMountAutoFocus: _cache[6] || (_cache[6] = vueExports.withModifiers(() => {
          }, ["prevent"])),
          onUnmountAutoFocus: _cache[7] || (_cache[7] = (event) => {
            emits("closeAutoFocus", event);
            if (event.defaultPrevented) return;
            vueExports.unref(rootContext).triggerElement.value?.focus({ preventScroll: true });
            event.preventDefault();
          })
        }, {
          default: vueExports.withCtx(() => [vueExports.createVNode(vueExports.unref(DismissableLayer_default), {
            "as-child": "",
            "disable-outside-pointer-events": "",
            onFocusOutside: _cache[2] || (_cache[2] = vueExports.withModifiers(() => {
            }, ["prevent"])),
            onDismiss: _cache[3] || (_cache[3] = ($event) => vueExports.unref(rootContext).onOpenChange(false)),
            onEscapeKeyDown: _cache[4] || (_cache[4] = ($event) => emits("escapeKeyDown", $event)),
            onPointerDownOutside: _cache[5] || (_cache[5] = ($event) => emits("pointerDownOutside", $event))
          }, {
            default: vueExports.withCtx(() => [(vueExports.openBlock(), vueExports.createBlock(vueExports.resolveDynamicComponent(_ctx.position === "popper" ? SelectPopperPosition_default : SelectItemAlignedPosition_default), vueExports.mergeProps({
              ..._ctx.$attrs,
              ...vueExports.unref(forwardedProps)
            }, {
              id: vueExports.unref(rootContext).contentId,
              ref: (vnode) => {
                const el = vueExports.unref(unrefElement)(vnode);
                if (el?.hasAttribute("data-reka-popper-content-wrapper")) content.value = el.firstElementChild;
                else content.value = el;
                return void 0;
              },
              role: "listbox",
              "data-state": vueExports.unref(rootContext).open.value ? "open" : "closed",
              dir: vueExports.unref(rootContext).dir.value,
              style: {
                display: "flex",
                flexDirection: "column",
                outline: "none"
              },
              onContextmenu: _cache[0] || (_cache[0] = vueExports.withModifiers(() => {
              }, ["prevent"])),
              onPlaced: _cache[1] || (_cache[1] = ($event) => isPositioned.value = true),
              onKeydown: handleKeyDown
            }), {
              default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
              _: 3
            }, 16, [
              "id",
              "data-state",
              "dir",
              "onKeydown"
            ]))]),
            _: 3
          })]),
          _: 3
        })]),
        _: 3
      });
    };
  }
});
var SelectContentImpl_default = SelectContentImpl_vue_vue_type_script_setup_true_lang_default;
const [injectSelectItemAlignedPositionContext, provideSelectItemAlignedPositionContext] = createContext("SelectItemAlignedPosition");
var SelectItemAlignedPosition_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  inheritAttrs: false,
  __name: "SelectItemAlignedPosition",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    }
  },
  emits: ["placed"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { getItems } = useCollection();
    const rootContext = injectSelectRootContext();
    const contentContext = injectSelectContentContext();
    const shouldExpandOnScrollRef = vueExports.ref(false);
    const shouldRepositionRef = vueExports.ref(true);
    const contentWrapperElement = vueExports.ref();
    const { forwardRef, currentElement: contentElement } = useForwardExpose();
    const { viewport, selectedItem, selectedItemText, focusSelectedItem } = contentContext;
    function position() {
      if (rootContext.triggerElement.value && rootContext.valueElement.value && contentWrapperElement.value && contentElement.value && viewport?.value && selectedItem?.value && selectedItemText?.value) {
        const triggerRect = rootContext.triggerElement.value.getBoundingClientRect();
        const contentRect = contentElement.value.getBoundingClientRect();
        const valueNodeRect = rootContext.valueElement.value.getBoundingClientRect();
        const itemTextRect = selectedItemText.value.getBoundingClientRect();
        if (rootContext.dir.value !== "rtl") {
          const itemTextOffset = itemTextRect.left - contentRect.left;
          const left = valueNodeRect.left - itemTextOffset;
          const leftDelta = triggerRect.left - left;
          const minContentWidth = triggerRect.width + leftDelta;
          const contentWidth = Math.max(minContentWidth, contentRect.width);
          const rightEdge = (void 0).innerWidth - CONTENT_MARGIN;
          const clampedLeft = clamp(left, CONTENT_MARGIN, Math.max(CONTENT_MARGIN, rightEdge - contentWidth));
          contentWrapperElement.value.style.minWidth = `${minContentWidth}px`;
          contentWrapperElement.value.style.left = `${clampedLeft}px`;
        } else {
          const itemTextOffset = contentRect.right - itemTextRect.right;
          const right = (void 0).innerWidth - valueNodeRect.right - itemTextOffset;
          const rightDelta = (void 0).innerWidth - triggerRect.right - right;
          const minContentWidth = triggerRect.width + rightDelta;
          const contentWidth = Math.max(minContentWidth, contentRect.width);
          const leftEdge = (void 0).innerWidth - CONTENT_MARGIN;
          const clampedRight = clamp(right, CONTENT_MARGIN, Math.max(CONTENT_MARGIN, leftEdge - contentWidth));
          contentWrapperElement.value.style.minWidth = `${minContentWidth}px`;
          contentWrapperElement.value.style.right = `${clampedRight}px`;
        }
        const items = getItems().map((i) => i.ref);
        const availableHeight = (void 0).innerHeight - CONTENT_MARGIN * 2;
        const itemsHeight = viewport.value.scrollHeight;
        const contentStyles = (void 0).getComputedStyle(contentElement.value);
        const contentBorderTopWidth = Number.parseInt(contentStyles.borderTopWidth, 10);
        const contentPaddingTop = Number.parseInt(contentStyles.paddingTop, 10);
        const contentBorderBottomWidth = Number.parseInt(contentStyles.borderBottomWidth, 10);
        const contentPaddingBottom = Number.parseInt(contentStyles.paddingBottom, 10);
        const fullContentHeight = contentBorderTopWidth + contentPaddingTop + itemsHeight + contentPaddingBottom + contentBorderBottomWidth;
        const minContentHeight = Math.min(selectedItem.value.offsetHeight * 5, fullContentHeight);
        const viewportStyles = (void 0).getComputedStyle(viewport.value);
        const viewportPaddingTop = Number.parseInt(viewportStyles.paddingTop, 10);
        const viewportPaddingBottom = Number.parseInt(viewportStyles.paddingBottom, 10);
        const topEdgeToTriggerMiddle = triggerRect.top + triggerRect.height / 2 - CONTENT_MARGIN;
        const triggerMiddleToBottomEdge = availableHeight - topEdgeToTriggerMiddle;
        const selectedItemHalfHeight = selectedItem.value.offsetHeight / 2;
        const itemOffsetMiddle = selectedItem.value.offsetTop + selectedItemHalfHeight;
        const contentTopToItemMiddle = contentBorderTopWidth + contentPaddingTop + itemOffsetMiddle;
        const itemMiddleToContentBottom = fullContentHeight - contentTopToItemMiddle;
        const willAlignWithoutTopOverflow = contentTopToItemMiddle <= topEdgeToTriggerMiddle;
        if (willAlignWithoutTopOverflow) {
          const isLastItem = selectedItem.value === items[items.length - 1];
          contentWrapperElement.value.style.bottom = `0px`;
          const viewportOffsetBottom = contentElement.value.clientHeight - viewport.value.offsetTop - viewport.value.offsetHeight;
          const clampedTriggerMiddleToBottomEdge = Math.max(triggerMiddleToBottomEdge, selectedItemHalfHeight + (isLastItem ? viewportPaddingBottom : 0) + viewportOffsetBottom + contentBorderBottomWidth);
          const height = contentTopToItemMiddle + clampedTriggerMiddleToBottomEdge;
          contentWrapperElement.value.style.height = `${height}px`;
        } else {
          const isFirstItem = selectedItem.value === items[0];
          contentWrapperElement.value.style.top = `0px`;
          const clampedTopEdgeToTriggerMiddle = Math.max(topEdgeToTriggerMiddle, contentBorderTopWidth + viewport.value.offsetTop + (isFirstItem ? viewportPaddingTop : 0) + selectedItemHalfHeight);
          const height = clampedTopEdgeToTriggerMiddle + itemMiddleToContentBottom;
          contentWrapperElement.value.style.height = `${height}px`;
          viewport.value.scrollTop = contentTopToItemMiddle - topEdgeToTriggerMiddle + viewport.value.offsetTop;
        }
        contentWrapperElement.value.style.margin = `${CONTENT_MARGIN}px 0`;
        contentWrapperElement.value.style.minHeight = `${minContentHeight}px`;
        contentWrapperElement.value.style.maxHeight = `${availableHeight}px`;
        emits("placed");
        requestAnimationFrame(() => shouldExpandOnScrollRef.value = true);
      }
    }
    const contentZIndex = vueExports.ref("");
    function handleScrollButtonChange(node) {
      if (node && shouldRepositionRef.value === true) {
        position();
        focusSelectedItem?.();
        shouldRepositionRef.value = false;
      }
    }
    useResizeObserver(rootContext.triggerElement, () => {
      position();
    });
    provideSelectItemAlignedPositionContext({
      contentWrapper: contentWrapperElement,
      shouldExpandOnScrollRef,
      onScrollButtonChange: handleScrollButtonChange
    });
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createElementBlock("div", {
        ref_key: "contentWrapperElement",
        ref: contentWrapperElement,
        style: vueExports.normalizeStyle({
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          zIndex: contentZIndex.value
        })
      }, [vueExports.createVNode(vueExports.unref(Primitive), vueExports.mergeProps({
        ref: vueExports.unref(forwardRef),
        style: {
          boxSizing: "border-box",
          maxHeight: "100%"
        }
      }, {
        ..._ctx.$attrs,
        ...props
      }), {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16)], 4);
    };
  }
});
var SelectItemAlignedPosition_default = SelectItemAlignedPosition_vue_vue_type_script_setup_true_lang_default;
var SelectProvider_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  inheritAttrs: false,
  __name: "SelectProvider",
  props: { context: {
    type: Object,
    required: true
  } },
  setup(__props) {
    const props = __props;
    provideSelectRootContext(props.context);
    provideSelectContentContext(SelectContentDefaultContextValue);
    return (_ctx, _cache) => {
      return vueExports.renderSlot(_ctx.$slots, "default");
    };
  }
});
var SelectProvider_default = SelectProvider_vue_vue_type_script_setup_true_lang_default;
const _hoisted_1 = { key: 1 };
var SelectContent_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  inheritAttrs: false,
  __name: "SelectContent",
  props: {
    forceMount: {
      type: Boolean,
      required: false
    },
    position: {
      type: String,
      required: false
    },
    bodyLock: {
      type: Boolean,
      required: false
    },
    side: {
      type: null,
      required: false
    },
    sideOffset: {
      type: Number,
      required: false
    },
    sideFlip: {
      type: Boolean,
      required: false
    },
    align: {
      type: null,
      required: false
    },
    alignOffset: {
      type: Number,
      required: false
    },
    alignFlip: {
      type: Boolean,
      required: false
    },
    avoidCollisions: {
      type: Boolean,
      required: false
    },
    collisionBoundary: {
      type: null,
      required: false
    },
    collisionPadding: {
      type: [Number, Object],
      required: false
    },
    arrowPadding: {
      type: Number,
      required: false
    },
    sticky: {
      type: String,
      required: false
    },
    hideWhenDetached: {
      type: Boolean,
      required: false
    },
    positionStrategy: {
      type: String,
      required: false
    },
    updatePositionStrategy: {
      type: String,
      required: false
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: false
    },
    prioritizePosition: {
      type: Boolean,
      required: false
    },
    reference: {
      type: null,
      required: false
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
  emits: [
    "closeAutoFocus",
    "escapeKeyDown",
    "pointerDownOutside"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(props, emits);
    const rootContext = injectSelectRootContext();
    const fragment = vueExports.ref();
    const presenceRef = vueExports.ref();
    const present = vueExports.computed(() => props.forceMount || rootContext.open.value);
    const renderPresence = vueExports.ref(present.value);
    vueExports.watch(present, () => {
      setTimeout(() => renderPresence.value = present.value);
    });
    return (_ctx, _cache) => {
      return present.value || renderPresence.value || presenceRef.value?.present ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Presence_default), {
        key: 0,
        ref_key: "presenceRef",
        ref: presenceRef,
        present: present.value
      }, {
        default: vueExports.withCtx(() => [vueExports.createVNode(SelectContentImpl_default, vueExports.normalizeProps(vueExports.guardReactiveProps({
          ...vueExports.unref(forwarded),
          ..._ctx.$attrs
        })), {
          default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 16)]),
        _: 3
      }, 8, ["present"])) : fragment.value ? (vueExports.openBlock(), vueExports.createElementBlock("div", _hoisted_1, [(vueExports.openBlock(), vueExports.createBlock(vueExports.Teleport, { to: fragment.value }, [vueExports.createVNode(SelectProvider_default, { context: vueExports.unref(rootContext) }, {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 8, ["context"])], 8, ["to"]))])) : vueExports.createCommentVNode("v-if", true);
    };
  }
});
var SelectContent_default = SelectContent_vue_vue_type_script_setup_true_lang_default;
const [injectSelectItemContext, provideSelectItemContext] = createContext("SelectItem");
var SelectItem_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "SelectItem",
  props: {
    value: {
      type: null,
      required: true
    },
    disabled: {
      type: Boolean,
      required: false
    },
    textValue: {
      type: String,
      required: false
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
  emits: ["select"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { disabled } = vueExports.toRefs(props);
    const rootContext = injectSelectRootContext();
    const contentContext = injectSelectContentContext();
    const { forwardRef } = useForwardExpose();
    const { CollectionItem } = useCollection();
    const isSelected = vueExports.computed(() => valueComparator(rootContext.modelValue?.value, props.value, rootContext.by));
    const isFocused = vueExports.ref(false);
    const textValue = vueExports.ref(props.textValue ?? "");
    const textId = useId(void 0, "reka-select-item-text");
    const SELECT_SELECT = "select.select";
    async function handleSelectCustomEvent(ev) {
      if (ev.defaultPrevented) return;
      const eventDetail = {
        originalEvent: ev,
        value: props.value
      };
      handleAndDispatchCustomEvent(SELECT_SELECT, handleSelect, eventDetail);
    }
    async function handleSelect(ev) {
      await vueExports.nextTick();
      emits("select", ev);
      if (ev.defaultPrevented) return;
      if (!disabled.value) {
        rootContext.onValueChange(props.value);
        if (!rootContext.multiple.value) rootContext.onOpenChange(false);
      }
    }
    async function handlePointerMove(event) {
      await vueExports.nextTick();
      if (event.defaultPrevented) return;
      if (disabled.value) contentContext.onItemLeave?.();
      else event.currentTarget?.focus({ preventScroll: true });
    }
    async function handlePointerLeave(event) {
      await vueExports.nextTick();
      if (event.defaultPrevented) return;
      if (event.currentTarget === getActiveElement()) contentContext.onItemLeave?.();
    }
    async function handleKeyDown(event) {
      await vueExports.nextTick();
      if (event.defaultPrevented) return;
      const isTypingAhead = contentContext.searchRef?.value !== "";
      if (isTypingAhead && event.key === " ") return;
      if (SELECTION_KEYS.includes(event.key)) handleSelectCustomEvent(event);
      if (event.key === " ") event.preventDefault();
    }
    if (props.value === "") throw new Error("A <SelectItem /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.");
    provideSelectItemContext({
      value: props.value,
      disabled,
      textId,
      isSelected,
      onItemTextChange: (node) => {
        textValue.value = ((textValue.value || node?.textContent) ?? "").trim();
      }
    });
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(CollectionItem), { value: { textValue: textValue.value } }, {
        default: vueExports.withCtx(() => [vueExports.createVNode(vueExports.unref(Primitive), {
          ref: vueExports.unref(forwardRef),
          role: "option",
          "aria-labelledby": vueExports.unref(textId),
          "data-highlighted": isFocused.value ? "" : void 0,
          "aria-selected": isSelected.value,
          "data-state": isSelected.value ? "checked" : "unchecked",
          "aria-disabled": vueExports.unref(disabled) || void 0,
          "data-disabled": vueExports.unref(disabled) ? "" : void 0,
          tabindex: vueExports.unref(disabled) ? void 0 : -1,
          as: _ctx.as,
          "as-child": _ctx.asChild,
          onFocus: _cache[0] || (_cache[0] = ($event) => isFocused.value = true),
          onBlur: _cache[1] || (_cache[1] = ($event) => isFocused.value = false),
          onPointerup: handleSelectCustomEvent,
          onPointerdown: _cache[2] || (_cache[2] = (event) => {
            event.currentTarget.focus({ preventScroll: true });
          }),
          onTouchend: _cache[3] || (_cache[3] = vueExports.withModifiers(() => {
          }, ["prevent", "stop"])),
          onPointermove: handlePointerMove,
          onPointerleave: handlePointerLeave,
          onKeydown: handleKeyDown
        }, {
          default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 8, [
          "aria-labelledby",
          "data-highlighted",
          "aria-selected",
          "data-state",
          "aria-disabled",
          "data-disabled",
          "tabindex",
          "as",
          "as-child"
        ])]),
        _: 3
      }, 8, ["value"]);
    };
  }
});
var SelectItem_default = SelectItem_vue_vue_type_script_setup_true_lang_default;
var SelectTrigger_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "SelectTrigger",
  props: {
    disabled: {
      type: Boolean,
      required: false
    },
    reference: {
      type: null,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "button"
    }
  },
  setup(__props) {
    const props = __props;
    const rootContext = injectSelectRootContext();
    const { forwardRef } = useForwardExpose();
    const isDisabled = vueExports.computed(() => rootContext.disabled?.value || props.disabled);
    rootContext.contentId ||= useId(void 0, "reka-select-content");
    const { getItems } = useCollection();
    const { search, handleTypeaheadSearch, resetTypeahead } = useTypeahead();
    function handleOpen() {
      if (!isDisabled.value) {
        rootContext.onOpenChange(true);
        resetTypeahead();
      }
    }
    function handlePointerOpen(event) {
      handleOpen();
      rootContext.triggerPointerDownPosRef.value = {
        x: Math.round(event.pageX),
        y: Math.round(event.pageY)
      };
    }
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(PopperAnchor_default), {
        "as-child": "",
        reference: _ctx.reference
      }, {
        default: vueExports.withCtx(() => [vueExports.createVNode(vueExports.unref(Primitive), {
          ref: vueExports.unref(forwardRef),
          role: "combobox",
          type: _ctx.as === "button" ? "button" : void 0,
          "aria-controls": vueExports.unref(rootContext).contentId,
          "aria-expanded": vueExports.unref(rootContext).open.value || false,
          "aria-required": vueExports.unref(rootContext).required?.value,
          "aria-autocomplete": "none",
          disabled: isDisabled.value,
          dir: vueExports.unref(rootContext)?.dir.value,
          "data-state": vueExports.unref(rootContext)?.open.value ? "open" : "closed",
          "data-disabled": isDisabled.value ? "" : void 0,
          "data-placeholder": vueExports.unref(shouldShowPlaceholder)(vueExports.unref(rootContext).modelValue?.value) ? "" : void 0,
          "as-child": _ctx.asChild,
          as: _ctx.as,
          onClick: _cache[0] || (_cache[0] = (event) => {
            event?.currentTarget?.focus();
          }),
          onPointerdown: _cache[1] || (_cache[1] = (event) => {
            if (event.pointerType === "touch") return event.preventDefault();
            const target = event.target;
            if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
            if (event.button === 0 && event.ctrlKey === false) {
              handlePointerOpen(event);
              event.preventDefault();
            }
          }),
          onPointerup: _cache[2] || (_cache[2] = vueExports.withModifiers((event) => {
            if (event.pointerType === "touch") handlePointerOpen(event);
          }, ["prevent"])),
          onKeydown: _cache[3] || (_cache[3] = (event) => {
            const isTypingAhead = vueExports.unref(search) !== "";
            const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
            if (!isModifierKey && event.key.length === 1) {
              if (isTypingAhead && event.key === " ") return;
            }
            vueExports.unref(handleTypeaheadSearch)(event.key, vueExports.unref(getItems)());
            if (vueExports.unref(OPEN_KEYS).includes(event.key)) {
              handleOpen();
              event.preventDefault();
            }
          })
        }, {
          default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 8, [
          "type",
          "aria-controls",
          "aria-expanded",
          "aria-required",
          "disabled",
          "dir",
          "data-state",
          "data-disabled",
          "data-placeholder",
          "as-child",
          "as"
        ])]),
        _: 3
      }, 8, ["reference"]);
    };
  }
});
var SelectTrigger_default = SelectTrigger_vue_vue_type_script_setup_true_lang_default;
var SelectValue_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "SelectValue",
  props: {
    placeholder: {
      type: String,
      required: false,
      default: ""
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
    const { forwardRef } = useForwardExpose();
    const rootContext = injectSelectRootContext();
    const selectedLabel = vueExports.computed(() => {
      let list = [];
      const options = Array.from(rootContext.optionsSet.value);
      const getOption = (value) => options.find((option) => valueComparator(value, option.value, rootContext.by));
      if (Array.isArray(rootContext.modelValue.value)) list = rootContext.modelValue.value.map((value) => getOption(value)?.textContent ?? "");
      else list = [getOption(rootContext.modelValue.value)?.textContent ?? ""];
      return list.filter(Boolean);
    });
    const slotText = vueExports.computed(() => {
      return selectedLabel.value.length ? selectedLabel.value.join(", ") : props.placeholder;
    });
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Primitive), {
        ref: vueExports.unref(forwardRef),
        as: _ctx.as,
        "as-child": _ctx.asChild,
        style: { pointerEvents: "none" },
        "data-placeholder": selectedLabel.value.length ? void 0 : props.placeholder
      }, {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default", {
          selectedLabel: selectedLabel.value,
          modelValue: vueExports.unref(rootContext).modelValue.value
        }, () => [vueExports.createTextVNode(vueExports.toDisplayString(slotText.value), 1)])]),
        _: 3
      }, 8, [
        "as",
        "as-child",
        "data-placeholder"
      ]);
    };
  }
});
var SelectValue_default = SelectValue_vue_vue_type_script_setup_true_lang_default;
const [injectTagsInputRootContext, provideTagsInputRootContext] = createContext("TagsInputRoot");
var TagsInputRoot_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "TagsInputRoot",
  props: {
    modelValue: {
      type: [Array, null],
      required: false
    },
    defaultValue: {
      type: Array,
      required: false,
      default: () => []
    },
    addOnPaste: {
      type: Boolean,
      required: false
    },
    addOnTab: {
      type: Boolean,
      required: false
    },
    addOnBlur: {
      type: Boolean,
      required: false
    },
    duplicate: {
      type: Boolean,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false
    },
    delimiter: {
      type: null,
      required: false,
      default: ","
    },
    dir: {
      type: String,
      required: false
    },
    max: {
      type: Number,
      required: false,
      default: 0
    },
    id: {
      type: String,
      required: false
    },
    convertValue: {
      type: Function,
      required: false
    },
    displayValue: {
      type: Function,
      required: false,
      default: (value) => value.toString()
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    },
    name: {
      type: String,
      required: false
    },
    required: {
      type: Boolean,
      required: false
    }
  },
  emits: [
    "update:modelValue",
    "invalid",
    "addTag",
    "removeTag"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { addOnPaste, disabled, delimiter, max, id, dir: propDir, addOnBlur, addOnTab } = vueExports.toRefs(props);
    const dir = useDirection(propDir);
    const modelValue = useVModel(props, "modelValue", emits, {
      defaultValue: props.defaultValue,
      passive: true,
      deep: true
    });
    const { forwardRef, currentElement } = useForwardExpose();
    const { focused } = useFocusWithin(currentElement);
    const isFormControl = useFormControl(currentElement);
    const { getItems, CollectionSlot } = useCollection({ isProvider: true });
    const selectedElement = vueExports.ref();
    const isInvalidInput = vueExports.ref(false);
    const currentModelValue = vueExports.computed(() => Array.isArray(modelValue.value) ? [...modelValue.value] : []);
    function handleRemoveTag(index) {
      if (index !== -1) {
        const collection = getItems().filter((i) => i.ref.dataset.disabled !== "");
        modelValue.value = modelValue.value.filter((_, i) => i !== index);
        emits("removeTag", collection[index].value);
      }
    }
    provideTagsInputRootContext({
      modelValue,
      onAddValue: (_payload) => {
        const array = [...currentModelValue.value];
        const modelValueIsObject = array.length > 0 && typeof array[0] === "object";
        const defaultValueIsObject = array.length > 0 && typeof props.defaultValue[0] === "object";
        if ((modelValueIsObject || defaultValueIsObject) && typeof props.convertValue !== "function") throw new Error("You must provide a `convertValue` function when using objects as values.");
        const payload = props.convertValue ? props.convertValue(_payload) : _payload;
        if (array.length >= max.value && !!max.value) {
          emits("invalid", payload);
          return false;
        }
        if (props.duplicate) {
          modelValue.value = [...array, payload];
          emits("addTag", payload);
          return true;
        } else {
          const exist = array.includes(payload);
          if (!exist) {
            modelValue.value = [...array, payload];
            emits("addTag", payload);
            return true;
          } else isInvalidInput.value = true;
        }
        emits("invalid", payload);
        return false;
      },
      onRemoveValue: handleRemoveTag,
      onInputKeydown: (event) => {
        const target = event.target;
        const collection = getItems().map((i) => i.ref).filter((i) => i.dataset.disabled !== "");
        if (!collection.length) return;
        const lastTag = collection.at(-1);
        switch (event.key) {
          case "Delete":
          case "Backspace": {
            if (target.selectionStart !== 0 || target.selectionEnd !== 0) break;
            if (selectedElement.value) {
              const index = collection.findIndex((i) => i === selectedElement.value);
              handleRemoveTag(index);
              selectedElement.value = selectedElement.value === lastTag ? collection.at(index - 1) : collection.at(index + 1);
              event.preventDefault();
            } else if (event.key === "Backspace") {
              selectedElement.value = lastTag;
              event.preventDefault();
            }
            break;
          }
          case "Home":
          case "End":
          case "ArrowRight":
          case "ArrowLeft": {
            const isArrowRight = event.key === "ArrowRight" && dir.value === "ltr" || event.key === "ArrowLeft" && dir.value === "rtl";
            const isArrowLeft = !isArrowRight;
            if (target.selectionStart !== 0 || target.selectionEnd !== 0) break;
            if (isArrowLeft && !selectedElement.value) {
              selectedElement.value = lastTag;
              event.preventDefault();
            } else if (isArrowRight && lastTag && selectedElement.value === lastTag) {
              selectedElement.value = void 0;
              event.preventDefault();
            } else if (selectedElement.value) {
              const el = useArrowNavigation(event, selectedElement.value, void 0, {
                itemsArray: collection,
                loop: false,
                dir: dir.value
              });
              if (el) selectedElement.value = el;
              event.preventDefault();
            }
            break;
          }
          case "ArrowUp":
          case "ArrowDown": {
            if (selectedElement.value) event.preventDefault();
            break;
          }
          default:
            selectedElement.value = void 0;
        }
      },
      selectedElement,
      isInvalidInput,
      addOnPaste,
      addOnBlur,
      addOnTab,
      dir,
      disabled,
      delimiter,
      max,
      id,
      displayValue: props.displayValue
    });
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(CollectionSlot), null, {
        default: vueExports.withCtx(() => [vueExports.createVNode(vueExports.unref(Primitive), {
          ref: vueExports.unref(forwardRef),
          dir: vueExports.unref(dir),
          as: _ctx.as,
          "as-child": _ctx.asChild,
          "data-invalid": isInvalidInput.value ? "" : void 0,
          "data-disabled": vueExports.unref(disabled) ? "" : void 0,
          "data-focused": vueExports.unref(focused) ? "" : void 0
        }, {
          default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default", { modelValue: vueExports.unref(modelValue) }), vueExports.unref(isFormControl) && _ctx.name ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(VisuallyHiddenInput_default), {
            key: 0,
            name: _ctx.name,
            value: vueExports.unref(modelValue),
            required: _ctx.required,
            disabled: vueExports.unref(disabled)
          }, null, 8, [
            "name",
            "value",
            "required",
            "disabled"
          ])) : vueExports.createCommentVNode("v-if", true)]),
          _: 3
        }, 8, [
          "dir",
          "as",
          "as-child",
          "data-invalid",
          "data-disabled",
          "data-focused"
        ])]),
        _: 3
      });
    };
  }
});
var TagsInputRoot_default = TagsInputRoot_vue_vue_type_script_setup_true_lang_default;
var TagsInputInput_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "TagsInputInput",
  props: {
    placeholder: {
      type: String,
      required: false
    },
    autoFocus: {
      type: Boolean,
      required: false
    },
    maxLength: {
      type: Number,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "input"
    }
  },
  setup(__props) {
    const context = injectTagsInputRootContext();
    const { forwardRef } = useForwardExpose();
    function handleBlur(event) {
      context.selectedElement.value = void 0;
      if (!context.addOnBlur.value) return;
      const target = event.target;
      if (!target.value) return;
      const isAdded = context.onAddValue(target.value);
      if (isAdded) target.value = "";
    }
    function handleTab(event) {
      if (!context.addOnTab.value) return;
      handleCustomKeydown(event);
    }
    const isComposing = vueExports.ref(false);
    function onCompositionStart() {
      isComposing.value = true;
    }
    function onCompositionEnd() {
      vueExports.nextTick(() => {
        isComposing.value = false;
      });
    }
    async function handleCustomKeydown(event) {
      if (isComposing.value) return;
      await vueExports.nextTick();
      if (event.defaultPrevented) return;
      const target = event.target;
      if (!target.value) return;
      const isAdded = context.onAddValue(target.value);
      if (isAdded) target.value = "";
      event.preventDefault();
    }
    function handleInput(event) {
      context.isInvalidInput.value = false;
      if (event.data === null) return;
      const delimiter = context.delimiter.value;
      const matchesDelimiter = delimiter === event.data || delimiter instanceof RegExp && delimiter.test(event.data);
      if (matchesDelimiter) {
        const target = event.target;
        target.value = target.value.replace(delimiter, "");
        if (target.value.trim() === "") {
          target.value = "";
          return;
        }
        const isAdded = context.onAddValue(target.value);
        if (isAdded) target.value = "";
      }
    }
    function handlePaste(event) {
      if (context.addOnPaste.value) {
        event.preventDefault();
        const clipboardData = event.clipboardData;
        if (!clipboardData) return;
        const value = clipboardData.getData("text");
        if (context.delimiter.value) {
          const splitValue = value.split(context.delimiter.value);
          splitValue.forEach((v) => {
            context.onAddValue(v);
          });
        } else context.onAddValue(value);
      }
    }
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Primitive), {
        id: vueExports.unref(context).id?.value,
        ref: vueExports.unref(forwardRef),
        type: "text",
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        as: _ctx.as,
        "as-child": _ctx.asChild,
        maxlength: _ctx.maxLength,
        placeholder: _ctx.placeholder,
        disabled: vueExports.unref(context).disabled.value,
        "data-invalid": vueExports.unref(context).isInvalidInput.value ? "" : void 0,
        onInput: handleInput,
        onKeydown: [
          vueExports.withKeys(handleCustomKeydown, ["enter"]),
          vueExports.withKeys(handleTab, ["tab"]),
          vueExports.unref(context).onInputKeydown
        ],
        onBlur: handleBlur,
        onCompositionstart: onCompositionStart,
        onCompositionend: onCompositionEnd,
        onPaste: handlePaste
      }, {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 8, [
        "id",
        "as",
        "as-child",
        "maxlength",
        "placeholder",
        "disabled",
        "data-invalid",
        "onKeydown"
      ]);
    };
  }
});
var TagsInputInput_default = TagsInputInput_vue_vue_type_script_setup_true_lang_default;
const [injectTagsInputItemContext, provideTagsInputItemContext] = createContext("TagsInputItem");
var TagsInputItem_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "TagsInputItem",
  props: {
    value: {
      type: null,
      required: true
    },
    disabled: {
      type: Boolean,
      required: false
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
  setup(__props) {
    const props = __props;
    const { value } = vueExports.toRefs(props);
    const context = injectTagsInputRootContext();
    const { forwardRef, currentElement } = useForwardExpose();
    const { CollectionItem } = useCollection();
    const isSelected = vueExports.computed(() => context.selectedElement.value === currentElement.value);
    const disabled = vueExports.computed(() => props.disabled || context.disabled.value);
    const itemContext = provideTagsInputItemContext({
      value,
      isSelected,
      disabled,
      textId: "",
      displayValue: vueExports.computed(() => context.displayValue(value.value))
    });
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(CollectionItem), { value: vueExports.unref(value) }, {
        default: vueExports.withCtx(() => [vueExports.createVNode(vueExports.unref(Primitive), {
          ref: vueExports.unref(forwardRef),
          as: _ctx.as,
          "as-child": _ctx.asChild,
          "aria-labelledby": vueExports.unref(itemContext).textId,
          "aria-current": isSelected.value,
          "data-disabled": disabled.value ? "" : void 0,
          "data-state": isSelected.value ? "active" : "inactive"
        }, {
          default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 8, [
          "as",
          "as-child",
          "aria-labelledby",
          "aria-current",
          "data-disabled",
          "data-state"
        ])]),
        _: 3
      }, 8, ["value"]);
    };
  }
});
var TagsInputItem_default = TagsInputItem_vue_vue_type_script_setup_true_lang_default;
var TagsInputItemDelete_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "TagsInputItemDelete",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "button"
    }
  },
  setup(__props) {
    const props = __props;
    useForwardExpose();
    const context = injectTagsInputRootContext();
    const itemContext = injectTagsInputItemContext();
    const disabled = vueExports.computed(() => itemContext.disabled?.value || context.disabled.value);
    function handleDelete() {
      if (disabled.value) return;
      const index = context.modelValue.value.findIndex((i) => isEqual(i, itemContext.value.value));
      context.onRemoveValue(index);
    }
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Primitive), vueExports.mergeProps({ tabindex: "-1" }, props, {
        "aria-labelledby": vueExports.unref(itemContext).textId,
        "aria-current": vueExports.unref(itemContext).isSelected.value,
        "data-state": vueExports.unref(itemContext).isSelected.value ? "active" : "inactive",
        "data-disabled": disabled.value ? "" : void 0,
        type: _ctx.as === "button" ? "button" : void 0,
        onClick: handleDelete
      }), {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, [
        "aria-labelledby",
        "aria-current",
        "data-state",
        "data-disabled",
        "type"
      ]);
    };
  }
});
var TagsInputItemDelete_default = TagsInputItemDelete_vue_vue_type_script_setup_true_lang_default;
var TagsInputItemText_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "TagsInputItemText",
  props: {
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
    const itemContext = injectTagsInputItemContext();
    useForwardExpose();
    itemContext.textId ||= useId(void 0, "reka-tags-input-item-text");
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Primitive), vueExports.mergeProps(props, { id: vueExports.unref(itemContext).textId }), {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default", {}, () => [vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(itemContext).displayValue.value), 1)])]),
        _: 3
      }, 16, ["id"]);
    };
  }
});
var TagsInputItemText_default = TagsInputItemText_vue_vue_type_script_setup_true_lang_default;
const _sfc_main$6 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "FormLabel",
  __ssrInlineRender: true,
  props: {
    for: {},
    tokens: {}
  },
  setup(__props) {
    const styles = useTokenStyle(__props.tokens);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<label${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
        for: __props.for,
        style: vueExports.unref(styles).label,
        class: "f-label"
      }, _attrs))}>`);
      serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</label>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../layers/blocks/app/components/FormLabel.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main$6, { __name: "FormLabel" });
const _sfc_main$5 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "Input",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ vueExports.mergeModels({
    type: { default: "text" },
    placeholder: {},
    disabled: { type: Boolean },
    required: { type: Boolean },
    name: {},
    tokens: {}
  }, {
    "modelValue": {},
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const model = vueExports.useModel(__props, "modelValue");
    const styles = useTokenStyle(__props.tokens);
    return (_ctx, _push, _parent, _attrs) => {
      let _temp0;
      _push(`<input${serverRenderer_cjs_prodExports.ssrRenderAttrs((_temp0 = vueExports.mergeProps({
        type: __props.type,
        placeholder: __props.placeholder,
        disabled: __props.disabled,
        required: __props.required,
        name: __props.name,
        style: vueExports.unref(styles).input,
        class: "f-input"
      }, _attrs), vueExports.mergeProps(_temp0, serverRenderer_cjs_prodExports.ssrGetDynamicModelProps(_temp0, model.value))))}>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../layers/blocks/app/components/Input.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main$5, { __name: "Input" });
const _sfc_main$4 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "TagsInput",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ vueExports.mergeModels({
    placeholder: { default: "Add tags..." },
    disabled: { type: Boolean },
    required: { type: Boolean },
    name: {},
    max: {},
    addOnBlur: { type: Boolean, default: true },
    addOnPaste: { type: Boolean, default: true },
    addOnTab: { type: Boolean, default: true },
    delimiter: { default: "," },
    duplicate: { type: Boolean, default: false },
    tokens: {}
  }, {
    "modelValue": {},
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const model = vueExports.useModel(__props, "modelValue");
    const styles = useTokenStyle(__props.tokens);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_TagsInputRoot = TagsInputRoot_default;
      const _component_TagsInputItem = TagsInputItem_default;
      const _component_TagsInputItemText = TagsInputItemText_default;
      const _component_TagsInputItemDelete = TagsInputItemDelete_default;
      const _component_Icon = __nuxt_component_2$1;
      const _component_TagsInputInput = TagsInputInput_default;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_TagsInputRoot, vueExports.mergeProps({
        modelValue: model.value,
        "onUpdate:modelValue": ($event) => model.value = $event,
        disabled: __props.disabled,
        required: __props.required,
        name: __props.name,
        max: __props.max,
        "add-on-blur": __props.addOnBlur,
        "add-on-paste": __props.addOnPaste,
        "add-on-tab": __props.addOnTab,
        delimiter: __props.delimiter,
        duplicate: __props.duplicate,
        style: vueExports.unref(styles)["tags-input-root"],
        class: "f-tags-input-root"
      }, _attrs), {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            serverRenderer_cjs_prodExports.ssrRenderList(model.value, (item) => {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_TagsInputItem, {
                key: item,
                value: item,
                style: vueExports.unref(styles)["tags-input-item"],
                class: "f-tags-input-item"
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_TagsInputItemText, {
                      style: vueExports.unref(styles)["tags-input-item-text"],
                      class: "f-tags-input-item-text"
                    }, null, _parent3, _scopeId2));
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_TagsInputItemDelete, {
                      style: vueExports.unref(styles)["tags-input-item-delete"],
                      class: "f-tags-input-item-delete"
                    }, {
                      default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, { alias: "close" }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            vueExports.createVNode(_component_Icon, { alias: "close" })
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_TagsInputItemText, {
                        style: vueExports.unref(styles)["tags-input-item-text"],
                        class: "f-tags-input-item-text"
                      }, null, 8, ["style"]),
                      vueExports.createVNode(_component_TagsInputItemDelete, {
                        style: vueExports.unref(styles)["tags-input-item-delete"],
                        class: "f-tags-input-item-delete"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createVNode(_component_Icon, { alias: "close" })
                        ]),
                        _: 1
                      }, 8, ["style"])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_TagsInputInput, {
              placeholder: __props.placeholder,
              style: vueExports.unref(styles)["tags-input-input"],
              class: "f-tags-input-input"
            }, null, _parent2, _scopeId));
          } else {
            return [
              (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(model.value, (item) => {
                return vueExports.openBlock(), vueExports.createBlock(_component_TagsInputItem, {
                  key: item,
                  value: item,
                  style: vueExports.unref(styles)["tags-input-item"],
                  class: "f-tags-input-item"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_TagsInputItemText, {
                      style: vueExports.unref(styles)["tags-input-item-text"],
                      class: "f-tags-input-item-text"
                    }, null, 8, ["style"]),
                    vueExports.createVNode(_component_TagsInputItemDelete, {
                      style: vueExports.unref(styles)["tags-input-item-delete"],
                      class: "f-tags-input-item-delete"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_Icon, { alias: "close" })
                      ]),
                      _: 1
                    }, 8, ["style"])
                  ]),
                  _: 1
                }, 8, ["value", "style"]);
              }), 128)),
              vueExports.createVNode(_component_TagsInputInput, {
                placeholder: __props.placeholder,
                style: vueExports.unref(styles)["tags-input-input"],
                class: "f-tags-input-input"
              }, null, 8, ["placeholder", "style"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../layers/blocks/app/components/TagsInput.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_5 = Object.assign(_sfc_main$4, { __name: "TagsInput" });
const _sfc_main$3 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "Select",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ vueExports.mergeModels({
    options: {},
    placeholder: { default: "Select an option" },
    disabled: { type: Boolean },
    required: { type: Boolean },
    name: {},
    tokens: {}
  }, {
    "modelValue": {},
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const model = vueExports.useModel(__props, "modelValue");
    const styles = useTokenStyle(__props.tokens);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SelectRoot = SelectRoot_default;
      const _component_SelectTrigger = SelectTrigger_default;
      const _component_SelectValue = SelectValue_default;
      const _component_Icon = __nuxt_component_2$1;
      const _component_SelectContent = SelectContent_default;
      const _component_SelectItem = SelectItem_default;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SelectRoot, vueExports.mergeProps({
        modelValue: model.value,
        "onUpdate:modelValue": ($event) => model.value = $event,
        disabled: __props.disabled,
        required: __props.required,
        name: __props.name,
        style: vueExports.unref(styles)["select-root"],
        class: "f-select-root"
      }, _attrs), {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SelectTrigger, {
              style: vueExports.unref(styles)["select-trigger"],
              class: "f-select-trigger"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SelectValue, { placeholder: __props.placeholder }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, { alias: "chevron-down" }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_SelectValue, { placeholder: __props.placeholder }, null, 8, ["placeholder"]),
                    vueExports.createVNode(_component_Icon, { alias: "chevron-down" })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SelectContent, {
              style: vueExports.unref(styles)["select-content"],
              class: "f-select-content"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  serverRenderer_cjs_prodExports.ssrRenderList(__props.options, (option) => {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SelectItem, {
                      key: option.value,
                      value: option.value,
                      disabled: option.disabled,
                      style: vueExports.unref(styles)["select-item"],
                      class: "f-select-item"
                    }, {
                      default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(option.label)}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(option.label), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  });
                  _push3(`<!--]-->`);
                } else {
                  return [
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(__props.options, (option) => {
                      return vueExports.openBlock(), vueExports.createBlock(_component_SelectItem, {
                        key: option.value,
                        value: option.value,
                        disabled: option.disabled,
                        style: vueExports.unref(styles)["select-item"],
                        class: "f-select-item"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(option.label), 1)
                        ]),
                        _: 2
                      }, 1032, ["value", "disabled", "style"]);
                    }), 128))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_SelectTrigger, {
                style: vueExports.unref(styles)["select-trigger"],
                class: "f-select-trigger"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_SelectValue, { placeholder: __props.placeholder }, null, 8, ["placeholder"]),
                  vueExports.createVNode(_component_Icon, { alias: "chevron-down" })
                ]),
                _: 1
              }, 8, ["style"]),
              vueExports.createVNode(_component_SelectContent, {
                style: vueExports.unref(styles)["select-content"],
                class: "f-select-content"
              }, {
                default: vueExports.withCtx(() => [
                  (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(__props.options, (option) => {
                    return vueExports.openBlock(), vueExports.createBlock(_component_SelectItem, {
                      key: option.value,
                      value: option.value,
                      disabled: option.disabled,
                      style: vueExports.unref(styles)["select-item"],
                      class: "f-select-item"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(option.label), 1)
                      ]),
                      _: 2
                    }, 1032, ["value", "disabled", "style"]);
                  }), 128))
                ]),
                _: 1
              }, 8, ["style"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../layers/blocks/app/components/Select.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_6 = Object.assign(_sfc_main$3, { __name: "Select" });
const _sfc_main$2 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ContentFilters",
  __ssrInlineRender: true,
  props: {
    collection: {}
  },
  setup(__props) {
    const searchQuery = vueExports.ref("");
    const tags = vueExports.ref([]);
    const sortBy = vueExports.ref("published-desc");
    const sortOptions = [
      { value: "published-desc", label: "Newest First" },
      { value: "published-asc", label: "Oldest First" },
      { value: "title-asc", label: "Title A-Z" },
      { value: "title-desc", label: "Title Z-A" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Caption = __nuxt_component_0$2;
      const _component_Icon = __nuxt_component_2$1;
      const _component_Group = __nuxt_component_3$2;
      const _component_FormLabel = __nuxt_component_3;
      const _component_Input = __nuxt_component_4;
      const _component_TagsInput = __nuxt_component_5;
      const _component_Select = __nuxt_component_6;
      _push(`<!--[-->`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Caption, null, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, { alias: "filter" }, null, _parent2, _scopeId));
            _push2(` Query Content `);
          } else {
            return [
              vueExports.createVNode(_component_Icon, { alias: "filter" }),
              vueExports.createTextVNode(" Query Content ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Group, { tokens: {
        group: {
          width: "ref-full",
          "flex-direction": "ref-flex-col",
          "align-items": "ref-align-start",
          gap: "ref-spacing-xs",
          "padding-left": "ref-spacing-md",
          "padding-right": "ref-spacing-md"
        }
      } }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_FormLabel, { for: "search" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Search`);
                } else {
                  return [
                    vueExports.createTextVNode("Search")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Input, {
              id: "search",
              modelValue: vueExports.unref(searchQuery),
              "onUpdate:modelValue": ($event) => vueExports.isRef(searchQuery) ? searchQuery.value = $event : null,
              type: "search",
              placeholder: "Search content...",
              tokens: { input: { width: "ref-size-full" } }
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_FormLabel, { for: "tags" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Tags`);
                } else {
                  return [
                    vueExports.createTextVNode("Tags")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_TagsInput, {
              id: "tags",
              modelValue: vueExports.unref(tags),
              "onUpdate:modelValue": ($event) => vueExports.isRef(tags) ? tags.value = $event : null,
              placeholder: "Add tags...",
              tokens: { "tags-input-root": { width: "ref-size-full" } }
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_FormLabel, { for: "search" }, {
                default: vueExports.withCtx(() => [
                  vueExports.createTextVNode("Search")
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_Input, {
                id: "search",
                modelValue: vueExports.unref(searchQuery),
                "onUpdate:modelValue": ($event) => vueExports.isRef(searchQuery) ? searchQuery.value = $event : null,
                type: "search",
                placeholder: "Search content...",
                tokens: { input: { width: "ref-size-full" } }
              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
              vueExports.createVNode(_component_FormLabel, { for: "tags" }, {
                default: vueExports.withCtx(() => [
                  vueExports.createTextVNode("Tags")
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_TagsInput, {
                id: "tags",
                modelValue: vueExports.unref(tags),
                "onUpdate:modelValue": ($event) => vueExports.isRef(tags) ? tags.value = $event : null,
                placeholder: "Add tags...",
                tokens: { "tags-input-root": { width: "ref-size-full" } }
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Caption, null, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, { alias: "sort" }, null, _parent2, _scopeId));
            _push2(` Sort Content `);
          } else {
            return [
              vueExports.createVNode(_component_Icon, { alias: "sort" }),
              vueExports.createTextVNode(" Sort Content ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Group, { tokens: {
        group: {
          width: "ref-full",
          "flex-direction": "ref-flex-col",
          "align-items": "ref-align-start",
          gap: "ref-spacing-xs",
          "padding-left": "ref-spacing-md",
          "padding-right": "ref-spacing-md"
        }
      } }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_FormLabel, { for: "sort" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Sort By`);
                } else {
                  return [
                    vueExports.createTextVNode("Sort By")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Select, {
              id: "sort",
              modelValue: vueExports.unref(sortBy),
              "onUpdate:modelValue": ($event) => vueExports.isRef(sortBy) ? sortBy.value = $event : null,
              options: sortOptions,
              tokens: { select: { width: "ref-size-full" } }
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_FormLabel, { for: "sort" }, {
                default: vueExports.withCtx(() => [
                  vueExports.createTextVNode("Sort By")
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_Select, {
                id: "sort",
                modelValue: vueExports.unref(sortBy),
                "onUpdate:modelValue": ($event) => vueExports.isRef(sortBy) ? sortBy.value = $event : null,
                options: sortOptions,
                tokens: { select: { width: "ref-size-full" } }
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../layers/prose/app/components/ContentFilters.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main$2, { __name: "ContentFilters" });
const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ContentGrid",
  __ssrInlineRender: true,
  props: {
    collection: {},
    tokens: {}
  },
  async setup(__props) {
    let __temp, __restore;
    const styles = useTokenStyle(__props.tokens);
    const { data: items } = ([__temp, __restore] = vueExports.withAsyncContext(() => useAsyncData(
      `content-grid-${__props.collection}`,
      () => queryCollection(__props.collection).all()
    )), __temp = await __temp, __restore(), __temp);
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$3;
      const _component_Icon = __nuxt_component_2$1;
      if (vueExports.unref(items)) {
        _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
          style: vueExports.unref(styles)["content-grid"],
          class: "f-content-grid"
        }, _attrs))}><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(items), (item) => {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
            key: item.id,
            to: `/${__props.collection}${item.path}`,
            style: vueExports.unref(styles)["content-grid-item"],
            class: "f-content-grid-item"
          }, {
            default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<span style="${serverRenderer_cjs_prodExports.ssrRenderStyle(vueExports.unref(styles)["content-grid-title"])}" class="f-content-grid-title"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(item.title)}</span>`);
                if (item.description) {
                  _push2(`<span style="${serverRenderer_cjs_prodExports.ssrRenderStyle(vueExports.unref(styles)["content-grid-description"])}" class="f-content-grid-description"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(item.description)}</span>`);
                } else {
                  _push2(`<!---->`);
                }
                if (item.author || item.published) {
                  _push2(`<div style="${serverRenderer_cjs_prodExports.ssrRenderStyle(vueExports.unref(styles)["content-grid-meta"])}" class="f-content-grid-meta"${_scopeId}>`);
                  if (item.author) {
                    _push2(`<span style="${serverRenderer_cjs_prodExports.ssrRenderStyle(vueExports.unref(styles)["content-grid-author"])}" class="f-content-grid-author"${_scopeId}>`);
                    _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, { alias: "user" }, null, _parent2, _scopeId));
                    _push2(` ${serverRenderer_cjs_prodExports.ssrInterpolate(item.author)}</span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  if (item.published) {
                    _push2(`<span style="${serverRenderer_cjs_prodExports.ssrRenderStyle(vueExports.unref(styles)["content-grid-published"])}" class="f-content-grid-published"${_scopeId}>`);
                    _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, { alias: "calendar" }, null, _parent2, _scopeId));
                    _push2(` ${serverRenderer_cjs_prodExports.ssrInterpolate(formatDate(item.published))}</span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div>`);
                } else {
                  _push2(`<!---->`);
                }
              } else {
                return [
                  vueExports.createVNode("span", {
                    style: vueExports.unref(styles)["content-grid-title"],
                    class: "f-content-grid-title"
                  }, vueExports.toDisplayString(item.title), 5),
                  item.description ? (vueExports.openBlock(), vueExports.createBlock("span", {
                    key: 0,
                    style: vueExports.unref(styles)["content-grid-description"],
                    class: "f-content-grid-description"
                  }, vueExports.toDisplayString(item.description), 5)) : vueExports.createCommentVNode("", true),
                  item.author || item.published ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 1,
                    style: vueExports.unref(styles)["content-grid-meta"],
                    class: "f-content-grid-meta"
                  }, [
                    item.author ? (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 0,
                      style: vueExports.unref(styles)["content-grid-author"],
                      class: "f-content-grid-author"
                    }, [
                      vueExports.createVNode(_component_Icon, { alias: "user" }),
                      vueExports.createTextVNode(" " + vueExports.toDisplayString(item.author), 1)
                    ], 4)) : vueExports.createCommentVNode("", true),
                    item.published ? (vueExports.openBlock(), vueExports.createBlock("span", {
                      key: 1,
                      style: vueExports.unref(styles)["content-grid-published"],
                      class: "f-content-grid-published"
                    }, [
                      vueExports.createVNode(_component_Icon, { alias: "calendar" }),
                      vueExports.createTextVNode(" " + vueExports.toDisplayString(formatDate(item.published)), 1)
                    ], 4)) : vueExports.createCommentVNode("", true)
                  ], 4)) : vueExports.createCommentVNode("", true)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../layers/prose/app/components/ContentGrid.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_7 = Object.assign(_sfc_main$1, { __name: "ContentGrid" });
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const appConfig = useAppConfig();
    const collection = vueExports.computed(() => route.params.collection);
    const collectionConfig = vueExports.computed(
      () => appConfig.collections?.find(
        (c) => c.key === collection.value
      )
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Nav = __nuxt_component_1;
      const _component_Aside = __nuxt_component_1$1;
      const _component_ContentFilters = __nuxt_component_2;
      const _component_Section = __nuxt_component_3$1;
      const _component_Article = __nuxt_component_5$1;
      const _component_H1 = __nuxt_component_0;
      const _component_P = __nuxt_component_0$1;
      const _component_ContentGrid = __nuxt_component_7;
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
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ContentFilters, { collection: vueExports.unref(collection) }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_ContentFilters, { collection: vueExports.unref(collection) }, null, 8, ["collection"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_Aside, null, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_ContentFilters, { collection: vueExports.unref(collection) }, null, 8, ["collection"])
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
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Article, null, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_H1, null, {
                    default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(collectionConfig)?.title || vueExports.unref(collection))}`);
                      } else {
                        return [
                          vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(collectionConfig)?.title || vueExports.unref(collection)), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  if (vueExports.unref(collectionConfig)?.description) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_P, null, {
                      default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(collectionConfig).description)}`);
                        } else {
                          return [
                            vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(collectionConfig).description), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    vueExports.createVNode(_component_H1, null, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(collectionConfig)?.title || vueExports.unref(collection)), 1)
                      ]),
                      _: 1
                    }),
                    vueExports.unref(collectionConfig)?.description ? (vueExports.openBlock(), vueExports.createBlock(_component_P, { key: 0 }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(collectionConfig).description), 1)
                      ]),
                      _: 1
                    })) : vueExports.createCommentVNode("", true)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ContentGrid, { collection: vueExports.unref(collection) }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_Article, null, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_H1, null, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(collectionConfig)?.title || vueExports.unref(collection)), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.unref(collectionConfig)?.description ? (vueExports.openBlock(), vueExports.createBlock(_component_P, { key: 0 }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(collectionConfig).description), 1)
                    ]),
                    _: 1
                  })) : vueExports.createCommentVNode("", true)
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_ContentGrid, { collection: vueExports.unref(collection) }, null, 8, ["collection"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[collection]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CLwqeARi.mjs.map
