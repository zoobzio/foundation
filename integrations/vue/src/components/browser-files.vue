<script lang="ts">
import type {
  BrowserFilesContext,
  BrowserFilesPassthrough,
  BrowserFilesProps,
  BrowserFilesSlots,
} from "../types/components/browser-files";

import Checkbox from "./checkbox.vue";
import Fab from "./fab.vue";
import Menu from "./menu.vue";

import { Primitive } from "reka-ui";

import { useSlots, useTemplateRef } from "vue";
import { useRefs } from "../composables/ref";
import { usePassthrough } from "../composables/passthrough";
import { useContext } from "../composables/context";
import { cell } from "../utils/format";
import {
  BROWSER_ACTIONS_LABEL,
  BROWSER_NO_FILES_TEXT,
} from "../constants/browser";
</script>

<script setup lang="ts" generic="T">
const { service, pt } = defineProps<BrowserFilesProps<T>>();

const el = useTemplateRef<HTMLTableSectionElement>("el");

const slots = useSlots();

const {
  files,
  columns,
  colSpan,
  actions,
  isSelectable,
  hasActions,
  hasFolderActions,
} = useRefs(service);

const settings = usePassthrough<BrowserFilesPassthrough<T>>(() => ({
  pt,
  recipes: {
    rowCheckbox: {},
    actionsTrigger: { label: BROWSER_ACTIONS_LABEL },
    actionsMenu: {
      groups: [{ key: "actions", items: actions.value }],
      align: "end",
    },
    link: ({ value }) => ({
      as: "a",
      href: String(value),
      target: "_blank",
      rel: "noopener",
    }),
  },
}));

const ctx = useContext<BrowserFilesContext<T>>("browser-files", () => ({
  browser: service,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<BrowserFilesSlots<T>>();
</script>

<template>
  <tbody ref="el" class="f-tbody f-data-browser-files">
    <tr v-if="!files.length" class="f-tr f-data-browser-no-files">
      <td class="f-td" :colspan="colSpan">
        <slot name="noFiles" v-bind="ctx">{{ BROWSER_NO_FILES_TEXT }}</slot>
      </td>
    </tr>
    <template v-else>
      <tr
        v-for="row in files"
        :key="service.keyOf(row)"
        class="f-tr"
        :class="{ 'f-data-browser-selected': service.isRowSelected(row) }"
      >
        <td v-if="isSelectable" class="f-td f-data-browser-select">
          <Checkbox
            v-bind="settings.rowCheckbox"
            :model-value="service.isRowSelected(row)"
            @update:model-value="service.toggleRow(service.keyOf(row))"
          />
        </td>
        <td v-for="col in columns" :key="String(col.key)" class="f-td">
          <!-- 1. cell:<key> overrides one column -->
          <slot
            v-if="slots[`cell:${String(col.key)}`]"
            :name="`cell:${String(col.key)}`"
            v-bind="{ ...ctx, row, column: col, value: row[col.key] }"
          />
          <!-- 2. cell:<type> overrides all columns of a type -->
          <slot
            v-else-if="col.type && slots[`cell:${col.type}`]"
            :name="`cell:${col.type}`"
            v-bind="{ ...ctx, row, column: col, value: row[col.key] }"
          />
          <!-- 3. cell overrides all cells -->
          <slot
            v-else
            name="cell"
            v-bind="{ ...ctx, row, column: col, value: row[col.key] }"
          >
            <!-- 4. Default rendering by type -->
            <Primitive
              v-if="col.type === 'url'"
              class="f-anchor"
              v-bind="settings.link({ row, column: col, value: row[col.key] })"
            >
              {{ row[col.key] }}
            </Primitive>
            <img
              v-else-if="col.type === 'image'"
              class="f-img"
              :src="String(row[col.key])"
              :alt="col.label"
            />
            <span v-else class="f-span">
              {{
                cell(row[col.key], col.type, service.locale, service.currency)
              }}
            </span>
          </slot>
        </td>
        <!-- The trailing cell stays for alignment with folder rows that
             carry their own actions menu. -->
        <td
          v-if="hasActions || hasFolderActions"
          class="f-td f-data-browser-actions"
        >
          <Menu
            v-if="hasActions"
            v-bind="settings.actionsMenu"
            @select="service.runAction($event.key, row)"
          >
            <Fab v-bind="settings.actionsTrigger">
              <template v-if="slots.actionsIcon" #icon>
                <slot name="actionsIcon" v-bind="{ ...ctx, row }" />
              </template>
            </Fab>
            <template v-if="slots.actionIcon" #itemIcon="{ item }">
              <slot name="actionIcon" v-bind="{ ...ctx, row, item }" />
            </template>
          </Menu>
        </td>
      </tr>
    </template>
  </tbody>
</template>
