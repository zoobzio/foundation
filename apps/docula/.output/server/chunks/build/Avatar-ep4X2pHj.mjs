import { v as vueExports, g as useTokenStyle, s as serverRenderer_cjs_prodExports, d as useForwardExpose, c as createContext, q as isClient, A as useUntheme, b as useVModel, r as refAutoReset, w as useDebounceFn, x as reactiveOmit, e as useResizeObserver, a as unrefElement, y as injectTooltipProviderContext, z as useTimeoutFn, p as useMounted, i as createEventHook } from './server.mjs';
import { _ as __nuxt_component_1$1, b as __nuxt_component_3$1, P as Primitive, a as __nuxt_component_2$2, c as useCollection, u as useDirection, d as useId, g as getActiveElement } from './Group-pXYCZuBY.mjs';
import { V as VisuallyHidden_default, b as useForwardPropsEmits, c as Presence_default, u as useArrowNavigation, D as DismissableLayer_default, P as PopperRoot_default, a as PopperAnchor_default, i as useEmitAsProps, h as PopperContent_default, f as useForwardProps, d as useBodyScrollLock, e as useHideOthers, F as FocusScope_default, j as getOpenState$1 } from './PopperContent-BW9NCRPQ.mjs';
import { _ as __nuxt_component_0$3 } from './nuxt-link-Df9NoxNv.mjs';
import { _ as __nuxt_component_1$2 } from './Button-3FIsxtWq.mjs';
import { _ as __nuxt_component_0$4 } from './P-DDZ97RQ5.mjs';

function useGraceArea(triggerElement, containerElement) {
  const isPointerInTransit = refAutoReset(false, 300);
  const pointerGraceArea = vueExports.ref(null);
  const pointerExit = createEventHook();
  function handleRemoveGraceArea() {
    pointerGraceArea.value = null;
    isPointerInTransit.value = false;
  }
  function handleCreateGraceArea(event, hoverTarget) {
    const currentTarget = event.currentTarget;
    const exitPoint = {
      x: event.clientX,
      y: event.clientY
    };
    const exitSide = getExitSideFromRect(exitPoint, currentTarget.getBoundingClientRect());
    const paddedExitPoints = getPaddedExitPoints(exitPoint, exitSide);
    const hoverTargetPoints = getPointsFromRect(hoverTarget.getBoundingClientRect());
    const graceArea = getHull([...paddedExitPoints, ...hoverTargetPoints]);
    pointerGraceArea.value = graceArea;
    isPointerInTransit.value = true;
  }
  vueExports.watchEffect((cleanupFn) => {
    if (triggerElement.value && containerElement.value) {
      const handleTriggerLeave = (event) => handleCreateGraceArea(event, containerElement.value);
      const handleContentLeave = (event) => handleCreateGraceArea(event, triggerElement.value);
      triggerElement.value.addEventListener("pointerleave", handleTriggerLeave);
      containerElement.value.addEventListener("pointerleave", handleContentLeave);
      cleanupFn(() => {
        triggerElement.value?.removeEventListener("pointerleave", handleTriggerLeave);
        containerElement.value?.removeEventListener("pointerleave", handleContentLeave);
      });
    }
  });
  vueExports.watchEffect((cleanupFn) => {
    if (pointerGraceArea.value) {
      const handleTrackPointerGrace = (event) => {
        if (!pointerGraceArea.value || !(event.target instanceof Element)) return;
        const target = event.target;
        const pointerPosition = {
          x: event.clientX,
          y: event.clientY
        };
        const hasEnteredTarget = triggerElement.value?.contains(target) || containerElement.value?.contains(target);
        const isPointerOutsideGraceArea = !isPointInPolygon(pointerPosition, pointerGraceArea.value);
        const isAnotherGraceAreaTrigger = !!target.closest("[data-grace-area-trigger]");
        if (hasEnteredTarget) handleRemoveGraceArea();
        else if (isPointerOutsideGraceArea || isAnotherGraceAreaTrigger) {
          handleRemoveGraceArea();
          pointerExit.trigger();
        }
      };
      triggerElement.value?.ownerDocument.addEventListener("pointermove", handleTrackPointerGrace);
      cleanupFn(() => triggerElement.value?.ownerDocument.removeEventListener("pointermove", handleTrackPointerGrace));
    }
  });
  return {
    isPointerInTransit,
    onPointerExit: pointerExit.on
  };
}
function getExitSideFromRect(point, rect) {
  const top = Math.abs(rect.top - point.y);
  const bottom = Math.abs(rect.bottom - point.y);
  const right = Math.abs(rect.right - point.x);
  const left = Math.abs(rect.left - point.x);
  switch (Math.min(top, bottom, right, left)) {
    case left:
      return "left";
    case right:
      return "right";
    case top:
      return "top";
    case bottom:
      return "bottom";
    default:
      throw new Error("unreachable");
  }
}
function getPaddedExitPoints(exitPoint, exitSide, padding = 5) {
  const paddedExitPoints = [];
  switch (exitSide) {
    case "top":
      paddedExitPoints.push({
        x: exitPoint.x - padding,
        y: exitPoint.y + padding
      }, {
        x: exitPoint.x + padding,
        y: exitPoint.y + padding
      });
      break;
    case "bottom":
      paddedExitPoints.push({
        x: exitPoint.x - padding,
        y: exitPoint.y - padding
      }, {
        x: exitPoint.x + padding,
        y: exitPoint.y - padding
      });
      break;
    case "left":
      paddedExitPoints.push({
        x: exitPoint.x + padding,
        y: exitPoint.y - padding
      }, {
        x: exitPoint.x + padding,
        y: exitPoint.y + padding
      });
      break;
    case "right":
      paddedExitPoints.push({
        x: exitPoint.x - padding,
        y: exitPoint.y - padding
      }, {
        x: exitPoint.x - padding,
        y: exitPoint.y + padding
      });
      break;
  }
  return paddedExitPoints;
}
function getPointsFromRect(rect) {
  const { top, right, bottom, left } = rect;
  return [
    {
      x: left,
      y: top
    },
    {
      x: right,
      y: top
    },
    {
      x: right,
      y: bottom
    },
    {
      x: left,
      y: bottom
    }
  ];
}
function isPointInPolygon(point, polygon) {
  const { x, y } = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;
    const intersect = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}
function getHull(points) {
  const newPoints = points.slice();
  newPoints.sort((a, b) => {
    if (a.x < b.x) return -1;
    else if (a.x > b.x) return 1;
    else if (a.y < b.y) return -1;
    else if (a.y > b.y) return 1;
    else return 0;
  });
  return getHullPresorted(newPoints);
}
function getHullPresorted(points) {
  if (points.length <= 1) return points.slice();
  const upperHull = [];
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    while (upperHull.length >= 2) {
      const q = upperHull[upperHull.length - 1];
      const r = upperHull[upperHull.length - 2];
      if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) upperHull.pop();
      else break;
    }
    upperHull.push(p);
  }
  upperHull.pop();
  const lowerHull = [];
  for (let i = points.length - 1; i >= 0; i--) {
    const p = points[i];
    while (lowerHull.length >= 2) {
      const q = lowerHull[lowerHull.length - 1];
      const r = lowerHull[lowerHull.length - 2];
      if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) lowerHull.pop();
      else break;
    }
    lowerHull.push(p);
  }
  lowerHull.pop();
  if (upperHull.length === 1 && lowerHull.length === 1 && upperHull[0].x === lowerHull[0].x && upperHull[0].y === lowerHull[0].y) return upperHull;
  else return upperHull.concat(lowerHull);
}
const [injectDialogRootContext, provideDialogRootContext] = createContext("DialogRoot");
var DialogRoot_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  inheritAttrs: false,
  __name: "DialogRoot",
  props: {
    open: {
      type: Boolean,
      required: false,
      default: void 0
    },
    defaultOpen: {
      type: Boolean,
      required: false,
      default: false
    },
    modal: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const open = useVModel(props, "open", emit, {
      defaultValue: props.defaultOpen,
      passive: props.open === void 0
    });
    const triggerElement = vueExports.ref();
    const contentElement = vueExports.ref();
    const { modal } = vueExports.toRefs(props);
    provideDialogRootContext({
      open,
      modal,
      openModal: () => {
        open.value = true;
      },
      onOpenChange: (value) => {
        open.value = value;
      },
      onOpenToggle: () => {
        open.value = !open.value;
      },
      contentId: "",
      titleId: "",
      descriptionId: "",
      triggerElement,
      contentElement
    });
    return (_ctx, _cache) => {
      return vueExports.renderSlot(_ctx.$slots, "default", {
        open: vueExports.unref(open),
        close: () => open.value = false
      });
    };
  }
});
var DialogRoot_default = DialogRoot_vue_vue_type_script_setup_true_lang_default;
var DialogContentImpl_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DialogContentImpl",
  props: {
    forceMount: {
      type: Boolean,
      required: false
    },
    trapFocus: {
      type: Boolean,
      required: false
    },
    disableOutsidePointerEvents: {
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
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const rootContext = injectDialogRootContext();
    const { forwardRef, currentElement: contentElement } = useForwardExpose();
    rootContext.titleId ||= useId(void 0, "reka-dialog-title");
    rootContext.descriptionId ||= useId(void 0, "reka-dialog-description");
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(FocusScope_default), {
        "as-child": "",
        loop: "",
        trapped: props.trapFocus,
        onMountAutoFocus: _cache[5] || (_cache[5] = ($event) => emits("openAutoFocus", $event)),
        onUnmountAutoFocus: _cache[6] || (_cache[6] = ($event) => emits("closeAutoFocus", $event))
      }, {
        default: vueExports.withCtx(() => [vueExports.createVNode(vueExports.unref(DismissableLayer_default), vueExports.mergeProps({
          id: vueExports.unref(rootContext).contentId,
          ref: vueExports.unref(forwardRef),
          as: _ctx.as,
          "as-child": _ctx.asChild,
          "disable-outside-pointer-events": _ctx.disableOutsidePointerEvents,
          role: "dialog",
          "aria-describedby": vueExports.unref(rootContext).descriptionId,
          "aria-labelledby": vueExports.unref(rootContext).titleId,
          "data-state": vueExports.unref(getOpenState$1)(vueExports.unref(rootContext).open.value)
        }, _ctx.$attrs, {
          onDismiss: _cache[0] || (_cache[0] = ($event) => vueExports.unref(rootContext).onOpenChange(false)),
          onEscapeKeyDown: _cache[1] || (_cache[1] = ($event) => emits("escapeKeyDown", $event)),
          onFocusOutside: _cache[2] || (_cache[2] = ($event) => emits("focusOutside", $event)),
          onInteractOutside: _cache[3] || (_cache[3] = ($event) => emits("interactOutside", $event)),
          onPointerDownOutside: _cache[4] || (_cache[4] = ($event) => emits("pointerDownOutside", $event))
        }), {
          default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 16, [
          "id",
          "as",
          "as-child",
          "disable-outside-pointer-events",
          "aria-describedby",
          "aria-labelledby",
          "data-state"
        ])]),
        _: 3
      }, 8, ["trapped"]);
    };
  }
});
var DialogContentImpl_default = DialogContentImpl_vue_vue_type_script_setup_true_lang_default;
var DialogContentModal_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DialogContentModal",
  props: {
    forceMount: {
      type: Boolean,
      required: false
    },
    trapFocus: {
      type: Boolean,
      required: false
    },
    disableOutsidePointerEvents: {
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
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const rootContext = injectDialogRootContext();
    const emitsAsProps = useEmitAsProps(emits);
    const { forwardRef, currentElement } = useForwardExpose();
    useHideOthers(currentElement);
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(DialogContentImpl_default, vueExports.mergeProps({
        ...props,
        ...vueExports.unref(emitsAsProps)
      }, {
        ref: vueExports.unref(forwardRef),
        "trap-focus": vueExports.unref(rootContext).open.value,
        "disable-outside-pointer-events": true,
        onCloseAutoFocus: _cache[0] || (_cache[0] = (event) => {
          if (!event.defaultPrevented) {
            event.preventDefault();
            vueExports.unref(rootContext).triggerElement.value?.focus();
          }
        }),
        onPointerDownOutside: _cache[1] || (_cache[1] = (event) => {
          const originalEvent = event.detail.originalEvent;
          const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
          const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
          if (isRightClick) event.preventDefault();
        }),
        onFocusOutside: _cache[2] || (_cache[2] = (event) => {
          event.preventDefault();
        })
      }), {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, ["trap-focus"]);
    };
  }
});
var DialogContentModal_default = DialogContentModal_vue_vue_type_script_setup_true_lang_default;
var DialogContentNonModal_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DialogContentNonModal",
  props: {
    forceMount: {
      type: Boolean,
      required: false
    },
    trapFocus: {
      type: Boolean,
      required: false
    },
    disableOutsidePointerEvents: {
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
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const emitsAsProps = useEmitAsProps(emits);
    useForwardExpose();
    const rootContext = injectDialogRootContext();
    const hasInteractedOutsideRef = vueExports.ref(false);
    const hasPointerDownOutsideRef = vueExports.ref(false);
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(DialogContentImpl_default, vueExports.mergeProps({
        ...props,
        ...vueExports.unref(emitsAsProps)
      }, {
        "trap-focus": false,
        "disable-outside-pointer-events": false,
        onCloseAutoFocus: _cache[0] || (_cache[0] = (event) => {
          if (!event.defaultPrevented) {
            if (!hasInteractedOutsideRef.value) vueExports.unref(rootContext).triggerElement.value?.focus();
            event.preventDefault();
          }
          hasInteractedOutsideRef.value = false;
          hasPointerDownOutsideRef.value = false;
        }),
        onInteractOutside: _cache[1] || (_cache[1] = (event) => {
          if (!event.defaultPrevented) {
            hasInteractedOutsideRef.value = true;
            if (event.detail.originalEvent.type === "pointerdown") hasPointerDownOutsideRef.value = true;
          }
          const target = event.target;
          const targetIsTrigger = vueExports.unref(rootContext).triggerElement.value?.contains(target);
          if (targetIsTrigger) event.preventDefault();
          if (event.detail.originalEvent.type === "focusin" && hasPointerDownOutsideRef.value) event.preventDefault();
        })
      }), {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var DialogContentNonModal_default = DialogContentNonModal_vue_vue_type_script_setup_true_lang_default;
var DialogContent_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DialogContent",
  props: {
    forceMount: {
      type: Boolean,
      required: false
    },
    disableOutsidePointerEvents: {
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
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const rootContext = injectDialogRootContext();
    const emitsAsProps = useEmitAsProps(emits);
    const { forwardRef } = useForwardExpose();
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Presence_default), { present: _ctx.forceMount || vueExports.unref(rootContext).open.value }, {
        default: vueExports.withCtx(() => [vueExports.unref(rootContext).modal.value ? (vueExports.openBlock(), vueExports.createBlock(DialogContentModal_default, vueExports.mergeProps({
          key: 0,
          ref: vueExports.unref(forwardRef)
        }, {
          ...props,
          ...vueExports.unref(emitsAsProps),
          ..._ctx.$attrs
        }), {
          default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 16)) : (vueExports.openBlock(), vueExports.createBlock(DialogContentNonModal_default, vueExports.mergeProps({
          key: 1,
          ref: vueExports.unref(forwardRef)
        }, {
          ...props,
          ...vueExports.unref(emitsAsProps),
          ..._ctx.$attrs
        }), {
          default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 16))]),
        _: 3
      }, 8, ["present"]);
    };
  }
});
var DialogContent_default = DialogContent_vue_vue_type_script_setup_true_lang_default;
var DialogDescription_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DialogDescription",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "p"
    }
  },
  setup(__props) {
    const props = __props;
    useForwardExpose();
    const rootContext = injectDialogRootContext();
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Primitive), vueExports.mergeProps(props, { id: vueExports.unref(rootContext).descriptionId }), {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, ["id"]);
    };
  }
});
var DialogDescription_default = DialogDescription_vue_vue_type_script_setup_true_lang_default;
var DialogOverlayImpl_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DialogOverlayImpl",
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
  setup(__props) {
    const rootContext = injectDialogRootContext();
    useBodyScrollLock(true);
    useForwardExpose();
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Primitive), {
        as: _ctx.as,
        "as-child": _ctx.asChild,
        "data-state": vueExports.unref(rootContext).open.value ? "open" : "closed",
        style: { "pointer-events": "auto" }
      }, {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 8, [
        "as",
        "as-child",
        "data-state"
      ]);
    };
  }
});
var DialogOverlayImpl_default = DialogOverlayImpl_vue_vue_type_script_setup_true_lang_default;
var DialogOverlay_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DialogOverlay",
  props: {
    forceMount: {
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
    const rootContext = injectDialogRootContext();
    const { forwardRef } = useForwardExpose();
    return (_ctx, _cache) => {
      return vueExports.unref(rootContext)?.modal.value ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Presence_default), {
        key: 0,
        present: _ctx.forceMount || vueExports.unref(rootContext).open.value
      }, {
        default: vueExports.withCtx(() => [vueExports.createVNode(DialogOverlayImpl_default, vueExports.mergeProps(_ctx.$attrs, {
          ref: vueExports.unref(forwardRef),
          as: _ctx.as,
          "as-child": _ctx.asChild
        }), {
          default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 16, ["as", "as-child"])]),
        _: 3
      }, 8, ["present"])) : vueExports.createCommentVNode("v-if", true);
    };
  }
});
var DialogOverlay_default = DialogOverlay_vue_vue_type_script_setup_true_lang_default;
var Teleport_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "Teleport",
  props: {
    to: {
      type: null,
      required: false,
      default: "body"
    },
    disabled: {
      type: Boolean,
      required: false
    },
    defer: {
      type: Boolean,
      required: false
    },
    forceMount: {
      type: Boolean,
      required: false
    }
  },
  setup(__props) {
    const isMounted = useMounted();
    return (_ctx, _cache) => {
      return vueExports.unref(isMounted) || _ctx.forceMount ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Teleport, {
        key: 0,
        to: _ctx.to,
        disabled: _ctx.disabled,
        defer: _ctx.defer
      }, [vueExports.renderSlot(_ctx.$slots, "default")], 8, [
        "to",
        "disabled",
        "defer"
      ])) : vueExports.createCommentVNode("v-if", true);
    };
  }
});
var Teleport_default = Teleport_vue_vue_type_script_setup_true_lang_default;
var DialogPortal_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DialogPortal",
  props: {
    to: {
      type: null,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false
    },
    defer: {
      type: Boolean,
      required: false
    },
    forceMount: {
      type: Boolean,
      required: false
    }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Teleport_default), vueExports.normalizeProps(vueExports.guardReactiveProps(props)), {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var DialogPortal_default = DialogPortal_vue_vue_type_script_setup_true_lang_default;
var DialogTitle_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "DialogTitle",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "h2"
    }
  },
  setup(__props) {
    const props = __props;
    const rootContext = injectDialogRootContext();
    useForwardExpose();
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Primitive), vueExports.mergeProps(props, { id: vueExports.unref(rootContext).titleId }), {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, ["id"]);
    };
  }
});
var DialogTitle_default = DialogTitle_vue_vue_type_script_setup_true_lang_default;
const [injectAvatarRootContext, provideAvatarRootContext] = createContext("AvatarRoot");
var AvatarRoot_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "AvatarRoot",
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
    useForwardExpose();
    provideAvatarRootContext({ imageLoadingStatus: vueExports.ref("idle") });
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Primitive), {
        "as-child": _ctx.asChild,
        as: _ctx.as
      }, {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 8, ["as-child", "as"]);
    };
  }
});
var AvatarRoot_default = AvatarRoot_vue_vue_type_script_setup_true_lang_default;
var AvatarFallback_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "AvatarFallback",
  props: {
    delayMs: {
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
      default: "span"
    }
  },
  setup(__props) {
    const props = __props;
    const rootContext = injectAvatarRootContext();
    useForwardExpose();
    const canRender = vueExports.ref(props.delayMs === void 0);
    vueExports.watchEffect((onCleanup) => {
      if (props.delayMs && isClient) ;
    });
    return (_ctx, _cache) => {
      return canRender.value && vueExports.unref(rootContext).imageLoadingStatus.value !== "loaded" ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Primitive), {
        key: 0,
        "as-child": _ctx.asChild,
        as: _ctx.as
      }, {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 8, ["as-child", "as"])) : vueExports.createCommentVNode("v-if", true);
    };
  }
});
var AvatarFallback_default = AvatarFallback_vue_vue_type_script_setup_true_lang_default;
function resolveLoadingStatus(image, src) {
  if (!image) return "idle";
  if (!src) return "error";
  if (image.src !== src) image.src = src;
  return image.complete && image.naturalWidth > 0 ? "loaded" : "loading";
}
function useImageLoadingStatus(src, { referrerPolicy, crossOrigin } = {}) {
  const isMounted = vueExports.ref(false);
  const imageRef = vueExports.ref(null);
  const image = vueExports.computed(() => {
    if (!isMounted.value) return null;
    if (!imageRef.value && isClient) ;
    return imageRef.value;
  });
  const loadingStatus = vueExports.ref(resolveLoadingStatus(image.value, src.value));
  return loadingStatus;
}
var AvatarImage_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "AvatarImage",
  props: {
    src: {
      type: String,
      required: true
    },
    referrerPolicy: {
      type: null,
      required: false
    },
    crossOrigin: {
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
      default: "img"
    }
  },
  emits: ["loadingStatusChange"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { src, referrerPolicy, crossOrigin } = vueExports.toRefs(props);
    useForwardExpose();
    const rootContext = injectAvatarRootContext();
    const imageLoadingStatus = useImageLoadingStatus(src, {
      referrerPolicy,
      crossOrigin
    });
    vueExports.watch(imageLoadingStatus, (newValue) => {
      emits("loadingStatusChange", newValue);
      if (newValue !== "idle") rootContext.imageLoadingStatus.value = newValue;
    }, { immediate: true });
    return (_ctx, _cache) => {
      return vueExports.withDirectives((vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Primitive), {
        role: "img",
        "as-child": _ctx.asChild,
        as: _ctx.as,
        src: vueExports.unref(src),
        "referrer-policy": vueExports.unref(referrerPolicy)
      }, {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 8, [
        "as-child",
        "as",
        "src",
        "referrer-policy"
      ])), [[vueExports.vShow, vueExports.unref(imageLoadingStatus) === "loaded"]]);
    };
  }
});
var AvatarImage_default = AvatarImage_vue_vue_type_script_setup_true_lang_default;
const [injectNavigationMenuContext, provideNavigationMenuContext] = createContext(["NavigationMenuRoot", "NavigationMenuSub"], "NavigationMenuContext");
var NavigationMenuRoot_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "NavigationMenuRoot",
  props: {
    modelValue: {
      type: String,
      required: false,
      default: void 0
    },
    defaultValue: {
      type: String,
      required: false
    },
    dir: {
      type: String,
      required: false
    },
    orientation: {
      type: String,
      required: false,
      default: "horizontal"
    },
    delayDuration: {
      type: Number,
      required: false,
      default: 200
    },
    skipDelayDuration: {
      type: Number,
      required: false,
      default: 300
    },
    disableClickTrigger: {
      type: Boolean,
      required: false,
      default: false
    },
    disableHoverTrigger: {
      type: Boolean,
      required: false,
      default: false
    },
    disablePointerLeaveClose: {
      type: Boolean,
      required: false
    },
    unmountOnHide: {
      type: Boolean,
      required: false,
      default: true
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "nav"
    }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const modelValue = useVModel(props, "modelValue", emits, {
      defaultValue: props.defaultValue ?? "",
      passive: props.modelValue === void 0
    });
    const previousValue = vueExports.ref("");
    const { forwardRef, currentElement: rootNavigationMenu } = useForwardExpose();
    const indicatorTrack = vueExports.ref();
    const viewport = vueExports.ref();
    const activeTrigger = vueExports.ref();
    const { getItems, CollectionSlot } = useCollection({
      key: "NavigationMenu",
      isProvider: true
    });
    const { delayDuration, skipDelayDuration, dir: propDir, disableClickTrigger, disableHoverTrigger, unmountOnHide } = vueExports.toRefs(props);
    const dir = useDirection(propDir);
    const isDelaySkipped = refAutoReset(false, skipDelayDuration);
    const computedDelay = vueExports.computed(() => {
      const isOpen = modelValue.value !== "";
      if (isOpen || isDelaySkipped.value) return 150;
      else return delayDuration.value;
    });
    const debouncedFn = useDebounceFn((val) => {
      if (typeof val === "string") {
        previousValue.value = modelValue.value;
        modelValue.value = val;
      }
    }, computedDelay);
    vueExports.watchEffect(() => {
      if (!modelValue.value) return;
      const items = getItems().map((i) => i.ref);
      activeTrigger.value = items.find((item) => item.id.includes(modelValue.value));
    });
    provideNavigationMenuContext({
      isRootMenu: true,
      modelValue,
      previousValue,
      baseId: useId(void 0, "reka-navigation-menu"),
      disableClickTrigger,
      disableHoverTrigger,
      dir,
      unmountOnHide,
      orientation: props.orientation,
      rootNavigationMenu,
      indicatorTrack,
      activeTrigger,
      onIndicatorTrackChange: (val) => {
        indicatorTrack.value = val;
      },
      viewport,
      onViewportChange: (val) => {
        viewport.value = val;
      },
      onTriggerEnter: (val) => {
        debouncedFn(val);
      },
      onTriggerLeave: () => {
        isDelaySkipped.value = true;
        debouncedFn("");
      },
      onContentEnter: () => {
        debouncedFn();
      },
      onContentLeave: () => {
        if (!props.disablePointerLeaveClose) debouncedFn("");
      },
      onItemSelect: (val) => {
        previousValue.value = modelValue.value;
        modelValue.value = val;
      },
      onItemDismiss: () => {
        previousValue.value = modelValue.value;
        modelValue.value = "";
      }
    });
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(CollectionSlot), null, {
        default: vueExports.withCtx(() => [vueExports.createVNode(vueExports.unref(Primitive), {
          ref: vueExports.unref(forwardRef),
          "aria-label": "Main",
          as: _ctx.as,
          "as-child": _ctx.asChild,
          "data-orientation": _ctx.orientation,
          dir: vueExports.unref(dir),
          "data-reka-navigation-menu": ""
        }, {
          default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default", { modelValue: vueExports.unref(modelValue) })]),
          _: 3
        }, 8, [
          "as",
          "as-child",
          "data-orientation",
          "dir"
        ])]),
        _: 3
      });
    };
  }
});
var NavigationMenuRoot_default = NavigationMenuRoot_vue_vue_type_script_setup_true_lang_default;
function getOpenState(open) {
  return open ? "open" : "closed";
}
function makeTriggerId(baseId, value) {
  return `${baseId}-trigger-${value}`;
}
function makeContentId(baseId, value) {
  return `${baseId}-content-${value}`;
}
const LINK_SELECT = "navigationMenu.linkSelect";
const EVENT_ROOT_CONTENT_DISMISS = "navigationMenu.rootContentDismiss";
function getTabbableCandidates(container) {
  const nodes = [];
  const walker = (void 0).createTreeWalker(container, NodeFilter.SHOW_ELEMENT, { acceptNode: (node) => {
    const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
    if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;
    return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
  } });
  while (walker.nextNode()) nodes.push(walker.currentNode);
  return nodes;
}
function focusFirst(candidates) {
  const previouslyFocusedElement = getActiveElement();
  return candidates.some((candidate) => {
    if (candidate === previouslyFocusedElement) return true;
    candidate.focus();
    return getActiveElement() !== previouslyFocusedElement;
  });
}
function removeFromTabOrder(candidates) {
  candidates.forEach((candidate) => {
    candidate.dataset.tabindex = candidate.getAttribute("tabindex") || "";
    candidate.setAttribute("tabindex", "-1");
  });
  return () => {
    candidates.forEach((candidate) => {
      const prevTabIndex = candidate.dataset.tabindex;
      candidate.setAttribute("tabindex", prevTabIndex);
    });
  };
}
function whenMouse(handler) {
  return (event) => event.pointerType === "mouse" ? handler(event) : void 0;
}
const [injectNavigationMenuItemContext, provideNavigationMenuItemContext] = createContext("NavigationMenuItem");
var NavigationMenuItem_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "NavigationMenuItem",
  props: {
    value: {
      type: String,
      required: false
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
  setup(__props) {
    const props = __props;
    useForwardExpose();
    const { getItems } = useCollection({ key: "NavigationMenu" });
    const context = injectNavigationMenuContext();
    const value = useId(props.value);
    const triggerRef = vueExports.ref();
    const focusProxyRef = vueExports.ref();
    const contentId = makeContentId(context.baseId, value);
    let restoreContentTabOrderRef = () => ({});
    const wasEscapeCloseRef = vueExports.ref(false);
    async function handleContentEntry(side = "start") {
      const el = (void 0).getElementById(contentId);
      if (el) {
        restoreContentTabOrderRef();
        const candidates = getTabbableCandidates(el);
        if (candidates.length) focusFirst(side === "start" ? candidates : candidates.reverse());
      }
    }
    function handleContentExit() {
      const el = (void 0).getElementById(contentId);
      if (el) {
        const candidates = getTabbableCandidates(el);
        if (candidates.length) restoreContentTabOrderRef = removeFromTabOrder(candidates);
      }
    }
    provideNavigationMenuItemContext({
      value,
      contentId,
      triggerRef,
      focusProxyRef,
      wasEscapeCloseRef,
      onEntryKeyDown: handleContentEntry,
      onFocusProxyEnter: handleContentEntry,
      onContentFocusOutside: handleContentExit,
      onRootContentClose: handleContentExit
    });
    function handleClose() {
      context.onItemDismiss();
      triggerRef.value?.focus();
    }
    function handleKeydown(ev) {
      const currentFocus = getActiveElement();
      if (ev.keyCode === 32 || ev.key === "Enter") if (context.modelValue.value === value) {
        handleClose();
        ev.preventDefault();
        return;
      } else {
        ev.target.click();
        ev.preventDefault();
        return;
      }
      const itemsArray = getItems().filter((i) => i.ref.parentElement?.hasAttribute("data-menu-item")).map((i) => i.ref);
      if (!itemsArray.includes(currentFocus)) return;
      const newSelectedElement = useArrowNavigation(ev, currentFocus, void 0, {
        itemsArray,
        loop: false
      });
      if (newSelectedElement) newSelectedElement?.focus();
      ev.preventDefault();
      ev.stopPropagation();
    }
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Primitive), {
        "as-child": _ctx.asChild,
        as: _ctx.as,
        "data-menu-item": "",
        onKeydown: vueExports.withKeys(handleKeydown, [
          "up",
          "down",
          "left",
          "right",
          "home",
          "end",
          "space"
        ])
      }, {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 8, ["as-child", "as"]);
    };
  }
});
var NavigationMenuItem_default = NavigationMenuItem_vue_vue_type_script_setup_true_lang_default;
var NavigationMenuContentImpl_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "NavigationMenuContentImpl",
  props: {
    disableOutsidePointerEvents: {
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
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { getItems } = useCollection({ key: "NavigationMenu" });
    const { forwardRef, currentElement } = useForwardExpose();
    const menuContext = injectNavigationMenuContext();
    const itemContext = injectNavigationMenuItemContext();
    const triggerId = makeTriggerId(menuContext.baseId, itemContext.value);
    const contentId = makeContentId(menuContext.baseId, itemContext.value);
    const prevMotionAttributeRef = vueExports.ref(null);
    const motionAttribute = vueExports.computed(() => {
      const values = getItems().map((i) => i.ref.id.split("trigger-")[1]);
      if (menuContext.dir.value === "rtl") values.reverse();
      const index = values.indexOf(menuContext.modelValue.value);
      const prevIndex = values.indexOf(menuContext.previousValue.value);
      const isSelected = itemContext.value === menuContext.modelValue.value;
      const wasSelected = prevIndex === values.indexOf(itemContext.value);
      if (!isSelected && !wasSelected) return prevMotionAttributeRef.value;
      const attribute = (() => {
        if (index !== prevIndex) {
          if (isSelected && prevIndex !== -1) return index > prevIndex ? "from-end" : "from-start";
          if (wasSelected && index !== -1) return index > prevIndex ? "to-start" : "to-end";
        }
        return null;
      })();
      prevMotionAttributeRef.value = attribute;
      return attribute;
    });
    function handleFocusOutside(ev) {
      emits("focusOutside", ev);
      emits("interactOutside", ev);
      const target = ev.detail.originalEvent.target;
      if (target.hasAttribute("data-navigation-menu-trigger")) ev.preventDefault();
      if (!ev.defaultPrevented) {
        itemContext.onContentFocusOutside();
        const target$1 = ev.target;
        if (menuContext.rootNavigationMenu?.value?.contains(target$1)) ev.preventDefault();
      }
    }
    function handlePointerDownOutside(ev) {
      emits("pointerDownOutside", ev);
      if (!ev.defaultPrevented) {
        const target = ev.target;
        const isTrigger = getItems().some((i) => i.ref.contains(target));
        const isRootViewport = menuContext.isRootMenu && menuContext.viewport.value?.contains(target);
        if (isTrigger || isRootViewport || !menuContext.isRootMenu) ev.preventDefault();
      }
    }
    vueExports.watchEffect((cleanupFn) => {
      const content = currentElement.value;
      if (menuContext.isRootMenu && content) {
        const handleClose = () => {
          menuContext.onItemDismiss();
          itemContext.onRootContentClose();
          if (content.contains(getActiveElement())) itemContext.triggerRef.value?.focus();
        };
        content.addEventListener(EVENT_ROOT_CONTENT_DISMISS, handleClose);
        cleanupFn(() => content.removeEventListener(EVENT_ROOT_CONTENT_DISMISS, handleClose));
      }
    });
    function handleEscapeKeyDown(ev) {
      emits("escapeKeyDown", ev);
      if (!ev.defaultPrevented) {
        menuContext.onItemDismiss();
        itemContext.triggerRef?.value?.focus();
        itemContext.wasEscapeCloseRef.value = true;
      }
    }
    function handleKeydown(ev) {
      if (ev.target.closest("[data-reka-navigation-menu]") !== menuContext.rootNavigationMenu.value) return;
      const isMetaKey = ev.altKey || ev.ctrlKey || ev.metaKey;
      const isTabKey = ev.key === "Tab" && !isMetaKey;
      const candidates = getTabbableCandidates(ev.currentTarget);
      if (isTabKey) {
        const focusedElement = getActiveElement();
        const index = candidates.findIndex((candidate) => candidate === focusedElement);
        const isMovingBackwards = ev.shiftKey;
        const nextCandidates = isMovingBackwards ? candidates.slice(0, index).reverse() : candidates.slice(index + 1, candidates.length);
        if (focusFirst(nextCandidates)) ev.preventDefault();
        else {
          itemContext.focusProxyRef.value?.focus();
          return;
        }
      }
      const newSelectedElement = useArrowNavigation(ev, getActiveElement(), void 0, {
        itemsArray: candidates,
        loop: false,
        enableIgnoredElement: true
      });
      newSelectedElement?.focus();
    }
    function handleDismiss() {
      const rootContentDismissEvent = new Event(EVENT_ROOT_CONTENT_DISMISS, {
        bubbles: true,
        cancelable: true
      });
      currentElement.value?.dispatchEvent(rootContentDismissEvent);
    }
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(DismissableLayer_default), vueExports.mergeProps({
        id: vueExports.unref(contentId),
        ref: vueExports.unref(forwardRef),
        "aria-labelledby": vueExports.unref(triggerId),
        "data-motion": motionAttribute.value,
        "data-state": vueExports.unref(getOpenState)(vueExports.unref(menuContext).modelValue.value === vueExports.unref(itemContext).value),
        "data-orientation": vueExports.unref(menuContext).orientation
      }, props, {
        onKeydown: handleKeydown,
        onEscapeKeyDown: handleEscapeKeyDown,
        onPointerDownOutside: handlePointerDownOutside,
        onFocusOutside: handleFocusOutside,
        onDismiss: handleDismiss
      }), {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, [
        "id",
        "aria-labelledby",
        "data-motion",
        "data-state",
        "data-orientation"
      ]);
    };
  }
});
var NavigationMenuContentImpl_default = NavigationMenuContentImpl_vue_vue_type_script_setup_true_lang_default;
var NavigationMenuContent_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  inheritAttrs: false,
  __name: "NavigationMenuContent",
  props: {
    forceMount: {
      type: Boolean,
      required: false
    },
    disableOutsidePointerEvents: {
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
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(reactiveOmit(props, "forceMount"), emits);
    const { forwardRef } = useForwardExpose();
    const menuContext = injectNavigationMenuContext();
    const itemContext = injectNavigationMenuItemContext();
    const open = vueExports.computed(() => itemContext.value === menuContext.modelValue.value);
    const isLastActiveValue = vueExports.computed(() => {
      if (menuContext.viewport.value) {
        if (!menuContext.modelValue.value && menuContext.previousValue.value) return menuContext.previousValue.value === itemContext.value;
      }
      return false;
    });
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.Teleport, {
        to: vueExports.unref(isClient) && vueExports.unref(menuContext).viewport.value ? vueExports.unref(menuContext).viewport.value : "body",
        disabled: vueExports.unref(isClient) && vueExports.unref(menuContext).viewport.value ? !vueExports.unref(menuContext).viewport.value : true
      }, [vueExports.createVNode(vueExports.unref(Presence_default), {
        present: _ctx.forceMount || open.value || isLastActiveValue.value,
        "force-mount": !vueExports.unref(menuContext).unmountOnHide.value
      }, {
        default: vueExports.withCtx(({ present }) => [vueExports.createVNode(NavigationMenuContentImpl_default, vueExports.mergeProps({
          ref: vueExports.unref(forwardRef),
          "data-state": vueExports.unref(getOpenState)(open.value),
          style: { pointerEvents: !open.value && vueExports.unref(menuContext).isRootMenu ? "none" : void 0 }
        }, {
          ..._ctx.$attrs,
          ...vueExports.unref(forwarded)
        }, {
          hidden: !present,
          onPointerenter: _cache[0] || (_cache[0] = ($event) => vueExports.unref(menuContext).onContentEnter(vueExports.unref(itemContext).value)),
          onPointerleave: _cache[1] || (_cache[1] = ($event) => vueExports.unref(whenMouse)(() => vueExports.unref(menuContext).onContentLeave())($event)),
          onPointerDownOutside: _cache[2] || (_cache[2] = ($event) => emits("pointerDownOutside", $event)),
          onFocusOutside: _cache[3] || (_cache[3] = ($event) => emits("focusOutside", $event)),
          onInteractOutside: _cache[4] || (_cache[4] = ($event) => emits("interactOutside", $event))
        }), {
          default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
          _: 2
        }, 1040, [
          "data-state",
          "style",
          "hidden"
        ])]),
        _: 3
      }, 8, ["present", "force-mount"])], 8, ["to", "disabled"]);
    };
  }
});
var NavigationMenuContent_default = NavigationMenuContent_vue_vue_type_script_setup_true_lang_default;
var NavigationMenuIndicator_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  inheritAttrs: false,
  __name: "NavigationMenuIndicator",
  props: {
    forceMount: {
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
    const { forwardRef } = useForwardExpose();
    const menuContext = injectNavigationMenuContext();
    const indicatorStyle = vueExports.ref();
    const isHorizontal = vueExports.computed(() => menuContext.orientation === "horizontal");
    const isVisible = vueExports.computed(() => !!menuContext.modelValue.value);
    const { activeTrigger } = menuContext;
    function handlePositionChange() {
      if (!activeTrigger.value) return;
      indicatorStyle.value = {
        size: isHorizontal.value ? activeTrigger.value.offsetWidth : activeTrigger.value.offsetHeight,
        position: isHorizontal.value ? activeTrigger.value.offsetLeft : activeTrigger.value.offsetTop
      };
    }
    vueExports.watchEffect(() => {
      if (!menuContext.modelValue.value) return;
      handlePositionChange();
    });
    useResizeObserver(activeTrigger, handlePositionChange);
    useResizeObserver(menuContext.indicatorTrack, handlePositionChange);
    return (_ctx, _cache) => {
      return vueExports.unref(menuContext).indicatorTrack.value ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Teleport, {
        key: 0,
        to: vueExports.unref(menuContext).indicatorTrack.value
      }, [vueExports.createVNode(vueExports.unref(Presence_default), { present: _ctx.forceMount || isVisible.value }, {
        default: vueExports.withCtx(() => [vueExports.createVNode(vueExports.unref(Primitive), vueExports.mergeProps({
          ref: vueExports.unref(forwardRef),
          "aria-hidden": "true",
          "data-state": isVisible.value ? "visible" : "hidden",
          "data-orientation": vueExports.unref(menuContext).orientation,
          "as-child": props.asChild,
          as: _ctx.as,
          style: { ...indicatorStyle.value ? {
            "--reka-navigation-menu-indicator-size": `${indicatorStyle.value.size}px`,
            "--reka-navigation-menu-indicator-position": `${indicatorStyle.value.position}px`
          } : {} }
        }, _ctx.$attrs), {
          default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 16, [
          "data-state",
          "data-orientation",
          "as-child",
          "as",
          "style"
        ])]),
        _: 3
      }, 8, ["present"])], 8, ["to"])) : vueExports.createCommentVNode("v-if", true);
    };
  }
});
var NavigationMenuIndicator_default = NavigationMenuIndicator_vue_vue_type_script_setup_true_lang_default;
var NavigationMenuLink_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "NavigationMenuLink",
  props: {
    active: {
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
      default: "a"
    }
  },
  emits: ["select"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { CollectionItem } = useCollection({ key: "NavigationMenu" });
    useForwardExpose();
    async function handleClick(ev) {
      const linkSelectEvent = new CustomEvent(LINK_SELECT, {
        bubbles: true,
        cancelable: true,
        detail: { originalEvent: ev }
      });
      emits("select", linkSelectEvent);
      if (!linkSelectEvent.defaultPrevented && !ev.metaKey) {
        const rootContentDismissEvent = new CustomEvent(EVENT_ROOT_CONTENT_DISMISS, {
          bubbles: true,
          cancelable: true
        });
        ev.target?.dispatchEvent(rootContentDismissEvent);
      }
    }
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(CollectionItem), null, {
        default: vueExports.withCtx(() => [vueExports.createVNode(vueExports.unref(Primitive), {
          as: _ctx.as,
          "data-active": _ctx.active ? "" : void 0,
          "aria-current": _ctx.active ? "page" : void 0,
          "as-child": props.asChild,
          onClick: handleClick
        }, {
          default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 8, [
          "as",
          "data-active",
          "aria-current",
          "as-child"
        ])]),
        _: 3
      });
    };
  }
});
var NavigationMenuLink_default = NavigationMenuLink_vue_vue_type_script_setup_true_lang_default;
var NavigationMenuList_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  inheritAttrs: false,
  __name: "NavigationMenuList",
  props: {
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
  setup(__props) {
    const props = __props;
    const menuContext = injectNavigationMenuContext();
    const { forwardRef } = useForwardExpose();
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Primitive), {
        ref: vueExports.unref(forwardRef),
        style: { "position": "relative" }
      }, {
        default: vueExports.withCtx(() => [vueExports.createVNode(vueExports.unref(Primitive), vueExports.mergeProps(_ctx.$attrs, {
          "as-child": props.asChild,
          as: _ctx.as,
          "data-orientation": vueExports.unref(menuContext).orientation
        }), {
          default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 16, [
          "as-child",
          "as",
          "data-orientation"
        ])]),
        _: 3
      }, 512);
    };
  }
});
var NavigationMenuList_default = NavigationMenuList_vue_vue_type_script_setup_true_lang_default;
const _hoisted_1 = ["aria-owns"];
var NavigationMenuTrigger_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  inheritAttrs: false,
  __name: "NavigationMenuTrigger",
  props: {
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
      required: false,
      default: "button"
    }
  },
  setup(__props) {
    const props = __props;
    const menuContext = injectNavigationMenuContext();
    const itemContext = injectNavigationMenuItemContext();
    const { CollectionItem } = useCollection({ key: "NavigationMenu" });
    const { forwardRef, currentElement: triggerElement } = useForwardExpose();
    const triggerId = vueExports.ref("");
    const contentId = vueExports.ref("");
    const hasPointerMoveOpenedRef = refAutoReset(false, 300);
    const wasClickCloseRef = vueExports.ref(false);
    const open = vueExports.computed(() => itemContext.value === menuContext.modelValue.value);
    function handlePointerEnter() {
      if (menuContext.disableHoverTrigger.value) return;
      wasClickCloseRef.value = false;
      itemContext.wasEscapeCloseRef.value = false;
    }
    function handlePointerMove(ev) {
      if (menuContext.disableHoverTrigger.value) return;
      if (ev.pointerType === "mouse") {
        if (props.disabled || wasClickCloseRef.value || itemContext.wasEscapeCloseRef.value || hasPointerMoveOpenedRef.value) return;
        menuContext.onTriggerEnter(itemContext.value);
        hasPointerMoveOpenedRef.value = true;
      }
    }
    function handlePointerLeave(ev) {
      if (menuContext.disableHoverTrigger.value) return;
      if (ev.pointerType === "mouse") {
        if (props.disabled) return;
        menuContext.onTriggerLeave();
        hasPointerMoveOpenedRef.value = false;
      }
    }
    function handleClick(event) {
      if ((!("pointerType" in event) || event.pointerType === "mouse") && menuContext.disableClickTrigger.value) return;
      if (hasPointerMoveOpenedRef.value) return;
      if (open.value) menuContext.onItemSelect("");
      else menuContext.onItemSelect(itemContext.value);
      wasClickCloseRef.value = open.value;
    }
    function handleKeydown(ev) {
      const verticalEntryKey = menuContext.dir.value === "rtl" ? "ArrowLeft" : "ArrowRight";
      const entryKey = {
        horizontal: "ArrowDown",
        vertical: verticalEntryKey
      }[menuContext.orientation];
      if (open.value && ev.key === entryKey) {
        itemContext.onEntryKeyDown();
        ev.preventDefault();
        ev.stopPropagation();
      }
    }
    function setFocusProxyRef(node) {
      itemContext.focusProxyRef.value = unrefElement(node);
      return void 0;
    }
    function handleVisuallyHiddenFocus(ev) {
      const content = (void 0).getElementById(itemContext.contentId);
      const prevFocusedElement = ev.relatedTarget;
      const wasTriggerFocused = prevFocusedElement === triggerElement.value;
      const wasFocusFromContent = content?.contains(prevFocusedElement);
      if (wasTriggerFocused || !wasFocusFromContent) itemContext.onFocusProxyEnter(wasTriggerFocused ? "start" : "end");
    }
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createElementBlock(vueExports.Fragment, null, [vueExports.createVNode(vueExports.unref(CollectionItem), null, {
        default: vueExports.withCtx(() => [vueExports.createVNode(vueExports.unref(Primitive), vueExports.mergeProps({
          id: triggerId.value,
          ref: vueExports.unref(forwardRef),
          disabled: _ctx.disabled,
          "data-disabled": _ctx.disabled ? "" : void 0,
          "data-state": vueExports.unref(getOpenState)(open.value),
          "data-navigation-menu-trigger": "",
          "aria-expanded": open.value,
          "aria-controls": contentId.value,
          "as-child": props.asChild,
          as: _ctx.as
        }, _ctx.$attrs, {
          onPointerenter: handlePointerEnter,
          onPointermove: handlePointerMove,
          onPointerleave: handlePointerLeave,
          onClick: handleClick,
          onKeydown: handleKeydown
        }), {
          default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 16, [
          "id",
          "disabled",
          "data-disabled",
          "data-state",
          "aria-expanded",
          "aria-controls",
          "as-child",
          "as"
        ])]),
        _: 3
      }), open.value ? (vueExports.openBlock(), vueExports.createElementBlock(vueExports.Fragment, { key: 0 }, [vueExports.createVNode(vueExports.unref(VisuallyHidden_default), {
        ref: setFocusProxyRef,
        "aria-hidden": "true",
        tabindex: 0,
        onFocus: handleVisuallyHiddenFocus
      }), vueExports.unref(menuContext).viewport ? (vueExports.openBlock(), vueExports.createElementBlock("span", {
        key: 0,
        "aria-owns": contentId.value
      }, null, 8, _hoisted_1)) : vueExports.createCommentVNode("v-if", true)], 64)) : vueExports.createCommentVNode("v-if", true)], 64);
    };
  }
});
var NavigationMenuTrigger_default = NavigationMenuTrigger_vue_vue_type_script_setup_true_lang_default;
var NavigationMenuViewport_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  inheritAttrs: false,
  __name: "NavigationMenuViewport",
  props: {
    forceMount: {
      type: Boolean,
      required: false
    },
    align: {
      type: String,
      required: false,
      default: "center"
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
    const { forwardRef, currentElement } = useForwardExpose();
    const menuContext = injectNavigationMenuContext();
    const { activeTrigger, rootNavigationMenu, modelValue } = menuContext;
    const size = vueExports.ref();
    const position = vueExports.ref();
    const open = vueExports.computed(() => !!menuContext.modelValue.value);
    vueExports.watch(currentElement, () => {
      menuContext.onViewportChange(currentElement.value);
    });
    const content = vueExports.ref();
    vueExports.watch([modelValue, open], () => {
      vueExports.nextTick(() => {
        if (!currentElement.value) return;
        requestAnimationFrame(() => {
          const el = currentElement.value?.querySelector("[data-state=open]");
          content.value = el;
        });
      });
    }, { immediate: true });
    function updatePosition() {
      if (content.value && activeTrigger.value && rootNavigationMenu.value) {
        const bodyWidth = (void 0).documentElement.offsetWidth;
        const bodyHeight = (void 0).documentElement.offsetHeight;
        const rootRect = rootNavigationMenu.value.getBoundingClientRect();
        const rect = activeTrigger.value.getBoundingClientRect();
        const { offsetWidth, offsetHeight } = content.value;
        const startPositionLeft = rect.left - rootRect.left;
        const startPositionTop = rect.top - rootRect.top;
        let posLeft = null;
        let posTop = null;
        switch (props.align) {
          case "start":
            posLeft = startPositionLeft;
            posTop = startPositionTop;
            break;
          case "end":
            posLeft = startPositionLeft - offsetWidth + rect.width;
            posTop = startPositionTop - offsetHeight + rect.height;
            break;
          default:
            posLeft = startPositionLeft - offsetWidth / 2 + rect.width / 2;
            posTop = startPositionTop - offsetHeight / 2 + rect.height / 2;
        }
        const screenOffset = 10;
        if (posLeft + rootRect.left < screenOffset) posLeft = screenOffset - rootRect.left;
        const rightOffset = posLeft + rootRect.left + offsetWidth;
        if (rightOffset > bodyWidth - screenOffset) {
          posLeft -= rightOffset - bodyWidth + screenOffset;
          if (posLeft < screenOffset - rootRect.left) posLeft = screenOffset - rootRect.left;
        }
        if (posTop + rootRect.top < screenOffset) posTop = screenOffset - rootRect.top;
        const bottomOffset = posTop + rootRect.top + offsetHeight;
        if (bottomOffset > bodyHeight - screenOffset) {
          posTop -= bottomOffset - bodyHeight + screenOffset;
          if (posTop < screenOffset - rootRect.top) posTop = screenOffset - rootRect.top;
        }
        posLeft = Math.round(posLeft);
        posTop = Math.round(posTop);
        position.value = {
          left: posLeft,
          top: posTop
        };
      }
    }
    useResizeObserver(content, () => {
      if (content.value) {
        size.value = {
          width: content.value.offsetWidth,
          height: content.value.offsetHeight
        };
        updatePosition();
      }
    });
    useResizeObserver([globalThis.document?.body, rootNavigationMenu], () => {
      updatePosition();
    });
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Presence_default), {
        present: _ctx.forceMount || open.value,
        "force-mount": !vueExports.unref(menuContext).unmountOnHide.value,
        onAfterLeave: _cache[2] || (_cache[2] = () => {
          size.value = void 0;
          position.value = void 0;
        })
      }, {
        default: vueExports.withCtx(({ present }) => [vueExports.createVNode(vueExports.unref(Primitive), vueExports.mergeProps(_ctx.$attrs, {
          ref: vueExports.unref(forwardRef),
          as: _ctx.as,
          "as-child": _ctx.asChild,
          "data-state": vueExports.unref(getOpenState)(open.value),
          "data-orientation": vueExports.unref(menuContext).orientation,
          style: {
            pointerEvents: !open.value && vueExports.unref(menuContext).isRootMenu ? "none" : void 0,
            ["--reka-navigation-menu-viewport-width"]: size.value ? `${size.value?.width}px` : void 0,
            ["--reka-navigation-menu-viewport-height"]: size.value ? `${size.value?.height}px` : void 0,
            ["--reka-navigation-menu-viewport-left"]: position.value ? `${position.value?.left}px` : void 0,
            ["--reka-navigation-menu-viewport-top"]: position.value ? `${position.value?.top}px` : void 0
          },
          hidden: !present,
          onPointerenter: _cache[0] || (_cache[0] = ($event) => vueExports.unref(menuContext).onContentEnter(vueExports.unref(menuContext).modelValue.value)),
          onPointerleave: _cache[1] || (_cache[1] = ($event) => vueExports.unref(whenMouse)(() => vueExports.unref(menuContext).onContentLeave())($event))
        }), {
          default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
          _: 2
        }, 1040, [
          "as",
          "as-child",
          "data-state",
          "data-orientation",
          "style",
          "hidden"
        ])]),
        _: 3
      }, 8, ["present", "force-mount"]);
    };
  }
});
var NavigationMenuViewport_default = NavigationMenuViewport_vue_vue_type_script_setup_true_lang_default;
const TOOLTIP_OPEN = "tooltip.open";
const [injectTooltipRootContext, provideTooltipRootContext] = createContext("TooltipRoot");
var TooltipRoot_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "TooltipRoot",
  props: {
    defaultOpen: {
      type: Boolean,
      required: false,
      default: false
    },
    open: {
      type: Boolean,
      required: false,
      default: void 0
    },
    delayDuration: {
      type: Number,
      required: false,
      default: void 0
    },
    disableHoverableContent: {
      type: Boolean,
      required: false,
      default: void 0
    },
    disableClosingTrigger: {
      type: Boolean,
      required: false,
      default: void 0
    },
    disabled: {
      type: Boolean,
      required: false,
      default: void 0
    },
    ignoreNonKeyboardFocus: {
      type: Boolean,
      required: false,
      default: void 0
    }
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    useForwardExpose();
    const providerContext = injectTooltipProviderContext();
    const disableHoverableContent = vueExports.computed(() => props.disableHoverableContent ?? providerContext.disableHoverableContent.value);
    const disableClosingTrigger = vueExports.computed(() => props.disableClosingTrigger ?? providerContext.disableClosingTrigger.value);
    const disableTooltip = vueExports.computed(() => props.disabled ?? providerContext.disabled.value);
    const delayDuration = vueExports.computed(() => props.delayDuration ?? providerContext.delayDuration.value);
    const ignoreNonKeyboardFocus = vueExports.computed(() => props.ignoreNonKeyboardFocus ?? providerContext.ignoreNonKeyboardFocus.value);
    const open = useVModel(props, "open", emit, {
      defaultValue: props.defaultOpen,
      passive: props.open === void 0
    });
    vueExports.watch(open, (isOpen) => {
      if (!providerContext.onClose) return;
      if (isOpen) {
        providerContext.onOpen();
        (void 0).dispatchEvent(new CustomEvent(TOOLTIP_OPEN));
      } else providerContext.onClose();
    });
    const wasOpenDelayedRef = vueExports.ref(false);
    const trigger = vueExports.ref();
    const stateAttribute = vueExports.computed(() => {
      if (!open.value) return "closed";
      return wasOpenDelayedRef.value ? "delayed-open" : "instant-open";
    });
    const { start: startTimer, stop: clearTimer } = useTimeoutFn(() => {
      wasOpenDelayedRef.value = true;
      open.value = true;
    }, delayDuration, { immediate: false });
    function handleOpen() {
      clearTimer();
      wasOpenDelayedRef.value = false;
      open.value = true;
    }
    function handleClose() {
      clearTimer();
      open.value = false;
    }
    function handleDelayedOpen() {
      startTimer();
    }
    provideTooltipRootContext({
      contentId: "",
      open,
      stateAttribute,
      trigger,
      onTriggerChange(el) {
        trigger.value = el;
      },
      onTriggerEnter() {
        if (providerContext.isOpenDelayed.value) handleDelayedOpen();
        else handleOpen();
      },
      onTriggerLeave() {
        if (disableHoverableContent.value) handleClose();
        else clearTimer();
      },
      onOpen: handleOpen,
      onClose: handleClose,
      disableHoverableContent,
      disableClosingTrigger,
      disabled: disableTooltip,
      ignoreNonKeyboardFocus
    });
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(PopperRoot_default), null, {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default", { open: vueExports.unref(open) })]),
        _: 3
      });
    };
  }
});
var TooltipRoot_default = TooltipRoot_vue_vue_type_script_setup_true_lang_default;
var TooltipContentImpl_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "TooltipContentImpl",
  props: {
    ariaLabel: {
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
    },
    side: {
      type: null,
      required: false,
      default: "top"
    },
    sideOffset: {
      type: Number,
      required: false,
      default: 0
    },
    align: {
      type: null,
      required: false,
      default: "center"
    },
    alignOffset: {
      type: Number,
      required: false
    },
    avoidCollisions: {
      type: Boolean,
      required: false,
      default: true
    },
    collisionBoundary: {
      type: null,
      required: false,
      default: () => []
    },
    collisionPadding: {
      type: [Number, Object],
      required: false,
      default: 0
    },
    arrowPadding: {
      type: Number,
      required: false,
      default: 0
    },
    sticky: {
      type: String,
      required: false,
      default: "partial"
    },
    hideWhenDetached: {
      type: Boolean,
      required: false,
      default: false
    },
    positionStrategy: {
      type: String,
      required: false
    },
    updatePositionStrategy: {
      type: String,
      required: false
    }
  },
  emits: ["escapeKeyDown", "pointerDownOutside"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const rootContext = injectTooltipRootContext();
    const { forwardRef } = useForwardExpose();
    const slot = vueExports.useSlots();
    const defaultSlot = vueExports.computed(() => slot.default?.({}));
    const ariaLabel = vueExports.computed(() => {
      if (props.ariaLabel) return props.ariaLabel;
      let content = "";
      function recursiveTextSearch(node) {
        if (typeof node.children === "string" && node.type !== vueExports.Comment) content += node.children;
        else if (Array.isArray(node.children)) node.children.forEach((child) => recursiveTextSearch(child));
      }
      defaultSlot.value?.forEach((node) => recursiveTextSearch(node));
      return content;
    });
    const popperContentProps = vueExports.computed(() => {
      const { ariaLabel: _, ...restProps } = props;
      return restProps;
    });
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(DismissableLayer_default), {
        "as-child": "",
        "disable-outside-pointer-events": false,
        onEscapeKeyDown: _cache[0] || (_cache[0] = ($event) => emits("escapeKeyDown", $event)),
        onPointerDownOutside: _cache[1] || (_cache[1] = (event) => {
          if (vueExports.unref(rootContext).disableClosingTrigger.value && vueExports.unref(rootContext).trigger.value?.contains(event.target)) event.preventDefault();
          emits("pointerDownOutside", event);
        }),
        onFocusOutside: _cache[2] || (_cache[2] = vueExports.withModifiers(() => {
        }, ["prevent"])),
        onDismiss: _cache[3] || (_cache[3] = ($event) => vueExports.unref(rootContext).onClose())
      }, {
        default: vueExports.withCtx(() => [vueExports.createVNode(vueExports.unref(PopperContent_default), vueExports.mergeProps({
          ref: vueExports.unref(forwardRef),
          "data-state": vueExports.unref(rootContext).stateAttribute.value
        }, {
          ..._ctx.$attrs,
          ...popperContentProps.value
        }, { style: {
          "--reka-tooltip-content-transform-origin": "var(--reka-popper-transform-origin)",
          "--reka-tooltip-content-available-width": "var(--reka-popper-available-width)",
          "--reka-tooltip-content-available-height": "var(--reka-popper-available-height)",
          "--reka-tooltip-trigger-width": "var(--reka-popper-anchor-width)",
          "--reka-tooltip-trigger-height": "var(--reka-popper-anchor-height)"
        } }), {
          default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default"), vueExports.createVNode(vueExports.unref(VisuallyHidden_default), {
            id: vueExports.unref(rootContext).contentId,
            role: "tooltip"
          }, {
            default: vueExports.withCtx(() => [vueExports.createTextVNode(vueExports.toDisplayString(ariaLabel.value), 1)]),
            _: 1
          }, 8, ["id"])]),
          _: 3
        }, 16, ["data-state"])]),
        _: 3
      });
    };
  }
});
var TooltipContentImpl_default = TooltipContentImpl_vue_vue_type_script_setup_true_lang_default;
var TooltipContentHoverable_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "TooltipContentHoverable",
  props: {
    ariaLabel: {
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
    },
    side: {
      type: null,
      required: false
    },
    sideOffset: {
      type: Number,
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
    }
  },
  setup(__props) {
    const props = __props;
    const forwardedProps = useForwardProps(props);
    const { forwardRef, currentElement } = useForwardExpose();
    const { trigger, onClose } = injectTooltipRootContext();
    const providerContext = injectTooltipProviderContext();
    const { isPointerInTransit, onPointerExit } = useGraceArea(trigger, currentElement);
    providerContext.isPointerInTransitRef = isPointerInTransit;
    onPointerExit(() => {
      onClose();
    });
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(TooltipContentImpl_default, vueExports.mergeProps({ ref: vueExports.unref(forwardRef) }, vueExports.unref(forwardedProps)), {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var TooltipContentHoverable_default = TooltipContentHoverable_vue_vue_type_script_setup_true_lang_default;
var TooltipContent_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "TooltipContent",
  props: {
    forceMount: {
      type: Boolean,
      required: false
    },
    ariaLabel: {
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
    },
    side: {
      type: null,
      required: false,
      default: "top"
    },
    sideOffset: {
      type: Number,
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
    }
  },
  emits: ["escapeKeyDown", "pointerDownOutside"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const rootContext = injectTooltipRootContext();
    const forwarded = useForwardPropsEmits(props, emits);
    const { forwardRef } = useForwardExpose();
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Presence_default), { present: _ctx.forceMount || vueExports.unref(rootContext).open.value }, {
        default: vueExports.withCtx(() => [(vueExports.openBlock(), vueExports.createBlock(vueExports.resolveDynamicComponent(vueExports.unref(rootContext).disableHoverableContent.value ? TooltipContentImpl_default : TooltipContentHoverable_default), vueExports.mergeProps({ ref: vueExports.unref(forwardRef) }, vueExports.unref(forwarded)), {
          default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 16))]),
        _: 3
      }, 8, ["present"]);
    };
  }
});
var TooltipContent_default = TooltipContent_vue_vue_type_script_setup_true_lang_default;
var TooltipPortal_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "TooltipPortal",
  props: {
    to: {
      type: null,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false
    },
    defer: {
      type: Boolean,
      required: false
    },
    forceMount: {
      type: Boolean,
      required: false
    }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(Teleport_default), vueExports.normalizeProps(vueExports.guardReactiveProps(props)), {
        default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var TooltipPortal_default = TooltipPortal_vue_vue_type_script_setup_true_lang_default;
var TooltipTrigger_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vueExports.defineComponent({
  __name: "TooltipTrigger",
  props: {
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
    const rootContext = injectTooltipRootContext();
    const providerContext = injectTooltipProviderContext();
    rootContext.contentId ||= useId(void 0, "reka-tooltip-content");
    const { forwardRef } = useForwardExpose();
    const isPointerDown = vueExports.ref(false);
    const hasPointerMoveOpened = vueExports.ref(false);
    const tooltipListeners = vueExports.computed(() => {
      if (rootContext.disabled.value) return {};
      return {
        click: handleClick,
        focus: handleFocus,
        pointermove: handlePointerMove,
        pointerleave: handlePointerLeave,
        pointerdown: handlePointerDown,
        blur: handleBlur
      };
    });
    function handlePointerUp() {
      setTimeout(() => {
        isPointerDown.value = false;
      }, 1);
    }
    function handlePointerDown() {
      if (rootContext.open && !rootContext.disableClosingTrigger.value) rootContext.onClose();
      isPointerDown.value = true;
      (void 0).addEventListener("pointerup", handlePointerUp, { once: true });
    }
    function handlePointerMove(event) {
      if (event.pointerType === "touch") return;
      if (!hasPointerMoveOpened.value && !providerContext.isPointerInTransitRef.value) {
        rootContext.onTriggerEnter();
        hasPointerMoveOpened.value = true;
      }
    }
    function handlePointerLeave() {
      rootContext.onTriggerLeave();
      hasPointerMoveOpened.value = false;
    }
    function handleFocus(event) {
      if (isPointerDown.value) return;
      if (rootContext.ignoreNonKeyboardFocus.value && !event.target.matches?.(":focus-visible")) return;
      rootContext.onOpen();
    }
    function handleBlur() {
      rootContext.onClose();
    }
    function handleClick() {
      if (!rootContext.disableClosingTrigger.value) rootContext.onClose();
    }
    return (_ctx, _cache) => {
      return vueExports.openBlock(), vueExports.createBlock(vueExports.unref(PopperAnchor_default), {
        "as-child": "",
        reference: _ctx.reference
      }, {
        default: vueExports.withCtx(() => [vueExports.createVNode(vueExports.unref(Primitive), vueExports.mergeProps({
          ref: vueExports.unref(forwardRef),
          "aria-describedby": vueExports.unref(rootContext).open.value ? vueExports.unref(rootContext).contentId : void 0,
          "data-state": vueExports.unref(rootContext).stateAttribute.value,
          as: _ctx.as,
          "as-child": props.asChild,
          "data-grace-area-trigger": ""
        }, vueExports.toHandlers(tooltipListeners.value)), {
          default: vueExports.withCtx(() => [vueExports.renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 16, [
          "aria-describedby",
          "data-state",
          "as",
          "as-child"
        ])]),
        _: 3
      }, 8, ["reference"]);
    };
  }
});
var TooltipTrigger_default = TooltipTrigger_vue_vue_type_script_setup_true_lang_default;
const _sfc_main$b = /* @__PURE__ */ vueExports.defineComponent({
  __name: "Main",
  __ssrInlineRender: true,
  props: {
    tokens: {}
  },
  setup(__props) {
    const styles = useTokenStyle(__props.tokens);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<main${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
        style: vueExports.unref(styles).main,
        class: "f-main"
      }, _attrs))}>`);
      serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main>`);
    };
  }
});
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../layers/blocks/app/components/Main.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const __nuxt_component_0$2 = Object.assign(_sfc_main$b, { __name: "Main" });
const _sfc_main$a = /* @__PURE__ */ vueExports.defineComponent({
  __name: "Header",
  __ssrInlineRender: true,
  props: {
    tokens: {}
  },
  setup(__props) {
    const styles = useTokenStyle(__props.tokens);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<header${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
        style: vueExports.unref(styles).header,
        class: "f-header"
      }, _attrs))}>`);
      serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</header>`);
    };
  }
});
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../layers/blocks/app/components/Header.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const __nuxt_component_0$1 = Object.assign(_sfc_main$a, { __name: "Header" });
const isMenu = (item) => {
  return "children" in item;
};
const _sfc_main$9 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "Navigator",
  __ssrInlineRender: true,
  props: {
    items: {},
    orientation: { default: "horizontal" },
    indicator: { type: Boolean, default: false },
    delayDuration: { default: 0 },
    skipDelayDuration: { default: 0 },
    featured: {},
    tokens: {}
  },
  setup(__props) {
    const styles = useTokenStyle(__props.tokens);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NavigationMenuRoot = NavigationMenuRoot_default;
      const _component_NavigationMenuList = NavigationMenuList_default;
      const _component_NavigationMenuItem = NavigationMenuItem_default;
      const _component_NavigationMenuTrigger = NavigationMenuTrigger_default;
      const _component_Icon = __nuxt_component_2$2;
      const _component_NavigationMenuContent = NavigationMenuContent_default;
      const _component_NavigationMenuLink = NavigationMenuLink_default;
      const _component_NuxtLink = __nuxt_component_0$3;
      const _component_NavigationMenuIndicator = NavigationMenuIndicator_default;
      const _component_NavigationMenuViewport = NavigationMenuViewport_default;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NavigationMenuRoot, vueExports.mergeProps({
        orientation: __props.orientation,
        "delay-duration": __props.delayDuration,
        "skip-delay-duration": __props.skipDelayDuration,
        style: vueExports.unref(styles)["navigator-root"],
        class: "f-navigator-root"
      }, _attrs), {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NavigationMenuList, {
              style: vueExports.unref(styles)["navigator-list"],
              class: "f-navigator-list"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  serverRenderer_cjs_prodExports.ssrRenderList(__props.items, (item) => {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NavigationMenuItem, {
                      key: isMenu(item) ? item.value : item.to,
                      value: isMenu(item) ? item.value : void 0,
                      style: vueExports.unref(styles)["navigator-item"],
                      class: "f-navigator-item"
                    }, {
                      default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          if (isMenu(item)) {
                            _push4(`<!--[-->`);
                            _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NavigationMenuTrigger, {
                              style: vueExports.unref(styles)["navigator-trigger"],
                              class: "f-navigator-trigger"
                            }, {
                              default: vueExports.withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "trigger", { item }, () => {
                                    if (item.icon) {
                                      _push5(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
                                        alias: item.icon
                                      }, null, _parent5, _scopeId4));
                                    } else {
                                      _push5(`<!---->`);
                                    }
                                    _push5(` ${serverRenderer_cjs_prodExports.ssrInterpolate(item.label)}`);
                                  }, _push5, _parent5, _scopeId4);
                                } else {
                                  return [
                                    vueExports.renderSlot(_ctx.$slots, "trigger", { item }, () => [
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
                            }, _parent4, _scopeId3));
                            _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NavigationMenuContent, {
                              style: vueExports.unref(styles)["navigator-content"],
                              class: "f-navigator-content"
                            }, {
                              default: vueExports.withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "content", {
                                    item,
                                    featured: __props.featured
                                  }, () => {
                                    if (__props.featured) {
                                      _push5(`<div style="${serverRenderer_cjs_prodExports.ssrRenderStyle(vueExports.unref(styles)["navigator-grid"])}" class="f-navigator-grid"${_scopeId4}>`);
                                      _push5(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NavigationMenuLink, { "as-child": "" }, {
                                        default: vueExports.withCtx((_5, _push6, _parent6, _scopeId5) => {
                                          if (_push6) {
                                            _push6(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                                              to: __props.featured.to,
                                              style: vueExports.unref(styles)["navigator-featured"],
                                              class: "f-navigator-featured"
                                            }, {
                                              default: vueExports.withCtx((_6, _push7, _parent7, _scopeId6) => {
                                                if (_push7) {
                                                  serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "featured", { item: __props.featured }, () => {
                                                    if (__props.featured.icon) {
                                                      _push7(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
                                                        alias: __props.featured.icon
                                                      }, null, _parent7, _scopeId6));
                                                    } else {
                                                      _push7(`<!---->`);
                                                    }
                                                    _push7(` ${serverRenderer_cjs_prodExports.ssrInterpolate(__props.featured.label)}`);
                                                  }, _push7, _parent7, _scopeId6);
                                                } else {
                                                  return [
                                                    vueExports.renderSlot(_ctx.$slots, "featured", { item: __props.featured }, () => [
                                                      __props.featured.icon ? (vueExports.openBlock(), vueExports.createBlock(_component_Icon, {
                                                        key: 0,
                                                        alias: __props.featured.icon
                                                      }, null, 8, ["alias"])) : vueExports.createCommentVNode("", true),
                                                      vueExports.createTextVNode(" " + vueExports.toDisplayString(__props.featured.label), 1)
                                                    ])
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent6, _scopeId5));
                                          } else {
                                            return [
                                              vueExports.createVNode(_component_NuxtLink, {
                                                to: __props.featured.to,
                                                style: vueExports.unref(styles)["navigator-featured"],
                                                class: "f-navigator-featured"
                                              }, {
                                                default: vueExports.withCtx(() => [
                                                  vueExports.renderSlot(_ctx.$slots, "featured", { item: __props.featured }, () => [
                                                    __props.featured.icon ? (vueExports.openBlock(), vueExports.createBlock(_component_Icon, {
                                                      key: 0,
                                                      alias: __props.featured.icon
                                                    }, null, 8, ["alias"])) : vueExports.createCommentVNode("", true),
                                                    vueExports.createTextVNode(" " + vueExports.toDisplayString(__props.featured.label), 1)
                                                  ])
                                                ]),
                                                _: 3
                                              }, 8, ["to", "style"])
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent5, _scopeId4));
                                      _push5(`<!--[-->`);
                                      serverRenderer_cjs_prodExports.ssrRenderList(item.children, (child) => {
                                        _push5(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NavigationMenuLink, {
                                          key: isMenu(child) ? child.value : child.to,
                                          "as-child": ""
                                        }, {
                                          default: vueExports.withCtx((_5, _push6, _parent6, _scopeId5) => {
                                            if (_push6) {
                                              if (!isMenu(child)) {
                                                _push6(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                                                  to: child.to,
                                                  style: vueExports.unref(styles)["navigator-card"],
                                                  class: "f-navigator-card"
                                                }, {
                                                  default: vueExports.withCtx((_6, _push7, _parent7, _scopeId6) => {
                                                    if (_push7) {
                                                      serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "card", { item: child }, () => {
                                                        if (child.icon) {
                                                          _push7(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
                                                            alias: child.icon
                                                          }, null, _parent7, _scopeId6));
                                                        } else {
                                                          _push7(`<!---->`);
                                                        }
                                                        _push7(` ${serverRenderer_cjs_prodExports.ssrInterpolate(child.label)}`);
                                                      }, _push7, _parent7, _scopeId6);
                                                    } else {
                                                      return [
                                                        vueExports.renderSlot(_ctx.$slots, "card", { item: child }, () => [
                                                          child.icon ? (vueExports.openBlock(), vueExports.createBlock(_component_Icon, {
                                                            key: 0,
                                                            alias: child.icon
                                                          }, null, 8, ["alias"])) : vueExports.createCommentVNode("", true),
                                                          vueExports.createTextVNode(" " + vueExports.toDisplayString(child.label), 1)
                                                        ])
                                                      ];
                                                    }
                                                  }),
                                                  _: 2
                                                }, _parent6, _scopeId5));
                                              } else {
                                                _push6(`<!---->`);
                                              }
                                            } else {
                                              return [
                                                !isMenu(child) ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                                                  key: 0,
                                                  to: child.to,
                                                  style: vueExports.unref(styles)["navigator-card"],
                                                  class: "f-navigator-card"
                                                }, {
                                                  default: vueExports.withCtx(() => [
                                                    vueExports.renderSlot(_ctx.$slots, "card", { item: child }, () => [
                                                      child.icon ? (vueExports.openBlock(), vueExports.createBlock(_component_Icon, {
                                                        key: 0,
                                                        alias: child.icon
                                                      }, null, 8, ["alias"])) : vueExports.createCommentVNode("", true),
                                                      vueExports.createTextVNode(" " + vueExports.toDisplayString(child.label), 1)
                                                    ])
                                                  ]),
                                                  _: 2
                                                }, 1032, ["to", "style"])) : vueExports.createCommentVNode("", true)
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent5, _scopeId4));
                                      });
                                      _push5(`<!--]--></div>`);
                                    } else {
                                      _push5(`<!--[-->`);
                                      serverRenderer_cjs_prodExports.ssrRenderList(item.children, (child) => {
                                        _push5(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NavigationMenuLink, {
                                          key: isMenu(child) ? child.value : child.to,
                                          "as-child": ""
                                        }, {
                                          default: vueExports.withCtx((_5, _push6, _parent6, _scopeId5) => {
                                            if (_push6) {
                                              if (!isMenu(child)) {
                                                _push6(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                                                  to: child.to,
                                                  style: vueExports.unref(styles)["navigator-link"],
                                                  class: "f-navigator-link"
                                                }, {
                                                  default: vueExports.withCtx((_6, _push7, _parent7, _scopeId6) => {
                                                    if (_push7) {
                                                      serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "link", { item: child }, () => {
                                                        if (child.icon) {
                                                          _push7(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
                                                            alias: child.icon
                                                          }, null, _parent7, _scopeId6));
                                                        } else {
                                                          _push7(`<!---->`);
                                                        }
                                                        _push7(` ${serverRenderer_cjs_prodExports.ssrInterpolate(child.label)}`);
                                                      }, _push7, _parent7, _scopeId6);
                                                    } else {
                                                      return [
                                                        vueExports.renderSlot(_ctx.$slots, "link", { item: child }, () => [
                                                          child.icon ? (vueExports.openBlock(), vueExports.createBlock(_component_Icon, {
                                                            key: 0,
                                                            alias: child.icon
                                                          }, null, 8, ["alias"])) : vueExports.createCommentVNode("", true),
                                                          vueExports.createTextVNode(" " + vueExports.toDisplayString(child.label), 1)
                                                        ])
                                                      ];
                                                    }
                                                  }),
                                                  _: 2
                                                }, _parent6, _scopeId5));
                                              } else {
                                                _push6(`<!---->`);
                                              }
                                            } else {
                                              return [
                                                !isMenu(child) ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                                                  key: 0,
                                                  to: child.to,
                                                  style: vueExports.unref(styles)["navigator-link"],
                                                  class: "f-navigator-link"
                                                }, {
                                                  default: vueExports.withCtx(() => [
                                                    vueExports.renderSlot(_ctx.$slots, "link", { item: child }, () => [
                                                      child.icon ? (vueExports.openBlock(), vueExports.createBlock(_component_Icon, {
                                                        key: 0,
                                                        alias: child.icon
                                                      }, null, 8, ["alias"])) : vueExports.createCommentVNode("", true),
                                                      vueExports.createTextVNode(" " + vueExports.toDisplayString(child.label), 1)
                                                    ])
                                                  ]),
                                                  _: 2
                                                }, 1032, ["to", "style"])) : vueExports.createCommentVNode("", true)
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent5, _scopeId4));
                                      });
                                      _push5(`<!--]-->`);
                                    }
                                  }, _push5, _parent5, _scopeId4);
                                } else {
                                  return [
                                    vueExports.renderSlot(_ctx.$slots, "content", {
                                      item,
                                      featured: __props.featured
                                    }, () => [
                                      __props.featured ? (vueExports.openBlock(), vueExports.createBlock("div", {
                                        key: 0,
                                        style: vueExports.unref(styles)["navigator-grid"],
                                        class: "f-navigator-grid"
                                      }, [
                                        vueExports.createVNode(_component_NavigationMenuLink, { "as-child": "" }, {
                                          default: vueExports.withCtx(() => [
                                            vueExports.createVNode(_component_NuxtLink, {
                                              to: __props.featured.to,
                                              style: vueExports.unref(styles)["navigator-featured"],
                                              class: "f-navigator-featured"
                                            }, {
                                              default: vueExports.withCtx(() => [
                                                vueExports.renderSlot(_ctx.$slots, "featured", { item: __props.featured }, () => [
                                                  __props.featured.icon ? (vueExports.openBlock(), vueExports.createBlock(_component_Icon, {
                                                    key: 0,
                                                    alias: __props.featured.icon
                                                  }, null, 8, ["alias"])) : vueExports.createCommentVNode("", true),
                                                  vueExports.createTextVNode(" " + vueExports.toDisplayString(__props.featured.label), 1)
                                                ])
                                              ]),
                                              _: 3
                                            }, 8, ["to", "style"])
                                          ]),
                                          _: 3
                                        }),
                                        (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(item.children, (child) => {
                                          return vueExports.openBlock(), vueExports.createBlock(_component_NavigationMenuLink, {
                                            key: isMenu(child) ? child.value : child.to,
                                            "as-child": ""
                                          }, {
                                            default: vueExports.withCtx(() => [
                                              !isMenu(child) ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                                                key: 0,
                                                to: child.to,
                                                style: vueExports.unref(styles)["navigator-card"],
                                                class: "f-navigator-card"
                                              }, {
                                                default: vueExports.withCtx(() => [
                                                  vueExports.renderSlot(_ctx.$slots, "card", { item: child }, () => [
                                                    child.icon ? (vueExports.openBlock(), vueExports.createBlock(_component_Icon, {
                                                      key: 0,
                                                      alias: child.icon
                                                    }, null, 8, ["alias"])) : vueExports.createCommentVNode("", true),
                                                    vueExports.createTextVNode(" " + vueExports.toDisplayString(child.label), 1)
                                                  ])
                                                ]),
                                                _: 2
                                              }, 1032, ["to", "style"])) : vueExports.createCommentVNode("", true)
                                            ]),
                                            _: 2
                                          }, 1024);
                                        }), 128))
                                      ], 4)) : (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, { key: 1 }, vueExports.renderList(item.children, (child) => {
                                        return vueExports.openBlock(), vueExports.createBlock(_component_NavigationMenuLink, {
                                          key: isMenu(child) ? child.value : child.to,
                                          "as-child": ""
                                        }, {
                                          default: vueExports.withCtx(() => [
                                            !isMenu(child) ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                                              key: 0,
                                              to: child.to,
                                              style: vueExports.unref(styles)["navigator-link"],
                                              class: "f-navigator-link"
                                            }, {
                                              default: vueExports.withCtx(() => [
                                                vueExports.renderSlot(_ctx.$slots, "link", { item: child }, () => [
                                                  child.icon ? (vueExports.openBlock(), vueExports.createBlock(_component_Icon, {
                                                    key: 0,
                                                    alias: child.icon
                                                  }, null, 8, ["alias"])) : vueExports.createCommentVNode("", true),
                                                  vueExports.createTextVNode(" " + vueExports.toDisplayString(child.label), 1)
                                                ])
                                              ]),
                                              _: 2
                                            }, 1032, ["to", "style"])) : vueExports.createCommentVNode("", true)
                                          ]),
                                          _: 2
                                        }, 1024);
                                      }), 128))
                                    ])
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(`<!--]-->`);
                          } else {
                            _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NavigationMenuLink, { "as-child": "" }, {
                              default: vueExports.withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
                                    to: item.to,
                                    style: vueExports.unref(styles)["navigator-link"],
                                    class: "f-navigator-link"
                                  }, {
                                    default: vueExports.withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "link", { item }, () => {
                                          if (item.icon) {
                                            _push6(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
                                              alias: item.icon
                                            }, null, _parent6, _scopeId5));
                                          } else {
                                            _push6(`<!---->`);
                                          }
                                          _push6(` ${serverRenderer_cjs_prodExports.ssrInterpolate(item.label)}`);
                                        }, _push6, _parent6, _scopeId5);
                                      } else {
                                        return [
                                          vueExports.renderSlot(_ctx.$slots, "link", { item }, () => [
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
                                  }, _parent5, _scopeId4));
                                } else {
                                  return [
                                    vueExports.createVNode(_component_NuxtLink, {
                                      to: item.to,
                                      style: vueExports.unref(styles)["navigator-link"],
                                      class: "f-navigator-link"
                                    }, {
                                      default: vueExports.withCtx(() => [
                                        vueExports.renderSlot(_ctx.$slots, "link", { item }, () => [
                                          item.icon ? (vueExports.openBlock(), vueExports.createBlock(_component_Icon, {
                                            key: 0,
                                            alias: item.icon
                                          }, null, 8, ["alias"])) : vueExports.createCommentVNode("", true),
                                          vueExports.createTextVNode(" " + vueExports.toDisplayString(item.label), 1)
                                        ])
                                      ]),
                                      _: 2
                                    }, 1032, ["to", "style"])
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          }
                        } else {
                          return [
                            isMenu(item) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                              vueExports.createVNode(_component_NavigationMenuTrigger, {
                                style: vueExports.unref(styles)["navigator-trigger"],
                                class: "f-navigator-trigger"
                              }, {
                                default: vueExports.withCtx(() => [
                                  vueExports.renderSlot(_ctx.$slots, "trigger", { item }, () => [
                                    item.icon ? (vueExports.openBlock(), vueExports.createBlock(_component_Icon, {
                                      key: 0,
                                      alias: item.icon
                                    }, null, 8, ["alias"])) : vueExports.createCommentVNode("", true),
                                    vueExports.createTextVNode(" " + vueExports.toDisplayString(item.label), 1)
                                  ])
                                ]),
                                _: 2
                              }, 1032, ["style"]),
                              vueExports.createVNode(_component_NavigationMenuContent, {
                                style: vueExports.unref(styles)["navigator-content"],
                                class: "f-navigator-content"
                              }, {
                                default: vueExports.withCtx(() => [
                                  vueExports.renderSlot(_ctx.$slots, "content", {
                                    item,
                                    featured: __props.featured
                                  }, () => [
                                    __props.featured ? (vueExports.openBlock(), vueExports.createBlock("div", {
                                      key: 0,
                                      style: vueExports.unref(styles)["navigator-grid"],
                                      class: "f-navigator-grid"
                                    }, [
                                      vueExports.createVNode(_component_NavigationMenuLink, { "as-child": "" }, {
                                        default: vueExports.withCtx(() => [
                                          vueExports.createVNode(_component_NuxtLink, {
                                            to: __props.featured.to,
                                            style: vueExports.unref(styles)["navigator-featured"],
                                            class: "f-navigator-featured"
                                          }, {
                                            default: vueExports.withCtx(() => [
                                              vueExports.renderSlot(_ctx.$slots, "featured", { item: __props.featured }, () => [
                                                __props.featured.icon ? (vueExports.openBlock(), vueExports.createBlock(_component_Icon, {
                                                  key: 0,
                                                  alias: __props.featured.icon
                                                }, null, 8, ["alias"])) : vueExports.createCommentVNode("", true),
                                                vueExports.createTextVNode(" " + vueExports.toDisplayString(__props.featured.label), 1)
                                              ])
                                            ]),
                                            _: 3
                                          }, 8, ["to", "style"])
                                        ]),
                                        _: 3
                                      }),
                                      (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(item.children, (child) => {
                                        return vueExports.openBlock(), vueExports.createBlock(_component_NavigationMenuLink, {
                                          key: isMenu(child) ? child.value : child.to,
                                          "as-child": ""
                                        }, {
                                          default: vueExports.withCtx(() => [
                                            !isMenu(child) ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                                              key: 0,
                                              to: child.to,
                                              style: vueExports.unref(styles)["navigator-card"],
                                              class: "f-navigator-card"
                                            }, {
                                              default: vueExports.withCtx(() => [
                                                vueExports.renderSlot(_ctx.$slots, "card", { item: child }, () => [
                                                  child.icon ? (vueExports.openBlock(), vueExports.createBlock(_component_Icon, {
                                                    key: 0,
                                                    alias: child.icon
                                                  }, null, 8, ["alias"])) : vueExports.createCommentVNode("", true),
                                                  vueExports.createTextVNode(" " + vueExports.toDisplayString(child.label), 1)
                                                ])
                                              ]),
                                              _: 2
                                            }, 1032, ["to", "style"])) : vueExports.createCommentVNode("", true)
                                          ]),
                                          _: 2
                                        }, 1024);
                                      }), 128))
                                    ], 4)) : (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, { key: 1 }, vueExports.renderList(item.children, (child) => {
                                      return vueExports.openBlock(), vueExports.createBlock(_component_NavigationMenuLink, {
                                        key: isMenu(child) ? child.value : child.to,
                                        "as-child": ""
                                      }, {
                                        default: vueExports.withCtx(() => [
                                          !isMenu(child) ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                                            key: 0,
                                            to: child.to,
                                            style: vueExports.unref(styles)["navigator-link"],
                                            class: "f-navigator-link"
                                          }, {
                                            default: vueExports.withCtx(() => [
                                              vueExports.renderSlot(_ctx.$slots, "link", { item: child }, () => [
                                                child.icon ? (vueExports.openBlock(), vueExports.createBlock(_component_Icon, {
                                                  key: 0,
                                                  alias: child.icon
                                                }, null, 8, ["alias"])) : vueExports.createCommentVNode("", true),
                                                vueExports.createTextVNode(" " + vueExports.toDisplayString(child.label), 1)
                                              ])
                                            ]),
                                            _: 2
                                          }, 1032, ["to", "style"])) : vueExports.createCommentVNode("", true)
                                        ]),
                                        _: 2
                                      }, 1024);
                                    }), 128))
                                  ])
                                ]),
                                _: 2
                              }, 1032, ["style"])
                            ], 64)) : (vueExports.openBlock(), vueExports.createBlock(_component_NavigationMenuLink, {
                              key: 1,
                              "as-child": ""
                            }, {
                              default: vueExports.withCtx(() => [
                                vueExports.createVNode(_component_NuxtLink, {
                                  to: item.to,
                                  style: vueExports.unref(styles)["navigator-link"],
                                  class: "f-navigator-link"
                                }, {
                                  default: vueExports.withCtx(() => [
                                    vueExports.renderSlot(_ctx.$slots, "link", { item }, () => [
                                      item.icon ? (vueExports.openBlock(), vueExports.createBlock(_component_Icon, {
                                        key: 0,
                                        alias: item.icon
                                      }, null, 8, ["alias"])) : vueExports.createCommentVNode("", true),
                                      vueExports.createTextVNode(" " + vueExports.toDisplayString(item.label), 1)
                                    ])
                                  ]),
                                  _: 2
                                }, 1032, ["to", "style"])
                              ]),
                              _: 2
                            }, 1024))
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  });
                  _push3(`<!--]-->`);
                  if (__props.indicator) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NavigationMenuIndicator, {
                      style: vueExports.unref(styles)["navigator-indicator"],
                      class: "f-navigator-indicator"
                    }, {
                      default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "indicator", {}, null, _push4, _parent4, _scopeId3);
                        } else {
                          return [
                            vueExports.renderSlot(_ctx.$slots, "indicator")
                          ];
                        }
                      }),
                      _: 3
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(__props.items, (item) => {
                      return vueExports.openBlock(), vueExports.createBlock(_component_NavigationMenuItem, {
                        key: isMenu(item) ? item.value : item.to,
                        value: isMenu(item) ? item.value : void 0,
                        style: vueExports.unref(styles)["navigator-item"],
                        class: "f-navigator-item"
                      }, {
                        default: vueExports.withCtx(() => [
                          isMenu(item) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                            vueExports.createVNode(_component_NavigationMenuTrigger, {
                              style: vueExports.unref(styles)["navigator-trigger"],
                              class: "f-navigator-trigger"
                            }, {
                              default: vueExports.withCtx(() => [
                                vueExports.renderSlot(_ctx.$slots, "trigger", { item }, () => [
                                  item.icon ? (vueExports.openBlock(), vueExports.createBlock(_component_Icon, {
                                    key: 0,
                                    alias: item.icon
                                  }, null, 8, ["alias"])) : vueExports.createCommentVNode("", true),
                                  vueExports.createTextVNode(" " + vueExports.toDisplayString(item.label), 1)
                                ])
                              ]),
                              _: 2
                            }, 1032, ["style"]),
                            vueExports.createVNode(_component_NavigationMenuContent, {
                              style: vueExports.unref(styles)["navigator-content"],
                              class: "f-navigator-content"
                            }, {
                              default: vueExports.withCtx(() => [
                                vueExports.renderSlot(_ctx.$slots, "content", {
                                  item,
                                  featured: __props.featured
                                }, () => [
                                  __props.featured ? (vueExports.openBlock(), vueExports.createBlock("div", {
                                    key: 0,
                                    style: vueExports.unref(styles)["navigator-grid"],
                                    class: "f-navigator-grid"
                                  }, [
                                    vueExports.createVNode(_component_NavigationMenuLink, { "as-child": "" }, {
                                      default: vueExports.withCtx(() => [
                                        vueExports.createVNode(_component_NuxtLink, {
                                          to: __props.featured.to,
                                          style: vueExports.unref(styles)["navigator-featured"],
                                          class: "f-navigator-featured"
                                        }, {
                                          default: vueExports.withCtx(() => [
                                            vueExports.renderSlot(_ctx.$slots, "featured", { item: __props.featured }, () => [
                                              __props.featured.icon ? (vueExports.openBlock(), vueExports.createBlock(_component_Icon, {
                                                key: 0,
                                                alias: __props.featured.icon
                                              }, null, 8, ["alias"])) : vueExports.createCommentVNode("", true),
                                              vueExports.createTextVNode(" " + vueExports.toDisplayString(__props.featured.label), 1)
                                            ])
                                          ]),
                                          _: 3
                                        }, 8, ["to", "style"])
                                      ]),
                                      _: 3
                                    }),
                                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(item.children, (child) => {
                                      return vueExports.openBlock(), vueExports.createBlock(_component_NavigationMenuLink, {
                                        key: isMenu(child) ? child.value : child.to,
                                        "as-child": ""
                                      }, {
                                        default: vueExports.withCtx(() => [
                                          !isMenu(child) ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                                            key: 0,
                                            to: child.to,
                                            style: vueExports.unref(styles)["navigator-card"],
                                            class: "f-navigator-card"
                                          }, {
                                            default: vueExports.withCtx(() => [
                                              vueExports.renderSlot(_ctx.$slots, "card", { item: child }, () => [
                                                child.icon ? (vueExports.openBlock(), vueExports.createBlock(_component_Icon, {
                                                  key: 0,
                                                  alias: child.icon
                                                }, null, 8, ["alias"])) : vueExports.createCommentVNode("", true),
                                                vueExports.createTextVNode(" " + vueExports.toDisplayString(child.label), 1)
                                              ])
                                            ]),
                                            _: 2
                                          }, 1032, ["to", "style"])) : vueExports.createCommentVNode("", true)
                                        ]),
                                        _: 2
                                      }, 1024);
                                    }), 128))
                                  ], 4)) : (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, { key: 1 }, vueExports.renderList(item.children, (child) => {
                                    return vueExports.openBlock(), vueExports.createBlock(_component_NavigationMenuLink, {
                                      key: isMenu(child) ? child.value : child.to,
                                      "as-child": ""
                                    }, {
                                      default: vueExports.withCtx(() => [
                                        !isMenu(child) ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                                          key: 0,
                                          to: child.to,
                                          style: vueExports.unref(styles)["navigator-link"],
                                          class: "f-navigator-link"
                                        }, {
                                          default: vueExports.withCtx(() => [
                                            vueExports.renderSlot(_ctx.$slots, "link", { item: child }, () => [
                                              child.icon ? (vueExports.openBlock(), vueExports.createBlock(_component_Icon, {
                                                key: 0,
                                                alias: child.icon
                                              }, null, 8, ["alias"])) : vueExports.createCommentVNode("", true),
                                              vueExports.createTextVNode(" " + vueExports.toDisplayString(child.label), 1)
                                            ])
                                          ]),
                                          _: 2
                                        }, 1032, ["to", "style"])) : vueExports.createCommentVNode("", true)
                                      ]),
                                      _: 2
                                    }, 1024);
                                  }), 128))
                                ])
                              ]),
                              _: 2
                            }, 1032, ["style"])
                          ], 64)) : (vueExports.openBlock(), vueExports.createBlock(_component_NavigationMenuLink, {
                            key: 1,
                            "as-child": ""
                          }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createVNode(_component_NuxtLink, {
                                to: item.to,
                                style: vueExports.unref(styles)["navigator-link"],
                                class: "f-navigator-link"
                              }, {
                                default: vueExports.withCtx(() => [
                                  vueExports.renderSlot(_ctx.$slots, "link", { item }, () => [
                                    item.icon ? (vueExports.openBlock(), vueExports.createBlock(_component_Icon, {
                                      key: 0,
                                      alias: item.icon
                                    }, null, 8, ["alias"])) : vueExports.createCommentVNode("", true),
                                    vueExports.createTextVNode(" " + vueExports.toDisplayString(item.label), 1)
                                  ])
                                ]),
                                _: 2
                              }, 1032, ["to", "style"])
                            ]),
                            _: 2
                          }, 1024))
                        ]),
                        _: 2
                      }, 1032, ["value", "style"]);
                    }), 128)),
                    __props.indicator ? (vueExports.openBlock(), vueExports.createBlock(_component_NavigationMenuIndicator, {
                      key: 0,
                      style: vueExports.unref(styles)["navigator-indicator"],
                      class: "f-navigator-indicator"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.renderSlot(_ctx.$slots, "indicator")
                      ]),
                      _: 3
                    }, 8, ["style"])) : vueExports.createCommentVNode("", true)
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
            _push2(`<div style="${serverRenderer_cjs_prodExports.ssrRenderStyle(vueExports.unref(styles)["navigator-viewport-wrapper"])}" class="f-navigator-viewport-wrapper"${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NavigationMenuViewport, {
              style: {
                ...vueExports.unref(styles)["navigator-viewport"],
                width: "var(--reka-navigation-menu-viewport-width)",
                height: "var(--reka-navigation-menu-viewport-height)",
                left: "var(--reka-navigation-menu-viewport-left)"
              },
              class: "f-navigator-viewport"
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode(_component_NavigationMenuList, {
                style: vueExports.unref(styles)["navigator-list"],
                class: "f-navigator-list"
              }, {
                default: vueExports.withCtx(() => [
                  (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(__props.items, (item) => {
                    return vueExports.openBlock(), vueExports.createBlock(_component_NavigationMenuItem, {
                      key: isMenu(item) ? item.value : item.to,
                      value: isMenu(item) ? item.value : void 0,
                      style: vueExports.unref(styles)["navigator-item"],
                      class: "f-navigator-item"
                    }, {
                      default: vueExports.withCtx(() => [
                        isMenu(item) ? (vueExports.openBlock(), vueExports.createBlock(vueExports.Fragment, { key: 0 }, [
                          vueExports.createVNode(_component_NavigationMenuTrigger, {
                            style: vueExports.unref(styles)["navigator-trigger"],
                            class: "f-navigator-trigger"
                          }, {
                            default: vueExports.withCtx(() => [
                              vueExports.renderSlot(_ctx.$slots, "trigger", { item }, () => [
                                item.icon ? (vueExports.openBlock(), vueExports.createBlock(_component_Icon, {
                                  key: 0,
                                  alias: item.icon
                                }, null, 8, ["alias"])) : vueExports.createCommentVNode("", true),
                                vueExports.createTextVNode(" " + vueExports.toDisplayString(item.label), 1)
                              ])
                            ]),
                            _: 2
                          }, 1032, ["style"]),
                          vueExports.createVNode(_component_NavigationMenuContent, {
                            style: vueExports.unref(styles)["navigator-content"],
                            class: "f-navigator-content"
                          }, {
                            default: vueExports.withCtx(() => [
                              vueExports.renderSlot(_ctx.$slots, "content", {
                                item,
                                featured: __props.featured
                              }, () => [
                                __props.featured ? (vueExports.openBlock(), vueExports.createBlock("div", {
                                  key: 0,
                                  style: vueExports.unref(styles)["navigator-grid"],
                                  class: "f-navigator-grid"
                                }, [
                                  vueExports.createVNode(_component_NavigationMenuLink, { "as-child": "" }, {
                                    default: vueExports.withCtx(() => [
                                      vueExports.createVNode(_component_NuxtLink, {
                                        to: __props.featured.to,
                                        style: vueExports.unref(styles)["navigator-featured"],
                                        class: "f-navigator-featured"
                                      }, {
                                        default: vueExports.withCtx(() => [
                                          vueExports.renderSlot(_ctx.$slots, "featured", { item: __props.featured }, () => [
                                            __props.featured.icon ? (vueExports.openBlock(), vueExports.createBlock(_component_Icon, {
                                              key: 0,
                                              alias: __props.featured.icon
                                            }, null, 8, ["alias"])) : vueExports.createCommentVNode("", true),
                                            vueExports.createTextVNode(" " + vueExports.toDisplayString(__props.featured.label), 1)
                                          ])
                                        ]),
                                        _: 3
                                      }, 8, ["to", "style"])
                                    ]),
                                    _: 3
                                  }),
                                  (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(item.children, (child) => {
                                    return vueExports.openBlock(), vueExports.createBlock(_component_NavigationMenuLink, {
                                      key: isMenu(child) ? child.value : child.to,
                                      "as-child": ""
                                    }, {
                                      default: vueExports.withCtx(() => [
                                        !isMenu(child) ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                                          key: 0,
                                          to: child.to,
                                          style: vueExports.unref(styles)["navigator-card"],
                                          class: "f-navigator-card"
                                        }, {
                                          default: vueExports.withCtx(() => [
                                            vueExports.renderSlot(_ctx.$slots, "card", { item: child }, () => [
                                              child.icon ? (vueExports.openBlock(), vueExports.createBlock(_component_Icon, {
                                                key: 0,
                                                alias: child.icon
                                              }, null, 8, ["alias"])) : vueExports.createCommentVNode("", true),
                                              vueExports.createTextVNode(" " + vueExports.toDisplayString(child.label), 1)
                                            ])
                                          ]),
                                          _: 2
                                        }, 1032, ["to", "style"])) : vueExports.createCommentVNode("", true)
                                      ]),
                                      _: 2
                                    }, 1024);
                                  }), 128))
                                ], 4)) : (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, { key: 1 }, vueExports.renderList(item.children, (child) => {
                                  return vueExports.openBlock(), vueExports.createBlock(_component_NavigationMenuLink, {
                                    key: isMenu(child) ? child.value : child.to,
                                    "as-child": ""
                                  }, {
                                    default: vueExports.withCtx(() => [
                                      !isMenu(child) ? (vueExports.openBlock(), vueExports.createBlock(_component_NuxtLink, {
                                        key: 0,
                                        to: child.to,
                                        style: vueExports.unref(styles)["navigator-link"],
                                        class: "f-navigator-link"
                                      }, {
                                        default: vueExports.withCtx(() => [
                                          vueExports.renderSlot(_ctx.$slots, "link", { item: child }, () => [
                                            child.icon ? (vueExports.openBlock(), vueExports.createBlock(_component_Icon, {
                                              key: 0,
                                              alias: child.icon
                                            }, null, 8, ["alias"])) : vueExports.createCommentVNode("", true),
                                            vueExports.createTextVNode(" " + vueExports.toDisplayString(child.label), 1)
                                          ])
                                        ]),
                                        _: 2
                                      }, 1032, ["to", "style"])) : vueExports.createCommentVNode("", true)
                                    ]),
                                    _: 2
                                  }, 1024);
                                }), 128))
                              ])
                            ]),
                            _: 2
                          }, 1032, ["style"])
                        ], 64)) : (vueExports.openBlock(), vueExports.createBlock(_component_NavigationMenuLink, {
                          key: 1,
                          "as-child": ""
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createVNode(_component_NuxtLink, {
                              to: item.to,
                              style: vueExports.unref(styles)["navigator-link"],
                              class: "f-navigator-link"
                            }, {
                              default: vueExports.withCtx(() => [
                                vueExports.renderSlot(_ctx.$slots, "link", { item }, () => [
                                  item.icon ? (vueExports.openBlock(), vueExports.createBlock(_component_Icon, {
                                    key: 0,
                                    alias: item.icon
                                  }, null, 8, ["alias"])) : vueExports.createCommentVNode("", true),
                                  vueExports.createTextVNode(" " + vueExports.toDisplayString(item.label), 1)
                                ])
                              ]),
                              _: 2
                            }, 1032, ["to", "style"])
                          ]),
                          _: 2
                        }, 1024))
                      ]),
                      _: 2
                    }, 1032, ["value", "style"]);
                  }), 128)),
                  __props.indicator ? (vueExports.openBlock(), vueExports.createBlock(_component_NavigationMenuIndicator, {
                    key: 0,
                    style: vueExports.unref(styles)["navigator-indicator"],
                    class: "f-navigator-indicator"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.renderSlot(_ctx.$slots, "indicator")
                    ]),
                    _: 3
                  }, 8, ["style"])) : vueExports.createCommentVNode("", true)
                ]),
                _: 3
              }, 8, ["style"]),
              vueExports.createVNode("div", {
                style: vueExports.unref(styles)["navigator-viewport-wrapper"],
                class: "f-navigator-viewport-wrapper"
              }, [
                vueExports.createVNode(_component_NavigationMenuViewport, {
                  style: {
                    ...vueExports.unref(styles)["navigator-viewport"],
                    width: "var(--reka-navigation-menu-viewport-width)",
                    height: "var(--reka-navigation-menu-viewport-height)",
                    left: "var(--reka-navigation-menu-viewport-left)"
                  },
                  class: "f-navigator-viewport"
                }, null, 8, ["style"])
              ], 4)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../layers/blocks/app/components/Navigator.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const __nuxt_component_2$1 = Object.assign(_sfc_main$9, { __name: "Navigator" });
const _sfc_main$8 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "Tooltip",
  __ssrInlineRender: true,
  props: {
    content: {},
    delayDuration: { default: 0 },
    side: { default: "bottom" },
    align: { default: "center" },
    sideOffset: { default: 10 },
    tokens: {}
  },
  setup(__props) {
    const styles = useTokenStyle(__props.tokens);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_TooltipRoot = TooltipRoot_default;
      const _component_TooltipTrigger = TooltipTrigger_default;
      const _component_TooltipPortal = TooltipPortal_default;
      const _component_TooltipContent = TooltipContent_default;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_TooltipRoot, vueExports.mergeProps({ "delay-duration": __props.delayDuration }, _attrs), {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_TooltipTrigger, { "as-child": "" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push3, _parent3, _scopeId2);
                } else {
                  return [
                    vueExports.renderSlot(_ctx.$slots, "default")
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_TooltipPortal, null, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_TooltipContent, {
                    side: __props.side,
                    align: __props.align,
                    "side-offset": __props.sideOffset,
                    style: vueExports.unref(styles)["tooltip-content"],
                    class: "f-tooltip-content"
                  }, {
                    default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "content", {}, () => {
                          _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.content)}`);
                        }, _push4, _parent4, _scopeId3);
                      } else {
                        return [
                          vueExports.renderSlot(_ctx.$slots, "content", {}, () => [
                            vueExports.createTextVNode(vueExports.toDisplayString(__props.content), 1)
                          ])
                        ];
                      }
                    }),
                    _: 3
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_TooltipContent, {
                      side: __props.side,
                      align: __props.align,
                      "side-offset": __props.sideOffset,
                      style: vueExports.unref(styles)["tooltip-content"],
                      class: "f-tooltip-content"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.renderSlot(_ctx.$slots, "content", {}, () => [
                          vueExports.createTextVNode(vueExports.toDisplayString(__props.content), 1)
                        ])
                      ]),
                      _: 3
                    }, 8, ["side", "align", "side-offset", "style"])
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_TooltipTrigger, { "as-child": "" }, {
                default: vueExports.withCtx(() => [
                  vueExports.renderSlot(_ctx.$slots, "default")
                ]),
                _: 3
              }),
              vueExports.createVNode(_component_TooltipPortal, null, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_TooltipContent, {
                    side: __props.side,
                    align: __props.align,
                    "side-offset": __props.sideOffset,
                    style: vueExports.unref(styles)["tooltip-content"],
                    class: "f-tooltip-content"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.renderSlot(_ctx.$slots, "content", {}, () => [
                        vueExports.createTextVNode(vueExports.toDisplayString(__props.content), 1)
                      ])
                    ]),
                    _: 3
                  }, 8, ["side", "align", "side-offset", "style"])
                ]),
                _: 3
              })
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../layers/blocks/app/components/Tooltip.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$8, { __name: "Tooltip" });
const _sfc_main$7 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "Kbd",
  __ssrInlineRender: true,
  props: {
    tokens: {}
  },
  setup(__props) {
    const styles = useTokenStyle(__props.tokens);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<kbd${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
        style: vueExports.unref(styles).kbd,
        class: "f-kbd"
      }, _attrs))}>`);
      serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</kbd>`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../layers/blocks/app/components/Kbd.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main$7, { __name: "Kbd" });
const _sfc_main$6 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "Dialog",
  __ssrInlineRender: true,
  props: {
    title: {},
    description: {},
    open: { type: Boolean },
    tokens: {}
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const styles = useTokenStyle(__props.tokens);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DialogRoot = DialogRoot_default;
      const _component_DialogPortal = DialogPortal_default;
      const _component_DialogOverlay = DialogOverlay_default;
      const _component_DialogContent = DialogContent_default;
      const _component_DialogTitle = DialogTitle_default;
      const _component_DialogDescription = DialogDescription_default;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_DialogRoot, vueExports.mergeProps({
        open: __props.open,
        "onUpdate:open": ($event) => emit("update:open", $event)
      }, _attrs), {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_DialogPortal, null, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_DialogOverlay, {
                    style: vueExports.unref(styles)["dialog-overlay"],
                    class: "f-dialog-overlay"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_DialogContent, {
                    style: vueExports.unref(styles)["dialog-content"],
                    class: "f-dialog-content"
                  }, {
                    default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_DialogTitle, null, {
                          default: vueExports.withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.title)}`);
                            } else {
                              return [
                                vueExports.createTextVNode(vueExports.toDisplayString(__props.title), 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_DialogDescription, null, {
                          default: vueExports.withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.description)}`);
                            } else {
                              return [
                                vueExports.createTextVNode(vueExports.toDisplayString(__props.description), 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push4, _parent4, _scopeId3);
                      } else {
                        return [
                          vueExports.createVNode(_component_DialogTitle, null, {
                            default: vueExports.withCtx(() => [
                              vueExports.createTextVNode(vueExports.toDisplayString(__props.title), 1)
                            ]),
                            _: 1
                          }),
                          vueExports.createVNode(_component_DialogDescription, null, {
                            default: vueExports.withCtx(() => [
                              vueExports.createTextVNode(vueExports.toDisplayString(__props.description), 1)
                            ]),
                            _: 1
                          }),
                          vueExports.renderSlot(_ctx.$slots, "default")
                        ];
                      }
                    }),
                    _: 3
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_DialogOverlay, {
                      style: vueExports.unref(styles)["dialog-overlay"],
                      class: "f-dialog-overlay"
                    }, null, 8, ["style"]),
                    vueExports.createVNode(_component_DialogContent, {
                      style: vueExports.unref(styles)["dialog-content"],
                      class: "f-dialog-content"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_DialogTitle, null, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(__props.title), 1)
                          ]),
                          _: 1
                        }),
                        vueExports.createVNode(_component_DialogDescription, null, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(__props.description), 1)
                          ]),
                          _: 1
                        }),
                        vueExports.renderSlot(_ctx.$slots, "default")
                      ]),
                      _: 3
                    }, 8, ["style"])
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_DialogPortal, null, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_DialogOverlay, {
                    style: vueExports.unref(styles)["dialog-overlay"],
                    class: "f-dialog-overlay"
                  }, null, 8, ["style"]),
                  vueExports.createVNode(_component_DialogContent, {
                    style: vueExports.unref(styles)["dialog-content"],
                    class: "f-dialog-content"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_DialogTitle, null, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(__props.title), 1)
                        ]),
                        _: 1
                      }),
                      vueExports.createVNode(_component_DialogDescription, null, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(__props.description), 1)
                        ]),
                        _: 1
                      }),
                      vueExports.renderSlot(_ctx.$slots, "default")
                    ]),
                    _: 3
                  }, 8, ["style"])
                ]),
                _: 3
              })
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../layers/blocks/app/components/Dialog.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_4$1 = Object.assign(_sfc_main$6, { __name: "Dialog" });
const _sfc_main$5 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "Search",
  __ssrInlineRender: true,
  setup(__props) {
    const open = vueExports.ref(false);
    const isMac = vueExports.computed(() => {
      return false;
    });
    const modKey = vueExports.computed(() => isMac.value ? "⌘" : "Ctrl");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Tooltip = __nuxt_component_0;
      const _component_Button = __nuxt_component_1$2;
      const _component_Icon = __nuxt_component_2$2;
      const _component_Kbd = __nuxt_component_3;
      const _component_Dialog = __nuxt_component_4$1;
      const _component_P = __nuxt_component_0$4;
      _push(`<!--[-->`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Tooltip, null, {
        content: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span${_scopeId}>Search</span>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Kbd, null, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(modKey))} `);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
                    alias: "plus",
                    tokens: { icon: { "font-size": "ref-text-xs" } }
                  }, null, _parent3, _scopeId2));
                  _push3(` K `);
                } else {
                  return [
                    vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(modKey)) + " ", 1),
                    vueExports.createVNode(_component_Icon, {
                      alias: "plus",
                      tokens: { icon: { "font-size": "ref-text-xs" } }
                    }),
                    vueExports.createTextVNode(" K ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode("span", null, "Search"),
              vueExports.createVNode(_component_Kbd, null, {
                default: vueExports.withCtx(() => [
                  vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(modKey)) + " ", 1),
                  vueExports.createVNode(_component_Icon, {
                    alias: "plus",
                    tokens: { icon: { "font-size": "ref-text-xs" } }
                  }),
                  vueExports.createTextVNode(" K ")
                ]),
                _: 1
              })
            ];
          }
        }),
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Button, {
              shortcut: "k",
              onClick: ($event) => open.value = true
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, { alias: "search" }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_Icon, { alias: "search" })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_Button, {
                shortcut: "k",
                onClick: ($event) => open.value = true
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_Icon, { alias: "search" })
                ]),
                _: 1
              }, 8, ["onClick"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Dialog, {
        open: vueExports.unref(open),
        "onUpdate:open": ($event) => vueExports.isRef(open) ? open.value = $event : null,
        title: "Search for stuff",
        description: "SEARCH BRO"
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_P, null, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Search dialog content`);
                } else {
                  return [
                    vueExports.createTextVNode("Search dialog content")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_P, null, {
                default: vueExports.withCtx(() => [
                  vueExports.createTextVNode("Search dialog content")
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
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Search.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main$5, { __name: "Search" });
const _sfc_main$4 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "Translate",
  __ssrInlineRender: true,
  setup(__props) {
    const open = vueExports.ref(false);
    const isMac = vueExports.computed(() => {
      return false;
    });
    const modKey = vueExports.computed(() => isMac.value ? "⌘" : "Ctrl");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Tooltip = __nuxt_component_0;
      const _component_Button = __nuxt_component_1$2;
      const _component_Icon = __nuxt_component_2$2;
      const _component_Kbd = __nuxt_component_3;
      const _component_Dialog = __nuxt_component_4$1;
      const _component_P = __nuxt_component_0$4;
      _push(`<!--[-->`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Tooltip, null, {
        content: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span${_scopeId}>Translate</span>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Kbd, null, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(modKey))} `);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
                    alias: "plus",
                    tokens: { icon: { "font-size": "ref-text-xs" } }
                  }, null, _parent3, _scopeId2));
                  _push3(` L `);
                } else {
                  return [
                    vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(modKey)) + " ", 1),
                    vueExports.createVNode(_component_Icon, {
                      alias: "plus",
                      tokens: { icon: { "font-size": "ref-text-xs" } }
                    }),
                    vueExports.createTextVNode(" L ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode("span", null, "Translate"),
              vueExports.createVNode(_component_Kbd, null, {
                default: vueExports.withCtx(() => [
                  vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(modKey)) + " ", 1),
                  vueExports.createVNode(_component_Icon, {
                    alias: "plus",
                    tokens: { icon: { "font-size": "ref-text-xs" } }
                  }),
                  vueExports.createTextVNode(" L ")
                ]),
                _: 1
              })
            ];
          }
        }),
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Button, {
              shortcut: "l",
              onClick: ($event) => open.value = true
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, { alias: "translate" }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_Icon, { alias: "translate" })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_Button, {
                shortcut: "l",
                onClick: ($event) => open.value = true
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_Icon, { alias: "translate" })
                ]),
                _: 1
              }, 8, ["onClick"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Dialog, {
        open: vueExports.unref(open),
        "onUpdate:open": ($event) => vueExports.isRef(open) ? open.value = $event : null,
        title: "Translate languages",
        description: "I am a banana"
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_P, null, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Language selection dialog content`);
                } else {
                  return [
                    vueExports.createTextVNode("Language selection dialog content")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_P, null, {
                default: vueExports.withCtx(() => [
                  vueExports.createTextVNode("Language selection dialog content")
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
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Translate.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_5 = Object.assign(_sfc_main$4, { __name: "Translate" });
const _sfc_main$3 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "Theme",
  __ssrInlineRender: true,
  setup(__props) {
    const open = vueExports.ref(false);
    const isMac = vueExports.computed(() => {
      return false;
    });
    const modKey = vueExports.computed(() => isMac.value ? "⌘" : "Ctrl");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Tooltip = __nuxt_component_0;
      const _component_Button = __nuxt_component_1$2;
      const _component_Icon = __nuxt_component_2$2;
      const _component_Kbd = __nuxt_component_3;
      const _component_Dialog = __nuxt_component_4$1;
      const _component_P = __nuxt_component_0$4;
      _push(`<!--[-->`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Tooltip, null, {
        content: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span${_scopeId}>Theme</span>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Kbd, null, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(modKey))} `);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
                    alias: "plus",
                    tokens: { icon: { "font-size": "ref-text-xs" } }
                  }, null, _parent3, _scopeId2));
                  _push3(` T `);
                } else {
                  return [
                    vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(modKey)) + " ", 1),
                    vueExports.createVNode(_component_Icon, {
                      alias: "plus",
                      tokens: { icon: { "font-size": "ref-text-xs" } }
                    }),
                    vueExports.createTextVNode(" T ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode("span", null, "Theme"),
              vueExports.createVNode(_component_Kbd, null, {
                default: vueExports.withCtx(() => [
                  vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(modKey)) + " ", 1),
                  vueExports.createVNode(_component_Icon, {
                    alias: "plus",
                    tokens: { icon: { "font-size": "ref-text-xs" } }
                  }),
                  vueExports.createTextVNode(" T ")
                ]),
                _: 1
              })
            ];
          }
        }),
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Button, {
              shortcut: "t",
              onClick: ($event) => open.value = true
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, { alias: "theme" }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_Icon, { alias: "theme" })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_Button, {
                shortcut: "t",
                onClick: ($event) => open.value = true
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_Icon, { alias: "theme" })
                ]),
                _: 1
              }, 8, ["onClick"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Dialog, {
        open: vueExports.unref(open),
        "onUpdate:open": ($event) => vueExports.isRef(open) ? open.value = $event : null,
        title: "I am a Theme selector!",
        description: "change your theme bro"
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_P, null, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Theme selection dialog content`);
                } else {
                  return [
                    vueExports.createTextVNode("Theme selection dialog content")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_P, null, {
                default: vueExports.withCtx(() => [
                  vueExports.createTextVNode("Theme selection dialog content")
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
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Theme.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_6 = Object.assign(_sfc_main$3, { __name: "Theme" });
const _sfc_main$2 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ColorMode",
  __ssrInlineRender: true,
  setup(__props) {
    const { mode } = useUntheme();
    const isDark = vueExports.computed(() => mode.value === "dark");
    const label = vueExports.computed(() => isDark.value ? "Dark" : "Light");
    const isMac = vueExports.computed(() => {
      return false;
    });
    const modKey = vueExports.computed(() => isMac.value ? "⌘" : "Ctrl");
    const toggle = () => {
      mode.value = isDark.value ? "light" : "dark";
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Tooltip = __nuxt_component_0;
      const _component_Button = __nuxt_component_1$2;
      const _component_Icon = __nuxt_component_2$2;
      const _component_Kbd = __nuxt_component_3;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Tooltip, _attrs, {
        content: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(label))}</span>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Kbd, null, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(modKey))} `);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
                    alias: "plus",
                    tokens: { icon: { "font-size": "ref-text-2xs" } }
                  }, null, _parent3, _scopeId2));
                  _push3(` D `);
                } else {
                  return [
                    vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(modKey)) + " ", 1),
                    vueExports.createVNode(_component_Icon, {
                      alias: "plus",
                      tokens: { icon: { "font-size": "ref-text-2xs" } }
                    }),
                    vueExports.createTextVNode(" D ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode("span", null, vueExports.toDisplayString(vueExports.unref(label)), 1),
              vueExports.createVNode(_component_Kbd, null, {
                default: vueExports.withCtx(() => [
                  vueExports.createTextVNode(vueExports.toDisplayString(vueExports.unref(modKey)) + " ", 1),
                  vueExports.createVNode(_component_Icon, {
                    alias: "plus",
                    tokens: { icon: { "font-size": "ref-text-2xs" } }
                  }),
                  vueExports.createTextVNode(" D ")
                ]),
                _: 1
              })
            ];
          }
        }),
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Button, {
              shortcut: "d",
              onClick: toggle
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, { alias: vueExports.unref(mode) }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_Icon, { alias: vueExports.unref(mode) }, null, 8, ["alias"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_Button, {
                shortcut: "d",
                onClick: toggle
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_Icon, { alias: vueExports.unref(mode) }, null, 8, ["alias"])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ColorMode.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_7 = Object.assign(_sfc_main$2, { __name: "ColorMode" });
const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "TopBar",
  __ssrInlineRender: true,
  setup(__props) {
    const navItems = [
      { label: "Home", to: "/" },
      {
        label: "Guides",
        value: "guides",
        children: [
          { label: "Getting Started", to: "/guides/getting-started" },
          { label: "Installation", to: "/guides/installation" },
          { label: "Configuration", to: "/guides/configuration" },
          { label: "Advanced Topics", to: "/guides/advanced" }
        ]
      },
      {
        label: "Components",
        value: "components",
        children: [
          { label: "Button", to: "/components/button" },
          { label: "Accordion", to: "/components/accordion" },
          { label: "Tabs", to: "/components/tabs" },
          { label: "Navigator", to: "/components/navigator" }
        ]
      },
      { label: "About", to: "/about" }
    ];
    const guidesFeatured = {
      label: "Quick Start Guide",
      to: "/guides/quickstart",
      icon: "explore"
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Header = __nuxt_component_0$1;
      const _component_Nav = __nuxt_component_1$1;
      const _component_Navigator = __nuxt_component_2$1;
      const _component_Group = __nuxt_component_3$1;
      const _component_Search = __nuxt_component_4;
      const _component_Translate = __nuxt_component_5;
      const _component_Theme = __nuxt_component_6;
      const _component_ColorMode = __nuxt_component_7;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Header, _attrs, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "logo", {}, () => {
              _push2(` Logo `);
            }, _push2, _parent2, _scopeId);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Nav, null, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "navigation", {}, () => {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Navigator, {
                      items: navItems,
                      featured: guidesFeatured
                    }, null, _parent3, _scopeId2));
                  }, _push3, _parent3, _scopeId2);
                } else {
                  return [
                    vueExports.renderSlot(_ctx.$slots, "navigation", {}, () => [
                      vueExports.createVNode(_component_Navigator, {
                        items: navItems,
                        featured: guidesFeatured
                      })
                    ])
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
            serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "actions", {}, () => {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Group, { tokens: { group: { "margin-left": "ref-auto" } } }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Search, null, null, _parent3, _scopeId2));
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Translate, null, null, _parent3, _scopeId2));
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Theme, null, null, _parent3, _scopeId2));
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ColorMode, null, null, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_Search),
                      vueExports.createVNode(_component_Translate),
                      vueExports.createVNode(_component_Theme),
                      vueExports.createVNode(_component_ColorMode)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            }, _push2, _parent2, _scopeId);
          } else {
            return [
              vueExports.renderSlot(_ctx.$slots, "logo", {}, () => [
                vueExports.createTextVNode(" Logo ")
              ]),
              vueExports.createVNode(_component_Nav, null, {
                default: vueExports.withCtx(() => [
                  vueExports.renderSlot(_ctx.$slots, "navigation", {}, () => [
                    vueExports.createVNode(_component_Navigator, {
                      items: navItems,
                      featured: guidesFeatured
                    })
                  ])
                ]),
                _: 3
              }),
              vueExports.renderSlot(_ctx.$slots, "actions", {}, () => [
                vueExports.createVNode(_component_Group, { tokens: { group: { "margin-left": "ref-auto" } } }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_Search),
                    vueExports.createVNode(_component_Translate),
                    vueExports.createVNode(_component_Theme),
                    vueExports.createVNode(_component_ColorMode)
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TopBar.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$1, { __name: "TopBar" });
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "Avatar",
  __ssrInlineRender: true,
  props: {
    src: {},
    alt: {},
    fallback: {},
    tokens: {}
  },
  setup(__props) {
    const styles = useTokenStyle(__props.tokens);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AvatarRoot = AvatarRoot_default;
      const _component_AvatarImage = AvatarImage_default;
      const _component_AvatarFallback = AvatarFallback_default;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_AvatarRoot, vueExports.mergeProps({
        style: vueExports.unref(styles)["avatar-root"],
        class: "f-avatar-root"
      }, _attrs), {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_AvatarImage, {
              src: __props.src,
              alt: __props.alt,
              style: vueExports.unref(styles)["avatar-image"],
              class: "f-avatar-image"
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_AvatarFallback, {
              style: vueExports.unref(styles)["avatar-fallback"],
              class: "f-avatar-fallback"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "fallback", {}, () => {
                    _push3(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.fallback)}`);
                  }, _push3, _parent3, _scopeId2);
                } else {
                  return [
                    vueExports.renderSlot(_ctx.$slots, "fallback", {}, () => [
                      vueExports.createTextVNode(vueExports.toDisplayString(__props.fallback), 1)
                    ])
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_AvatarImage, {
                src: __props.src,
                alt: __props.alt,
                style: vueExports.unref(styles)["avatar-image"],
                class: "f-avatar-image"
              }, null, 8, ["src", "alt", "style"]),
              vueExports.createVNode(_component_AvatarFallback, {
                style: vueExports.unref(styles)["avatar-fallback"],
                class: "f-avatar-fallback"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.renderSlot(_ctx.$slots, "fallback", {}, () => [
                    vueExports.createTextVNode(vueExports.toDisplayString(__props.fallback), 1)
                  ])
                ]),
                _: 3
              }, 8, ["style"])
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../layers/blocks/app/components/Avatar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main, { __name: "Avatar" });

export { __nuxt_component_0$2 as _, __nuxt_component_1 as a, __nuxt_component_2 as b };
//# sourceMappingURL=Avatar-ep4X2pHj.mjs.map
