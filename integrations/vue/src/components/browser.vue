<script lang="ts">
import type {
  BrowserContext,
  BrowserEmits,
  BrowserPassthrough,
  BrowserProps,
  BrowserSlots,
} from "../types/components/browser";

import BrowserBulkActions from "./browser-bulk-actions.vue";
import BrowserFiles from "./browser-files.vue";
import BrowserFolders from "./browser-folders.vue";
import BrowserHead from "./browser-head.vue";
import Autocomplete from "./autocomplete.vue";
import Fab from "./fab.vue";
import Menu from "./menu.vue";

import Primitive from "./primitive.vue";

import { useTemplateRef } from "vue";
import { useServiceEmits } from "../composables/events";
import { useForward } from "../composables/forward";
import { useRefs } from "../composables/ref";
import { usePassthrough } from "../composables/passthrough";
import { useContext } from "../composables/context";
import { useSync } from "../composables/sync";
import { sortItems } from "../utils/browser";
import { isSyncCurrent, selectSync, syncGroups } from "../utils/sync";
import {
  BROWSER_EMPTY_TEXT,
  BROWSER_EVENTS,
  BROWSER_NO_MATCHES_TEXT,
  BROWSER_REFRESH_LABEL,
  BROWSER_SEARCH_PLACEHOLDER,
  BROWSER_SORT_LABEL,
} from "../constants/browser";
</script>

<script setup lang="ts" generic="T">
const { service, pt } = defineProps<BrowserProps<T>>();

const emit = defineEmits<BrowserEmits<T>>();

useServiceEmits(service, BROWSER_EVENTS, emit);

// The listing is kept alive while the browser is on screen.
useSync(() => service.sync);

const el = useTemplateRef<HTMLDivElement>("el");

const { folders, hasSelection, isEmpty, isFiltered, colSpan, sortableColumns } =
  useRefs(service);

const settings = usePassthrough<BrowserPassthrough>(() => ({
  pt,
  recipes: {
    search: {
      as: Autocomplete,
      service: service.query,
      placeholder: BROWSER_SEARCH_PLACEHOLDER,
    },
    sortMenu: {
      as: Menu,
      groups: [{ key: "sort", items: sortItems(service) }],
      align: "end",
      // The item the files sort by is marked, with its direction.
      pt: {
        item: (item) => ({
          "data-current": service.sortField === item.key ? "" : undefined,
          "data-direction":
            service.sortField === item.key ? service.sortDirection : undefined,
        }),
      },
      onSelect: (item) => service.sortBy(item.key),
    },
    sortTrigger: { as: Fab, label: BROWSER_SORT_LABEL },
    // With a sync the button is the trigger of the sync menu, which
    // refreshes at once from its first item.
    refresh: {
      as: Fab,
      label: BROWSER_REFRESH_LABEL,
      ...(!service.sync && { onClick: () => service.fetch() }),
    },
    syncMenu: {
      as: Menu,
      groups: service.sync ? syncGroups(service.sync) : [],
      align: "end",
      // The item of the interval the sync is on is marked.
      pt: {
        item: (item) => ({
          "data-current": isSyncCurrent(service.sync, item) ? "" : undefined,
        }),
      },
      onSelect: (item) => {
        if (service.sync) selectSync(service.sync, item, () => service.fetch());
      },
    },
  },
}));

const ctx = useContext<BrowserContext<T>>("browser", () => ({
  browser: service,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });

const slots = defineSlots<BrowserSlots<T>>();

const { Head, Folders, Files } = useForward({
  Head: {
    component: BrowserHead,
    props: () => ({ service, pt: pt?.head }),
    slots,
  },
  Folders: {
    component: BrowserFolders,
    props: () => ({ service, pt: pt?.folders }),
    slots,
  },
  Files: {
    component: BrowserFiles,
    props: () => ({ service, pt: pt?.files }),
    slots,
  },
});
</script>

<template>
  <div
    ref="el"
    class="f-group f-data-browser"
    :class="{
      'f-data-browser-loading': service.loading,
      'f-data-browser-live': service.sync?.active,
      'f-data-browser-syncing': service.sync?.syncing,
    }"
  >
    <slot name="toolbar" v-bind="ctx">
      <div class="f-group f-data-browser-toolbar">
        <slot v-if="service.searchable" name="search" v-bind="ctx">
          <Primitive v-bind="settings.search" class="f-data-browser-search" />
        </slot>
        <Primitive v-if="sortableColumns.length" v-bind="settings.sortMenu">
          <slot name="sort" v-bind="ctx">
            <Primitive v-bind="settings.sortTrigger" />
          </slot>
          <template v-if="slots.sortPrepend" #itemPrepend="{ item }">
            <slot name="sortPrepend" v-bind="{ ...ctx, item }" />
          </template>
          <template v-if="slots.sortAppend" #itemAppend="{ item }">
            <slot name="sortAppend" v-bind="{ ...ctx, item }" />
          </template>
        </Primitive>
        <Primitive v-if="service.sync" v-bind="settings.syncMenu">
          <slot name="refresh" v-bind="ctx">
            <Primitive v-bind="settings.refresh" />
          </slot>
          <template v-if="slots.syncPrepend" #itemPrepend="{ item }">
            <slot name="syncPrepend" v-bind="{ ...ctx, item }" />
          </template>
          <template v-if="slots.syncLabel" #itemLabel="{ item }">
            <slot name="syncLabel" v-bind="{ ...ctx, item }" />
          </template>
          <template v-if="slots.syncAppend" #itemAppend="{ item }">
            <slot name="syncAppend" v-bind="{ ...ctx, item }" />
          </template>
        </Primitive>
        <slot v-else name="refresh" v-bind="ctx">
          <Primitive v-bind="settings.refresh" />
        </slot>
      </div>
    </slot>

    <BrowserBulkActions v-if="hasSelection" :service="service">
      <template v-if="slots.bulkActionPrepend" #bulkActionPrepend="slotProps">
        <slot name="bulkActionPrepend" v-bind="slotProps" />
      </template>
      <template v-if="slots.bulkActionAppend" #bulkActionAppend="slotProps">
        <slot name="bulkActionAppend" v-bind="slotProps" />
      </template>
      <template v-if="slots.bulkClear" #bulkClear="slotProps">
        <slot name="bulkClear" v-bind="slotProps" />
      </template>
    </BrowserBulkActions>

    <table class="f-table">
      <Head />
      <!-- The head stays over a settled empty folder: the trail is the way
           back out of it. -->
      <tbody v-if="isEmpty" class="f-tbody f-data-browser-empty">
        <tr class="f-tr">
          <td class="f-td" :colspan="colSpan">
            <slot name="empty" v-bind="ctx">
              {{ isFiltered ? BROWSER_NO_MATCHES_TEXT : BROWSER_EMPTY_TEXT }}
            </slot>
          </td>
        </tr>
      </tbody>
      <template v-else>
        <Folders v-if="folders.length" />
        <Files />
      </template>
    </table>
  </div>
</template>
