<script lang="ts">
import type {
  ImgContext,
  ImgProps,
} from "../../types/common/img";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../composables/bindings";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts">
const { src, alt, modifiers, tokens, aria } = defineProps<ImgProps>();

const el = useTemplateRef<HTMLImageElement>("el");

const bindings = useBindings<"img">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<ImgContext>("img", () => ({
  src,
  alt,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
</script>

<template>
  <img ref="el" :src="src" :alt="alt" class="f-img" v-bind="bindings" >
</template>
