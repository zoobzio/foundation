---
title: Quick Start
description: Build your first page with Foundation in minutes.
author: Foundation Team
published: 2025-01-15
tags: [Getting Started, Tutorial]
---

# Quick Start

Build your first page with Foundation in minutes.

## Create a Page

Create a new file at `app/pages/index.vue`:

```vue
<template>
  <Main>
    <Section>
      <H1>Hello Foundation</H1>
      <P>Welcome to your first Foundation page.</P>
      <Button>Get Started</Button>
    </Section>
  </Main>
</template>
```

## Add Content

Foundation integrates seamlessly with Nuxt Content. Create markdown files in `content/`:

```markdown
# My First Post

This is rendered with **Foundation** prose components.
```

## Customize Tokens

Override tokens in your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  untheme: {
    elements: {
      button: elements.button({
        background: "sys-primary",
        text: "sys-on-primary",
      }),
    },
  },
});
```

## What's Next?

Explore the component library and theming options in the guides section.
