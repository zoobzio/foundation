<script setup lang="ts">
const { code } = defineProps<{
  code: string;
}>();

const copied = ref(false);

const copyCode = async () => {
  await navigator.clipboard.writeText(code);

  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
};
</script>

<template>
  <Pre
    :tokens="{
      pre: {
        position: 'ref-position-relative',
      },
    }"
  >
    <Button
      :tokens="{
        button: {
          position: 'ref-position-absolute',
          top: 'ref-position-zero',
          right: 'ref-position-zero',
        },
      }"
      @click="copyCode"
    >
      <Icon :alias="copied ? 'check' : 'copy'" />
    </Button>
    <slot />
  </Pre>
</template>
