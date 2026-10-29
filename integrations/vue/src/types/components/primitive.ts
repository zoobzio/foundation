import type { Component } from "vue";

/**
 * Props of the primitive: `as`, the component rendered. The rest of what
 * the primitive receives is handed to that component as its props and
 * listeners, and the parent's slots reach it whole, named ones included.
 */
export type PrimitiveProps = {
  as: Component;
};
