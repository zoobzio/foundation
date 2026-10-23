import type {
  Actions,
  BrowserFetchResult,
  Config,
  State,
} from "@zoobzio/browser";

import { reactive } from "vue";
import { vi } from "vitest";
import { BrowserService, createBrowserState } from "@zoobzio/browser";
import { fakeFolders } from "#test/data/browser";

/**
 * A file with a url column, so the file rows render a link part.
 */
export type LinkedFile = {
  id: number;
  name: string;
  url: string;
};

export const linkedFiles: LinkedFile[] = [
  { id: 1, name: "logo.svg", url: "https://cdn.example/logo.svg" },
  { id: 2, name: "hero.png", url: "https://cdn.example/hero.png" },
];

/**
 * A real browser service over a reactive container, with a `vi.fn()` fetch
 * that resolves the linked listing. The shape every consumer builds.
 */
export const makeBrowser = (
  config: Partial<Config<LinkedFile>> = {},
  wiring: Partial<Actions<LinkedFile>> = {},
  result: BrowserFetchResult<LinkedFile> = {
    folders: fakeFolders,
    files: linkedFiles,
  },
) => {
  const full: Config<LinkedFile> = {
    columns: [
      { key: "name", label: "Name", type: "text" },
      { key: "url", label: "URL", type: "url" },
    ],
    fileKey: "id",
    ...config,
  };
  const state: State<LinkedFile> = reactive(createBrowserState<LinkedFile>());
  const fetch = wiring.fetch ?? vi.fn(async () => result);
  const service = new BrowserService<LinkedFile>("test-browser", full, state, {
    ...wiring,
    fetch,
  });
  return { service, state, fetch };
};
