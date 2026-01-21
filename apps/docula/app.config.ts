import type { PageCollections } from "@nuxt/content";

export interface DoculaCollection {
  key: keyof PageCollections;
  title: string;
  description?: string;
  repo?: string;
  navIcons?: Record<string, IconAlias>;
}

export interface DoculaVersion {
  current: string;
  versions: string[];
  latest: string;
}

declare module "nuxt/schema" {
  interface AppConfigInput {
    title?: string;
    collection?: DoculaCollection;
    version?: DoculaVersion;
  }
}

export default defineAppConfig({
  title: "Foundation",
  collection: undefined as unknown as DoculaCollection,
});
