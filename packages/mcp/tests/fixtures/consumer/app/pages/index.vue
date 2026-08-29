<template>
  <section>
    <Fab label="Save" />
    <the-badge />
  </section>
</template>

<script setup lang="ts">
import Fab from "@zoobzio/foundation/components/core/fab.vue";
import TheBadge from "~/components/TheBadge.vue";
// Imported but never rendered — health's unrendered-imports check needs it.
import Unused from "~/components/Unused.vue";
import { useGreeting } from "../composables/greeting";
// Second file of the same catalog entry — adoption must count this page as
// ONE importing file of core/fab, not two edges.
import type { FabProps } from "@zoobzio/foundation/types/core/fab";

const greeting = useGreeting();
void greeting;
</script>
