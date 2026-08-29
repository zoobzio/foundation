<script setup lang="ts">
import type { CommissionListResult } from "#shared/commissions";

import { useTable } from "@zoobzio/foundation/factories/table";
import { COMMISSIONS_TABLE } from "~/definitions/commissions";

const table = useTable("commissions", COMMISSIONS_TABLE, {
  fetch: async (params) => {
    return await $fetch<CommissionListResult>("/api/commissions", {
      query: {
        page: params.page,
        pageSize: params.pageSize,
        sortField: params.sortField ?? undefined,
        sortDirection: params.sortDirection,
        q: params.query || undefined,
        filters: params.filters.length
          ? JSON.stringify(params.filters)
          : undefined,
      },
    });
  },
  actions: {
    edit: (row) => {
      console.info("[example] edit commission", row.id, row.title);
    },
    remove: async (row) => {
      await $fetch(`/api/commissions/${row.id}`, { method: "DELETE" });
      await table.service.fetch();
    },
  },
  bulkActions: {
    removeSelected: async (selected) => {
      await Promise.all(
        [...selected].map((id) =>
          $fetch(`/api/commissions/${id}`, { method: "DELETE" }),
        ),
      );
      table.service.clearSelection();
      await table.service.fetch();
    },
  },
});
</script>

<template>
  <section>
    <h1 class="page-title">Commissions</h1>
    <component :is="table.component" :service="table.service" />
  </section>
</template>
