import type {
  Actions,
  BrowserFetchResult,
  Config,
  State,
} from "@zoobzio/browser";
import type { FakeFile } from "#test/data/browser";

import { reactive } from "vue";
import { vi } from "vitest";
import { BrowserService, createBrowserState } from "@zoobzio/browser";
import { fakeFileColumns, fakeFiles, fakeFolders } from "#test/data/browser";

/**
 * A real browser service over a reactive container, with a `vi.fn()` fetch
 * that resolves the fake listing. The shape every consumer builds.
 */
export const makeBrowser = (
  config: Partial<Config<FakeFile>> = {},
  wiring: Partial<Actions<FakeFile>> = {},
  result: BrowserFetchResult<FakeFile> = {
    folders: fakeFolders,
    files: fakeFiles,
  },
) => {
  const full: Config<FakeFile> = {
    columns: fakeFileColumns,
    fileKey: "id",
    ...config,
  };
  const state: State<FakeFile> = reactive(createBrowserState<FakeFile>());
  const fetch = wiring.fetch ?? vi.fn(async () => result);
  const service = new BrowserService<FakeFile>("test-browser", full, state, {
    ...wiring,
    fetch,
  });
  return { service, state, fetch };
};
