import { defineNuxtPlugin, reloadNuxtApp } from "#app";

/**
 * Reloads the app when the visitor switches locale. The wrappers resolve
 * text on each render and follow a switch on their own; the services do
 * not, as a factory resolves the labels of its columns, actions and fields
 * once, when the service is built. The prosary module writes the new
 * locale to its cookie before it raises the hook, so the reload renders
 * the app in the locale chosen, from the server on.
 */
export default defineNuxtPlugin({
  name: "@zoobzio/nuxt/locale",
  dependsOn: ["prosary"],
  setup: (nuxtApp) => {
    nuxtApp.hook("prosary:locale", () => {
      reloadNuxtApp();
    });
  },
});
