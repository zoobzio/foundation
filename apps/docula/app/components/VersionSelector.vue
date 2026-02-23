<script setup lang="ts">
const route = useRoute();
const { current, versions, latest } = useVersion();

const options = versions.map((v) => ({
  value: v,
  label: v === latest ? `${v} (latest)` : v,
}));

const selected = ref(current.value || latest);

const displayLabel = computed(() => {
  if (!selected.value) return "Version";
  return selected.value === latest ? `${selected.value} (latest)` : selected.value;
});

// Sync selected when URL changes
watch(current, (v) => {
  if (v) selected.value = v;
});

watch(selected, (version) => {
  if (version && version !== current.value) {
    const path = route.path.replace(/^\/v[\d.]+/, "");
    navigateTo(`/${version}${path}`);
  }
});
</script>

<template>
  <SelectRoot
    v-if="options.length > 0"
    v-model="selected"
    class="f-version-select-root"
  >
    <SelectTrigger as-child>
      <Button>
        {{ displayLabel }}
        <Icon alias="chevron-down" />
      </Button>
    </SelectTrigger>
    <SelectContent position="popper" class="f-version-select-content">
      <SelectItem
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        class="f-version-select-item"
      >
        {{ option.label }}
      </SelectItem>
    </SelectContent>
  </SelectRoot>
</template>
