import { _ as __nuxt_component_0$1 } from './nuxt-link-Df9NoxNv.mjs';
import { v as vueExports, g as useTokenStyle, s as serverRenderer_cjs_prodExports } from './server.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "A",
  __ssrInlineRender: true,
  props: {
    label: {},
    to: {},
    external: { type: Boolean },
    target: {},
    replace: { type: Boolean },
    prefetch: { type: Boolean },
    disabled: { type: Boolean },
    tokens: {}
  },
  setup(__props) {
    const styles = useTokenStyle(__props.tokens);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, vueExports.mergeProps({
        to: __props.disabled ? void 0 : __props.to,
        external: __props.external,
        target: __props.target,
        replace: __props.replace,
        prefetch: __props.prefetch,
        style: vueExports.unref(styles).a,
        "aria-disabled": __props.disabled,
        "aria-current": __props.disabled ? "page" : void 0,
        class: "f-a"
      }, _attrs), {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "default", {}, () => {
              _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.label)}`);
            }, _push2, _parent2, _scopeId);
          } else {
            return [
              vueExports.renderSlot(_ctx.$slots, "default", {}, () => [
                vueExports.createTextVNode(vueExports.toDisplayString(__props.label), 1)
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../layers/blocks/app/components/A.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "A" });

export { __nuxt_component_0 as _ };
//# sourceMappingURL=A-0MGUp8zl.mjs.map
