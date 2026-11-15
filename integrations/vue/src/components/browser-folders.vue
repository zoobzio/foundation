<script lang="ts">
import type {
  BrowserFoldersContext,
  BrowserFoldersPassthrough,
  BrowserFoldersProps,
  BrowserFoldersSlots,
} from "../types/components/browser-folders";

import Checkbox from "./checkbox.vue";
import Fab from "./fab.vue";
import Menu from "./menu.vue";

import Primitive from "./primitive.vue";

import { useTemplateRef } from "vue";
import { useRefs } from "../composables/ref";
import { usePassthrough } from "../composables/passthrough";
import { useContext } from "../composables/context";
import { cell } from "../utils/format";
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
    rowCheckbox: { as: Checkbox },
    actionsMenu: {
      as: Menu,
      groups: [{ key: "folder-actions", items: folderActions.value }],
      align: "end",
    },
    actionsTrigger: { as: Fab, label: BROWSER_ACTIONS_LABEL },
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
      :class="{ 'f-data-browser-selected': service.isFolderSelected(folder) }"
    >
      <td v-if="isSelectable" class="f-td f-data-browser-select">
        <Primitive
          v-bind="settings.rowCheckbox"
          :model-value="service.isFolderSelected(folder)"
          @update:model-value="service.toggleFolder(folder.key)"
        />
      </td>
      <td v-for="(col, index) in columns" :key="String(col.key)" class="f-td">
        <!-- The folder's label fills the first column. -->
        <slot v-if="index === 0" name="folder" v-bind="{ ...ctx, folder }">
          <button
            type="button"
            class="f-button f-data-browser-folder-btn"
            @click="service.open(folder)"
          >
            <slot name="folderPrepend" v-bind="{ ...ctx, folder }" />
            <slot name="folderLabel" v-bind="{ ...ctx, folder }">
              <span class="f-span">{{ folder.label }}</span>
            </slot>
            <slot name="folderAppend" v-bind="{ ...ctx, folder }" />
            <span
              v-if="folder.count != null"
              class="f-caption f-data-browser-folder-count"
            >
              {{ folder.count }}
            </span>
          </button>
        </slot>
        <!-- 1. folderCell:<key> overrides one column -->
        <slot
          v-else-if="slots[`folderCell:${String(col.key)}`]"
          :name="`folderCell:${String(col.key)}`"
          v-bind="{
            ...ctx,
            folder,
            column: col,
            value: folder.values?.[col.key],
          }"
        />
        <!-- 2. folderCell:<type> overrides all columns of a type -->
        <slot
          v-else-if="col.type && slots[`folderCell:${col.type}`]"
          :name="`folderCell:${col.type}`"
          v-bind="{
            ...ctx,
            folder,
            column: col,
            value: folder.values?.[col.key],
          }"
        />
        <!-- 3. folderCell overrides all cells; 4. the value by its type,
             and nothing where the folder carries none -->
        <slot
          v-else
          name="folderCell"
          v-bind="{
            ...ctx,
            folder,
            column: col,
            value: folder.values?.[col.key],
          }"
        >
          <span v-if="folder.values?.[col.key] != null" class="f-span">
            {{
              cell(
                folder.values[col.key],
                col.type,
                service.locale,
                service.currency,
                service.timeZone,
              )
            }}
          </span>
        </slot>
      </td>
      <td
        v-if="hasActions || hasFolderActions"
        class="f-td f-data-browser-actions"
      >
        <Primitive
          v-if="hasFolderActions"
          v-bind="settings.actionsMenu"
          @select="service.runFolderAction($event.key, folder)"
        >
          <slot name="folderActions" v-bind="{ ...ctx, folder }">
            <Primitive v-bind="settings.actionsTrigger" />
          </slot>
          <template v-if="slots.folderActionPrepend" #itemPrepend="{ item }">
            <slot
              name="folderActionPrepend"
              v-bind="{ ...ctx, folder, item }"
            />
          </template>
          <template v-if="slots.folderActionAppend" #itemAppend="{ item }">
            <slot name="folderActionAppend" v-bind="{ ...ctx, folder, item }" />
          </template>
        </Primitive>
      </td>
    </tr>
  </tbody>
</template>
