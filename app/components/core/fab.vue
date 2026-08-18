<script lang="ts">
import type {
  FabProps,
  FabEmits,
  FabPassthrough,
  FabContext,
  FabSlots,
} from "../../types/core/fab";
import type { ComponentPublicInstance } from "vue";

import Button from "../common/button.vue";
import Group from "../common/group.vue";
import Icon from "../common/icon.vue";

import { useTemplateRef } from "#imports";
import { usePassthrough } from "../../composables/passthrough";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts">
const {
  icon,
  label,
  type = "button",
  disabled,
  badge,
  pt,
} = defineProps<FabProps>();

const emit = defineEmits<FabEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const settings = usePassthrough<FabPassthrough>(() => ({
  pt,
  recipes: {
    root: {
      type,
      disabled,
      aria: label ? { label } : undefined,
    },
    icon: { alias: icon! },
    badge: {},
  },
}));

const ctx = useContext<FabContext>("fab", () => ({
  icon,
  label,
  type,
  disabled,
  badge,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<FabSlots>();
</script>

<template>
  <Button ref="el" v-bind="settings.root" @click="emit('click', $event)">
    <slot name="icon" v-bind="ctx">
      <Icon v-if="icon" v-bind="settings.icon" />
    </slot>
    <slot name="badge" v-bind="ctx">
      <Group v-if="badge !== undefined" v-bind="settings.badge">
        {{ badge }}
      </Group>
    </slot>
  </Button>
</template>
