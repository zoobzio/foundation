import { _ as __nuxt_component_3 } from './Section-9Z3cyJCG.mjs';
import { _ as __nuxt_component_0 } from './H1-Cdbb55Nq.mjs';
import { _ as __nuxt_component_0$1 } from './P-DDZ97RQ5.mjs';
import { _ as __nuxt_component_0$2 } from './Ul-CipXModQ.mjs';
import { _ as __nuxt_component_0$3 } from './Li-BRbBjFao.mjs';
import { _ as __nuxt_component_0$4 } from './A-0MGUp8zl.mjs';
import { s as serverRenderer_cjs_prodExports, v as vueExports } from './server.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
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

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_Section = __nuxt_component_3;
  const _component_H1 = __nuxt_component_0;
  const _component_P = __nuxt_component_0$1;
  const _component_Ul = __nuxt_component_0$2;
  const _component_Li = __nuxt_component_0$3;
  const _component_A = __nuxt_component_0$4;
  _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Section, _attrs, {
    default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_H1, null, {
          default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`Welcome`);
            } else {
              return [
                vueExports.createTextVNode("Welcome")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_P, null, {
          default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`Landing page placeholder`);
            } else {
              return [
                vueExports.createTextVNode("Landing page placeholder")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Ul, null, {
          default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Li, null, {
                default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                  if (_push4) {
                    _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_A, { to: "/example" }, {
                      default: vueExports.withCtx((_4, _push5, _parent5, _scopeId4) => {
                        if (_push5) {
                          _push5(`Example Collection`);
                        } else {
                          return [
                            vueExports.createTextVNode("Example Collection")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent4, _scopeId3));
                  } else {
                    return [
                      vueExports.createVNode(_component_A, { to: "/example" }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode("Example Collection")
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent3, _scopeId2));
            } else {
              return [
                vueExports.createVNode(_component_Li, null, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_A, { to: "/example" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode("Example Collection")
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
      } else {
        return [
          vueExports.createVNode(_component_H1, null, {
            default: vueExports.withCtx(() => [
              vueExports.createTextVNode("Welcome")
            ]),
            _: 1
          }),
          vueExports.createVNode(_component_P, null, {
            default: vueExports.withCtx(() => [
              vueExports.createTextVNode("Landing page placeholder")
            ]),
            _: 1
          }),
          vueExports.createVNode(_component_Ul, null, {
            default: vueExports.withCtx(() => [
              vueExports.createVNode(_component_Li, null, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_A, { to: "/example" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode("Example Collection")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { index as default };
//# sourceMappingURL=index-C1qlJdfS.mjs.map
