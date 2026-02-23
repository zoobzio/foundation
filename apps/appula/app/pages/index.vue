<script setup lang="ts">
import type { DashboardConfig } from "../types/dashboard";

const config: DashboardConfig = {
  direction: "horizontal",
  panels: [
    {
      id: "main",
      size: 100,
      minSize: 30,
      widget: {
        variant: "users",
      },
    },
  ],
};
</script>

<template>
  <Page title="Dashboard">
    <DataDashboard :config="config" />
  </Page>
</template>
