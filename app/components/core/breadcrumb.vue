<script lang="ts">
import type {
  BreadcrumbContext,
  BreadcrumbEmits,
  BreadcrumbItem,
  BreadcrumbProps,
  BreadcrumbSlots,
} from "../../types/core/breadcrumb";

import { useTemplateRef } from "#imports";
import { useContext } from "../../composables/context";
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
            >
              <Icon
                v-if="item.icon"
                class="f-icon"
                fill="currentColor"
                :name="item.icon"
              />
            </slot>
            <slot name="itemLabel" v-bind="{ ...ctx, item, index, last: true }">
              {{ item.label }}
            </slot>
          </span>
          <NuxtLink
            v-else-if="item.link"
            :to="item.disabled ? undefined : item.link.to"
            :external="item.link.external"
            :target="item.link.target"
            :replace="item.link.replace"
            :prefetch="item.link.prefetch"
            class="f-anchor"
            @click="!item.disabled && emit('select', item)"
          >
            <slot
              name="itemIcon"
              v-bind="{ ...ctx, item, index, last: false }"
            >
              <Icon
                v-if="item.icon"
                class="f-icon"
                fill="currentColor"
                :name="item.icon"
              />
            </slot>
            <slot
              name="itemLabel"
              v-bind="{ ...ctx, item, index, last: false }"
            >
              <span class="f-span">{{ item.label }}</span>
            </slot>
          </NuxtLink>
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
            >
              <Icon
                v-if="item.icon"
                class="f-icon"
                fill="currentColor"
                :name="item.icon"
              />
            </slot>
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
        >
          <Icon class="f-icon" fill="currentColor" name="chevron-right" />
        </slot>
      </li>
    </ol>
  </nav>
</template>
