import type { PageCollections } from "@nuxt/content";

export interface DoculaCollection {
  key: keyof PageCollections;
  title: string;
  description?: string;
  repo?: string;
}

declare module "nuxt/schema" {
  interface AppConfigInput {
    collection?: DoculaCollection;
  }
}

export default defineAppConfig({
  collection: undefined as unknown as DoculaCollection,
});
