<script lang="ts">
/**
 * A navigation trail. The last item renders as the current page. Items with
 * a `link` render as anchors, other items as buttons.
 */
import type {
  BreadcrumbContext,
  BreadcrumbEmits,
  BreadcrumbItem,
  BreadcrumbProps,
  BreadcrumbSlots,
} from "../types/core/breadcrumb";

import { useTemplateRef } from "vue";
import { useContext } from "../composables/context";
</script>

<script setup lang="ts" generic="T extends BreadcrumbItem">
const { items } = defineProps<BreadcrumbProps<T>>();

const emit = defineEmits<BreadcrumbEmits<T>>();

const el = useTemplateRef<HTMLElement>("el");

const ctx = useContext<BreadcrumbContext<T>>("breadcrumb", () => ({
  items,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<BreadcrumbSlots<T>>();
</script>

<template>
  <nav ref="el" class="f-nav" aria-label="Breadcrumb">
    <ol class="f-ol">
      <li v-for="(item, index) in items" :key="item.key" class="f-li">
        <slot
          name="item"
          v-bind="{ ...ctx, item, index, last: index === items.length - 1 }"
        >
          <span
            v-if="index === items.length - 1"
            class="f-span"
            aria-current="page"
          >
            <slot
              name="itemIcon"
              v-bind="{ ...ctx, item, index, last: true }"
            />
            <slot name="itemLabel" v-bind="{ ...ctx, item, index, last: true }">
              {{ item.label }}
            </slot>
          </span>
          <a
            v-else-if="item.link"
            :href="item.disabled ? undefined : item.link.to"
            :target="item.link.target"
            class="f-anchor"
            @click="!item.disabled && emit('select', item)"
          >
            <slot
              name="itemIcon"
              v-bind="{ ...ctx, item, index, last: false }"
            />
            <slot
              name="itemLabel"
              v-bind="{ ...ctx, item, index, last: false }"
            >
              <span class="f-span">{{ item.label }}</span>
            </slot>
          </a>
          <button
            v-else
            type="button"
            class="f-button"
            :disabled="item.disabled"
            @click="emit('select', item)"
          >
            <slot
              name="itemIcon"
              v-bind="{ ...ctx, item, index, last: false }"
            />
            <slot
              name="itemLabel"
              v-bind="{ ...ctx, item, index, last: false }"
            >
              <span class="f-span">{{ item.label }}</span>
            </slot>
          </button>
        </slot>
        <slot
          v-if="index < items.length - 1"
          name="separator"
          v-bind="{ ...ctx, item, index }"
        />
      </li>
    </ol>
  </nav>
</template>
