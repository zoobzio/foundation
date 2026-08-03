<script lang="ts">
import type {
  KeywordsContext,
  KeywordsEmits,
  KeywordsPassthrough,
  KeywordsProps,
  KeywordsSlots,
} from "#foundation/types/core/keywords";
import type { ComponentPublicInstance } from "vue";

import Caption from "#foundation/components/common/caption.vue";
import Fab from "#foundation/components/core/fab.vue";
import Group from "#foundation/components/common/group.vue";
import Popover from "#foundation/components/core/popover.vue";
import SegmentedControl from "#foundation/components/core/segmented-control.vue";
import TagsInput from "#foundation/components/core/tags-input.vue";

import { useTemplateRef } from "#imports";
import { usePassthrough } from "#foundation/composables/passthrough";
import { useModel } from "#foundation/composables/model";
import { useContext } from "#foundation/composables/context";
import { useKeywords } from "#foundation/composables/keywords";
import {
  KEYWORDS_EXCLUDE_PLACEHOLDER,
  KEYWORDS_INCLUDE_PLACEHOLDER,
  KEYWORDS_TRIGGER_ICON,
  MATCH_OPTIONS,
} from "#foundation/constants/keywords";
</script>

<script setup lang="ts">
const { modelValue, open = undefined, pt } = defineProps<KeywordsProps>();

const emit = defineEmits<KeywordsEmits>();

const $model = useModel(
  () => modelValue,
  (v) => emit("update:modelValue", v),
  { default: "" },
);

const $open = useModel(
  () => open,
  (v) => emit("update:open", v),
  { default: false },
);

const el = useTemplateRef<ComponentPublicInstance>("el");

const {
  mode,
  include,
  exclude,
  includeInput,
  excludeInput,
  activeCount,
  setMode,
  onIncludeInput,
  onExcludeInput,
  onIncludeKeydown,
  onExcludeKeydown,
} = useKeywords($model);

const settings = usePassthrough<KeywordsPassthrough>(() => ({
  pt,
  recipes: {
    popover: {
      open: $open.value,
      align: "end",
      "onUpdate:open": (v) => {
        $open.value = v;
      },
    },
    trigger: {
      icon: KEYWORDS_TRIGGER_ICON,
      badge: activeCount.value > 0 ? activeCount.value : undefined,
    },
    root: {},
    include: {},
    includeLabel: {},
    includeInput: {
      modelValue: include.value,
      delimiter: "",
      "onUpdate:modelValue": (v) => {
        include.value = v;
      },
    },
    exclude: {},
    excludeLabel: {},
    excludeInput: {
      modelValue: exclude.value,
      delimiter: "",
      "onUpdate:modelValue": (v) => {
        exclude.value = v;
      },
    },
    match: {},
    matchLabel: {},
    matchControl: {
      modelValue: mode.value,
      options: MATCH_OPTIONS,
      "onUpdate:modelValue": setMode,
    },
  },
}));

const ctx = useContext<KeywordsContext>("keywords", () => ({
  keywords: $model.value ?? "",
  include: include.value,
  exclude: exclude.value,
  mode: mode.value,
  activeCount: activeCount.value,
  open: $open,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<KeywordsSlots>();
</script>

<template>
  <Popover ref="el" v-bind="settings.popover">
    <template #trigger>
      <slot name="trigger" v-bind="ctx">
        <Fab v-bind="settings.trigger" />
      </slot>
    </template>
    <template #content>
      <slot name="root" v-bind="ctx">
        <Group v-bind="settings.root" class="f-keywords">
          <slot name="include" v-bind="ctx">
            <Group v-bind="settings.include" class="f-keywords-section">
              <slot name="includeLabel" v-bind="ctx">
                <Caption v-bind="settings.includeLabel" class="f-keywords-label">
                  Include
                </Caption>
              </slot>
              <slot name="includeInput" v-bind="ctx">
                <TagsInput v-bind="settings.includeInput" class="f-keywords-tags">
                  <template #input>
                    <input
                      :value="includeInput"
                      :placeholder="KEYWORDS_INCLUDE_PLACEHOLDER"
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
            <Group v-bind="settings.exclude" class="f-keywords-section">
              <slot name="excludeLabel" v-bind="ctx">
                <Caption v-bind="settings.excludeLabel" class="f-keywords-label">
                  Exclude
                </Caption>
              </slot>
              <slot name="excludeInput" v-bind="ctx">
                <TagsInput v-bind="settings.excludeInput" class="f-keywords-tags">
                  <template #input>
                    <input
                      :value="excludeInput"
                      :placeholder="KEYWORDS_EXCLUDE_PLACEHOLDER"
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
            <Group v-bind="settings.match" class="f-keywords-match">
              <slot name="matchLabel" v-bind="ctx">
                <Caption v-bind="settings.matchLabel" class="f-keywords-label">
                  Match
                </Caption>
              </slot>
              <slot name="matchControl" v-bind="ctx">
                <SegmentedControl v-bind="settings.matchControl" />
              </slot>
            </Group>
          </slot>
        </Group>
      </slot>
    </template>
  </Popover>
</template>
