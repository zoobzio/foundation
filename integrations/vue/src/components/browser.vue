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
import Breadcrumb from "./breadcrumb.vue";
import Fab from "./fab.vue";

import { useTemplateRef } from "vue";
import { useServiceEmits } from "../composables/events";
import { useForward } from "../composables/forward";
import { useRefs } from "../composables/ref";
import { usePassthrough } from "../composables/passthrough";
import { useContext } from "../composables/context";
import { crumbItems } from "../utils/browser";
import {
  BROWSER_EMPTY_TEXT,
  BROWSER_EVENTS,
  BROWSER_REFRESH_LABEL,
} from "../constants/browser";
</script>

<script setup lang="ts" generic="T">
const { service, pt } = defineProps<BrowserProps<T>>();

const emit = defineEmits<BrowserEmits<T>>();

useServiceEmits(service, BROWSER_EVENTS, emit);

const el = useTemplateRef<HTMLDivElement>("el");

const { folders, hasSelection, isEmpty } = useRefs(service);

const settings = usePassthrough<BrowserPassthrough>(() => ({
  pt,
  recipes: {
    breadcrumb: {
      items: crumbItems(service),
      onSelect: (item) => service.navigate(item.index),
    },
    refresh: { label: BROWSER_REFRESH_LABEL, onClick: () => service.fetch() },
  },
}));

const ctx = useContext<BrowserContext<T>>("browser", () => ({
  browser: service,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });

const slots = defineSlots<BrowserSlots<T>>();

const { Folders, Files } = useForward({
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
    :class="{ 'f-data-browser-loading': service.loading }"
  >
    <slot name="toolbar" v-bind="ctx">
      <div class="f-group f-data-browser-toolbar">
        <slot name="breadcrumb" v-bind="ctx">
          <Breadcrumb
            v-bind="settings.breadcrumb"
            class="f-data-browser-breadcrumb"
          />
        </slot>
        <Fab v-bind="settings.refresh">
          <template v-if="slots.refreshPrepend" #prepend>
            <slot name="refreshPrepend" v-bind="ctx" />
          </template>
          <template v-if="slots.refreshAppend" #append>
            <slot name="refreshAppend" v-bind="ctx" />
          </template>
        </Fab>
      </div>
    </slot>

    <BrowserBulkActions v-if="hasSelection" :service="service">
      <template v-if="slots.bulkActionPrepend" #bulkActionPrepend="slotProps">
        <slot name="bulkActionPrepend" v-bind="slotProps" />
      </template>
      <template v-if="slots.bulkActionAppend" #bulkActionAppend="slotProps">
        <slot name="bulkActionAppend" v-bind="slotProps" />
      </template>
    </BrowserBulkActions>

    <slot v-if="isEmpty" name="empty" v-bind="ctx">
      <div class="f-group f-data-browser-empty">{{ BROWSER_EMPTY_TEXT }}</div>
    </slot>
    <table v-else class="f-table">
      <Folders v-if="folders.length" />
      <Files />
    </table>
  </div>
</template>
