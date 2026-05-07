<script lang="ts">
import type { AppAuthProps } from "../../types/app-auth";
</script>

<script setup lang="ts">
const { pt } = defineProps<AppAuthProps>();

const el = useTemplateRef("el");
defineExpose({ el });

const { user, authenticated, login, logout } = useAuth();

const icon = computed(() => authenticated.value ? "user" : "lock");

const onClick = () => {
  if (authenticated.value) {
    logout();
  } else {
    login();
  }
};

const ctx = computed(() => ({ user: user.value, authenticated: authenticated.value }));
</script>

<template>
  <Group ref="el" v-bind="pt?.root" class="f-app-auth">
    <slot name="trigger" v-bind="ctx">
      <Fab
        v-bind="pt?.trigger"
        :icon="icon"
        class="f-app-auth-trigger"
        @click="onClick"
      />
    </slot>
  </Group>
</template>
