<script lang="ts">
import type { KeywordsProps, KeywordsEmits } from "#foundation/types/data/filter-keywords";
import { computed, ref, useTemplateRef, watch } from "#imports";
import { usePassthrough } from "#foundation/composables/passthrough";
import type { IconAlias } from "#foundation/types/common/iconic";
import { Keywords } from "#foundation/utils/keywords";
import { MATCH_OPTIONS } from "#foundation/constants/common/keywords";
import Caption from "#foundation/components/common/caption.vue";
import Fab from "#foundation/components/core/Fab.vue";
import Group from "#foundation/components/common/group.vue";
import Popover from "#foundation/components/core/Popover.vue";
import SegmentedControl from "#foundation/components/core/SegmentedControl.vue";
import TagsInput from "#foundation/components/core/TagsInput.vue";
</script>

<script setup lang="ts">
const { modelValue, pt } = defineProps<KeywordsProps>();

const emit = defineEmits<KeywordsEmits>();

const el = useTemplateRef("el");
defineExpose({ el });
const open = ref(false);
const includeInput = ref("");
const excludeInput = ref("");

const isOrMode = computed(() => (modelValue ?? "").includes("||"));
const mode = ref<"and" | "or">(isOrMode.value ? "or" : "and");

watch(isOrMode, (v) => { mode.value = v ? "or" : "and"; });

const parsed = computed(() => Keywords.parse(modelValue ?? ""));

const rebuild = (include: string[], exclude: string[]) => {
  emit("update:modelValue", Keywords.build(include, exclude, mode.value));
};

const includeModel = computed({
  get: () => parsed.value.include,
  set: (val: string[]) => {
    const excludeFiltered = parsed.value.exclude.filter((t) => !val.includes(t));
    rebuild(val, excludeFiltered);
  },
});

const excludeModel = computed({
  get: () => parsed.value.exclude,
  set: (val: string[]) => {
    const includeFiltered = parsed.value.include.filter((t) => !val.includes(t));
    rebuild(includeFiltered, val);
  },
});

watch(mode, () => {
  rebuild(parsed.value.include, parsed.value.exclude);
});

const activeCount = computed(() => parsed.value.include.length + parsed.value.exclude.length);

const addTag = (term: string, target: "include" | "exclude") => {
  if (!term) return;
  if (target === "include") {
    if (includeModel.value.includes(term)) return;
    includeModel.value = [...includeModel.value, term];
  } else {
    if (excludeModel.value.includes(term)) return;
    excludeModel.value = [...excludeModel.value, term];
  }
};

const removeTag = (term: string, target: "include" | "exclude") => {
  if (target === "include") {
    includeModel.value = includeModel.value.filter((t) => t !== term);
  } else {
    excludeModel.value = excludeModel.value.filter((t) => t !== term);
  }
};

const handleInput = (raw: string, target: "include" | "exclude") => {
  if (raw.startsWith('"')) {
    if (raw.endsWith('"') && raw.length > 2) {
      addTag(raw.slice(1, -1), target);
      return "";
    }
    return raw;
  }
  if (raw.endsWith(" ")) {
    const term = raw.trim();
    if (term) addTag(term, target);
    return "";
  }
  return raw;
};

const onIncludeInput = (event: Event) => {
  includeInput.value = handleInput((event.target as HTMLInputElement).value, "include");
};

const onExcludeInput = (event: Event) => {
  excludeInput.value = handleInput((event.target as HTMLInputElement).value, "exclude");
};

const onIncludeKeydown = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    event.preventDefault();
    const term = includeInput.value.trim().replace(/^"|"$/g, "");
    if (term) addTag(term, "include");
    includeInput.value = "";
  }
  if (event.key === "Backspace" && !includeInput.value && includeModel.value.length) {
    removeTag(includeModel.value[includeModel.value.length - 1]!, "include");
  }
};

const onExcludeKeydown = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    event.preventDefault();
    const term = excludeInput.value.trim().replace(/^"|"$/g, "");
    if (term) addTag(term, "exclude");
    excludeInput.value = "";
  }
  if (event.key === "Backspace" && !excludeInput.value && excludeModel.value.length) {
    removeTag(excludeModel.value[excludeModel.value.length - 1]!, "exclude");
  }
};

const popoverPT = usePassthrough(pt?.popover, () => ({
  props: { open: open.value, align: "end" as const },
  handlers: { "update:open": (v: boolean) => { open.value = v; } },
}));
const triggerPT = usePassthrough(pt?.trigger, () => ({
  props: { icon: "tag" as IconAlias, badge: activeCount.value > 0 ? activeCount.value : undefined },
  handlers: {},
}));
const rootPT = usePassthrough(pt?.root, { props: {}, handlers: {} });
const includePT = usePassthrough(pt?.include, { props: {}, handlers: {} });
const includeLabelPT = usePassthrough(pt?.includeLabel, { props: {}, handlers: {} });
const excludePT = usePassthrough(pt?.exclude, { props: {}, handlers: {} });
const excludeLabelPT = usePassthrough(pt?.excludeLabel, { props: {}, handlers: {} });
const matchPT = usePassthrough(pt?.match, { props: {}, handlers: {} });
const matchLabelPT = usePassthrough(pt?.matchLabel, { props: {}, handlers: {} });
const matchControlPT = usePassthrough(pt?.matchControl, () => ({
  props: { modelValue: mode.value, options: MATCH_OPTIONS },
  handlers: { "update:modelValue": (v: string) => { mode.value = v as "and" | "or"; } },
}));
const includeInputPT = usePassthrough(pt?.includeInput, () => ({
  props: { modelValue: includeModel.value, placeholder: "Add keyword...", delimiter: "" },
  handlers: { "update:modelValue": (v: string[]) => { includeModel.value = v; } },
}));
const excludeInputPT = usePassthrough(pt?.excludeInput, () => ({
  props: { modelValue: excludeModel.value, placeholder: "Exclude keyword...", delimiter: "" },
  handlers: { "update:modelValue": (v: string[]) => { excludeModel.value = v; } },
}));

const ctx = computed(() => ({
  keywords: modelValue ?? "",
  includeEntries: includeModel.value,
  excludeEntries: excludeModel.value,
  mode: mode.value,
  activeCount: activeCount.value,
  open: open.value,
}));
</script>

<template>
  <slot name="popover" v-bind="ctx">
    <Popover v-bind="popoverPT.props" v-on="popoverPT.handlers">
      <template #trigger>
        <slot name="trigger" v-bind="ctx">
          <Fab v-bind="triggerPT.props" v-on="triggerPT.handlers" />
        </slot>
      </template>
      <template #content>
        <slot name="root" v-bind="ctx">
          <Group ref="el" v-bind="rootPT.props" class="f-keywords" v-on="rootPT.handlers">
            <slot name="include" v-bind="ctx">
              <Group v-bind="includePT.props" class="f-keywords-section" v-on="includePT.handlers">
                <slot name="includeLabel" v-bind="ctx">
                  <Caption v-bind="includeLabelPT.props" class="f-keywords-label" v-on="includeLabelPT.handlers">Include</Caption>
                </slot>
                <slot name="includeInput" v-bind="ctx">
                  <TagsInput
                    v-bind="includeInputPT.props"
                    class="f-keywords-tags"
                    v-on="includeInputPT.handlers"
                  >
                    <template #input>
                      <input
                        :value="includeInput"
                        placeholder="Add keyword..."
                        class="f-tags-input-input"
                        @input="onIncludeInput"
                        @keydown="onIncludeKeydown"
                      >
                    </template>
                  </TagsInput>
                </slot>
              </Group>
            </slot>
            <slot name="exclude" v-bind="ctx">
              <Group v-bind="excludePT.props" class="f-keywords-section" v-on="excludePT.handlers">
                <slot name="excludeLabel" v-bind="ctx">
                  <Caption v-bind="excludeLabelPT.props" class="f-keywords-label" v-on="excludeLabelPT.handlers">Exclude</Caption>
                </slot>
                <slot name="excludeInput" v-bind="ctx">
                  <TagsInput
                    v-bind="excludeInputPT.props"
                    class="f-keywords-tags"
                    v-on="excludeInputPT.handlers"
                  >
                    <template #input>
                      <input
                        :value="excludeInput"
                        placeholder="Exclude keyword..."
                        class="f-tags-input-input"
                        @input="onExcludeInput"
                        @keydown="onExcludeKeydown"
                      >
                    </template>
                  </TagsInput>
                </slot>
              </Group>
            </slot>
            <slot name="match" v-bind="ctx">
              <Group v-bind="matchPT.props" class="f-keywords-match" v-on="matchPT.handlers">
                <slot name="matchLabel" v-bind="ctx">
                  <Caption v-bind="matchLabelPT.props" class="f-keywords-label" v-on="matchLabelPT.handlers">Match</Caption>
                </slot>
                <slot name="matchControl" v-bind="ctx">
                  <SegmentedControl v-bind="matchControlPT.props" v-on="matchControlPT.handlers" />
                </slot>
              </Group>
            </slot>
          </Group>
        </slot>
      </template>
    </Popover>
  </slot>
</template>
