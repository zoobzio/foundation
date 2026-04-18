import { defineNuxtModule } from "@nuxt/kit";
import type { GitterModuleOptions } from "./types";

export default defineNuxtModule<GitterModuleOptions>({
  meta: {
    name: "gitter",
    configKey: "gitter",
  },
  setup(options, nuxt) {
    nuxt.options.runtimeConfig.gitter = {
      token: options.token ?? process.env.GITHUB_TOKEN ?? "",
    };
  },
});
