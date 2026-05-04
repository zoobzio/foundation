import { defineComponent, h, type VNode } from "vue";

export const createStub = (name: string, tag = "div") =>
  defineComponent({
    name,
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      return () => h(tag, { ...attrs }, slots.default?.());
    },
  });

export const createScopedStub = (name: string, slotProps: Record<string, unknown> = {}, tag = "div") =>
  defineComponent({
    name,
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      return () => h(tag, { ...attrs }, slots.default?.(slotProps));
    },
  });

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

export const rekaStubs = (...names: string[]) =>
  Object.fromEntries(names.map((name) => [name, createStub(name)]));

export const oreStubs = {
  Icon: createStub("Icon", "i"),
  Group: createStub("Group", "div"),
  Button: createStub("Button", "button"),
  Span: createStub("Span", "span"),
  Label: createStub("Label", "label"),
  Caption: createStub("Caption", "div"),
  Section: createStub("Section", "section"),
  H1: createStub("H1", "h1"),
  H2: createStub("H2", "h2"),
  H3: createStub("H3", "h3"),
  H4: createStub("H4", "h4"),
  H5: createStub("H5", "h5"),
  H6: createStub("H6", "h6"),
  Em: createStub("Em", "em"),
  P: createStub("P", "p"),
  Kbd: createStub("Kbd", "kbd"),
  Input: createStub("Input", "input"),
  Table: createStub("Table", "table"),
  Thead: createStub("Thead", "thead"),
  Tbody: createStub("Tbody", "tbody"),
  Tr: createStub("Tr", "tr"),
  Th: createStub("Th", "th"),
  Td: createStub("Td", "td"),
  Anchor: createStub("Anchor", "a"),
  Img: createStub("Img", "img"),
  Chip: createStub("Chip", "button"),
  Article: createStub("Article", "article"),
  Strong: createStub("Strong", "strong"),
  Del: createStub("Del", "del"),
  Blockquote: createStub("Blockquote", "blockquote"),
  Ul: createStub("Ul", "ul"),
  Ol: createStub("Ol", "ol"),
  Li: createStub("Li", "li"),
  Code: createStub("Code", "code"),
  Pre: createStub("Pre", "pre"),
  Hr: createStub("Hr", "hr"),
  Textarea: createStub("Textarea", "textarea"),
  Fieldset: createStub("Fieldset", "fieldset"),
  Header: createStub("Header", "header"),
  Footer: createStub("Footer", "footer"),
} as const;
