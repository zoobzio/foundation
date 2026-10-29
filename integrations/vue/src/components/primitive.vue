<script lang="ts">
import type { PrimitiveProps } from "../types/components/primitive";
</script>

<script setup lang="ts">
// Renders the component under `as` with everything else as its props and
// the parent's slots handed on whole. reka's `Primitive` forwards only the
// default slot, and a nested component takes named ones, so this stands in
// for it where a part renders one of the package's own components. A
// consumer's or a layer's `pt` swaps the component through `as`, as
// `pt.link` swaps an anchor.
defineOptions({ inheritAttrs: false });
defineProps<PrimitiveProps>();
</script>

<template>
  <component :is="as" v-bind="$attrs">
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </component>
</template>
