import { _ as __nuxt_component_0 } from './A-0MGUp8zl.mjs';
import { v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';
import './nuxt-link-Df9NoxNv.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'better-sqlite3';
import 'node:stream';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'vue/server-renderer';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ProseA",
  __ssrInlineRender: true,
  props: {
    href: {},
    target: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_A = __nuxt_component_0;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_A, vueExports.mergeProps({
        href: __props.href,
        target: __props.target
      }, _attrs), {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              vueExports.renderSlot(_ctx.$slots, "default")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../layers/prose/app/components/content/ProseA.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ProseA = Object.assign(_sfc_main, { __name: "ProseA" });

export { ProseA as default };
//# sourceMappingURL=ProseA-BphFOazn.mjs.map
