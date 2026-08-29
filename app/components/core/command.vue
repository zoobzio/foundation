<script lang="ts">
import type {
  CommandProps,
  CommandEmits,
  CommandPassthrough,
  CommandContext,
  CommandSlots,
  CommandOption,
} from "../../types/core/command";
import type { ComponentPublicInstance } from "vue";

import {
  ListboxRoot,
  ListboxFilter,
  ListboxContent,
  ListboxGroup,
  ListboxGroupLabel,
  ListboxItem,
} from "reka-ui";
import Checkbox from "./checkbox.vue";
import Scroller from "./scroller.vue";

import { computed, useTemplateRef } from "#imports";
import { usePassthrough } from "../../composables/passthrough";
import { useModel } from "../../composables/model";
import { useContext } from "../../composables/context";
import { useSelection } from "../../composables/selection";
import { useSearch } from "../../composables/search";
</script>

<script setup lang="ts" generic="T extends CommandOption">
const {
  modelValue,
  groups,
  placeholder = "Search...",
  disabled,
  multiple = false,
  search,
  pt,
} = defineProps<CommandProps<T>>();

const emit = defineEmits<CommandEmits<T>>();

const $model = useModel(
  () => modelValue,
  (v) => emit("update:modelValue", v),
);

const $search = useModel<string>(
  () => search,
  (v) => emit("update:search", v),
  { default: "" },
);

const el = useTemplateRef<ComponentPublicInstance>("el");

const { selected } = useSelection($model, () => ({
  placeholder,
  multiple,
}));

const { match } = useSearch(
  $search,
  () => groups.flatMap((group) => group.options),
  () => ({ keys: ["value", "label"] }),
);

const results = computed(() => {
  const base = groups.map((group) => ({
    ...group,
    options: group.options.filter(
      (option) => match(option) && (option.count !== 0 || selected(option)),
    ),
  }));
  return base.filter((group) => group.options.length > 0);
});

const hasResults = computed(() => results.value.length > 0);

const settings = usePassthrough<CommandPassthrough<T>>(() => ({
  pt,
  recipes: {
    root: {
      modelValue: $model.value?.map((o) => o.value),
      multiple,
      disabled,
      "onUpdate:modelValue": (v) => {
        const keys = Array.isArray(v) ? v : [v];
        const options = groups.flatMap((group) => group.options);
        const next = options.filter((o) => keys.includes(o.value));
        $model.value = multiple ? next : next.slice(0, 1);
      },
    },
    filter: {
      modelValue: $search.value,
      autoFocus: true,
      placeholder,
      "onUpdate:modelValue": (v) => {
        $search.value = v;
      },
    },
    content: {},
    viewport: {},
    group: {},
    groupLabel: {},
    item: (item) => ({
      value: item.value,
      disabled: item.disabled,
    }),
    itemCheckbox: (item) => ({
      modelValue: selected(item),
    }),
  },
}));

const ctx = useContext<CommandContext<T>>("command", () => ({
  groups,
  placeholder,
  disabled,
  multiple,
  search: $search,
  modelValue: $model,
  results: results.value,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<CommandSlots<T>>();
</script>

<template>
  <ListboxRoot ref="el" class="f-listbox-root" v-bind="settings.root">
    <slot name="inputWrapper" v-bind="ctx">
      <div class="f-group">
        <slot name="inputIcon" v-bind="ctx" />
        <slot name="filter" v-bind="ctx">
          <ListboxFilter class="f-listbox-filter" v-bind="settings.filter" />
        </slot>
      </div>
    </slot>
    <slot name="content" v-bind="ctx">
      <ListboxContent class="f-listbox-content" v-bind="settings.content">
        <slot name="viewport" v-bind="ctx">
          <Scroller v-bind="settings.viewport">
            <div v-if="!hasResults" class="f-group">
              <slot name="empty" v-bind="ctx">No results found</slot>
            </div>
            <ListboxGroup
              v-for="group in results"
              :key="group.key"
              class="f-listbox-group"
              v-bind="settings.group"
            >
              <template v-if="group.label && results.length > 1">
                <slot name="groupLabel" v-bind="{ ...ctx, group }">
                  <ListboxGroupLabel
                    class="f-listbox-group-label"
                    v-bind="settings.groupLabel"
                  >
                    {{ group.label }}
                  </ListboxGroupLabel>
                </slot>
              </template>
              <template v-for="item in group.options" :key="item.value">
                <slot
                  name="item"
                  v-bind="{ ...ctx, item, selected: selected(item) }"
                >
                  <ListboxItem
                    class="f-listbox-item"
                    v-bind="settings.item(item)"
                  >
                    <slot
                      name="itemCheckbox"
                      v-bind="{ ...ctx, item, selected: selected(item) }"
                    >
                      <Checkbox
                        v-if="multiple"
                        v-bind="settings.itemCheckbox(item)"
                      />
                    </slot>
                    <slot name="itemIcon" v-bind="{ ...ctx, item }">
                      <Icon
                        v-if="item.icon"
                        class="f-icon"
                        fill="currentColor"
                        :name="item.icon!"
                      />
                    </slot>
                    <slot name="itemLabel" v-bind="{ ...ctx, item }">
                      <span class="f-span">{{ item.label }}</span>
                    </slot>
                    <slot name="itemCount" v-bind="{ ...ctx, item }">
                      <kbd v-if="item.count !== undefined" class="f-kbd">
                        {{ item.count }}
                      </kbd>
                    </slot>
                  </ListboxItem>
                </slot>
              </template>
            </ListboxGroup>
          </Scroller>
        </slot>
      </ListboxContent>
    </slot>
  </ListboxRoot>
</template>
