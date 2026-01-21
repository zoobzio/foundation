export type GiscusMapping =
  | "pathname"
  | "url"
  | "title"
  | "og:title"
  | "specific"
  | "number";

export type GiscusInputPosition = "top" | "bottom";

export type GiscusLoading = "lazy" | "eager";

export interface GiscusConfig {
  repo: `${string}/${string}`;
  repoId: string;
  category: string;
  categoryId: string;
  mapping?: GiscusMapping;
  term?: string;
  reactionsEnabled?: boolean;
  emitMetadata?: boolean;
  inputPosition?: GiscusInputPosition;
  lang?: string;
  loading?: GiscusLoading;
}

declare module "nuxt/schema" {
  interface AppConfigInput {
    giscus?: GiscusConfig;
  }
}

export default defineAppConfig({
  giscus: undefined as unknown as GiscusConfig | undefined,
});
