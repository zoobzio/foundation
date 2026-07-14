<script lang="ts">
import type { PaginationProps, PaginationEmits } from "#foundation/types/core/pagination";
</script>

<script setup lang="ts">
import { computed, useTemplateRef } from "#imports";
import { usePassthrough } from "#foundation/composables/passthrough";
import type { IconAlias } from "#foundation/types/common/iconic";
import { Pagination } from "#foundation/utils/pagination";
import { PAGE_SIZE_OPTIONS } from "#foundation/constants/common/pagination";
import Button from "#foundation/components/common/Button.vue";
import Fab from "#foundation/components/core/Fab.vue";
import Group from "#foundation/components/common/Group.vue";
import Select from "#foundation/components/core/Select.vue";
import Span from "#foundation/components/common/Span.vue";
const { page, pageSize, pageCount, total, goToPage, pt } = defineProps<PaginationProps>();

const emit = defineEmits<PaginationEmits>();

const el = useTemplateRef("el");
defineExpose({ el });

const hasPrev = computed(() => page > 1);
const hasNext = computed(() => page < pageCount);

const first = () => goToPage(1);
const prev = () => goToPage(page - 1);
const next = () => goToPage(page + 1);
const last = () => goToPage(pageCount);

const pageSizeModel = computed({
  get: () => String(pageSize),
  set: (v) => emit("update:pageSize", Number(v)),
});

const pageNumbers = computed(() => Pagination.paginate(page, pageCount));

const rootPT = usePassthrough(pt?.root, { props: {}, handlers: {} });
const infoPT = usePassthrough(pt?.info, { props: {}, handlers: {} });
const pagesPT = usePassthrough(pt?.pages, { props: {}, handlers: {} });
const firstPT = usePassthrough(pt?.first, () => ({ props: { disabled: !hasPrev.value, icon: "chevron-first" as IconAlias }, handlers: { click: first } }));
const prevPT = usePassthrough(pt?.prev, () => ({ props: { disabled: !hasPrev.value, icon: "chevron-left" as IconAlias }, handlers: { click: prev } }));
const nextPT = usePassthrough(pt?.next, () => ({ props: { disabled: !hasNext.value, icon: "chevron-right" as IconAlias }, handlers: { click: next } }));
const lastPT = usePassthrough(pt?.last, () => ({ props: { disabled: !hasNext.value, icon: "chevron-last" as IconAlias }, handlers: { click: last } }));
const numbersPT = usePassthrough(pt?.numbers, { props: {}, handlers: {} });
const numberPT = usePassthrough(pt?.number, { props: { type: "button" as const }, handlers: {} });
const pageSizePT = usePassthrough(pt?.pageSize, () => ({
  props: { modelValue: pageSizeModel.value, options: PAGE_SIZE_OPTIONS },
  handlers: { "update:modelValue": (v: string) => { pageSizeModel.value = v; } },
}));

const ctx = computed(() => ({ page, pageSize, pageCount, total, hasPrev: hasPrev.value, hasNext: hasNext.value, pageNumbers: pageNumbers.value }));
</script>

<template>
  <Group ref="el" v-bind="rootPT.props" class="f-pagination" v-on="rootPT.handlers">
    <slot name="info" v-bind="ctx">
      <Span v-bind="infoPT.props" class="f-pagination-info" v-on="infoPT.handlers">
        Page {{ page }} of {{ pageCount }} ({{ total }} results)
      </Span>
    </slot>

    <slot name="pages" v-bind="ctx">
      <Group v-bind="pagesPT.props" class="f-pagination-pages" v-on="pagesPT.handlers">
        <slot name="first" v-bind="ctx">
          <Fab v-bind="firstPT.props" v-on="firstPT.handlers" />
        </slot>
        <slot name="prev" v-bind="ctx">
          <Fab v-bind="prevPT.props" v-on="prevPT.handlers" />
        </slot>

        <slot name="numbers" v-bind="ctx">
          <Group v-bind="numbersPT.props" class="f-pagination-numbers" v-on="numbersPT.handlers">
            <slot v-for="(p, i) in pageNumbers" name="number" v-bind="{ ...ctx, page: p }">
              <Button
                :key="i"
                v-bind="{ ...numberPT.props, disabled: p === '...' || p === page, 'data-selected': p === page ? '' : undefined }"
                class="f-pagination-number"
                v-on="numberPT.handlers"
                @click="typeof p === 'number' && goToPage(p)"
              >
                {{ p }}
              </Button>
            </slot>
          </Group>
        </slot>

        <slot name="next" v-bind="ctx">
          <Fab v-bind="nextPT.props" v-on="nextPT.handlers" />
        </slot>
        <slot name="last" v-bind="ctx">
          <Fab v-bind="lastPT.props" v-on="lastPT.handlers" />
        </slot>
      </Group>
    </slot>

    <slot name="pageSize" v-bind="ctx">
      <Select
        v-bind="pageSizePT.props"
        v-on="pageSizePT.handlers"
      />
    </slot>
  </Group>
</template>
