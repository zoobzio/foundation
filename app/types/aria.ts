import type { AriaAttributes } from "vue";
import type { GlobalAria, ProhibitedAria, RoleAria } from "./aria-spec";
import type { Element } from "./element";
import type components from "../../config/components";

type AllAria = {
  [K in keyof AriaAttributes as K extends `aria-${infer Name}`
    ? Name
    : never]?: AriaAttributes[K];
};

export type AriaRole<C extends Element> =
  (typeof components.elements)[C]["role"];

export type AriaBindings<C extends Element> = {
  [K in keyof AriaProps<C> as `aria-${K & string}`]?: AriaProps<C>[K];
};

export type AriaProps<C extends Element> = Pick<
  AllAria,
  Exclude<GlobalAria | RoleAria[AriaRole<C>], ProhibitedAria[AriaRole<C>]> &
    keyof AllAria
>;
