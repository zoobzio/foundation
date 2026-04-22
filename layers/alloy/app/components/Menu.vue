<script lang="ts">
import type { MenuProps, MenuEmits, MenuItem } from "../types/menu";
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
</script>

<script setup lang="ts">
const {
  groups,
  side = "bottom",
  align = "center",
  sideOffset = 10,
  alignOffset = 0,
  pt,
} = defineProps<MenuProps>();

const emit = defineEmits<MenuEmits>();

const el = useTemplateRef("el");
defineExpose({ el });

const open = defineModel<boolean>("open", { default: false });

const onSelect = (item: MenuItem) => {
  emit("select", item);
};

const ctx = computed(() => ({ groups, open: open.value }));
</script>

<template>
  <DropdownMenuRoot ref="el" v-model:open="open">
    <DropdownMenuTrigger as-child>
      <slot v-bind="ctx" />
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent
        :side="side"
        :align="align"
        :side-offset="sideOffset"
        :align-offset="alignOffset"
        v-bind="pt?.content"
        class="f-menu-content"
      >
        <template v-for="(group, groupIndex) in groups" :key="group.key">
          <DropdownMenuSeparator
            v-if="groupIndex > 0"
            class="f-menu-separator"
          />
          <DropdownMenuGroup>
            <DropdownMenuLabel v-if="group.label" as-child>
              <Caption>{{ group.label }}</Caption>
            </DropdownMenuLabel>
            <DropdownMenuItem
              v-for="item in group.items"
              :key="item.label"
              :disabled="item.disabled"
              class="f-menu-item"
              @select="onSelect(item)"
            >
              <Icon v-if="item.icon" :alias="item.icon" />
              <Span class="f-menu-item-label">{{ item.label }}</Span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </template>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
