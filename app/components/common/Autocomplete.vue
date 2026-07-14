<script lang="ts">
import type {
  AutocompleteItem,
  AutocompleteProps,
  AutocompleteEmits,
} from "#foundation/types/core/autocomplete";
</script>

<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef, watch } from "#imports";
import { usePassthrough } from "#foundation/composables/passthrough";
import { AUTOCOMPLETE_BLUR_DELAY_MS } from "#foundation/constants/common/autocomplete";
import type { IconAlias } from "#foundation/types/common/iconic";
import { passthrough } from "#foundation/utils/passthrough";
import Button from "#foundation/components/common/Button.vue";
import Group from "#foundation/components/common/Group.vue";
import Icon from "#foundation/components/common/Icon.vue";
import Input from "#foundation/components/common/Input.vue";
import Scroller from "#foundation/components/core/Scroller.vue";
import Span from "#foundation/components/common/Span.vue";
const {
  modelValue,
  suggestions,
  steps = [],
  hint,
  showEmpty = false,
  placeholder,
  pt,
} = defineProps<AutocompleteProps>();

const emit = defineEmits<AutocompleteEmits>();

const el = useTemplateRef("el");
const inputRef = useTemplateRef<{ el: HTMLInputElement }>("inputEl");
defineExpose({ el, focus: () => inputRef.value?.el?.focus() });

const focused = ref(false);
const highlightIndex = ref(0);

// Panels: each locked step as a single-item panel, then active suggestions
const panels = computed(() => {
  if (!focused.value) return [];
  const result: AutocompleteItem[][] = [];
  for (const step of steps) {
    result.push([{ ...step, hasChildren: true }]);
  }
  if (suggestions.length) {
    result.push(suggestions);
  }
  return result;
});

const hasDropdown = computed(
  () => panels.value.length > 0 || showEmpty,
);

// Reset highlight when active panel changes
watch(
  () => suggestions,
  (items) => {
    let idx = 0;
    while (idx < items.length && items[idx]?.disabled) idx++;
    highlightIndex.value = idx < items.length ? idx : 0;
  },
);

// Scroll highlighted item into view
watch(highlightIndex, () => {
  nextTick(() => {
    const container = el.value?.$el ?? el.value;
    const highlighted = (
      container as HTMLElement | undefined
    )?.querySelector(".f-autocomplete-item--highlighted");
    highlighted?.scrollIntoView({ block: "nearest" });
  });
});

// Keyboard navigation
const onKeydown = (event: KeyboardEvent) => {
  if (hasDropdown.value) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      let next = highlightIndex.value + 1;
      while (next < suggestions.length && suggestions[next]?.disabled) next++;
      if (next < suggestions.length) highlightIndex.value = next;
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      let next = highlightIndex.value - 1;
      while (next >= 0 && suggestions[next]?.disabled) next--;
      if (next >= 0) highlightIndex.value = next;
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      if (suggestions.length) {
        const item = suggestions[highlightIndex.value];
        if (item && !item.disabled) {
          emit("select", item);
          return;
        }
      }
      emit("submit", modelValue);
      return;
    }
  } else if (event.key === "Enter") {
    event.preventDefault();
    emit("submit", modelValue);
    return;
  }

  // Forward all other keys (backspace, escape, etc.) to consumer
  emit("keydown", event);
};

const onInput = (event: Event) => {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
};

const onFocus = () => {
  focused.value = true;
  emit("focus");
};

const onBlur = () => {
  window.setTimeout(() => {
    focused.value = false;
    emit("blur");
  }, AUTOCOMPLETE_BLUR_DELAY_MS);
};

const ctx = computed(() => ({
  modelValue,
  suggestions,
  steps,
  hint,
  showEmpty,
  placeholder,
  focused: focused.value,
  highlightIndex: highlightIndex.value,
  panels: panels.value,
  hasDropdown: hasDropdown.value,
}));

// Passthrough
const rootPT = usePassthrough(pt?.root, { props: {}, handlers: {} });
const hintWrapPT = usePassthrough(pt?.hintWrap, {
  props: {},
  handlers: {},
});
const hintTextPT = usePassthrough(pt?.hintText, {
  props: {},
  handlers: {},
});
const hintCharPT = usePassthrough(pt?.hintChar, {
  props: {},
  handlers: {},
});
const inputPT = usePassthrough(pt?.input, () => ({
  props: { placeholder: placeholder ?? "", value: modelValue },
  handlers: {},
}));
const dropdownPT = usePassthrough(pt?.dropdown, { props: {}, handlers: {} });
const panelPT = usePassthrough(pt?.panel, { props: {}, handlers: {} });
const scrollerPT = usePassthrough(pt?.scroller, { props: {}, handlers: {} });
const emptyPT = usePassthrough(pt?.empty, { props: {}, handlers: {} });
</script>

<template>
  <Group
    ref="el"
    v-bind="rootPT.props"
    class="f-autocomplete"
    v-on="rootPT.handlers"
  >
    <slot name="hintWrap" v-bind="ctx">
      <ClientOnly>
        <Group
          v-show="hint"
          v-bind="hintWrapPT.props"
          class="f-autocomplete-hint"
          aria-hidden="true"
          v-on="hintWrapPT.handlers"
        >
          <Span
            v-bind="hintTextPT.props"
            class="f-autocomplete-hint-text"
            v-on="hintTextPT.handlers"
            >{{ modelValue }}</Span
          >
          <Span
            v-bind="hintCharPT.props"
            class="f-autocomplete-hint-char"
            v-on="hintCharPT.handlers"
            >{{ hint }}</Span
          >
        </Group>
      </ClientOnly>
    </slot>
    <slot name="input" v-bind="ctx">
      <Input
        ref="inputEl"
        v-bind="inputPT.props"
        :class="[
          'f-autocomplete-input',
          { 'f-autocomplete-input--ghost': hint },
        ]"
        @input="onInput"
        @keydown="onKeydown"
        @focus="onFocus"
        @blur="onBlur"
      />
    </slot>
    <slot name="dropdown" v-bind="ctx">
      <Group
        v-if="hasDropdown"
        v-bind="dropdownPT.props"
        class="f-autocomplete-dropdown"
        v-on="dropdownPT.handlers"
      >
        <slot
          v-for="(panel, panelIndex) in panels"
          :key="panelIndex"
          name="panel"
          v-bind="{ ...ctx, panel, panelIndex }"
        >
          <Group
            v-bind="panelPT.props"
            class="f-autocomplete-panel"
            v-on="panelPT.handlers"
          >
            <Scroller
              v-bind="scrollerPT.props"
              class="f-autocomplete-scroller"
              v-on="scrollerPT.handlers"
            >
              <template #content>
                <slot
                  v-for="(item, i) in panel"
                  :key="item.value"
                  name="item"
                  v-bind="{ ...ctx, item, index: i, panelIndex }"
                >
                  <Button
                    v-bind="
                      passthrough(pt?.item, {
                        props: { disabled: item.disabled },
                        handlers: {},
                      }).props
                    "
                    :class="[
                      'f-autocomplete-item',
                      {
                        'f-autocomplete-item--highlighted':
                          panelIndex === panels.length - 1 &&
                          i === highlightIndex,
                      },
                      {
                        'f-autocomplete-item--locked':
                          panel.length === 1 &&
                          panelIndex < panels.length - 1,
                      },
                      {
                        'f-autocomplete-item--disabled': item.disabled,
                      },
                    ]"
                    @mousedown.prevent="
                      panelIndex < panels.length - 1
                        ? emit('unwind', panelIndex)
                        : !item.disabled && emit('select', item)
                    "
                  >
                    <Icon
                      v-if="item.icon"
                      v-bind="
                        passthrough(pt?.itemIcon, {
                          props: { alias: item.icon },
                          handlers: {},
                        }).props
                      "
                      class="f-autocomplete-item-icon"
                    />
                    <Span
                      v-bind="
                        passthrough(pt?.itemLabel, {
                          props: {},
                          handlers: {},
                        }).props
                      "
                      class="f-autocomplete-item-label"
                      >{{ item.label }}</Span
                    >
                    <Icon
                      v-if="item.hasChildren"
                      v-bind="
                        passthrough(pt?.itemArrow, {
                          props: { alias: 'chevron-right' as IconAlias },
                          handlers: {},
                        }).props
                      "
                      class="f-autocomplete-item-arrow"
                    />
                  </Button>
                </slot>
              </template>
            </Scroller>
          </Group>
        </slot>
        <slot name="empty" v-bind="ctx">
          <Group
            v-if="showEmpty"
            v-bind="panelPT.props"
            class="f-autocomplete-panel"
            v-on="panelPT.handlers"
          >
            <Span
              v-bind="emptyPT.props"
              class="f-autocomplete-empty"
              v-on="emptyPT.handlers"
              >No matches</Span
            >
          </Group>
        </slot>
      </Group>
    </slot>
  </Group>
</template>
