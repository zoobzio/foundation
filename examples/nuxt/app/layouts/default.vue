<script setup lang="ts">
import { NuxtLink } from "#components";
import { useUntheme } from "#imports";
import { computed } from "vue";

const untheme = useUntheme();
const dark = computed(() => untheme.config.input.color === "dark");
const toggle = () => untheme.swap("color", dark.value ? "light" : "dark");

// Every demo, in the order the header lists them. A new page is one line.
const demos = [
  { to: "/", label: "Editor" },
  { to: "/calendar", label: "Calendar" },
  { to: "/timeline", label: "Timeline" },
  { to: "/browser", label: "Browser" },
  { to: "/table", label: "Table" },
];
</script>

<template>
  <header class="site-header">
    <div class="site-header-inner">
      <NuxtLink to="/" class="site-brand">foundation</NuxtLink>
      <nav class="site-nav" aria-label="Demos">
        <NuxtLink
          v-for="demo in demos"
          :key="demo.to"
          :to="demo.to"
          class="site-nav-link"
        >
          {{ demo.label }}
        </NuxtLink>
      </nav>
      <button type="button" class="site-scheme" @click="toggle">
        {{ dark ? "Light" : "Dark" }}
      </button>
    </div>
  </header>
  <main>
    <slot />
  </main>
</template>
