import { createConfigForNuxt } from "@nuxt/eslint-config/flat";

export default createConfigForNuxt({
  features: {
    tooling: true,
    stylistic: false,
    typescript: true,
  },
  dirs: {
    src: [
      "./apps/*/app",
      "./layers/*/app",
      "./packages/*/src",
      "./packages/*/runtime",
    ],
    pages: [
      "./apps/*/app/pages",
      "./layers/*/app/pages",
    ],
    layouts: [
      "./apps/*/app/layouts",
      "./layers/*/app/layouts",
    ],
    components: [
      "./apps/*/app/components",
      "./layers/*/app/components",
    ],
  },
}).append(
  {
    ignores: [
      "**/node_modules/**",
      "**/.nuxt/**",
      "**/.output/**",
      "**/dist/**",
      "**/.nitro/**",
    ],
  },
  {
    rules: {
      // Allow single-word component names (design system components)
      "vue/multi-word-component-names": "off",
      // Vue 3 allows multiple root elements
      "vue/no-multiple-template-root": "off",
      // Optional props without defaults are fine
      "vue/require-default-prop": "off",
      // Allow @ts-ignore for runtime module imports
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },
);
