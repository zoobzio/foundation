---
title: Installation
description: Learn how to install Foundation in your Nuxt project.
author: Foundation Team
published: 2025-01-12
tags: [Getting Started, Setup]
---

# Installation

Learn how to install Foundation in your Nuxt project.

## Prerequisites

Before installing Foundation, ensure you have:

- Node.js 18 or higher
- pnpm (recommended) or npm

## Installation Steps

### 1. Add the dependency

```bash
pnpm add @foundation/blocks @foundation/prose
```

### 2. Configure Nuxt

Add Foundation to your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  extends: ["@foundation/prose"],
});
```

### 3. Set up your theme

Create a theme configuration with your design tokens.

## Next Steps

Once installed, check out the quick start guide to build your first page.
