// @ts-ignore only available at runtime within a module
import type aliases from "#build/iconic.config.mjs";

export type Iconic = typeof aliases;
export type IconAlias = keyof Iconic;
