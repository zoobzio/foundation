import { buildSearchIndex } from "../utils/search";

let indexTriggered = false;

export default defineNitroPlugin((nitroApp) => {
  // Trigger index build on the first incoming request
  nitroApp.hooks.hook("request", async (event) => {
    if (indexTriggered) return;
    indexTriggered = true;

    // Fire and forget - don't block the request
    buildSearchIndex(async (collection) => {
      return await queryCollectionSearchSections(event, collection as any, {
        ignoredTags: ["pre", "code"],
      });
    }).catch((error) => {
      console.error("[search] Background index build failed:", error);
    });
  });
});
