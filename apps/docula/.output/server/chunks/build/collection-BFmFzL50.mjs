import { _ as __nuxt_component_0$2, a as __nuxt_component_1, b as __nuxt_component_2 } from './Avatar-ep4X2pHj.mjs';
import { v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';
import './Group-pXYCZuBY.mjs';
import './PopperContent-BW9NCRPQ.mjs';
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
import './Button-3FIsxtWq.mjs';
import './P-DDZ97RQ5.mjs';
import 'node:stream';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'vue/server-renderer';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "collection",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Main = __nuxt_component_0$2;
      const _component_TopBar = __nuxt_component_1;
      const _component_Avatar = __nuxt_component_2;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Main, vueExports.mergeProps({ tokens: {
        main: {
          "grid-template-columns": "ref-layout-sidebar-left"
        }
      } }, _attrs), {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_TopBar, null, {
              logo: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Avatar, {
                    src: "https://github.com/zoobzio.png",
                    alt: "zoobzio",
                    fallback: "Z"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_Avatar, {
                      src: "https://github.com/zoobzio.png",
                      alt: "zoobzio",
                      fallback: "Z"
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              vueExports.createVNode(_component_TopBar, null, {
                logo: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_Avatar, {
                    src: "https://github.com/zoobzio.png",
                    alt: "zoobzio",
                    fallback: "Z"
                  })
                ]),
                _: 1
              }),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/collection.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=collection-BFmFzL50.mjs.map
