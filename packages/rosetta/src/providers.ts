import type { I18nProvider, SourceMap, LocaleMessages } from "./types";

/** Mock provider that wraps source text with the locale code. */
export const mockProvider: I18nProvider = {
  translate: (sourceMap: SourceMap, locale: string): LocaleMessages => {
    const messages: LocaleMessages = {};
    for (const [hash, text] of Object.entries(sourceMap)) {
      messages[hash] = `[${locale}] ${text}`;
    }
    return messages;
  },
};
