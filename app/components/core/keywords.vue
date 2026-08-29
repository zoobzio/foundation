<script lang="ts">
import type {
  KeywordsContext,
  KeywordsEmits,
  KeywordsPassthrough,
  KeywordsProps,
  KeywordsSlots,
} from "../../types/core/keywords";
import type { ComponentPublicInstance } from "vue";

import Fab from "./fab.vue";
import Popover from "./popover.vue";
import SegmentedControl from "./segmented-control.vue";
import TagsInput from "./tags-input.vue";

import { useTemplateRef } from "#imports";
import { usePassthrough } from "../../composables/passthrough";
import { useModel } from "../../composables/model";
import { useContext } from "../../composables/context";
import { useKeywords } from "../../composables/keywords";
import {
  KEYWORDS_EXCLUDE_PLACEHOLDER,
  KEYWORDS_INCLUDE_PLACEHOLDER,
  KEYWORDS_TRIGGER_ICON,
  MATCH_OPTIONS,
} from "../../constants/keywords";
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
    includeInput: {
      modelValue: include.value,
      delimiter: "",
      "onUpdate:modelValue": (v) => {
        include.value = v;
      },
    },
    excludeInput: {
      modelValue: exclude.value,
      delimiter: "",
      "onUpdate:modelValue": (v) => {
        exclude.value = v;
      },
    },
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
        <div class="f-group f-keywords">
          <slot name="include" v-bind="ctx">
            <div class="f-group f-keywords-section">
              <slot name="includeLabel" v-bind="ctx">
                <div class="f-caption f-keywords-label">
                  Include
                </div>
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
            </div>
          </slot>
          <slot name="exclude" v-bind="ctx">
            <div class="f-group f-keywords-section">
              <slot name="excludeLabel" v-bind="ctx">
                <div class="f-caption f-keywords-label">
                  Exclude
                </div>
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
            </div>
          </slot>
          <slot name="match" v-bind="ctx">
            <div class="f-group f-keywords-match">
              <slot name="matchLabel" v-bind="ctx">
                <div class="f-caption f-keywords-label">
                  Match
                </div>
              </slot>
              <slot name="matchControl" v-bind="ctx">
                <SegmentedControl v-bind="settings.matchControl" />
              </slot>
            </div>
          </slot>
        </div>
      </slot>
    </template>
  </Popover>
</template>
