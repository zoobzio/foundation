<script setup lang="ts">
// TopBar component for content layouts
// Provides logo, navigation, and actions sections
</script>

<template>
  <Header>
    <slot name="logo"> Logo </slot>
    <Nav>
      <slot name="navigation"> Navigation </slot>
    </Nav>
    <slot name="actions">
      <Group :tokens="{ group: { 'margin-left': 'ref-auto' } }">
        <Button>
          <Icon alias="translate" />
        </Button>
        <Button>
          <Icon alias="theme" />
        </Button>
        <Button>
          <Icon alias="dark" />
        </Button>
      </Group>
    </slot>
  </Header>
</template>
