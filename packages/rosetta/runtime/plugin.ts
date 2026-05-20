import { defineNuxtPlugin } from "#app";
import { useI18n, loadChunk } from "./composables";

export default defineNuxtPlugin({
  name: "rosetta",
  async setup(nuxtApp) {
    const { locale, messages } = useI18n();
    const router = nuxtApp.$router as { currentRoute: { value: { path: string } } };

    await loadChunk(locale.value, router.currentRoute.value.path, messages);

    nuxtApp.hook("page:start", async () => {
      await loadChunk(locale.value, router.currentRoute.value.path, messages);
    });
  },
});
