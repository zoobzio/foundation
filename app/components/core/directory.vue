<script lang="ts">
import type {
  DirectoryContext,
  DirectoryEmits,
  DirectoryItem,
  DirectoryProps,
  DirectorySlots,
} from "../../types/core/directory";

import { useTemplateRef } from "#imports";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts" generic="T extends DirectoryItem">
const { groups } = defineProps<DirectoryProps<T>>();

const emit = defineEmits<DirectoryEmits<T>>();

const el = useTemplateRef<HTMLElement>("el");

const ctx = useContext<DirectoryContext<T>>("directory", () => ({
  groups,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DirectorySlots<T>>();
</script>

<template>
  <nav ref="el" class="f-nav">
    <div v-for="group in groups" :key="group.key" class="f-group">
      <template v-if="group.label">
        <slot name="groupLabel" v-bind="{ ...ctx, group }">
          <div class="f-caption">{{ group.label }}</div>
        </slot>
      </template>
      <ul class="f-ul">
        <li v-for="item in group.items" :key="item.key" class="f-li">
          <slot name="item" v-bind="{ ...ctx, item }">
            <NuxtLink
              v-if="item.link"
              :to="item.disabled ? undefined : item.link.to"
              :external="item.link.external"
              :target="item.link.target"
              :replace="item.link.replace"
              :prefetch="item.link.prefetch"
              class="f-anchor"
              @click="!item.disabled && emit('select', item)"
            >
              <slot name="itemIcon" v-bind="{ ...ctx, item }">
                <Icon v-if="item.icon" class="f-icon" fill="currentColor" :name="item.icon" />
              </slot>
              <slot name="itemLabel" v-bind="{ ...ctx, item }">
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
              <slot name="itemIcon" v-bind="{ ...ctx, item }">
                <Icon v-if="item.icon" class="f-icon" fill="currentColor" :name="item.icon" />
              </slot>
              <slot name="itemLabel" v-bind="{ ...ctx, item }">
                <span class="f-span">{{ item.label }}</span>
              </slot>
            </button>
          </slot>
        </li>
      </ul>
    </div>
  </nav>
</template>
