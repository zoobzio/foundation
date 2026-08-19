<template>
  <section>
    <Button label="Save" />
    <the-badge />
  </section>
</template>

<script setup lang="ts">
import Button from "@zoobzio/foundation/components/common/button.vue";
import TheBadge from "~/components/TheBadge.vue";
// Imported but never rendered — health's unrendered-imports check needs it.
import Unused from "~/components/Unused.vue";
import { useGreeting } from "../composables/greeting";

const greeting = useGreeting();
void greeting;
</script>
