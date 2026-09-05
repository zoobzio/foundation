<script lang="ts">
import type {
  BrowserFoldersContext,
  BrowserFoldersPassthrough,
  BrowserFoldersProps,
  BrowserFoldersSlots,
} from "../../../types/data/browser/folders";

import Fab from "../../core/fab.vue";
import Menu from "../../core/menu.vue";

import { useTemplateRef } from "#imports";
import { useBrowserView } from "../../../composables/browser";
import { usePassthrough } from "../../../composables/passthrough";
import { useContext } from "../../../composables/context";
import {
  BROWSER_ACTIONS_ICON,
  BROWSER_FOLDER_ICON,
} from "../../../constants/browser";
</script>

<script setup lang="ts" generic="T">
const { browser, pt } = defineProps<BrowserFoldersProps<T>>();

const el = useTemplateRef<HTMLUListElement>("el");

const {
  folders,
  hasFolderActions,
  folderActionGroups,
  onFolderActionSelect,
} = useBrowserView(browser);

const settings = usePassthrough<BrowserFoldersPassthrough>(() => ({
  pt,
  recipes: {
    actionsMenu: { groups: folderActionGroups.value, align: "end" },
    actionsTrigger: { icon: BROWSER_ACTIONS_ICON },
  },
}));

const ctx = useContext<BrowserFoldersContext<T>>(
  "data-browser-folders",
  () => ({
    browser,
    el: el.value,
    settings: settings.value,
  }),
);

defineExpose({ ctx });
defineSlots<BrowserFoldersSlots<T>>();
</script>

<template>
  <ul ref="el" class="f-ul f-data-browser-folders">
    <li
      v-for="folder in folders"
      :key="folder.key"
      class="f-li f-data-browser-folder"
    >
      <slot name="folder" v-bind="{ ...ctx, folder }">
        <button
          type="button"
          class="f-button f-data-browser-folder-btn"
          @click="browser.open(folder)"
        >
          <slot name="folderIcon" v-bind="{ ...ctx, folder }">
            <Icon
              class="f-icon"
              fill="currentColor"
              :name="folder.icon ?? BROWSER_FOLDER_ICON"
            />
          </slot>
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
        <Menu
          v-if="hasFolderActions"
          v-bind="settings.actionsMenu"
          @select="onFolderActionSelect(folder, $event)"
        >
          <Fab v-bind="settings.actionsTrigger" />
        </Menu>
      </slot>
    </li>
  </ul>
</template>
