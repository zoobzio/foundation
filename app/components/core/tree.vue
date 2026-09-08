<script lang="ts">
import type {
  TreeContext,
  TreeEmits,
  TreeNode,
  TreePassthrough,
  TreeProps,
  TreeSlots,
} from "../../types/core/tree";
import type { ComponentPublicInstance } from "vue";

import { TreeRoot, TreeItem } from "reka-ui";

import { useTemplateRef } from "#imports";
import { usePassthrough } from "../../composables/passthrough";
import { useModel } from "../../composables/model";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts" generic="T extends TreeNode & { children?: T[] }">
const { items, modelValue, expanded, disabled, pt } =
  defineProps<TreeProps<T>>();

const emit = defineEmits<TreeEmits<T>>();

const $model = useModel<T | undefined>(
  () => modelValue,
  (v) => emit("update:modelValue", v),
  { explicit: "modelValue" },
);

const $expanded = useModel<string[]>(
  () => expanded,
  (v) => emit("update:expanded", v),
  { default: [], explicit: "expanded" },
);

const el = useTemplateRef<ComponentPublicInstance>("el");

const settings = usePassthrough<TreePassthrough<T>>(() => ({
  pt,
  recipes: {
    root: {
      items,
      multiple: false,
      disabled,
      modelValue: $model.value,
      expanded: $expanded.value,
      getKey: (node) => node.key,
      getChildren: (node) => node.children,
      "onUpdate:modelValue": (v) => {
        // multiple is false, so reka only ever sends a single node; the
        // array branch exists for the wide emit type alone.
        $model.value = Array.isArray(v) ? v[0] : v;
      },
      "onUpdate:expanded": (v) => {
        $expanded.value = v;
      },
    },
    // reka guards disabled nodes itself; `toggle` re-emits post-toggle
    // state (the event detail carries the pre-toggle value) and only for
    // branches — reka also dispatches toggle on leaf clicks, where it is
    // a no-op.
    item: (flat) => ({
      ...flat.bind,
      disabled: flat.value.disabled,
      onSelect: () => {
        emit("select", flat.value);
      },
      onToggle: (event) => {
        if (!flat.hasChildren) return;
        emit("toggle", flat.value, !event.detail.isExpanded);
      },
    }),
  },
}));

const ctx = useContext<TreeContext<T>>("tree", () => ({
  items,
  disabled,
  modelValue: $model,
  expanded: $expanded,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<TreeSlots<T>>();
</script>

<template>
  <TreeRoot
    ref="el"
    v-slot="{ flattenItems }"
    class="f-tree-root"
    v-bind="settings.root"
  >
    <TreeItem
      v-for="flat in flattenItems"
      :key="flat._id"
      v-slot="{ isExpanded, isSelected }"
      class="f-tree-item"
      v-bind="settings.item(flat)"
    >
      <slot name="item" v-bind="{ ...ctx, item: flat, isExpanded, isSelected }">
        <slot
          name="itemToggle"
          v-bind="{ ...ctx, item: flat, isExpanded, isSelected }"
        >
          <Icon
            v-if="flat.hasChildren"
            class="f-icon"
            fill="currentColor"
            :name="isExpanded ? 'chevron-down' : 'chevron-right'"
          />
        </slot>
        <slot
          name="itemIcon"
          v-bind="{ ...ctx, item: flat, isExpanded, isSelected }"
        >
          <Icon
            v-if="flat.value.icon"
            class="f-icon"
            fill="currentColor"
            :name="flat.value.icon"
          />
        </slot>
        <slot
          name="itemLabel"
          v-bind="{ ...ctx, item: flat, isExpanded, isSelected }"
        >
          <NuxtLink
            v-if="flat.value.link"
            :to="flat.value.disabled ? undefined : flat.value.link.to"
            :external="flat.value.link.external"
            :target="flat.value.link.target"
            :replace="flat.value.link.replace"
            :prefetch="flat.value.link.prefetch"
            class="f-anchor"
          >
            {{ flat.value.label }}
          </NuxtLink>
          <span v-else class="f-span">{{ flat.value.label }}</span>
        </slot>
      </slot>
    </TreeItem>
  </TreeRoot>
</template>
