<script lang="ts">
import type {
  DirectoryContext,
  DirectoryEmits,
  DirectoryItem,
  DirectoryPassthrough,
  DirectoryProps,
  DirectorySlots,
} from "../../types/core/directory";
import type { ComponentPublicInstance } from "vue";

import Anchor from "../common/anchor.vue";
import Button from "../common/button.vue";
import Caption from "../common/caption.vue";
import Group from "../common/group.vue";
import Icon from "../common/icon.vue";
import Li from "../common/li.vue";
import Nav from "../common/nav.vue";
import Span from "../common/span.vue";
import Ul from "../common/ul.vue";

import { useTemplateRef } from "#imports";
import { usePassthrough } from "../../composables/passthrough";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts" generic="T extends DirectoryItem">
const { groups, pt } = defineProps<DirectoryProps<T>>();

const emit = defineEmits<DirectoryEmits<T>>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const settings = usePassthrough<DirectoryPassthrough<T>>(() => ({
  pt,
  recipes: {
    root: {},
    group: {},
    groupLabel: {},
    list: {},
    item: () => ({}),
    itemAnchor: (item) => ({
      to: item.link?.to,
      external: item.link?.external,
      target: item.link?.target,
      replace: item.link?.replace,
      prefetch: item.link?.prefetch,
      disabled: item.disabled,
      // Anchor suppresses navigation when disabled but still emits click.
      onClick: () => {
        if (!item.disabled) emit("select", item);
      },
    }),
    itemButton: (item) => ({
      disabled: item.disabled,
      onClick: () => emit("select", item),
    }),
    itemIcon: (item) => ({
      alias: item.icon ?? "",
    }),
    itemLabel: {},
  },
}));

const ctx = useContext<DirectoryContext<T>>("directory", () => ({
  groups,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<DirectorySlots<T>>();
</script>

<template>
  <Nav ref="el" v-bind="settings.root">
    <Group v-for="group in groups" :key="group.key" v-bind="settings.group">
      <template v-if="group.label">
        <slot name="groupLabel" v-bind="{ ...ctx, group }">
          <Caption v-bind="settings.groupLabel">{{ group.label }}</Caption>
        </slot>
      </template>
      <Ul v-bind="settings.list">
        <Li
          v-for="item in group.items"
          :key="item.key"
          v-bind="settings.item(item)"
        >
          <slot name="item" v-bind="{ ...ctx, item }">
            <Anchor v-if="item.link" v-bind="settings.itemAnchor(item)">
              <slot name="itemIcon" v-bind="{ ...ctx, item }">
                <Icon v-if="item.icon" v-bind="settings.itemIcon(item)" />
              </slot>
              <slot name="itemLabel" v-bind="{ ...ctx, item }">
                <Span v-bind="settings.itemLabel">{{ item.label }}</Span>
              </slot>
            </Anchor>
            <Button v-else v-bind="settings.itemButton(item)">
              <slot name="itemIcon" v-bind="{ ...ctx, item }">
                <Icon v-if="item.icon" v-bind="settings.itemIcon(item)" />
              </slot>
              <slot name="itemLabel" v-bind="{ ...ctx, item }">
                <Span v-bind="settings.itemLabel">{{ item.label }}</Span>
              </slot>
            </Button>
          </slot>
        </Li>
      </Ul>
    </Group>
  </Nav>
</template>
