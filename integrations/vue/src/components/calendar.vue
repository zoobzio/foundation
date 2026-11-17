<script lang="ts">
import type {
  CalendarContext,
  CalendarEmits,
  CalendarPassthrough,
  CalendarProps,
  CalendarSlots,
} from "../types/components/calendar";

import Autocomplete from "./autocomplete.vue";
import Fab from "./fab.vue";
import Primitive from "./primitive.vue";

import { ToolbarButton, ToolbarRoot, ToolbarSeparator } from "reka-ui";

import { useTemplateRef } from "vue";
import { useServiceEmits } from "../composables/events";
import { useRefs } from "../composables/ref";
import { useCalendar } from "../composables/calendar";
import { usePassthrough } from "../composables/passthrough";
import { useContext } from "../composables/context";
import {
  CALENDAR_EMPTY_TEXT,
  CALENDAR_EVENTS,
  CALENDAR_HEADING_GROUP,
  CALENDAR_REFRESH_LABEL,
  CALENDAR_SEARCH_PLACEHOLDER,
  CALENDAR_UNTITLED_LABEL,
} from "../constants/calendar";
</script>

<script setup lang="ts" generic="I, O">
const { service, pt } = defineProps<CalendarProps<I, O>>();

const emit = defineEmits<CalendarEmits<O>>();

useServiceEmits(service, CALENDAR_EVENTS, emit);

const el = useTemplateRef<HTMLDivElement>("el");

const { view, loading, selected, occurrences } = useRefs(service);

const { tools, groups, heading, weekdays, days, weeks, time, open } =
  useCalendar(service);

const settings = usePassthrough<CalendarPassthrough>(() => ({
  pt,
  recipes: {
    search: {
      as: Autocomplete,
      service: service.query,
      placeholder: CALENDAR_SEARCH_PLACEHOLDER,
    },
    refresh: {
      as: Fab,
      label: CALENDAR_REFRESH_LABEL,
      onClick: () => service.fetch(),
    },
    toolbar: {},
    separator: () => ({}),
    tool: (tool) => ({
      as: Fab,
      class: "f-data-calendar-tool",
      "data-tool": tool.key,
      "data-group": tool.group,
      label: tool.label,
      type: "button",
      "aria-pressed": tool.kind === "toggle" ? tool.active : undefined,
      disabled: tool.disabled,
      onClick: () => tool.run(),
    }),
    grid: {},
    agenda: {},
    weekday: (weekday) => ({ scope: "col", abbr: weekday.name }),
    day: () => ({}),
    dayLabel: (day) => ({
      type: "button",
      "aria-label": day.name,
      "aria-current": day.today ? "date" : undefined,
      onClick: () => open(day.date),
    }),
    occurrence: (occurrence) => ({
      type: "button",
      "aria-pressed": occurrence.key === selected.value,
      onClick: () => service.select(occurrence.key),
    }),
  },
}));

const ctx = useContext<CalendarContext<I, O>>("calendar", () => ({
  calendar: service,
  heading: heading.value,
  weekdays: weekdays.value,
  weeks: weeks.value,
  days: days.value,
  tools: tools.value,
  groups: groups.value,
  time,
  open,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<CalendarSlots<I, O>>();
</script>

<template>
  <div
    ref="el"
    class="f-group f-data-calendar"
    :data-view="view"
    :data-loading="loading || undefined"
  >
    <slot name="controls" v-bind="ctx">
      <div class="f-group f-data-calendar-controls">
        <slot v-if="service.searchable" name="search" v-bind="ctx">
          <Primitive v-bind="settings.search" class="f-data-calendar-search" />
        </slot>
        <slot name="refresh" v-bind="ctx">
          <Primitive v-bind="settings.refresh" />
        </slot>
      </div>
    </slot>

    <div class="f-group f-data-calendar-body">
      <slot name="toolbar" v-bind="ctx">
        <ToolbarRoot
          class="f-group f-data-calendar-toolbar"
          v-bind="settings.toolbar"
        >
          <slot name="toolbarPrepend" v-bind="ctx" />
          <template v-for="(group, index) in groups" :key="group.name">
            <slot v-if="index > 0" name="separator" v-bind="{ ...ctx, group }">
              <ToolbarSeparator
                class="f-data-calendar-separator"
                v-bind="settings.separator(group)"
              />
            </slot>
            <template v-for="tool in group.tools" :key="tool.key">
              <slot name="tool" v-bind="{ ...ctx, tool }">
                <ToolbarButton
                  as-child
                  :disabled="settings.tool(tool).disabled"
                >
                  <Primitive v-bind="settings.tool(tool)">
                    <slot name="toolPrepend" v-bind="{ ...ctx, tool }" />
                    <slot name="toolLabel" v-bind="{ ...ctx, tool }">
                      <span class="f-span">{{ tool.label }}</span>
                    </slot>
                    <slot name="toolAppend" v-bind="{ ...ctx, tool }" />
                  </Primitive>
                </ToolbarButton>
              </slot>
            </template>
            <slot
              v-if="group.name === CALENDAR_HEADING_GROUP"
              name="heading"
              v-bind="ctx"
            >
              <h2 class="f-h2 f-data-calendar-heading" aria-live="polite">
                {{ heading }}
              </h2>
            </slot>
          </template>
          <slot name="toolbarAppend" v-bind="ctx" />
        </ToolbarRoot>
      </slot>

      <ol
        v-if="view === 'agenda'"
        class="f-ol f-data-calendar-agenda"
        v-bind="settings.agenda"
      >
        <template v-for="day in days" :key="day.date">
          <li
            v-if="day.occurrences.length"
            class="f-li f-data-calendar-day"
            :data-date="day.date"
            :data-today="day.today || undefined"
            v-bind="settings.day(day)"
          >
            <slot name="day" v-bind="{ ...ctx, day }">
              <slot name="dayLabel" v-bind="{ ...ctx, day }">
                <button
                  class="f-button f-data-calendar-day-label"
                  v-bind="settings.dayLabel(day)"
                >
                  {{ day.name }}
                </button>
              </slot>
              <ul class="f-ul f-data-calendar-occurrences">
                <li
                  v-for="occurrence in day.occurrences"
                  :key="occurrence.key"
                  class="f-li f-data-calendar-occurrence-item"
                >
                  <slot name="occurrence" v-bind="{ ...ctx, day, occurrence }">
                    <button
                      class="f-button f-data-calendar-occurrence"
                      :data-key="occurrence.key"
                      :data-type="occurrence.entry['@type']"
                      :data-all-day="occurrence.allDay || undefined"
                      :data-selected="occurrence.key === selected || undefined"
                      v-bind="settings.occurrence(occurrence)"
                    >
                      <slot
                        name="occurrenceTime"
                        v-bind="{ ...ctx, day, occurrence }"
                      >
                        <time
                          v-if="!occurrence.allDay"
                          class="f-time f-data-calendar-occurrence-time"
                          :datetime="occurrence.start"
                        >
                          {{ time(occurrence) }}
                        </time>
                      </slot>
                      <slot
                        name="occurrenceLabel"
                        v-bind="{ ...ctx, day, occurrence }"
                      >
                        <span class="f-span">
                          {{
                            occurrence.entry.title || CALENDAR_UNTITLED_LABEL
                          }}
                        </span>
                      </slot>
                    </button>
                  </slot>
                </li>
              </ul>
            </slot>
          </li>
        </template>
        <li v-if="!occurrences.length" class="f-li f-data-calendar-empty">
          <slot name="empty" v-bind="ctx">
            <span class="f-span">{{ CALENDAR_EMPTY_TEXT }}</span>
          </slot>
        </li>
      </ol>

      <table v-else class="f-table f-data-calendar-grid" v-bind="settings.grid">
        <thead class="f-thead f-data-calendar-weekdays">
          <tr class="f-tr">
            <th
              v-for="weekday in weekdays"
              :key="weekday.key"
              class="f-th f-data-calendar-weekday"
              v-bind="settings.weekday(weekday)"
            >
              <slot name="weekday" v-bind="{ ...ctx, weekday }">
                {{ weekday.label }}
              </slot>
            </th>
          </tr>
        </thead>
        <tbody class="f-tbody">
          <tr
            v-for="week in weeks"
            :key="week[0]?.date"
            class="f-tr f-data-calendar-week"
          >
            <td
              v-for="day in week"
              :key="day.date"
              class="f-td f-data-calendar-day"
              :data-date="day.date"
              :data-today="day.today || undefined"
              :data-outside="day.outside || undefined"
              v-bind="settings.day(day)"
            >
              <slot name="day" v-bind="{ ...ctx, day }">
                <slot name="dayLabel" v-bind="{ ...ctx, day }">
                  <button
                    class="f-button f-data-calendar-day-label"
                    v-bind="settings.dayLabel(day)"
                  >
                    {{ day.label }}
                  </button>
                </slot>
                <ul
                  v-if="day.occurrences.length"
                  class="f-ul f-data-calendar-occurrences"
                >
                  <li
                    v-for="occurrence in day.occurrences"
                    :key="occurrence.key"
                    class="f-li f-data-calendar-occurrence-item"
                  >
                    <slot
                      name="occurrence"
                      v-bind="{ ...ctx, day, occurrence }"
                    >
                      <button
                        class="f-button f-data-calendar-occurrence"
                        :data-key="occurrence.key"
                        :data-type="occurrence.entry['@type']"
                        :data-all-day="occurrence.allDay || undefined"
                        :data-selected="
                          occurrence.key === selected || undefined
                        "
                        v-bind="settings.occurrence(occurrence)"
                      >
                        <slot
                          name="occurrenceTime"
                          v-bind="{ ...ctx, day, occurrence }"
                        >
                          <time
                            v-if="!occurrence.allDay"
                            class="f-time f-data-calendar-occurrence-time"
                            :datetime="occurrence.start"
                          >
                            {{ time(occurrence) }}
                          </time>
                        </slot>
                        <slot
                          name="occurrenceLabel"
                          v-bind="{ ...ctx, day, occurrence }"
                        >
                          <span class="f-span">
                            {{
                              occurrence.entry.title || CALENDAR_UNTITLED_LABEL
                            }}
                          </span>
                        </slot>
                      </button>
                    </slot>
                  </li>
                </ul>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
