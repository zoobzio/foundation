<script lang="ts">
import type {
  MenuProps,
  MenuEmits,
  MenuPassthrough,
  MenuContext,
  MenuSlots,
} from "#foundation/types/core/menu";
import type { ComponentPublicInstance } from "vue";

import DropdownMenuRoot from "#foundation/components/common/dropdown-menu/root.vue";
import DropdownMenuTrigger from "#foundation/components/common/dropdown-menu/trigger.vue";
import DropdownMenuPortal from "#foundation/components/common/dropdown-menu/portal.vue";
import DropdownMenuContent from "#foundation/components/common/dropdown-menu/content.vue";
import DropdownMenuGroup from "#foundation/components/common/dropdown-menu/group.vue";
import DropdownMenuLabel from "#foundation/components/common/dropdown-menu/label.vue";
import DropdownMenuItem from "#foundation/components/common/dropdown-menu/item.vue";
import DropdownMenuSeparator from "#foundation/components/common/dropdown-menu/separator.vue";
import Caption from "#foundation/components/common/caption.vue";
import Icon from "#foundation/components/common/icon.vue";
import Span from "#foundation/components/common/span.vue";

import { useTemplateRef } from "#imports";
import { usePassthrough } from "#foundation/composables/passthrough";
import { useModel } from "#foundation/composables/model";
import { useContext } from "#foundation/composables/context";
import { MENU_SIDE_OFFSET } from "#foundation/constants/menu";
</script>

<script setup lang="ts">
const {
  open = undefined,
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
        <slot v-bind="ctx" />
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
