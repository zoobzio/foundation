import type base from "./tokens/reference/base";
import type colors from "./tokens/reference/color";
import type spacing from "./tokens/reference/spacing";
import type typography from "./tokens/reference/typography";
import type radius from "./tokens/reference/radius";
import type shadow from "./tokens/reference/shadow";
import type animation from "./tokens/reference/animation";
import type border from "./tokens/reference/border";
import type cursor from "./tokens/reference/cursor";
import type sizing from "./tokens/reference/sizing";
import type opacity from "./tokens/reference/opacity";
import type outline from "./tokens/reference/outline";
import type display from "./tokens/reference/display";
import type flexbox from "./tokens/reference/flexbox";
import type grid from "./tokens/reference/grid";
import type layout from "./tokens/reference/layout";
import type interaction from "./tokens/reference/interaction";
import type elevation from "./tokens/reference/elevation";
import type position from "./tokens/reference/position";
import type transform from "./tokens/reference/transform";
import type scroll from "./tokens/reference/scroll";
import type table from "./tokens/reference/table";
import type light from "./tokens/modes/light";

/**
 * Semantic token categories extracted from reference token files.
 * These provide type-safe constraints for role token properties.
 */
export type BaseToken = keyof typeof base;
export type ColorToken = keyof typeof colors;
export type SpacingToken = keyof typeof spacing;
export type TypographyToken = keyof typeof typography;
export type RadiusToken = keyof typeof radius;
export type ShadowToken = keyof typeof shadow;
export type AnimationToken = keyof typeof animation;
export type BorderToken = keyof typeof border;
export type CursorToken = keyof typeof cursor;
export type SizingToken = keyof typeof sizing;
export type OpacityToken = keyof typeof opacity;
export type OutlineToken = keyof typeof outline;
export type DisplayToken = keyof typeof display;
export type FlexboxToken = keyof typeof flexbox;
export type GridToken = keyof typeof grid;
export type LayoutToken = keyof typeof layout;
export type InteractionToken = keyof typeof interaction;
export type ElevationToken = keyof typeof elevation;
export type PositionToken = keyof typeof position;
export type TransformToken = keyof typeof transform;
export type ScrollToken = keyof typeof scroll;
export type TableToken = keyof typeof table;
export type ModeToken = keyof typeof light;

/**
 * Maps individual property names to their semantically valid token types.
 * Used to construct typed schemas for template objects.
 */
export type Schema = {
  // === SPACING ===
  padding: SpacingToken | BaseToken;
  "padding-top": SpacingToken | BaseToken;
  "padding-right": SpacingToken | BaseToken;
  "padding-bottom": SpacingToken | BaseToken;
  "padding-left": SpacingToken | BaseToken;
  margin: SpacingToken | BaseToken;
  "margin-top": SpacingToken | BaseToken;
  "margin-right": SpacingToken | BaseToken;
  "margin-bottom": SpacingToken | BaseToken;
  "margin-left": SpacingToken | BaseToken;
  gap: SpacingToken | BaseToken;

  // === SIZING ===
  width: SizingToken | SpacingToken | BaseToken;
  height: SizingToken | SpacingToken | BaseToken;
  "min-width": SizingToken | SpacingToken | BaseToken;
  "min-height": SizingToken | SpacingToken | BaseToken;
  "max-width": SizingToken | SpacingToken | BaseToken;
  "max-height": SizingToken | SpacingToken | BaseToken;

  // === COLORS (base states) ===
  background: ColorToken | ModeToken | BaseToken;
  text: ColorToken | ModeToken | BaseToken;
  "border-color": ColorToken | ModeToken | BaseToken;

  // === COLORS (interactive states) ===
  "background-hover": ColorToken | ModeToken | BaseToken;
  "background-active": ColorToken | ModeToken | BaseToken;
  "background-focus": ColorToken | ModeToken | BaseToken;
  "text-hover": ColorToken | ModeToken | BaseToken;
  "text-active": ColorToken | ModeToken | BaseToken;
  "text-focus": ColorToken | ModeToken | BaseToken;
  "border-color-hover": ColorToken | ModeToken | BaseToken;
  "border-color-active": ColorToken | ModeToken | BaseToken;
  "border-color-focus": ColorToken | ModeToken | BaseToken;

  // === COLORS (selected state) ===
  "background-selected": ColorToken | ModeToken | BaseToken;
  "text-selected": ColorToken | ModeToken | BaseToken;
  "border-color-selected": ColorToken | ModeToken | BaseToken;

  // === COLORS (selected-interactive compound states) ===
  "background-selected-hover": ColorToken | ModeToken | BaseToken;
  "background-selected-active": ColorToken | ModeToken | BaseToken;
  "background-selected-focus": ColorToken | ModeToken | BaseToken;
  "text-selected-hover": ColorToken | ModeToken | BaseToken;
  "text-selected-active": ColorToken | ModeToken | BaseToken;
  "text-selected-focus": ColorToken | ModeToken | BaseToken;
  "border-color-selected-hover": ColorToken | ModeToken | BaseToken;
  "border-color-selected-active": ColorToken | ModeToken | BaseToken;
  "border-color-selected-focus": ColorToken | ModeToken | BaseToken;

  // === BORDERS ===
  "border-width": BorderToken | BaseToken;
  "border-radius": RadiusToken | BaseToken;
  "border-top-width": BorderToken | BaseToken;
  "border-right-width": BorderToken | BaseToken;
  "border-bottom-width": BorderToken | BaseToken;
  "border-left-width": BorderToken | BaseToken;
  "border-top-style": BorderToken | BaseToken;
  "border-right-style": BorderToken | BaseToken;
  "border-bottom-style": BorderToken | BaseToken;
  "border-left-style": BorderToken | BaseToken;
  "border-top-left-radius": RadiusToken | BaseToken;
  "border-top-right-radius": RadiusToken | BaseToken;
  "border-bottom-right-radius": RadiusToken | BaseToken;
  "border-bottom-left-radius": RadiusToken | BaseToken;

  // === BORDERS (selected state) ===
  "border-top-width-selected": BorderToken | BaseToken;
  "border-right-width-selected": BorderToken | BaseToken;
  "border-bottom-width-selected": BorderToken | BaseToken;
  "border-left-width-selected": BorderToken | BaseToken;

  // === BORDERS (selected-interactive compound states) ===
  "border-top-width-selected-hover": BorderToken | BaseToken;
  "border-right-width-selected-hover": BorderToken | BaseToken;
  "border-bottom-width-selected-hover": BorderToken | BaseToken;
  "border-left-width-selected-hover": BorderToken | BaseToken;
  "border-top-width-selected-active": BorderToken | BaseToken;
  "border-right-width-selected-active": BorderToken | BaseToken;
  "border-bottom-width-selected-active": BorderToken | BaseToken;
  "border-left-width-selected-active": BorderToken | BaseToken;
  "border-top-width-selected-focus": BorderToken | BaseToken;
  "border-right-width-selected-focus": BorderToken | BaseToken;
  "border-bottom-width-selected-focus": BorderToken | BaseToken;
  "border-left-width-selected-focus": BorderToken | BaseToken;

  // === TYPOGRAPHY ===
  "font-family": TypographyToken | BaseToken;
  "font-size": TypographyToken | BaseToken;
  "font-weight": TypographyToken | BaseToken;
  "font-style": TypographyToken | BaseToken;
  "line-height": TypographyToken | BaseToken;
  "letter-spacing": TypographyToken | BaseToken;
  "text-align": FlexboxToken | BaseToken;
  "text-decoration": TypographyToken | BaseToken;
  "text-decoration-hover": TypographyToken | BaseToken;
  "text-decoration-active": TypographyToken | BaseToken;
  "text-decoration-focus": TypographyToken | BaseToken;

  // === TYPOGRAPHY (interactive states) ===
  "font-weight-hover": TypographyToken | BaseToken;
  "font-weight-active": TypographyToken | BaseToken;
  "font-weight-focus": TypographyToken | BaseToken;
  "font-weight-selected": TypographyToken | BaseToken;
  "font-weight-selected-hover": TypographyToken | BaseToken;
  "font-weight-selected-active": TypographyToken | BaseToken;
  "font-weight-selected-focus": TypographyToken | BaseToken;

  // === DISPLAY ===
  display: DisplayToken | BaseToken;
  "overflow-x": DisplayToken | BaseToken;
  "overflow-y": DisplayToken | BaseToken;
  "list-style-type": DisplayToken | BaseToken;
  "object-fit": DisplayToken | BaseToken;

  // === VISUAL EFFECTS ===
  cursor: CursorToken | BaseToken;
  "cursor-disabled": CursorToken | BaseToken;
  opacity: OpacityToken | BaseToken;
  "opacity-hover": OpacityToken | BaseToken;
  "opacity-active": OpacityToken | BaseToken;
  "opacity-disabled": OpacityToken | BaseToken;
  "opacity-selected-hover": OpacityToken | BaseToken;
  "opacity-selected-active": OpacityToken | BaseToken;
  "user-select": InteractionToken | BaseToken;
  "pointer-events": InteractionToken | BaseToken;
  "box-shadow": ShadowToken | BaseToken;
  "box-shadow-hover": ShadowToken | BaseToken;
  "box-shadow-focus": ShadowToken | BaseToken;
  "box-shadow-selected": ShadowToken | BaseToken;
  "box-shadow-selected-hover": ShadowToken | BaseToken;
  "box-shadow-selected-active": ShadowToken | BaseToken;
  "box-shadow-selected-focus": ShadowToken | BaseToken;
  "outline-width": OutlineToken | BaseToken;
  "outline-offset": OutlineToken | BaseToken;
  "outline-style": OutlineToken | BaseToken;
  "outline-color": ColorToken | ModeToken | BaseToken;

  // === FLEXBOX PARENT ===
  "flex-direction": FlexboxToken | BaseToken;
  "flex-wrap": FlexboxToken | BaseToken;
  "align-items": FlexboxToken | BaseToken;
  "align-content": FlexboxToken | BaseToken;
  "justify-content": FlexboxToken | BaseToken;
  "gap-row": SpacingToken | BaseToken;
  "gap-column": SpacingToken | BaseToken;

  // === FLEXBOX CHILD ===
  "align-self": FlexboxToken | BaseToken;
  "flex-grow": FlexboxToken | BaseToken;
  "flex-shrink": FlexboxToken | BaseToken;
  "flex-basis": FlexboxToken | BaseToken;

  // === GRID PARENT ===
  "grid-template-columns": GridToken | LayoutToken | BaseToken;
  "grid-template-rows": GridToken | LayoutToken | BaseToken;
  "grid-gap": SpacingToken | BaseToken;
  "grid-auto-flow": GridToken | BaseToken;
  "grid-auto-columns": GridToken | LayoutToken | BaseToken;
  "grid-auto-rows": GridToken | LayoutToken | BaseToken;

  // === GRID CHILD ===
  "grid-column": GridToken | BaseToken;
  "grid-row": GridToken | BaseToken;
  "grid-column-start": GridToken | BaseToken;
  "grid-column-end": GridToken | BaseToken;
  "grid-row-start": GridToken | BaseToken;
  "grid-row-end": GridToken | BaseToken;

  // === ANIMATION ===
  "transition-duration": AnimationToken | BaseToken;
  "transition-easing": AnimationToken | BaseToken;
  "transition-property": AnimationToken | BaseToken;

  // === POSITION ===
  position: PositionToken | BaseToken;
  top: PositionToken | SpacingToken | BaseToken;
  right: PositionToken | SpacingToken | BaseToken;
  bottom: PositionToken | SpacingToken | BaseToken;
  left: PositionToken | SpacingToken | BaseToken;
  "z-index": ElevationToken | BaseToken;

  // === TRANSFORM ===
  transform: TransformToken | BaseToken;
  "transform-origin": TransformToken | BaseToken;

  // === DISABLED STATE ===
  "background-disabled": ColorToken | ModeToken | BaseToken;
  "text-disabled": ColorToken | ModeToken | BaseToken;
  "border-color-disabled": ColorToken | ModeToken | BaseToken;
  "font-weight-disabled": TypographyToken | BaseToken;

  // === OPEN STATE ===
  "background-open": ColorToken | ModeToken | BaseToken;
  "text-open": ColorToken | ModeToken | BaseToken;
  "border-color-open": ColorToken | ModeToken | BaseToken;
  "font-weight-open": TypographyToken | BaseToken;
  "box-shadow-open": ShadowToken | BaseToken;
  "background-open-hover": ColorToken | ModeToken | BaseToken;
  "text-open-hover": ColorToken | ModeToken | BaseToken;
  "border-color-open-hover": ColorToken | ModeToken | BaseToken;
  "font-weight-open-hover": TypographyToken | BaseToken;
  "box-shadow-open-hover": ShadowToken | BaseToken;
  "background-open-active": ColorToken | ModeToken | BaseToken;
  "text-open-active": ColorToken | ModeToken | BaseToken;
  "border-color-open-active": ColorToken | ModeToken | BaseToken;
  "font-weight-open-active": TypographyToken | BaseToken;
  "box-shadow-open-active": ShadowToken | BaseToken;
  "background-open-focus": ColorToken | ModeToken | BaseToken;
  "text-open-focus": ColorToken | ModeToken | BaseToken;
  "border-color-open-focus": ColorToken | ModeToken | BaseToken;
  "font-weight-open-focus": TypographyToken | BaseToken;
  "box-shadow-open-focus": ShadowToken | BaseToken;

  // === SCROLL ===
  "scroll-margin-top": ScrollToken | SpacingToken | BaseToken;

  // === TABLE ===
  "border-collapse": TableToken | BaseToken;
  "table-layout": TableToken | BaseToken;
  "vertical-align": TableToken | BaseToken;
};

/**
 * Helper type to create a typed schema from an object's keys.
 * Maps each key to its semantically valid tokens from PropertyTokenMap.
 * Allows null for unset/ignored values.
 */
export type SchemaFor<T extends Record<string, any>> = {
  [K in keyof T]: K extends keyof Schema ? Schema[K] | null : never;
};
