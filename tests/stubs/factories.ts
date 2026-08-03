import { defineComponent, h, type VNode } from "vue";

/** Renders `tag` with attrs + default slot passed through. */
export const createStub = (name: string, tag = "div") =>
  defineComponent({
    name,
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      return () => h(tag, { ...attrs }, slots.default?.());
    },
  });

/** Like createStub, but calls the default slot with the given scope. */
export const createScopedStub = (name: string, slotProps: Record<string, unknown> = {}, tag = "div") =>
  defineComponent({
    name,
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      return () => h(tag, { ...attrs }, slots.default?.(slotProps));
    },
  });

/** Renders every named slot's content flat inside `tag` — for stubs whose slots must all mount. */
export const createAllSlotsStub = (name: string, tag = "div") =>
  defineComponent({
    name,
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      return () => {
        const children: VNode[] = [];
        for (const slotFn of Object.values(slots)) {
          const nodes = slotFn?.();
          if (nodes) children.push(...nodes);
        }
        return h(tag, { ...attrs }, children);
      };
    },
  });

/** Builds a stub map for reka-ui primitives (third-party — stubbed by their export names). */
export const rekaStubs = (...names: string[]) =>
  Object.fromEntries(names.map((name) => [name, createStub(name)]));
