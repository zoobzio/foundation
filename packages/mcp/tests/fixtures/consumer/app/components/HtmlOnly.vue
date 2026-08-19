<template>
  <div>only raw HTML here — the imported component is never rendered</div>
</template>

<script setup lang="ts">
// A template with no component tags used to skip this file entirely; the
// unrendered-import check must still flag TheBadge.
import TheBadge from "./TheBadge.vue";

void TheBadge;
</script>
