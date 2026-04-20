<script lang="ts">
import type { KeywordsProps, KeywordEntry } from "../types/keywords";
</script>

<script setup lang="ts">
const { pt } = defineProps<KeywordsProps>();

const el = useTemplateRef("el");
defineExpose({ el });

const keywords = defineModel<string>({ default: "" });
const open = ref(false);
const includeInput = ref("");
const excludeInput = ref("");

const entries = computed<KeywordEntry[]>(() => {
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

const buildKeywordString = (items: KeywordEntry[]) =>
  items.map((e) => (e.mode === "exclude" ? `-${e.term}` : `+${e.term}`)).join(" ");

const addInclude = () => {
  const term = includeInput.value.trim();
  if (!term) return;
  keywords.value = buildKeywordString([...entries.value, { mode: "include", term }]);
  includeInput.value = "";
};

const addExclude = () => {
  const term = excludeInput.value.trim();
  if (!term) return;
  keywords.value = buildKeywordString([...entries.value, { mode: "exclude", term }]);
  excludeInput.value = "";
};

const remove = (index: number) => {
  keywords.value = buildKeywordString(entries.value.filter((_, i) => i !== index));
};

const ctx = computed(() => ({ keywords: keywords.value, entries: entries.value, activeCount: activeCount.value }));
</script>

<template>
  <Popover v-model:open="open" align="start">
    <slot name="trigger" v-bind="ctx">
      <Fab icon="tag" :badge="activeCount > 0 ? activeCount : undefined" />
    </slot>
    <template #content>
      <slot v-bind="ctx">
        <Group ref="el" v-bind="pt?.root" class="f-keywords">
          <Group class="f-keywords-section">
            <Caption>Include</Caption>
            <Group class="f-keywords-input-row">
              <Input
                v-model="includeInput"
                type="text"
                placeholder="Add keyword..."
                @keydown.enter.prevent="addInclude"
              />
              <Fab icon="add" @click="addInclude" />
            </Group>
          </Group>
          <Group class="f-keywords-section">
            <Caption>Exclude</Caption>
            <Group class="f-keywords-input-row">
              <Input
                v-model="excludeInput"
                type="text"
                placeholder="Exclude keyword..."
                @keydown.enter.prevent="addExclude"
              />
              <Fab icon="add" @click="addExclude" />
            </Group>
          </Group>
          <Group v-if="entries.length" class="f-keywords-chips">
            <Chip
              v-for="(entry, i) in entries"
              :key="i"
              closable
              @close="remove(i)"
            >
              <Span :class="entry.mode === 'exclude' ? 'f-keywords-exclude' : 'f-keywords-include'">
                {{ entry.mode === "exclude" ? "−" : "+" }}
              </Span>
              {{ entry.term }}
            </Chip>
          </Group>
        </Group>
      </slot>
    </template>
  </Popover>
</template>
