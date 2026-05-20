import { defineNuxtPlugin, useHead } from "#app";
import { computed } from "vue";
import { useTheme } from "./composables";

export default defineNuxtPlugin({
  name: "untheme",
  setup() {
    const { mode, themeCSS } = useTheme();

    // Reactive head — mode class + theme style injection
    useHead({
      htmlAttrs: {
        class: computed(() => (mode.value === "dark" ? "dark" : "")),
      },
      style: computed(() =>
        themeCSS.value
          ? [{ key: "untheme-active", innerHTML: themeCSS.value }]
          : [],
      ),
    });
  },
});
