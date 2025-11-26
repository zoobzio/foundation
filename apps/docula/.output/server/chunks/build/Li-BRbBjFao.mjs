import { v as vueExports, g as useTokenStyle, s as serverRenderer_cjs_prodExports } from './server.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "Li",
  __ssrInlineRender: true,
  props: {
    tokens: {}
  },
  setup(__props) {
    const styles = useTokenStyle(__props.tokens);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<li${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
        style: vueExports.unref(styles).li,
        class: "f-li"
      }, _attrs))}>`);
      serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</li>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../layers/blocks/app/components/Li.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "Li" });

export { __nuxt_component_0 as _ };
//# sourceMappingURL=Li-BRbBjFao.mjs.map
