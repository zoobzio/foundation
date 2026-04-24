<script lang="ts">
import { ListboxRoot, ListboxContent, ListboxItem } from "reka-ui";
import type { ListboxProps, ListboxEmits } from "../types/listbox";
</script>

<script setup lang="ts">
const {
  items,
  modelValue,
  multiple = false,
  disabled,
  pt,
} = defineProps<ListboxProps>();

const emit = defineEmits<ListboxEmits>();

const el = useTemplateRef("el");
defineExpose({ el });

const rootPT = usePassthrough(pt?.root, {
  props: { modelValue, multiple, disabled },
});
const contentPT = usePassthrough(pt?.content, {});

const itemsPT = computed(() =>
  items.map((item) => ({
    item,
    pt: passthrough(pt?.item, {
      props: { value: item.value, disabled: item.disabled },
    }),
  })),
);

const ctx = computed(() => ({ items, modelValue, multiple, disabled }));
</script>

<template>
  <ListboxRoot
    ref="el"
    v-bind="rootPT.props"
    v-on="rootPT.handlers"
    class="f-listbox-root"
  >
    <slot name="content" v-bind="ctx">
      <ListboxContent
        v-bind="contentPT.props"
        v-on="contentPT.handlers"
        class="f-listbox-content"
      >
        <ListboxItem
          v-for="entry in itemsPT"
          :key="entry.item.value"
          v-bind="entry.pt.props"
          v-on="entry.pt.handlers"
          class="f-listbox-item"
        >
          <slot name="item" v-bind="{ ...ctx, item: entry.item }">
            {{ entry.item.label }}
          </slot>
        </ListboxItem>
      </ListboxContent>
    </slot>
  </ListboxRoot>
</template>
