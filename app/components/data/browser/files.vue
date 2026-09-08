<script lang="ts">
import type {
  BrowserFilesContext,
  BrowserFilesPassthrough,
  BrowserFilesProps,
  BrowserFilesSlots,
} from "../../../types/data/browser/files";

import Checkbox from "../../core/checkbox.vue";
import Fab from "../../core/fab.vue";
import Menu from "../../core/menu.vue";

import { useSlots, useTemplateRef } from "#imports";
import { useBrowserView } from "../../../composables/browser";
import { usePassthrough } from "../../../composables/passthrough";
import { useContext } from "../../../composables/context";
import { cell } from "../../../utils/format";
import { BROWSER_ACTIONS_ICON } from "../../../constants/browser";
</script>

<script setup lang="ts" generic="T">
const { browser, pt } = defineProps<BrowserFilesProps<T>>();

const el = useTemplateRef<HTMLTableSectionElement>("el");

const slots = useSlots();

const {
  files,
  columns,
  colSpan,
  isSelectable,
  hasActions,
  hasFolderActions,
  actionGroups,
  onActionSelect,
} = useBrowserView(browser);

const settings = usePassthrough<BrowserFilesPassthrough>(() => ({
  pt,
  recipes: {
    rowCheckbox: {},
    actionsMenu: { groups: actionGroups.value, align: "end" },
    actionsTrigger: { icon: BROWSER_ACTIONS_ICON },
  },
}));

const ctx = useContext<BrowserFilesContext<T>>("data-browser-files", () => ({
  browser,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<BrowserFilesSlots<T>>();
</script>

<template>
  <tbody ref="el" class="f-tbody f-data-browser-files">
    <tr v-if="!files.length" class="f-tr">
      <td class="f-td" :colspan="colSpan">
        <slot name="noFiles" v-bind="ctx">No files</slot>
      </td>
    </tr>
    <template v-else>
      <tr v-for="row in files" :key="browser.keyOf(row)" class="f-tr">
        <td v-if="isSelectable" class="f-td f-data-browser-select">
          <Checkbox
            v-bind="settings.rowCheckbox"
            :model-value="browser.isRowSelected(row)"
            @update:model-value="browser.toggleRow(browser.keyOf(row))"
          />
        </td>
        <td v-for="col in columns" :key="String(col.key)" class="f-td">
          <!-- 1. cell:<key> — override a specific column -->
          <slot
            v-if="slots[`cell:${String(col.key)}`]"
            :name="`cell:${String(col.key)}`"
            v-bind="{ ...ctx, row, column: col, value: row[col.key] }"
          />
          <!-- 2. cell:<type> — override all columns of a type -->
          <slot
            v-else-if="col.type && slots[`cell:${col.type}`]"
            :name="`cell:${col.type}`"
            v-bind="{ ...ctx, row, column: col, value: row[col.key] }"
          />
          <!-- 3. cell — override all cells -->
          <slot
            v-else
            name="cell"
            v-bind="{ ...ctx, row, column: col, value: row[col.key] }"
          >
            <!-- 4. Default type-based rendering -->
            <NuxtLink
              v-if="col.type === 'url'"
              class="f-anchor"
              :external="true"
              :to="String(row[col.key])"
            >
              {{ row[col.key] }}
            </NuxtLink>
            <img
              v-else-if="col.type === 'image'"
              class="f-img"
              :src="String(row[col.key])"
              :alt="col.label"
            >
            <span v-else class="f-span">
              {{ cell(row[col.key], col.type) }}
            </span>
          </slot>
        </td>
        <td
          v-if="hasActions || hasFolderActions"
          class="f-td f-data-browser-actions"
        >
          <Menu
            v-if="hasActions"
            v-bind="settings.actionsMenu"
            @select="onActionSelect(row, $event)"
          >
            <Fab v-bind="settings.actionsTrigger" />
          </Menu>
        </td>
      </tr>
    </template>
  </tbody>
</template>
