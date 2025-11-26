import { v as vueExports, s as serverRenderer_cjs_prodExports, g as useTokenStyle } from './server.mjs';
import { _ as __nuxt_component_1 } from './Button-3FIsxtWq.mjs';
import { a as __nuxt_component_2 } from './Group-pXYCZuBY.mjs';
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

const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "Pre",
  __ssrInlineRender: true,
  props: {
    tokens: {}
  },
  setup(__props) {
    const styles = useTokenStyle(__props.tokens);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<pre${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
        style: vueExports.unref(styles).pre,
        class: "f-pre"
      }, _attrs))}>`);
      serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</pre>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../layers/blocks/app/components/Pre.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$1, { __name: "Pre" });
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ProsePre",
  __ssrInlineRender: true,
  props: {
    code: {}
  },
  setup(__props) {
    const copied = vueExports.ref(false);
    const copyCode = async () => {
      await (void 0).clipboard.writeText(__props.code);
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 2e3);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Pre = __nuxt_component_0;
      const _component_Button = __nuxt_component_1;
      const _component_Icon = __nuxt_component_2;
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Pre, vueExports.mergeProps({ tokens: {
        pre: {
          position: "ref-position-relative"
        }
      } }, _attrs), {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Button, {
              tokens: {
                button: {
                  position: "ref-position-absolute",
                  top: "ref-position-zero",
                  right: "ref-position-zero"
                }
              },
              onClick: copyCode
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
                    alias: vueExports.unref(copied) ? "check" : "copy"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_Icon, {
                      alias: vueExports.unref(copied) ? "check" : "copy"
                    }, null, 8, ["alias"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              vueExports.createVNode(_component_Button, {
                tokens: {
                  button: {
                    position: "ref-position-absolute",
                    top: "ref-position-zero",
                    right: "ref-position-zero"
                  }
                },
                onClick: copyCode
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_Icon, {
                    alias: vueExports.unref(copied) ? "check" : "copy"
                  }, null, 8, ["alias"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../layers/prose/app/components/content/ProsePre.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ProsePre = Object.assign(_sfc_main, { __name: "ProsePre" });

export { ProsePre as default };
//# sourceMappingURL=ProsePre-Vp4Hmqin.mjs.map
