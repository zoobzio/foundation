/** Flat map of hash → original source text. The deduped source of truth. */
export type SourceMap = Record<string, string>;

/** Maps route paths to the hashes used on that page. */
export type PageMap = Record<string, string[]>;

/** Flat map of hash → translated text for a single locale. */
export type LocaleMessages = Record<string, string>;

/** Translates a source map into locale messages for a given locale. */
export interface I18nProvider {
  translate: (sourceMap: SourceMap, locale: string) => LocaleMessages | Promise<LocaleMessages>;
}

/** Config for the rosetta module. */
export interface I18nConfig {
  /** Default locale code (e.g. "en") */
  defaultLocale: string;
  /** Available locale codes */
  locales: string[];
  /** Translation provider. Defaults to mock provider. */
  provider?: I18nProvider;
}
