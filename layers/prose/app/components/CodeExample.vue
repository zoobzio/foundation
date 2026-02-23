<script setup lang="ts">
import { codeToHtml } from "shiki";
import highlights from "../../config/highlights";

const props = defineProps<{
  code: string;
  lang: string;
}>();

const highlighted = ref("");

const highlight = async () => {
  highlighted.value = await codeToHtml(props.code, {
    lang: props.lang,
    theme: highlights,
  });
};

await highlight();

watch(() => [props.code, props.lang], highlight);

const copied = ref(false);

const copyCode = async () => {
  await navigator.clipboard.writeText(props.code);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
};
</script>

<template>
  <div class="f-code-example">
    <Fab
      class="f-code-example-copy"
      :disabled="copied"
      :icon="copied ? 'check' : 'copy'"
      @click="copyCode"
    />
    <div class="f-code-example-content" v-html="highlighted" />
  </div>
</template>
