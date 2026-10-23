<script lang="ts">
import type {
  DirectoryContext,
  DirectoryEmits,
  DirectoryItem,
  DirectoryPassthrough,
  DirectoryProps,
  DirectorySlots,
} from "../types/components/directory";

import { Primitive } from "reka-ui";

import { useTemplateRef } from "vue";
import { usePassthrough } from "../composables/passthrough";
import { useContext } from "../composables/context";
import { anchor } from "../utils/link";
</script>

<script setup lang="ts" generic="T extends DirectoryItem">
const { groups, pt } = defineProps<DirectoryProps<T>>();

const emit = defineEmits<DirectoryEmits<T>>();

const el = useTemplateRef<HTMLElement>("el");

const settings = usePassthrough<DirectoryPassthrough<T>>(() => ({
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

const ctx = useContext<DirectoryContext<T>>("directory", () => ({
  groups,
  el: el.value,
  settings: settings.value,
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
            <Primitive
              v-if="item.link"
              class="f-anchor"
              v-bind="settings.link(item)"
            >
              <slot name="itemIcon" v-bind="{ ...ctx, item }" />
              <slot name="itemLabel" v-bind="{ ...ctx, item }">
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
              <slot name="itemIcon" v-bind="{ ...ctx, item }" />
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
