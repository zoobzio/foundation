import type { I18nConfig, I18nProvider } from "./types";

export type { I18nConfig, I18nProvider };
export { mockProvider } from "./providers";

export const defineI18n = (config: I18nConfig): I18nConfig => config;

export const defineI18nProvider = (provider: I18nProvider): I18nProvider => provider;
