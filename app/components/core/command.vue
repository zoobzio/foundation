<script lang="ts">
import type {
  CommandProps,
  CommandEmits,
  CommandPassthrough,
  CommandContext,
  CommandSlots,
  CommandOption,
} from "#foundation/types/core/command";
import type { ComponentPublicInstance } from "vue";

import ListboxRoot from "#foundation/components/common/listbox/root.vue";
import ListboxFilter from "#foundation/components/common/listbox/filter.vue";
import ListboxContent from "#foundation/components/common/listbox/content.vue";
import ListboxGroup from "#foundation/components/common/listbox/group.vue";
import ListboxGroupLabel from "#foundation/components/common/listbox/group-label.vue";
import ListboxItem from "#foundation/components/common/listbox/item.vue";
import Checkbox from "#foundation/components/core/checkbox.vue";
import Group from "#foundation/components/common/group.vue";
import Icon from "#foundation/components/common/icon.vue";
import Kbd from "#foundation/components/common/kbd.vue";
import Scroller from "#foundation/components/core/scroller.vue";
import Span from "#foundation/components/common/span.vue";

import { computed, useTemplateRef } from "#imports";
import { usePassthrough } from "#foundation/composables/passthrough";
import { useModel } from "#foundation/composables/model";
import { useContext } from "#foundation/composables/context";
import { useSelection } from "#foundation/composables/selection";
import { useSearch } from "#foundation/composables/search";
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
    inputWrapper: {},
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
    empty: {},
    group: {},
    groupLabel: {},
    item: (item) => ({
      value: item.value,
      disabled: item.disabled,
    }),
    itemCheckbox: (item) => ({
      modelValue: selected(item),
    }),
    itemIcon: (item) => ({
      alias: item.icon ?? "",
    }),
    itemLabel: {},
    itemCount: {},
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
  <ListboxRoot ref="el" v-bind="settings.root">
    <slot name="inputWrapper" v-bind="ctx">
      <Group v-bind="settings.inputWrapper">
        <slot name="inputIcon" v-bind="ctx" />
        <slot name="filter" v-bind="ctx">
          <ListboxFilter v-bind="settings.filter" />
        </slot>
      </Group>
    </slot>
    <slot name="content" v-bind="ctx">
      <ListboxContent v-bind="settings.content">
        <slot name="viewport" v-bind="ctx">
          <Scroller v-bind="settings.viewport">
            <Group v-if="!hasResults" v-bind="settings.empty">
              <slot name="empty" v-bind="ctx">No results found</slot>
            </Group>
            <ListboxGroup
              v-for="group in results"
              :key="group.key"
              v-bind="settings.group"
            >
              <template v-if="group.label && results.length > 1">
                <slot name="groupLabel" v-bind="{ ...ctx, group }">
                  <ListboxGroupLabel v-bind="settings.groupLabel">
                    {{ group.label }}
                  </ListboxGroupLabel>
                </slot>
              </template>
              <template v-for="item in group.options" :key="item.value">
                <slot
                  name="item"
                  v-bind="{ ...ctx, item, selected: selected(item) }"
                >
                  <ListboxItem v-bind="settings.item(item)">
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
                      <Icon v-if="item.icon" v-bind="settings.itemIcon(item)" />
                    </slot>
                    <slot name="itemLabel" v-bind="{ ...ctx, item }">
                      <Span v-bind="settings.itemLabel">{{ item.label }}</Span>
                    </slot>
                    <slot name="itemCount" v-bind="{ ...ctx, item }">
                      <Kbd
                        v-if="item.count !== undefined"
                        v-bind="settings.itemCount"
                        >{{ item.count }}</Kbd
                      >
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
