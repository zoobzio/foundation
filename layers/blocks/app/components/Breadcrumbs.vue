<script lang="ts">
export interface BreadcrumbItem {
  label: string;
  to: string;
  icon?: IconAlias;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: IconAlias;
  tokens?: Tokens<
    | "breadcrumbs-root"
    | "breadcrumbs-list"
    | "breadcrumbs-item"
    | "breadcrumbs-link"
    | "breadcrumbs-current"
  >;
}
</script>

<script setup lang="ts">
const {
  items,
  separator = "chevron-right",
  tokens,
} = defineProps<BreadcrumbsProps>();

const styles = useTokenStyle(tokens);

const isLast = (index: number) => index === items.length - 1;
</script>

<template>
  <nav
    aria-label="Breadcrumb"
    :style="styles['breadcrumbs-root']"
    class="f-breadcrumbs-root"
  >
    <ol :style="styles['breadcrumbs-list']" class="f-breadcrumbs-list">
      <li
        v-for="(item, index) in items"
        :key="item.to"
        :style="styles['breadcrumbs-item']"
        class="f-breadcrumbs-item"
      >
        <span
          v-if="isLast(index)"
          :style="styles['breadcrumbs-current']"
          class="f-breadcrumbs-current"
        >
          <slot
            name="item"
            :item="item"
            :index="index"
            :is-last="true"
          >
            <Icon v-if="item.icon" :alias="item.icon" />
            {{ item.label }}
          </slot>
        </span>
        <NuxtLink
          v-else
          :to="item.to"
          :style="styles['breadcrumbs-link']"
          class="f-breadcrumbs-link"
        >
          <slot
            name="item"
            :item="item"
            :index="index"
            :is-last="false"
          >
            <Icon v-if="item.icon" :alias="item.icon" />
            {{ item.label }}
          </slot>
        </NuxtLink>

        <slot v-if="!isLast(index)" name="separator">
          <Icon
            :alias="separator"
            :tokens="{ icon: { text: 'ref-slate-500' } }"
          />
        </slot>
      </li>
    </ol>
  </nav>
</template>
