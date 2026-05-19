import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin({
  name: "foundation:crucible",
  setup(nuxtApp) {
    nuxtApp.hook("rampart:denied", ({ roles, scopes }) => {
      log.warn("Access denied", { roles, scopes });
    });

    nuxtApp.hook("untheme:theme", ({ from, to }) => {
      log.info("Theme changed", { from, to });
    });
    nuxtApp.hook("untheme:mode", ({ from, to }) => {
      log.info("Color mode changed", { from, to });
    });

    nuxtApp.hook("rosetta:locale", ({ from, to }) => {
      log.info("Locale changed", { from, to });
    });
  },
});
