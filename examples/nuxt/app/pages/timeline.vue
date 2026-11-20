<script setup lang="ts">
import { Timeline } from "#components";
import { computed } from "vue";
import { push, useHistory } from "~/composables/history";

const history = useHistory();
await history.init();

const picked = computed(() =>
  history.selected === null ? undefined : history.record(history.selected),
);

/** Makes a commit on the backend, then reads the history again from the top. */
const commit = async () => {
  const made = push();
  await history.fetch();
  history.select(made.sha);
};
</script>

<template>
  <div class="page">
    <header class="page-header">
      <div>
        <h1 class="page-title">Timeline</h1>
        <p class="page-lead">
          The timeline of the foundation layer over a fake backend: a commit
          history, the latest first, a card per commit under the day it was
          made, loaded a batch at a time.
        </p>
      </div>
      <button type="button" class="detail-add" @click="commit">
        Push a commit
      </button>
    </header>

    <section class="demo">
      <Timeline :service="history">
        <template #recordPrepend="{ item }">
          <span class="commit-avatar" aria-hidden="true">
            {{ item.record.author.slice(0, 1) }}
          </span>
        </template>
        <template #recordAppend="{ item }">
          <span class="commit-author">{{ item.record.author }}</span>
          <code class="commit-sha">{{ item.record.sha }}</code>
        </template>
      </Timeline>
    </section>

    <section class="output">
      <h2 class="output-title">Selected</h2>
      <pre v-if="picked" class="output-code"><code>{{ picked }}</code></pre>
      <p v-else class="page-lead">Press a commit's message to select it.</p>
    </section>
  </div>
</template>
