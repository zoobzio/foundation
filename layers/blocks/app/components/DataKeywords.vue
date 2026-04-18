<script setup lang="ts">
const keywords = defineModel<string>("keywords", { default: "" });
const open = defineModel<boolean>("open", { default: false });

const includeInput = ref("");
const excludeInput = ref("");

// Parse keyword string into structured entries
const entries = computed(() => {
  if (!keywords.value.trim()) return [];
  return keywords.value
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => {
      if (token.startsWith("+")) return { mode: "include" as const, term: token.slice(1) };
      if (token.startsWith("-")) return { mode: "exclude" as const, term: token.slice(1) };
      return { mode: "include" as const, term: token };
    });
});

const activeCount = computed(() => entries.value.length);

function buildKeywordString(items: { mode: "include" | "exclude"; term: string }[]) {
  return items.map((e) => (e.mode === "exclude" ? `-${e.term}` : `+${e.term}`)).join(" ");
}

const addInclude = () => {
  const term = includeInput.value.trim();
  if (!term) return;
  const next = [...entries.value, { mode: "include" as const, term }];
  keywords.value = buildKeywordString(next);
  includeInput.value = "";
};

const addExclude = () => {
  const term = excludeInput.value.trim();
  if (!term) return;
  const next = [...entries.value, { mode: "exclude" as const, term }];
  keywords.value = buildKeywordString(next);
  excludeInput.value = "";
};

const remove = (index: number) => {
  const next = entries.value.filter((_, i) => i !== index);
  keywords.value = buildKeywordString(next);
};
</script>

<template>
  <Popover v-model:open="open" align="start">
    <Fab icon="tag" :badge="activeCount > 0 ? activeCount : undefined" />
    <template #content>
      <div class="f-keywords">
        <div class="f-keywords-section">
          <Caption>Include</Caption>
          <div class="f-keywords-input-row">
            <input
              v-model="includeInput"
              type="text"
              class="f-keywords-input"
              placeholder="Add keyword..."
              @keydown.enter.prevent="addInclude"
            >
            <Fab icon="add" @click="addInclude" />
          </div>
        </div>
        <div class="f-keywords-section">
          <Caption>Exclude</Caption>
          <div class="f-keywords-input-row">
            <input
              v-model="excludeInput"
              type="text"
              class="f-keywords-input"
              placeholder="Exclude keyword..."
              @keydown.enter.prevent="addExclude"
            >
            <Fab icon="add" @click="addExclude" />
          </div>
        </div>
        <div v-if="entries.length" class="f-keywords-chips">
          <Chip
            v-for="(entry, i) in entries"
            :key="i"
            closable
            @close="remove(i)"
          >
            <span :class="entry.mode === 'exclude' ? 'f-keywords-exclude' : 'f-keywords-include'">
              {{ entry.mode === "exclude" ? "−" : "+" }}
            </span>
            {{ entry.term }}
          </Chip>
        </div>
      </div>
    </template>
  </Popover>
</template>
