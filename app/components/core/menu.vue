<script lang="ts">
import type {
  MenuProps,
  MenuEmits,
  MenuPassthrough,
  MenuContext,
  MenuSlots,
} from "../../types/core/menu";
import type { ComponentPublicInstance } from "vue";

import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "reka-ui";

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
    content: { side, align, sideOffset, alignOffset },
    group: {},
    label: { asChild: true },
    item: (item) => ({
      disabled: item.disabled,
      onSelect: () => {
        emit("select", item);
      },
    }),
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
  <DropdownMenuRoot ref="el" class="f-dropdown-menu-root" v-bind="settings.root">
    <slot name="trigger" v-bind="ctx">
      <DropdownMenuTrigger class="f-dropdown-menu-trigger" v-bind="settings.trigger">
        <slot v-bind="ctx">
          <button type="button" class="f-button">{{ label }}</button>
        </slot>
      </DropdownMenuTrigger>
    </slot>
    <DropdownMenuPortal>
      <DropdownMenuContent class="f-dropdown-menu-content" v-bind="settings.content">
        <slot name="content" v-bind="ctx">
          <template v-for="(group, groupIndex) in groups" :key="group.key">
            <DropdownMenuSeparator
              v-if="groupIndex > 0"
              class="f-dropdown-menu-separator"
              v-bind="settings.separator"
            />
            <DropdownMenuGroup class="f-dropdown-menu-group" v-bind="settings.group">
              <DropdownMenuLabel
                v-if="group.label"
                class="f-dropdown-menu-label"
                v-bind="settings.label"
              >
                <slot name="groupLabel" v-bind="{ ...ctx, group }">
                  <div class="f-caption">{{ group.label }}</div>
                </slot>
              </DropdownMenuLabel>
              <template v-for="item in group.items" :key="item.label">
                <slot name="item" v-bind="{ ...ctx, item }">
                  <DropdownMenuItem
                    class="f-dropdown-menu-item"
                    v-bind="settings.item(item)"
                  >
                    <slot name="itemIcon" v-bind="{ ...ctx, item }">
                      <Icon
                        v-if="item.icon"
                        class="f-icon"
                        fill="currentColor"
                        :name="item.icon"
                      />
                    </slot>
                    <slot name="itemLabel" v-bind="{ ...ctx, item }">
                      <span class="f-span">{{ item.label }}</span>
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
