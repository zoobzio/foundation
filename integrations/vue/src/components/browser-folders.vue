<script lang="ts">
import type {
  BrowserFoldersContext,
  BrowserFoldersPassthrough,
  BrowserFoldersProps,
  BrowserFoldersSlots,
} from "../types/components/browser-folders";

import Fab from "./fab.vue";
import Menu from "./menu.vue";

import { useTemplateRef } from "vue";
import { useRefs } from "../composables/ref";
import { usePassthrough } from "../composables/passthrough";
import { useContext } from "../composables/context";
import { BROWSER_ACTIONS_LABEL } from "../constants/browser";
</script>

<script setup lang="ts" generic="T">
const { service, pt } = defineProps<BrowserFoldersProps<T>>();

const el = useTemplateRef<HTMLTableSectionElement>("el");

const {
  folders,
  columns,
  folderActions,
  isSelectable,
  hasActions,
  hasFolderActions,
} = useRefs(service);

const settings = usePassthrough<BrowserFoldersPassthrough>(() => ({
  pt,
  recipes: {
    actionsMenu: {
      groups: [{ key: "folder-actions", items: folderActions.value }],
      align: "end",
    },
    actionsTrigger: { label: BROWSER_ACTIONS_LABEL },
  },
}));

const ctx = useContext<BrowserFoldersContext<T>>("browser-folders", () => ({
  browser: service,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });

const slots = defineSlots<BrowserFoldersSlots<T>>();
</script>

<template>
  <tbody ref="el" class="f-tbody f-data-browser-folders">
    <tr
      v-for="folder in folders"
      :key="folder.key"
      class="f-tr f-data-browser-folder"
    >
      <!-- Selection is files-only; the empty cell keeps column alignment. -->
      <td v-if="isSelectable" class="f-td f-data-browser-select" />
      <td class="f-td" :colspan="columns.length">
        <slot name="folder" v-bind="{ ...ctx, folder }">
          <button
            type="button"
            class="f-button f-data-browser-folder-btn"
            @click="service.open(folder)"
          >
            <slot name="folderIcon" v-bind="{ ...ctx, folder }" />
            <slot name="folderLabel" v-bind="{ ...ctx, folder }">
              <span class="f-span">{{ folder.label }}</span>
            </slot>
            <span
              v-if="folder.count != null"
              class="f-caption f-data-browser-folder-count"
            >
              {{ folder.count }}
            </span>
          </button>
        </slot>
      </td>
      <td
        v-if="hasActions || hasFolderActions"
        class="f-td f-data-browser-actions"
      >
        <Menu
          v-if="hasFolderActions"
          v-bind="settings.actionsMenu"
          @select="service.runFolderAction($event.key, folder)"
        >
          <Fab v-bind="settings.actionsTrigger">
            <template v-if="slots.folderActionsIcon" #icon>
              <slot name="folderActionsIcon" v-bind="{ ...ctx, folder }" />
            </template>
          </Fab>
          <template v-if="slots.folderActionIcon" #itemIcon="{ item }">
            <slot name="folderActionIcon" v-bind="{ ...ctx, folder, item }" />
          </template>
        </Menu>
      </td>
    </tr>
  </tbody>
</template>
