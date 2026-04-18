import { defineNuxtPlugin, useHead } from "#app";
import { computed } from "vue";
import { useUntheme } from "./composables";

export default defineNuxtPlugin(() => {
  const { mode, themeCSS } = useUntheme();

  // Reactive head — mode class + theme style injection
  useHead(computed(() => ({
    htmlAttrs: {
      class: mode.value === "dark" ? "dark" : "",
    },
    style: themeCSS.value
      ? [{ key: "untheme-active", innerHTML: themeCSS.value }]
      : [],
  })));
});
