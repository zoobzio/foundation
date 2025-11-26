import { _ as __nuxt_component_0 } from './H1-Cdbb55Nq.mjs';
import { v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';
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
  __name: "ProseH1",
  __ssrInlineRender: true,
  props: {
    id: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_H1 = __nuxt_component_0;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_H1, vueExports.mergeProps({ id: __props.id }, _attrs), {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../layers/prose/app/components/content/ProseH1.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ProseH1 = Object.assign(_sfc_main, { __name: "ProseH1" });

export { ProseH1 as default };
//# sourceMappingURL=ProseH1-BmxKl7xv.mjs.map
