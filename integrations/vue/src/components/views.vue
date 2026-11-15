<script lang="ts">
import type {
  ViewsAction,
  ViewsContext,
  ViewsEmits,
  ViewsNaming,
  ViewsPassthrough,
  ViewsProps,
  ViewsSlots,
  ViewsTab,
} from "../types/components/views";
import type { MenuGroup } from "../types/components/menu";
import type { Intent, Resolution } from "@zoobzio/views";

import Dialog from "./dialog.vue";
import Fab from "./fab.vue";
import Menu from "./menu.vue";
import Tabs from "./tabs.vue";

import Primitive from "./primitive.vue";

import { computed, ref, useId, useTemplateRef, watchEffect } from "vue";
import { useServiceEmits } from "../composables/events";
import { usePassthrough } from "../composables/passthrough";
import { useContext } from "../composables/context";
import {
  VIEWS_ACTION_LABELS,
  VIEWS_CANCEL_LABEL,
  VIEWS_CONFIRM_DESCRIPTIONS,
  VIEWS_CONFIRM_TITLES,
  VIEWS_DRIFTED_LABEL,
  VIEWS_EVENTS,
  VIEWS_MENU_LABEL,
  VIEWS_NAME_LABEL,
  VIEWS_NAMING_DESCRIPTION,
  VIEWS_NAMING_TITLES,
  VIEWS_PROCEED_LABELS,
  VIEWS_SAVE_LABEL,
} from "../constants/views";
</script>

<script setup lang="ts" generic="P">
const { service, pt } = defineProps<ViewsProps<P>>();

const emit = defineEmits<ViewsEmits<P>>();

useServiceEmits(service, VIEWS_EVENTS, emit);

const el = useTemplateRef<HTMLDivElement>("el");
const id = useId();

/** The name being typed in the naming dialog, while it is open. */
const naming = ref<ViewsNaming | null>(null);
/** What the naming dialog is for, or was, so it keeps its text as it closes. */
const mode = ref<ViewsNaming["mode"]>("saveAs");
watchEffect(() => {
  if (naming.value) mode.value = naming.value.mode;
});
/** The name typed in the confirmation, for the view a save would make. */
const name = ref("");

/**
 * A rejection is the service's to report: it emits `failed` before it
 * throws, and the state is left as it was, so the dialog stays open.
 */
const settle = (work: Promise<unknown>): void => {
  work.catch(() => {});
};

const tabs = computed<ViewsTab[]>(() => {
  const drifted = service.drifted;
  return service.views.map((view) => ({
    value: view.id,
    label: view.name,
    origin: view.origin,
    drifted: drifted && view.id === service.active,
  }));
});

const groups = computed<MenuGroup<ViewsAction>[]>(() => {
  const { drifted, editable, saving } = service;
  const item = (key: ViewsAction["key"], enabled: boolean): ViewsAction => ({
    key,
    label: VIEWS_ACTION_LABELS[key],
    disabled: saving || !enabled,
  });
  return [
    {
      key: "edit",
      items: [
        item("save", editable && drifted),
        item("saveAs", service.initialized),
        item("rename", editable),
        item("revert", drifted),
      ],
    },
    { key: "remove", items: [item("remove", editable)] },
  ];
});

const act = ({ key }: ViewsAction): void => {
  const current = service.current;
  if (key === "save") settle(service.save());
  else if (key === "saveAs") naming.value = { mode: "saveAs", name: "" };
  else if (key === "revert") settle(service.revert());
  else if (!current) return;
  else if (key === "rename") {
    naming.value = { mode: "rename", name: current.name };
  } else settle(service.remove(current.id));
};

/** Stores the name typed in the naming dialog, and closes it. */
const commit = (): void => {
  const held = naming.value;
  if (!held || !held.name.trim()) return;
  const work =
    held.mode === "saveAs"
      ? service.saveAs(held.name)
      : service.rename(service.active ?? "", held.name);
  settle(
    work.then(() => {
      naming.value = null;
    }),
  );
};

/**
 * The kind of the pending intent, or of the last one, so the dialog keeps
 * its text while it closes.
 */
const kind = ref<Intent["kind"]>("select");
watchEffect(() => {
  if (service.pending) kind.value = service.pending.kind;
});

/** Whether a save of the pending intent makes a new view, which needs a name. */
const copies = computed(
  () => service.pending?.kind === "select" && !service.editable,
);

const resolve = (resolution: Resolution): void => {
  if (resolution === "save" && copies.value && !name.value.trim()) return;
  settle(
    service.resolve(resolution, name.value).then(() => {
      name.value = "";
    }),
  );
};

const settings = usePassthrough<ViewsPassthrough>(() => ({
  pt,
  recipes: {
    tabs: {
      as: Tabs,
      tabs: tabs.value,
      modelValue: service.active ?? undefined,
      "onUpdate:modelValue": (view) => settle(service.select(view)),
    },
    menu: {
      as: Menu,
      groups: groups.value,
      align: "end",
      onSelect: act,
    },
    trigger: { as: Fab, label: VIEWS_MENU_LABEL },
    confirm: (intent) => ({
      as: Dialog,
      open: service.pending !== null,
      title: VIEWS_CONFIRM_TITLES[intent],
      description: VIEWS_CONFIRM_DESCRIPTIONS[intent],
      "onUpdate:open": (open) => {
        if (!open) resolve("cancel");
      },
    }),
    naming: (mode) => ({
      as: Dialog,
      open: naming.value !== null,
      title: VIEWS_NAMING_TITLES[mode],
      description: VIEWS_NAMING_DESCRIPTION,
      "onUpdate:open": (open) => {
        if (!open) naming.value = null;
      },
    }),
  },
}));

const ctx = useContext<ViewsContext<P>>("views", () => ({
  views: service,
  tabs: tabs.value,
  groups: groups.value,
  naming,
  name,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });

const slots = defineSlots<ViewsSlots<P>>();
</script>

<template>
  <div
    ref="el"
    class="f-group f-views"
    :class="{ 'f-views-drifted': service.drifted }"
  >
    <Primitive v-bind="settings.tabs" class="f-views-tabs">
      <template v-if="slots.tabPrepend" #triggerPrepend="{ option }">
        <slot name="tabPrepend" v-bind="{ ...ctx, option }" />
      </template>
      <template v-if="slots.tabLabel" #triggerLabel="{ option }">
        <slot name="tabLabel" v-bind="{ ...ctx, option }" />
      </template>
      <template #triggerAppend="{ option }">
        <slot name="badge" v-bind="{ ...ctx, option }">
          <span
            v-if="option.drifted"
            class="f-span f-views-badge"
            role="img"
            :aria-label="VIEWS_DRIFTED_LABEL"
          />
        </slot>
      </template>
    </Primitive>

    <Primitive v-bind="settings.menu" class="f-views-menu">
      <slot name="trigger" v-bind="ctx">
        <Primitive v-bind="settings.trigger" />
      </slot>
      <template v-if="slots.actionPrepend" #itemPrepend="{ item }">
        <slot name="actionPrepend" v-bind="{ ...ctx, item }" />
      </template>
      <template v-if="slots.actionLabel" #itemLabel="{ item }">
        <slot name="actionLabel" v-bind="{ ...ctx, item }" />
      </template>
      <template v-if="slots.actionAppend" #itemAppend="{ item }">
        <slot name="actionAppend" v-bind="{ ...ctx, item }" />
      </template>
    </Primitive>

    <Primitive v-bind="settings.confirm(kind)">
      <form
        class="f-form f-views-confirm"
        @submit.prevent="resolve(kind === 'select' ? 'save' : 'proceed')"
      >
        <template v-if="copies">
          <label class="f-label" :for="`${id}-copy`">
            <slot name="nameLabel" v-bind="ctx">{{ VIEWS_NAME_LABEL }}</slot>
          </label>
          <input
            :id="`${id}-copy`"
            v-model="name"
            type="text"
            class="f-input f-views-name"
          />
        </template>
        <div class="f-group f-views-buttons">
          <button
            type="button"
            class="f-button f-views-cancel"
            @click="resolve('cancel')"
          >
            <slot name="cancelLabel" v-bind="ctx">{{
              VIEWS_CANCEL_LABEL
            }}</slot>
          </button>
          <button
            type="button"
            class="f-button f-views-proceed"
            :disabled="service.saving"
            @click="resolve('proceed')"
          >
            <slot name="proceedLabel" v-bind="{ ...ctx, kind }">
              {{ VIEWS_PROCEED_LABELS[kind] }}
            </slot>
          </button>
          <button
            v-if="kind === 'select'"
            type="submit"
            class="f-button f-views-save"
            :disabled="service.saving || (copies && !name.trim())"
          >
            <slot name="saveLabel" v-bind="ctx">{{ VIEWS_SAVE_LABEL }}</slot>
          </button>
        </div>
      </form>
    </Primitive>

    <Primitive v-bind="settings.naming(mode)">
      <form
        v-if="naming"
        class="f-form f-views-naming"
        @submit.prevent="commit()"
      >
        <label class="f-label" :for="`${id}-name`">
          <slot name="nameLabel" v-bind="ctx">{{ VIEWS_NAME_LABEL }}</slot>
        </label>
        <input
          :id="`${id}-name`"
          v-model="naming.name"
          type="text"
          class="f-input f-views-name"
        />
        <div class="f-group f-views-buttons">
          <button
            type="button"
            class="f-button f-views-cancel"
            @click="naming = null"
          >
            <slot name="cancelLabel" v-bind="ctx">{{
              VIEWS_CANCEL_LABEL
            }}</slot>
          </button>
          <button
            type="submit"
            class="f-button f-views-save"
            :disabled="service.saving || !naming.name.trim()"
          >
            <slot name="saveLabel" v-bind="ctx">{{ VIEWS_SAVE_LABEL }}</slot>
          </button>
        </div>
      </form>
    </Primitive>
  </div>
</template>
