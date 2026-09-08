import type { BreadcrumbItem } from "../types/core/breadcrumb";
import type { MenuGroup, MenuItem } from "../types/core/menu";
import type { BrowserFolder, Service } from "../types/data/browser";

import { computed } from "#imports";
import { useServiceRefs } from "./refs";

import {
  BROWSER_ROOT_ICON,
  BROWSER_ROOT_KEY,
  BROWSER_ROOT_LABEL,
} from "../constants/browser";

/**
 * The view surface of the browser feature, shared by every browser
 * component: the service's state as refs, the shared deriveds, the
 * breadcrumb bridge, and the per-row action menu dispatch for files and
 * folders. Each component destructures its slice.
 */
export const useBrowserView = <T>(browser: Service<T>) => {
  const serviceRefs = useServiceRefs(browser);

  // Shared deriveds
  const hasSelection = computed(() => browser.selected.size > 0);
  const isSelectable = computed(() => browser.bulkActions.length > 0);
  const hasActions = computed(() => browser.actions.length > 0);
  const hasFolderActions = computed(() => browser.folderActions.length > 0);
  // Gated on `initialized` so SSR and hydration agree: before the first
  // fetch resolves, both server and client render the body branch, not the
  // empty state — branching on loading alone mismatches when init kicks
  // off during client setup.
  const isEmpty = computed(
    () =>
      browser.initialized &&
      !browser.loading &&
      !browser.folders.length &&
      !browser.files.length,
  );

  // Breadcrumb bridge — the root crumb comes from config, the rest from
  // the trail. Crumb keys are joined path prefixes so they stay unique
  // when the same folder key recurs at different depths; the select
  // handler resolves by trail index, which is exactly what `navigate`
  // takes (clicking the current crumb resolves to `depth`, a no-op).
  const crumbItems = computed<BreadcrumbItem[]>(() => [
    {
      key: BROWSER_ROOT_KEY,
      label: browser.config.rootLabel ?? BROWSER_ROOT_LABEL,
      icon: browser.config.rootIcon ?? BROWSER_ROOT_ICON,
    },
    ...browser.path.map((crumb, index) => ({
      key: browser.pathKeys.slice(0, index + 1).join("/"),
      label: crumb.label,
    })),
  ]);

  const onCrumbSelect = (item: BreadcrumbItem) => {
    const index = crumbItems.value.findIndex((c) => c.key === item.key);
    if (index >= 0) browser.navigate(index);
  };

  // Per-row action menus — descriptors and the label→action dispatch,
  // one bridge for file rows and one for folder rows.
  const actionGroups = computed<MenuGroup[]>(() => [
    {
      key: "actions",
      items: browser.actions.map((a) => ({ icon: a.icon, label: a.label })),
    },
  ]);

  const actionMap = new Map(browser.actions.map((a) => [a.label, a]));

  const onActionSelect = (row: T, item: MenuItem) => {
    actionMap.get(item.label)?.action(row);
  };

  const folderActionGroups = computed<MenuGroup[]>(() => [
    {
      key: "folder-actions",
      items: browser.folderActions.map((a) => ({
        icon: a.icon,
        label: a.label,
      })),
    },
  ]);

  const folderActionMap = new Map(
    browser.folderActions.map((a) => [a.label, a]),
  );

  const onFolderActionSelect = (folder: BrowserFolder, item: MenuItem) => {
    folderActionMap.get(item.label)?.action(folder);
  };

  return {
    ...serviceRefs,
    hasSelection,
    isSelectable,
    hasActions,
    hasFolderActions,
    isEmpty,
    crumbItems,
    onCrumbSelect,
    actionGroups,
    onActionSelect,
    folderActionGroups,
    onFolderActionSelect,
  };
};
