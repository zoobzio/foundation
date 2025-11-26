<script setup lang="ts">
definePageMeta({
  layout: "collection",
});

const route = useRoute();
const appConfig = useAppConfig();

const collection = computed(() => route.params.collection as string);

// Get collection config from app.config
const collectionConfig = computed(() =>
  appConfig.collections?.find(
    (c: { key: string }) => c.key === collection.value,
  ),
);
</script>

<template>
  <Nav
    :tokens="{
      nav: {
        'border-right-width': 'ref-hairline',
        'border-right-style': 'ref-border-style-solid',
        'border-color': 'sys-outline',
      },
    }"
  >
    <Aside>
      <ContentFilters :collection="collection" />
    </Aside>
  </Nav>
  <Section>
    <Article>
      <H1>{{ collectionConfig?.title || collection }}</H1>
      <P v-if="collectionConfig?.description">
        {{ collectionConfig.description }}
      </P>
    </Article>
    <Hr
      :tokens="{
        hr: { 'margin-top': 'ref-none', 'margin-bottom': 'ref-none' },
      }"
    />
    <Group :tokens="{ group: { 'justify-content': 'ref-justify-between' } }">
      <span>Test</span>
      <span>Banana</span>
    </Group>
    <ContentGrid :collection="collection" />
  </Section>
</template>
