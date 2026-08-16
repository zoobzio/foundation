<script lang="ts">
import type {
  MenuProps,
  MenuEmits,
  MenuPassthrough,
  MenuContext,
  MenuSlots,
} from "../../types/core/menu";
import type { ComponentPublicInstance } from "vue";

import DropdownMenuRoot from "../common/dropdown-menu/root.vue";
import DropdownMenuTrigger from "../common/dropdown-menu/trigger.vue";
import DropdownMenuPortal from "../common/dropdown-menu/portal.vue";
import DropdownMenuContent from "../common/dropdown-menu/content.vue";
import DropdownMenuGroup from "../common/dropdown-menu/group.vue";
import DropdownMenuLabel from "../common/dropdown-menu/label.vue";
import DropdownMenuItem from "../common/dropdown-menu/item.vue";
import DropdownMenuSeparator from "../common/dropdown-menu/separator.vue";
import Button from "../common/button.vue";
import Caption from "../common/caption.vue";
import Icon from "../common/icon.vue";
import Span from "../common/span.vue";

import { useTemplateRef } from "#imports";
import { usePassthrough } from "../../composables/passthrough";
import { useModel } from "../../composables/model";
import { useContext } from "../../composables/context";
import { MENU_SIDE_OFFSET } from "../../constants/menu";
</script>

<script setup lang="ts">
const {
  open = undefined,
  label,
  groups,
  side = "bottom",
  align = "center",
  sideOffset = MENU_SIDE_OFFSET,
  alignOffset = 0,
  pt,
} = defineProps<MenuProps>();

const emit = defineEmits<MenuEmits>();

const $open = useModel(
  () => open,
  (v) => emit("update:open", v),
  { default: false },
);

const el = useTemplateRef<ComponentPublicInstance>("el");

const settings = usePassthrough<MenuPassthrough>(() => ({
  pt,
  recipes: {
    root: {
      open: $open.value,
      "onUpdate:open": (v) => {
        $open.value = v;
      },
    },
    trigger: { asChild: true },
    triggerButton: { label },
    content: { side, align, sideOffset, alignOffset },
    group: {},
    label: { asChild: true },
    groupLabel: {},
    item: (item) => ({
      disabled: item.disabled,
      onSelect: () => {
        emit("select", item);
      },
    }),
    itemIcon: (item) => ({
      alias: item.icon ?? "",
    }),
    itemLabel: {},
    separator: {},
  },
}));

const ctx = useContext<MenuContext>("menu", () => ({
  label,
  groups,
  side,
  align,
  sideOffset,
  alignOffset,
  open: $open,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<MenuSlots>();
</script>

<template>
  <DropdownMenuRoot ref="el" v-bind="settings.root">
    <slot name="trigger" v-bind="ctx">
      <DropdownMenuTrigger v-bind="settings.trigger">
        <slot v-bind="ctx">
          <Button v-bind="settings.triggerButton" />
        </slot>
      </DropdownMenuTrigger>
    </slot>
    <DropdownMenuPortal>
      <DropdownMenuContent v-bind="settings.content">
        <slot name="content" v-bind="ctx">
          <template v-for="(group, groupIndex) in groups" :key="group.key">
            <DropdownMenuSeparator
              v-if="groupIndex > 0"
              v-bind="settings.separator"
            />
            <DropdownMenuGroup v-bind="settings.group">
              <DropdownMenuLabel v-if="group.label" v-bind="settings.label">
                <slot name="groupLabel" v-bind="{ ...ctx, group }">
                  <Caption v-bind="settings.groupLabel">{{ group.label }}</Caption>
                </slot>
              </DropdownMenuLabel>
              <template v-for="item in group.items" :key="item.label">
                <slot name="item" v-bind="{ ...ctx, item }">
                  <DropdownMenuItem v-bind="settings.item(item)">
                    <slot name="itemIcon" v-bind="{ ...ctx, item }">
                      <Icon v-if="item.icon" v-bind="settings.itemIcon(item)" />
                    </slot>
                    <slot name="itemLabel" v-bind="{ ...ctx, item }">
                      <Span v-bind="settings.itemLabel">{{ item.label }}</Span>
                    </slot>
                  </DropdownMenuItem>
                </slot>
              </template>
            </DropdownMenuGroup>
          </template>
        </slot>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
