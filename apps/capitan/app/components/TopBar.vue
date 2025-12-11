<script setup lang="ts">
const appConfig = useAppConfig();
</script>

<template>
  <Header>
    <span>{{ appConfig.title }}</span>
    <Nav />
    <Group :tokens="{ group: { 'margin-left': 'ref-auto' } }">
      <Search />
      <Button>
        <Icon alias="github" />
      </Button>
      <ColorMode />
    </Group>
  </Header>
</template>
