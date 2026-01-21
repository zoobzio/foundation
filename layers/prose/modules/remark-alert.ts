import { defineNuxtModule, useNuxt } from "@nuxt/kit";
import { remarkAlert } from "../config/remark-alert";

export default defineNuxtModule({
  meta: {
    name: "remark-alert",
  },
  setup() {
    const nuxt = useNuxt();

    // Extend content config to add our remark plugin
    // @ts-expect-error - content options type
    nuxt.options.content = nuxt.options.content || {};
    // @ts-expect-error - content options type
    nuxt.options.content.build = nuxt.options.content.build || {};
    // @ts-expect-error - content options type
    nuxt.options.content.build.markdown = nuxt.options.content.build.markdown || {};
    // @ts-expect-error - content options type
    nuxt.options.content.build.markdown.remarkPlugins = {
      // @ts-expect-error - content options type
      ...nuxt.options.content.build.markdown.remarkPlugins,
      "remark-alert": {
        instance: remarkAlert,
      },
    };
  },
});
