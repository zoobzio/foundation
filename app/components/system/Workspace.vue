<script lang="ts">
import type { WorkspaceProps } from "#foundation/types/system/workspace";
</script>

<script setup lang="ts">
import { computed, useTemplateRef } from "#imports";
import Footer from "#foundation/components/common/Footer.vue";
import Group from "#foundation/components/common/Group.vue";
import Header from "#foundation/components/common/Header.vue";
const { workspace, pt } = defineProps<WorkspaceProps>();

const el = useTemplateRef("el");
defineExpose({ el });

const ctx = computed(() => ({ workspace }));
</script>

<template>
  <Group ref="el" v-bind="pt?.root" class="f-workspace">
    <slot name="header" v-bind="ctx">
      <Header v-bind="pt?.header" class="f-workspace-header" />
    </slot>

    <Group v-bind="pt?.grid" class="f-workspace-grid" :style="workspace.gridStyle.value">
      <Group
        v-for="s in workspace.layout.value.slots"
        :key="s.id"
        class="f-workspace-slot"
        :style="workspace.slotStyle(s)"
      >
        <slot :name="s.id" v-bind="{ ...ctx, slot: s }" />
      </Group>
    </Group>

    <slot name="footer" v-bind="ctx">
      <Footer v-bind="pt?.footer" class="f-workspace-footer" />
    </slot>
  </Group>
</template>
