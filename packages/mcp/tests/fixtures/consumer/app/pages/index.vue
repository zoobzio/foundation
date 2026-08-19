<template>
  <section>
    <Button label="Save" />
    <the-badge />
  </section>
</template>

<script setup lang="ts">
import Button from "@zoobzio/foundation/components/common/button.vue";
import TheBadge from "~/components/TheBadge.vue";
import { useGreeting } from "../composables/greeting";

const greeting = useGreeting();
void greeting;
</script>
