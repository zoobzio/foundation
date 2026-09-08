<script lang="ts">
import type {
  BrowserWidgetContext,
  BrowserWidgetEmits,
  BrowserWidgetPassthrough,
  BrowserWidgetProps,
  BrowserWidgetSlots,
} from "../../../types/data/browser/widget";
import type { Events } from "../../../types/data/browser";

import BulkActions from "./bulk-actions.vue";
import Files from "./files.vue";
import Folders from "./folders.vue";
import Breadcrumb from "../../core/breadcrumb.vue";
import Fab from "../../core/fab.vue";
import Scroller from "../../core/scroller.vue";

import { computed, useTemplateRef } from "#imports";
import { useBrowserView } from "../../../composables/browser";
import { useHooks } from "../../../composables/hook";
import { usePassthrough } from "../../../composables/passthrough";
import { useContext } from "../../../composables/context";
import { useForwardSlots } from "../../../composables/slots";
import { useLazyRequest } from "../../../composables/request";
import {
  BROWSER_FOLDER_SLOTS,
  BROWSER_REFRESH_ICON,
} from "../../../constants/browser";
</script>

<script setup lang="ts" generic="T">
const { service, pt } = defineProps<BrowserWidgetProps<T>>();

const emit = defineEmits<BrowserWidgetEmits>();

useHooks<Events>(service.id, {
  "browser:updated": (event) => emit("updated", event),
  "browser:navigated": (event) => emit("navigated", event),
});

const el = useTemplateRef<HTMLDivElement>("el");

const { hasSelection, isEmpty, crumbItems, onCrumbSelect } =
  useBrowserView(service);

const settings = usePassthrough<BrowserWidgetPassthrough>(() => ({
  pt,
  recipes: {
    breadcrumb: { items: crumbItems.value, onSelect: onCrumbSelect },
    refresh: { icon: BROWSER_REFRESH_ICON, onClick: () => service.fetch() },
    scroller: {},
  },
}));

const ctx = useContext<BrowserWidgetContext<T>>("data-browser", () => ({
  browser: service,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });

const slots = defineSlots<BrowserWidgetSlots<T>>();

// Child-owned slots relay to the folder and file row sections, filtered so
// each child keeps its own defaults for any the consumer didn't supply.
// `noFiles` (files ctx) and the cell slots (cell ctx) forward in separate
// loops to stay homogeneously typed.
const folderSlots = useForwardSlots(slots, BROWSER_FOLDER_SLOTS);
const noFilesSlots = computed(() =>
  Object.keys(slots).filter((n): n is "noFiles" => n === "noFiles"),
);
const cellSlots = computed(() =>
  Object.keys(slots).filter(
    (n): n is "cell" | `cell:${string}` =>
      n === "cell" || n.startsWith("cell:"),
  ),
);

useLazyRequest(`init-browser-${service.id}`, () => service.init());
</script>

<template>
  <div ref="el" class="f-group f-data-browser">
    <slot name="toolbar" v-bind="ctx">
      <div class="f-group f-data-browser-toolbar">
        <slot name="breadcrumb" v-bind="ctx">
          <Breadcrumb
            v-bind="settings.breadcrumb"
            class="f-data-browser-breadcrumb"
          />
        </slot>
        <Fab v-bind="settings.refresh" />
      </div>
    </slot>

    <BulkActions v-if="hasSelection" :browser="service" />

    <slot v-if="isEmpty" name="empty" v-bind="ctx">
      <div class="f-group f-data-browser-empty">Empty folder</div>
    </slot>
    <Scroller v-else v-bind="settings.scroller">
      <!-- One headerless table: folder rows on top, file rows below, each
           section its own tbody so alignment holds across both. -->
      <table class="f-table">
        <Folders
          v-if="service.folders.length"
          :browser="service"
          :pt="pt?.folders"
        >
          <template
            v-for="name in folderSlots"
            :key="name"
            #[name]="slotProps"
          >
            <slot :name="name" v-bind="slotProps" />
          </template>
        </Folders>
        <Files :browser="service" :pt="pt?.files">
          <template
            v-for="name in noFilesSlots"
            :key="name"
            #[name]="slotProps"
          >
            <slot :name="name" v-bind="slotProps" />
          </template>
          <template v-for="name in cellSlots" :key="name" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps" />
          </template>
        </Files>
      </table>
    </Scroller>
  </div>
</template>
