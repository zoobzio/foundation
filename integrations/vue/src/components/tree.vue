<script lang="ts">
/**
 * A single-select tree. `modelValue` and `expanded` are explicit models:
 * their presence on the vnode decides control, so pass `undefined`
 * explicitly for an uncontrolled instance.
 */
import type {
  TreeContext,
  TreeEmits,
  TreeNode,
  TreePassthrough,
  TreeProps,
  TreeSlots,
} from "../types/core/tree";
import type { ComponentPublicInstance } from "vue";

import { TreeRoot, TreeItem } from "reka-ui";

import { useTemplateRef } from "vue";
import { usePassthrough } from "../composables/passthrough";
import { useModel } from "../composables/model";
import { useContext } from "../composables/context";
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
        $model.value = Array.isArray(v) ? v[0] : v;
      },
      "onUpdate:expanded": (v) => {
        $expanded.value = v;
      },
    },
    item: (flat) => ({
      ...flat.bind,
      disabled: flat.value.disabled,
      onSelect: () => {
        emit("select", flat.value);
      },
      onToggle: (event) => {
        if (!flat.hasChildren) return;
        // `event.detail.isExpanded` is the state before the toggle.
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
        />
        <slot
          name="itemIcon"
          v-bind="{ ...ctx, item: flat, isExpanded, isSelected }"
        />
        <slot
          name="itemLabel"
          v-bind="{ ...ctx, item: flat, isExpanded, isSelected }"
        >
          <a
            v-if="flat.value.link"
            :href="flat.value.disabled ? undefined : flat.value.link.to"
            :target="flat.value.link.target"
            class="f-anchor"
          >
            {{ flat.value.label }}
          </a>
          <span v-else class="f-span">{{ flat.value.label }}</span>
        </slot>
      </slot>
    </TreeItem>
  </TreeRoot>
</template>
