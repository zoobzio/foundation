<script lang="ts">
import type {
  BrowserHeadContext,
  BrowserHeadPassthrough,
  BrowserHeadProps,
  BrowserHeadSlots,
} from "../types/components/browser-head";

import Breadcrumb from "./breadcrumb.vue";
import Checkbox from "./checkbox.vue";

import Primitive from "./primitive.vue";

import { useTemplateRef } from "vue";
import { useRefs } from "../composables/ref";
import { usePassthrough } from "../composables/passthrough";
import { useContext } from "../composables/context";
import { crumbItems, listingSummary } from "../utils/browser";
</script>

<script setup lang="ts" generic="T">
const { service, pt } = defineProps<BrowserHeadProps<T>>();

const el = useTemplateRef<HTMLTableSectionElement>("el");

const {
  columns,
  selectAllState,
  isSelectable,
  hasActions,
  hasFolderActions,
  initialized,
} = useRefs(service);

const settings = usePassthrough<BrowserHeadPassthrough>(() => ({
  pt,
  recipes: {
    breadcrumb: {
      as: Breadcrumb,
      items: crumbItems(service),
      onSelect: (item) => service.navigate(item.index),
    },
    selectAllCheckbox: {
      as: Checkbox,
      modelValue: selectAllState.value,
      "onUpdate:modelValue": () => service.toggleAll(),
    },
  },
}));

const ctx = useContext<BrowserHeadContext<T>>("browser-head", () => ({
  browser: service,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });

const slots = defineSlots<BrowserHeadSlots<T>>();
</script>

<template>
  <thead ref="el" class="f-thead f-data-browser-head">
    <tr class="f-tr">
      <th v-if="isSelectable" class="f-th f-data-browser-select">
        <Primitive v-bind="settings.selectAllCheckbox" />
      </th>
      <!-- One cell over the columns and the actions column, so the summary
           reaches the table's trailing edge. -->
      <th
        class="f-th"
        :colspan="columns.length + (hasActions || hasFolderActions ? 1 : 0)"
      >
        <div class="f-group f-data-browser-header-wrap">
          <slot name="breadcrumb" v-bind="ctx">
            <Primitive
              v-bind="settings.breadcrumb"
              class="f-data-browser-breadcrumb"
            >
              <template v-if="slots.crumbPrepend" #itemPrepend="crumb">
                <slot
                  name="crumbPrepend"
                  v-bind="{
                    ...ctx,
                    item: crumb.item,
                    index: crumb.index,
                    last: crumb.last,
                  }"
                />
              </template>
              <template v-if="slots.crumbAppend" #itemAppend="crumb">
                <slot
                  name="crumbAppend"
                  v-bind="{
                    ...ctx,
                    item: crumb.item,
                    index: crumb.index,
                    last: crumb.last,
                  }"
                />
              </template>
            </Primitive>
          </slot>
          <!-- Nothing is listed until the first fetch settles. -->
          <span v-if="initialized" class="f-caption f-data-browser-summary">
            <slot name="summary" v-bind="ctx">
              {{ listingSummary(service) }}
            </slot>
          </span>
        </div>
      </th>
    </tr>
  </thead>
</template>
