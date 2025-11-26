import { v as vueExports, g as useTokenStyle, s as serverRenderer_cjs_prodExports, D as injectConfigProviderContext, I as vue, a as unrefElement } from './server.mjs';

function getActiveElement() {
  let activeElement = (void 0).activeElement;
  if (activeElement == null) return null;
  while (activeElement != null && activeElement.shadowRoot != null && activeElement.shadowRoot.activeElement != null) activeElement = activeElement.shadowRoot.activeElement;
  return activeElement;
}
function renderSlotFragments(children) {
  if (!children) return [];
  return children.flatMap((child) => {
    if (child.type === vueExports.Fragment) return renderSlotFragments(child.children);
    return [child];
  });
}
function useDirection(dir) {
  const context = injectConfigProviderContext({ dir: vueExports.ref("ltr") });
  return vueExports.computed(() => dir?.value || context.dir?.value || "ltr");
}
let count = 0;
function useId(deterministicId, prefix = "reka") {
  if (deterministicId) return deterministicId;
  if ("useId" in vue) return `${prefix}-${vueExports.useId?.()}`;
  const configProviderContext = injectConfigProviderContext({ useId: void 0 });
  if (configProviderContext.useId) return `${prefix}-${configProviderContext.useId()}`;
  return `${prefix}-${++count}`;
}
const Slot = vueExports.defineComponent({
  name: "PrimitiveSlot",
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () => {
      if (!slots.default) return null;
      const children = renderSlotFragments(slots.default());
      const firstNonCommentChildrenIndex = children.findIndex((child) => child.type !== vueExports.Comment);
      if (firstNonCommentChildrenIndex === -1) return children;
      const firstNonCommentChildren = children[firstNonCommentChildrenIndex];
      delete firstNonCommentChildren.props?.ref;
      const mergedProps = firstNonCommentChildren.props ? vueExports.mergeProps(attrs, firstNonCommentChildren.props) : attrs;
      const cloned = vueExports.cloneVNode({
        ...firstNonCommentChildren,
        props: {}
      }, mergedProps);
      if (children.length === 1) return cloned;
      children[firstNonCommentChildrenIndex] = cloned;
      return children;
    };
  }
});
const SELF_CLOSING_TAGS = [
  "area",
  "img",
  "input"
];
const Primitive = vueExports.defineComponent({
  name: "Primitive",
  inheritAttrs: false,
  props: {
    asChild: {
      type: Boolean,
      default: false
    },
    as: {
      type: [String, Object],
      default: "div"
    }
  },
  setup(props, { attrs, slots }) {
    const asTag = props.asChild ? "template" : props.as;
    if (typeof asTag === "string" && SELF_CLOSING_TAGS.includes(asTag)) return () => vueExports.h(asTag, attrs);
    if (asTag !== "template") return () => vueExports.h(props.as, attrs, { default: slots.default });
    return () => vueExports.h(Slot, attrs, { default: slots.default });
  }
});
function usePrimitiveElement() {
  const primitiveElement = vueExports.ref();
  const currentElement = vueExports.computed(() => ["#text", "#comment"].includes(primitiveElement.value?.$el.nodeName) ? primitiveElement.value?.$el.nextElementSibling : unrefElement(primitiveElement));
  return {
    primitiveElement,
    currentElement
  };
}
const ITEM_DATA_ATTR = "data-reka-collection-item";
function useCollection(options = {}) {
  const { key = "", isProvider = false } = options;
  const injectionKey = `${key}CollectionProvider`;
  let context;
  if (isProvider) {
    const itemMap = vueExports.ref(/* @__PURE__ */ new Map());
    const collectionRef = vueExports.ref();
    context = {
      collectionRef,
      itemMap
    };
    vueExports.provide(injectionKey, context);
  } else context = vueExports.inject(injectionKey);
  const getItems = (includeDisabledItem = false) => {
    const collectionNode = context.collectionRef.value;
    if (!collectionNode) return [];
    const orderedNodes = Array.from(collectionNode.querySelectorAll(`[${ITEM_DATA_ATTR}]`));
    const items = Array.from(context.itemMap.value.values());
    const orderedItems = items.sort((a, b) => orderedNodes.indexOf(a.ref) - orderedNodes.indexOf(b.ref));
    if (includeDisabledItem) return orderedItems;
    else return orderedItems.filter((i) => i.ref.dataset.disabled !== "");
  };
  const CollectionSlot = vueExports.defineComponent({
    name: "CollectionSlot",
    setup(_, { slots }) {
      const { primitiveElement, currentElement } = usePrimitiveElement();
      vueExports.watch(currentElement, () => {
        context.collectionRef.value = currentElement.value;
      });
      return () => vueExports.h(Slot, { ref: primitiveElement }, slots);
    }
  });
  const CollectionItem = vueExports.defineComponent({
    name: "CollectionItem",
    inheritAttrs: false,
    props: { value: { validator: () => true } },
    setup(props, { slots, attrs }) {
      const { primitiveElement, currentElement } = usePrimitiveElement();
      vueExports.watchEffect((cleanupFn) => {
        if (currentElement.value) {
          const key$1 = vueExports.markRaw(currentElement.value);
          context.itemMap.value.set(key$1, {
            ref: currentElement.value,
            value: props.value
          });
          cleanupFn(() => context.itemMap.value.delete(key$1));
        }
      });
      return () => vueExports.h(Slot, {
        ...attrs,
        [ITEM_DATA_ATTR]: "",
        ref: primitiveElement
      }, slots);
    }
  });
  const reactiveItems = vueExports.computed(() => Array.from(context.itemMap.value.values()));
  const itemMapSize = vueExports.computed(() => context.itemMap.value.size);
  return {
    getItems,
    reactiveItems,
    itemMapSize,
    CollectionSlot,
    CollectionItem
  };
}
const _sfc_main$2 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "Nav",
  __ssrInlineRender: true,
  props: {
    tokens: {}
  },
  setup(__props) {
    const styles = useTokenStyle(__props.tokens);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<nav${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
        style: vueExports.unref(styles).nav,
        class: "f-nav"
      }, _attrs))}>`);
      serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</nav>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../layers/blocks/app/components/Nav.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$2, { __name: "Nav" });
const aliases = {
  "light": '<circle cx="12" cy="12" r="3" fill="currentColor" opacity=".3"/><path fill="currentColor" d="M12 9c1.65 0 3 1.35 3 3s-1.35 3-3 3s-3-1.35-3-3s1.35-3 3-3m0-2c-2.76 0-5 2.24-5 5s2.24 5 5 5s5-2.24 5-5s-2.24-5-5-5M2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1m18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1M11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1m0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1M5.99 4.58a.996.996 0 0 0-1.41 0a.996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41zm12.37 12.37a.996.996 0 0 0-1.41 0a.996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41zm1.06-10.96a.996.996 0 0 0 0-1.41a.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0zM7.05 18.36a.996.996 0 0 0 0-1.41a.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0z"/>',
  "dark": '<path fill="currentColor" d="M9.37 5.51A7.4 7.4 0 0 0 9.1 7.5c0 4.08 3.32 7.4 7.4 7.4c.68 0 1.35-.09 1.99-.27A7.01 7.01 0 0 1 12 19c-3.86 0-7-3.14-7-7c0-2.93 1.81-5.45 4.37-6.49" opacity=".3"/><path fill="currentColor" d="M9.37 5.51A7.4 7.4 0 0 0 9.1 7.5c0 4.08 3.32 7.4 7.4 7.4c.68 0 1.35-.09 1.99-.27A7.01 7.01 0 0 1 12 19c-3.86 0-7-3.14-7-7c0-2.93 1.81-5.45 4.37-6.49M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.39 5.39 0 0 1-4.4 2.26a5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1"/>',
  "theme": '<path fill="currentColor" d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8c.28 0 .5-.22.5-.5a.54.54 0 0 0-.14-.35c-.41-.46-.63-1.05-.63-1.65a2.5 2.5 0 0 1 2.5-2.5H16c2.21 0 4-1.79 4-4c0-3.86-3.59-7-8-7m-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 10 6.5 10s1.5.67 1.5 1.5S7.33 13 6.5 13m3-4C8.67 9 8 8.33 8 7.5S8.67 6 9.5 6s1.5.67 1.5 1.5S10.33 9 9.5 9m5 0c-.83 0-1.5-.67-1.5-1.5S13.67 6 14.5 6s1.5.67 1.5 1.5S15.33 9 14.5 9m4.5 2.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5s1.5.67 1.5 1.5" opacity=".3"/><path fill="currentColor" d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10a2.5 2.5 0 0 0 1.86-4.17a.495.495 0 0 1 .37-.83H16c3.31 0 6-2.69 6-6c0-4.96-4.49-9-10-9m4 13h-1.77a2.5 2.5 0 0 0-2.5 2.5c0 .61.22 1.19.63 1.65c.06.07.14.19.14.35c0 .28-.22.5-.5.5c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.14 8 7c0 2.21-1.79 4-4 4"/><circle cx="6.5" cy="11.5" r="1.5" fill="currentColor"/><circle cx="9.5" cy="7.5" r="1.5" fill="currentColor"/><circle cx="14.5" cy="7.5" r="1.5" fill="currentColor"/><circle cx="17.5" cy="11.5" r="1.5" fill="currentColor"/>',
  "translate": '<path fill="currentColor" d="m12.87 15.07l-2.54-2.51l.03-.03A17.5 17.5 0 0 0 14.07 6H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35C8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5l3.11 3.11zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2zm-2.62 7l1.62-4.33L19.12 17z"/>',
  "home": '<path fill="currentColor" d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3zm5 15h-2v-6H9v6H7v-7.81l5-4.5l5 4.5z"/><path fill="currentColor" d="M7 10.19V18h2v-6h6v6h2v-7.81l-5-4.5z" opacity=".3"/>',
  "menu": '<path fill="currentColor" d="M3 18h18v-2H3zm0-5h18v-2H3zm0-7v2h18V6z"/>',
  "close": '<path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/>',
  "search": '<path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"/>',
  "filter": '<path fill="currentColor" d="M10 18h4v-2h-4zM3 6v2h18V6zm3 7h12v-2H6z"/>',
  "sort": '<path fill="currentColor" d="M3 18h6v-2H3zM3 6v2h18V6zm0 7h12v-2H3z"/>',
  "explore": '<path fill="currentColor" d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8s8-3.59 8-8s-3.59-8-8-8m2.01 10.01L6.5 17.5l3.49-7.51L17.5 6.5z" opacity=".3"/><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m-5.5-2.5l7.51-3.49L17.5 6.5L9.99 9.99zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1s-1.1-.49-1.1-1.1s.49-1.1 1.1-1.1"/>',
  "add": '<path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"/>',
  "plus": '<path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"/>',
  "edit": '<path fill="currentColor" d="M5 18.08V19h.92l9.06-9.06l-.92-.92z" opacity=".3"/><path fill="currentColor" d="M20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29s-.51.1-.7.29l-1.83 1.83l3.75 3.75zM3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM5.92 19H5v-.92l9.06-9.06l.92.92z"/>',
  "delete": '<path fill="currentColor" d="M8 9h8v10H8z" opacity=".3"/><path fill="currentColor" d="m15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM8 9h8v10H8z"/>',
  "save": '<path fill="currentColor" d="M5 5v14h14V7.83L16.17 5zm7 13c-1.66 0-3-1.34-3-3s1.34-3 3-3s3 1.34 3 3s-1.34 3-3 3m3-8H6V6h9z" opacity=".3"/><path fill="currentColor" d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V7zm2 16H5V5h11.17L19 7.83zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3s3-1.34 3-3s-1.34-3-3-3M6 6h9v4H6z"/>',
  "copy": '<path fill="currentColor" d="M8 7h11v14H8z" opacity=".3"/><path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2m0 16H8V7h11z"/>',
  "arrow-up": '<path fill="currentColor" d="m4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8z"/>',
  "arrow-down": '<path fill="currentColor" d="m20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8z"/>',
  "arrow-left": '<path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8l8 8l1.41-1.41L7.83 13H20z"/>',
  "arrow-right": '<path fill="currentColor" d="m12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>',
  "link": '<path fill="currentColor" d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5m-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4zm-3-4h8v2H8z"/>',
  "link-copied": '<path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z"/>',
  "toc": '<path fill="currentColor" d="M7 5h14v2H7z"/><circle cx="4" cy="6" r="1.5" fill="currentColor"/><path fill="currentColor" d="M7 11h14v2H7zm0 6h14v2H7zm-3 2.5c.82 0 1.5-.68 1.5-1.5s-.67-1.5-1.5-1.5s-1.5.68-1.5 1.5s.68 1.5 1.5 1.5"/><circle cx="4" cy="12" r="1.5" fill="currentColor"/>',
  "dot": '<path fill="currentColor" d="M12 18c3.31 0 6-2.69 6-6s-2.69-6-6-6s-6 2.69-6 6s2.69 6 6 6" opacity=".3"/><path fill="currentColor" d="M12 20c4.42 0 8-3.58 8-8s-3.58-8-8-8s-8 3.58-8 8s3.58 8 8 8m0-14c3.31 0 6 2.69 6 6s-2.69 6-6 6s-6-2.69-6-6s2.69-6 6-6"/>',
  "chevron-up": '<path fill="currentColor" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6l-6 6z"/>',
  "chevron-down": '<path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6l-6-6z"/>',
  "chevron-left": '<path fill="currentColor" d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6l6 6z"/>',
  "chevron-right": '<path fill="currentColor" d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6z"/>',
  "settings": '<path fill="currentColor" d="m19.28 8.6l-.7-1.21l-1.27.51l-1.06.43l-.91-.7c-.39-.3-.8-.54-1.23-.71l-1.06-.43l-.16-1.13L12.7 4h-1.4l-.19 1.35l-.16 1.13l-1.06.44c-.41.17-.82.41-1.25.73l-.9.68l-1.05-.42l-1.27-.52l-.7 1.21l1.08.84l.89.7l-.14 1.13c-.03.3-.05.53-.05.73s.02.43.05.73l.14 1.13l-.89.7l-1.08.84l.7 1.21l1.27-.51l1.06-.43l.91.7c.39.3.8.54 1.23.71l1.06.43l.16 1.13l.19 1.36h1.39l.19-1.35l.16-1.13l1.06-.43c.41-.17.82-.41 1.25-.73l.9-.68l1.04.42l1.27.51l.7-1.21l-1.08-.84l-.89-.7l.14-1.13c.04-.31.05-.52.05-.73s-.02-.43-.05-.73l-.14-1.13l.89-.7zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4s4 1.79 4 4s-1.79 4-4 4" opacity=".3"/><path fill="currentColor" d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46a.5.5 0 0 0-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65A.49.49 0 0 0 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1a.6.6 0 0 0-.18-.03c-.17 0-.34.09-.43.25l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46a.5.5 0 0 0 .61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1q.09.03.18.03c.17 0 .34-.09.43-.25l2-3.46c.12-.22.07-.49-.12-.64zm-1.98-1.71c.04.31.05.52.05.73s-.02.43-.05.73l-.14 1.13l.89.7l1.08.84l-.7 1.21l-1.27-.51l-1.04-.42l-.9.68c-.43.32-.84.56-1.25.73l-1.06.43l-.16 1.13l-.2 1.35h-1.4l-.19-1.35l-.16-1.13l-1.06-.43c-.43-.18-.83-.41-1.23-.71l-.91-.7l-1.06.43l-1.27.51l-.7-1.21l1.08-.84l.89-.7l-.14-1.13c-.03-.31-.05-.54-.05-.74s.02-.43.05-.73l.14-1.13l-.89-.7l-1.08-.84l.7-1.21l1.27.51l1.04.42l.9-.68c.43-.32.84-.56 1.25-.73l1.06-.43l.16-1.13l.2-1.35h1.39l.19 1.35l.16 1.13l1.06.43c.43.18.83.41 1.23.71l.91.7l1.06-.43l1.27-.51l.7 1.21l-1.07.85l-.89.7zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4s4-1.79 4-4s-1.79-4-4-4m0 6c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2"/>',
  "user": '<path fill="currentColor" d="M12 16c-2.69 0-5.77 1.28-6 2h12c-.2-.71-3.3-2-6-2" opacity=".3"/><circle cx="12" cy="8" r="2" fill="currentColor" opacity=".3"/><path fill="currentColor" d="M12 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4m-6 4c.22-.72 3.31-2 6-2c2.7 0 5.8 1.29 6 2zm6-6c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4m0-6c1.1 0 2 .9 2 2s-.9 2-2 2s-2-.9-2-2s.9-2 2-2"/>',
  "calendar": '<path fill="currentColor" d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 2v3H4V5zM4 21V10h16v11z"/><path fill="currentColor" d="M4 5.01h16V8H4z" opacity=".3"/>',
  "check": '<path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z"/>',
  "info": '<path fill="currentColor" d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8s8-3.59 8-8s-3.59-8-8-8m1 13h-2v-6h2zm0-8h-2V7h2z" opacity=".3"/><path fill="currentColor" d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8"/>',
  "warning": '<path fill="currentColor" d="M4.47 19h15.06L12 5.99zM13 18h-2v-2h2zm0-4h-2v-4h2z" opacity=".3"/><path fill="currentColor" d="M1 21h22L12 2zm3.47-2L12 5.99L19.53 19zM11 16h2v2h-2zm0-6h2v4h-2z"/>',
  "error": '<path fill="currentColor" d="M12 4c-4.42 0-8 3.58-8 8s3.58 8 8 8s8-3.58 8-8s-3.58-8-8-8m1 13h-2v-2h2zm0-4h-2V7h2z" opacity=".3"/><path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8m-1-5h2v2h-2zm0-8h2v6h-2z"/>'
};
const useIconAlias = (alias) => aliases[alias];
const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "Icon",
  __ssrInlineRender: true,
  props: {
    alias: {},
    tokens: {}
  },
  setup(__props) {
    const icon = vueExports.computed(() => {
      return useIconAlias(__props.alias);
    });
    const styles = useTokenStyle(__props.tokens);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<svg${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
        viewBox: "0 0 24 24",
        xmlns: "http://www.w3.org/2000/svg",
        class: "f-icon",
        style: vueExports.unref(styles).icon
      }, _attrs))}>${vueExports.unref(icon) ?? ""}</svg>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../layers/blocks/app/components/Icon.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main$1, { __name: "Icon" });
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "Group",
  __ssrInlineRender: true,
  props: {
    tokens: {}
  },
  setup(__props) {
    const styles = useTokenStyle(__props.tokens);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
        style: vueExports.unref(styles).group,
        class: "f-group"
      }, _attrs))}>`);
      serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../layers/blocks/app/components/Group.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main, { __name: "Group" });

export { Primitive as P, __nuxt_component_1 as _, __nuxt_component_2 as a, __nuxt_component_3 as b, useCollection as c, useId as d, usePrimitiveElement as e, getActiveElement as g, renderSlotFragments as r, useDirection as u };
//# sourceMappingURL=Group-pXYCZuBY.mjs.map
