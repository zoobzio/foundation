import type { PageCollections } from "@nuxt/content";

export interface DoculaExample {
  code: string;
  lang: string;
}

export interface DoculaHero {
  tagline: string;
  description?: string;
  action?: Link;
  example?: DoculaExample;
}

export interface DoculaCollection {
  key: keyof PageCollections;
  title: string;
  hero: DoculaHero;
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
