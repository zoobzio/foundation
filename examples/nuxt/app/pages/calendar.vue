<script setup lang="ts">
import type { Scope } from "@zoobzio/calendar";

import { Calendar, NuxtLink } from "#components";
import { useUntheme } from "#imports";
import { computed } from "vue";
import { useTeam } from "~/composables/team";

const untheme = useUntheme();
const dark = computed(() => untheme.config.input.color === "dark");
const toggle = () => untheme.swap("color", dark.value ? "light" : "dark");

const team = useTeam();
await team.init();

const picked = computed(() =>
  team.selected === null ? undefined : team.occurrence(team.selected),
);

const recurring = computed(() => picked.value?.recurrenceId !== undefined);

const when = computed(() => {
  const occurrence = picked.value;
  if (!occurrence) return "";
  const format = new Intl.DateTimeFormat(team.context.locale, {
    dateStyle: "full",
    timeStyle: occurrence.allDay ? undefined : "short",
    timeZone: team.context.timeZone,
  });
  return format.formatRange(
    new Date(occurrence.start),
    // An all-day occurrence ends at the midnight after its last day.
    new Date(Date.parse(occurrence.end) - (occurrence.allDay ? 1 : 0)),
  );
});

const rename = async (scope?: Scope) => {
  const occurrence = picked.value;
  if (!occurrence) return;
  const title = `${occurrence.entry.title ?? "Untitled"} ★`;
  await team.update(occurrence.key, { title }, scope);
};

const remove = async (scope?: Scope) => {
  const occurrence = picked.value;
  if (!occurrence) return;
  team.select(null);
  await team.remove(occurrence.key, scope);
};

const add = async () => {
  const stamp = `${new Date().toISOString().slice(0, 19)}Z`;
  await team.create({
    "@type": "Event",
    uid: crypto.randomUUID(),
    updated: stamp,
    title: "New event",
    start: `${team.date}T15:00:00`,
    duration: "PT1H",
  });
};
</script>

<template>
  <div class="page page-wide">
    <header class="page-header">
      <div>
        <h1 class="page-title">Calendar</h1>
        <p class="page-lead">
          The calendar of the foundation layer over a fake backend: recurring
          events, an occurrence that moved, all-day spans, and a task.
          <NuxtLink to="/">The editor</NuxtLink>,
          <NuxtLink to="/browser">the browser</NuxtLink>, and
          <NuxtLink to="/table">the table</NuxtLink> are the other pages.
        </p>
      </div>
      <button type="button" class="page-scheme" @click="toggle">
        {{ dark ? "Light" : "Dark" }}
      </button>
    </header>

    <section class="demo">
      <Calendar :service="team" />
    </section>

    <section class="output">
      <h2 class="output-title">Selected</h2>
      <div v-if="picked" class="detail">
        <p class="detail-title">
          {{ picked.entry.title ?? "Untitled" }}
          <span class="detail-type">{{ picked.entry["@type"] }}</span>
        </p>
        <p class="detail-when">{{ when }}</p>
        <div class="detail-actions">
          <template v-if="recurring">
            <button type="button" @click="rename('one')">Star this one</button>
            <button type="button" @click="rename('following')">
              Star this and following
            </button>
            <button type="button" @click="rename('all')">Star all</button>
            <button type="button" @click="remove('one')">
              Remove this one
            </button>
            <button type="button" @click="remove('following')">
              Remove this and following
            </button>
            <button type="button" @click="remove('all')">Remove all</button>
          </template>
          <template v-else>
            <button type="button" @click="rename()">Star</button>
            <button type="button" @click="remove()">Remove</button>
          </template>
        </div>
        <pre class="output-code"><code>{{ picked.entry }}</code></pre>
      </div>
      <p v-else class="page-lead">
        Press an occurrence to select it, or
        <button type="button" class="detail-add" @click="add">
          add an event at 3 PM on {{ team.date }}</button
        >.
      </p>
    </section>
  </div>
</template>
