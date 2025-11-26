<script setup lang="ts">
const navItems: NavigatorItem[] = [
  { label: "Home", to: "/" },
  {
    label: "Guides",
    value: "guides",
    children: [
      { label: "Getting Started", to: "/guides/getting-started" },
      { label: "Installation", to: "/guides/installation" },
      { label: "Configuration", to: "/guides/configuration" },
      { label: "Advanced Topics", to: "/guides/advanced" },
    ],
  },
  {
    label: "Components",
    value: "components",
    children: [
      { label: "Button", to: "/components/button" },
      { label: "Accordion", to: "/components/accordion" },
      { label: "Tabs", to: "/components/tabs" },
      { label: "Navigator", to: "/components/navigator" },
    ],
  },
  { label: "About", to: "/about" },
];

const guidesFeatured: NavigatorLink = {
  label: "Quick Start Guide",
  to: "/guides/quickstart",
  icon: "explore",
};

const componentsFeatured: NavigatorLink = {
  label: "Component Library",
  to: "/components",
  icon: "apps",
};
</script>

<template>
  <Header>
    <slot name="logo"> Logo </slot>
    <Nav>
      <slot name="navigation">
        <Navigator :items="navItems" :featured="guidesFeatured" />
      </slot>
    </Nav>
    <slot name="actions">
      <Group :tokens="{ group: { 'margin-left': 'ref-auto' } }">
        <Search />
        <Translate />
        <Theme />
        <ColorMode />
      </Group>
    </slot>
  </Header>
</template>
