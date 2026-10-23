<script lang="ts">
import type {
  BreadcrumbContext,
  BreadcrumbEmits,
  BreadcrumbItem,
  BreadcrumbPassthrough,
  BreadcrumbProps,
  BreadcrumbSlots,
} from "../types/components/breadcrumb";

import { Primitive } from "reka-ui";

import { useTemplateRef } from "vue";
import { usePassthrough } from "../composables/passthrough";
import { useContext } from "../composables/context";
import { anchor } from "../utils/link";
</script>

<script setup lang="ts" generic="T extends BreadcrumbItem">
const { items, pt } = defineProps<BreadcrumbProps<T>>();

const emit = defineEmits<BreadcrumbEmits<T>>();

const el = useTemplateRef<HTMLElement>("el");

const settings = usePassthrough<BreadcrumbPassthrough<T>>(() => ({
  pt,
  recipes: {
    link: (item) => ({
      ...anchor(item.link, item.disabled),
      onClick: () => {
        if (!item.disabled) emit("select", item);
      },
    }),
  },
}));

const ctx = useContext<BreadcrumbContext<T>>("breadcrumb", () => ({
  items,
  el: el.value,
  settings: settings.value,
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
          <Primitive
            v-else-if="item.link"
            class="f-anchor"
            v-bind="settings.link(item)"
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
          </Primitive>
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
