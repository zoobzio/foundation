import { defineNuxtConfig } from "nuxt/config";
import cyberdream from "@zoobz-io/untheme/themes/cyberdream";
import oneDark from "@zoobz-io/untheme/themes/one-dark";
import catppuccin from "@zoobz-io/untheme/themes/catppuccin";
import tokyoNight from "@zoobz-io/untheme/themes/tokyo-night";
import nord from "@zoobz-io/untheme/themes/nord";
import dracula from "@zoobz-io/untheme/themes/dracula";
import solarized from "@zoobz-io/untheme/themes/solarized";
import rosePine from "@zoobz-io/untheme/themes/rose-pine";
import gruvbox from "@zoobz-io/untheme/themes/gruvbox";

export default defineNuxtConfig({
  compatibilityDate: "2025-11-06",
  extends: ["@zoobz-io/ore"],
  imports: {
    dirs: ["types"],
  },
  modules: [
    "@zoobz-io/untheme/module",
    "@vueuse/nuxt",
  ],
  untheme: {
    defaultTheme: "cyberdream",
    themes: {
      cyberdream,
      "one-dark": oneDark,
      catppuccin,
      "tokyo-night": tokyoNight,
      nord,
      dracula,
      solarized,
      "rose-pine": rosePine,
      gruvbox,
    },
  },
  vite: {
    optimizeDeps: {
      exclude: ["#build/iconic.config.mjs", "#build/untheme.themes.mjs"],
    },
  },
});
