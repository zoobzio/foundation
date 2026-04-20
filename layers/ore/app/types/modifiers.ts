type OreElements =
  | "alert" | "anchor" | "article" | "aside" | "banner" | "blockquote"
  | "button" | "caption" | "card" | "code" | "container" | "del" | "em"
  | "footer" | "group" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  | "header" | "hr" | "icon" | "img" | "input" | "kbd" | "label" | "li"
  | "main" | "nav" | "ol" | "p" | "pre" | "section" | "span" | "strong"
  | "table" | "tbody" | "td" | "th" | "thead" | "tr" | "ul";

type OreModifierMap = Record<OreElements, never>;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface OreVariants extends OreModifierMap {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface OreSizes extends OreModifierMap {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface OreColors extends OreModifierMap {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface OreRadius extends OreModifierMap {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface OreDensity extends OreModifierMap {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface OreElevation extends OreModifierMap {}
