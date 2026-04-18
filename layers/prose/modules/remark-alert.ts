import { defineNuxtModule, useNuxt } from "@nuxt/kit";
import { remarkAlert } from "../config/remark-alert";

export default defineNuxtModule({
  meta: {
    name: "remark-alert",
  },
  setup() {
    const nuxt = useNuxt();

    // Extend content config to add our remark plugin
    const opts = nuxt.options as unknown as Record<string, Record<string, Record<string, Record<string, unknown>>>>;
    opts.content = opts.content || {};
    opts.content.build = opts.content.build || {};
    opts.content.build.markdown = opts.content.build.markdown || {};
    const existing = (opts.content.build.markdown.remarkPlugins ?? {}) as Record<string, unknown>;
    opts.content.build.markdown.remarkPlugins = {
      ...existing,
      "remark-alert": {
        instance: remarkAlert,
      },
    };
  },
});
