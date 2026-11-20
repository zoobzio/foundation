<script lang="ts">
import type {
  TimelineContext,
  TimelineEmits,
  TimelinePassthrough,
  TimelineProps,
  TimelineSlots,
} from "../types/components/timeline";
import type { RecordData } from "@zoobzio/timeline";

import Autocomplete from "./autocomplete.vue";
import Fab from "./fab.vue";
import Menu from "./menu.vue";
import Primitive from "./primitive.vue";

import { useTemplateRef } from "vue";
import { useServiceEmits } from "../composables/events";
import { useRefs } from "../composables/ref";
import { useTimeline } from "../composables/timeline";
import { usePassthrough } from "../composables/passthrough";
import { useContext } from "../composables/context";
import { useSync } from "../composables/sync";
import { isSyncCurrent, selectSync, syncGroups } from "../utils/sync";
import {
  TIMELINE_EMPTY_TEXT,
  TIMELINE_EVENTS,
  TIMELINE_MORE_LABEL,
  TIMELINE_REFRESH_LABEL,
  TIMELINE_SEARCH_PLACEHOLDER,
} from "../constants/timeline";
</script>

<script setup lang="ts" generic="T extends RecordData">
const { service, pt } = defineProps<TimelineProps<T>>();

const emit = defineEmits<TimelineEmits<T>>();

useServiceEmits(service, TIMELINE_EVENTS, emit);

// The records are kept alive while the timeline is on screen.
useSync(() => service.sync);

const el = useTemplateRef<HTMLDivElement>("el");

const { loading, appending, initialized, more, selected, records } =
  useRefs(service);

const { groups } = useTimeline(service);

const settings = usePassthrough<TimelinePassthrough<T>>(() => ({
  pt,
  recipes: {
    search: {
      as: Autocomplete,
      service: service.query,
      placeholder: TIMELINE_SEARCH_PLACEHOLDER,
    },
    // With a sync the button is the trigger of the sync menu, which
    // refreshes at once from its first item.
    refresh: {
      as: Fab,
      label: TIMELINE_REFRESH_LABEL,
      ...(!service.sync && { onClick: () => service.fetch() }),
    },
    syncMenu: {
      as: Menu,
      groups: service.sync ? syncGroups(service.sync) : [],
      align: "end",
      // The item of the interval the sync is on is marked.
      pt: {
        item: (item) => ({
          "data-current": isSyncCurrent(service.sync, item) ? "" : undefined,
        }),
      },
      onSelect: (item) => {
        if (service.sync) selectSync(service.sync, item, () => service.fetch());
      },
    },
    groups: {},
    group: () => ({}),
    heading: () => ({}),
    record: () => ({}),
    label: (item) => ({
      type: "button",
      "aria-pressed": item.key === selected.value,
      onClick: () => service.select(item.key),
    }),
    more: {
      as: Fab,
      class: "f-data-timeline-more",
      label: TIMELINE_MORE_LABEL,
      type: "button",
      disabled: appending.value,
      onClick: () => service.loadMore(),
    },
  },
}));

const ctx = useContext<TimelineContext<T>>("timeline", () => ({
  timeline: service,
  groups: groups.value,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
const slots = defineSlots<TimelineSlots<T>>();
</script>

<template>
  <div
    ref="el"
    class="f-group f-data-timeline"
    :data-order="service.order"
    :data-loading="loading || undefined"
    :data-appending="appending || undefined"
    :data-live="service.sync?.active || undefined"
    :data-syncing="service.sync?.syncing || undefined"
  >
    <slot name="controls" v-bind="ctx">
      <div class="f-group f-data-timeline-controls">
        <slot v-if="service.searchable" name="search" v-bind="ctx">
          <Primitive v-bind="settings.search" class="f-data-timeline-search" />
        </slot>
        <Primitive v-if="service.sync" v-bind="settings.syncMenu">
          <slot name="refresh" v-bind="ctx">
            <Primitive v-bind="settings.refresh" />
          </slot>
          <template v-if="slots.syncPrepend" #itemPrepend="{ item }">
            <slot name="syncPrepend" v-bind="{ ...ctx, item }" />
          </template>
          <template v-if="slots.syncLabel" #itemLabel="{ item }">
            <slot name="syncLabel" v-bind="{ ...ctx, item }" />
          </template>
          <template v-if="slots.syncAppend" #itemAppend="{ item }">
            <slot name="syncAppend" v-bind="{ ...ctx, item }" />
          </template>
        </Primitive>
        <slot v-else name="refresh" v-bind="ctx">
          <Primitive v-bind="settings.refresh" />
        </slot>
      </div>
    </slot>

    <div class="f-group f-data-timeline-body">
      <ol
        v-if="groups.length"
        class="f-ol f-data-timeline-groups"
        v-bind="settings.groups"
      >
        <li
          v-for="group in groups"
          :key="group.id"
          class="f-li f-data-timeline-group"
          :data-group="group.key"
          :data-today="group.today || undefined"
          v-bind="settings.group(group)"
        >
          <slot name="group" v-bind="{ ...ctx, group }">
            <slot v-if="group.label" name="heading" v-bind="{ ...ctx, group }">
              <h3
                class="f-h3 f-data-timeline-heading"
                v-bind="settings.heading(group)"
              >
                <time class="f-time" :datetime="group.key">
                  {{ group.label }}
                </time>
              </h3>
            </slot>
            <ol class="f-ol f-data-timeline-records">
              <li
                v-for="item in group.items"
                :key="item.key"
                class="f-li f-data-timeline-item"
              >
                <slot name="record" v-bind="{ ...ctx, group, item }">
                  <article
                    class="f-article f-data-timeline-record"
                    :data-key="item.key"
                    :data-selected="item.key === selected || undefined"
                    v-bind="settings.record(item)"
                  >
                    <slot
                      name="recordPrepend"
                      v-bind="{ ...ctx, group, item }"
                    />
                    <button
                      class="f-button f-data-timeline-record-label"
                      v-bind="settings.label(item)"
                    >
                      <slot name="recordLabel" v-bind="{ ...ctx, group, item }">
                        <span class="f-span">{{ item.label }}</span>
                      </slot>
                    </button>
                    <slot name="recordTime" v-bind="{ ...ctx, group, item }">
                      <time
                        v-if="item.datetime"
                        class="f-time f-data-timeline-record-time"
                        :datetime="item.datetime"
                      >
                        {{ item.time }}
                      </time>
                    </slot>
                    <slot
                      name="recordAppend"
                      v-bind="{ ...ctx, group, item }"
                    />
                  </article>
                </slot>
              </li>
            </ol>
          </slot>
        </li>
      </ol>

      <p
        v-else-if="initialized && !records.length"
        class="f-p f-data-timeline-empty"
      >
        <slot name="empty" v-bind="ctx">
          <span class="f-span">{{ TIMELINE_EMPTY_TEXT }}</span>
        </slot>
      </p>

      <slot v-if="more" name="more" v-bind="ctx">
        <Primitive v-bind="settings.more" />
      </slot>
    </div>
  </div>
</template>
