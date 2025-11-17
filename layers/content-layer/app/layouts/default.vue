<script setup lang="ts">
// Default content layout with TopBar and trifold grid
const navigationSections = [
  {
    label: "Getting Started",
    value: "getting-started",
    items: [
      { value: "introduction", label: "Introduction" },
      { value: "installation", label: "Installation" },
      { value: "quickstart", label: "Quick Start" },
    ],
  },
  {
    label: "Guides",
    value: "guides",
    items: [
      { value: "components", label: "Components" },
      { value: "theming", label: "Theming" },
      { value: "layouts", label: "Layouts" },
    ],
  },
];
</script>

<template>
  <Main>
    <TopBar>
      <template #logo>
        <Avatar
          src="https://github.com/zoobzio.png"
          alt="zoobzio"
          fallback="Z"
        />
      </template>
    </TopBar>
    <Section>
      <Aside>
        <Accordion :items="navigationSections" type="multiple">
          <template #content="{ item }">
            <Listbox :items="item.items" />
          </template>
        </Accordion>
      </Aside>
      <slot />
      <div></div>
    </Section>
  </Main>
</template>
