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

const _sfc_main = {
  __name: "ProseScript",
  __ssrInlineRender: true,
  props: {
    src: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    const isDev = false;
    return (_ctx, _push, _parent, _attrs) => {
      if (vueExports.unref(isDev)) {
        _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)}> Rendering the <code>script</code> element is dangerous and is disabled by default. Consider implementing your own <code>ProseScript</code> element to have control over script rendering. </div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/@nuxtjs+mdc@0.18.2_magicast@0.3.5/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseScript.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ProseScript = Object.assign(_sfc_main, { __name: "ProseScript" });

export { ProseScript as default };
//# sourceMappingURL=ProseScript-DjP-2vAh.mjs.map
