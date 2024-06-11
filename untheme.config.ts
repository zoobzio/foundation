import { defineUnthemeConfig } from "untheme";
import { useColorPack, referenceColorTokens } from "@untheme/colors";

export default defineUnthemeConfig({
  tokens: {
    // colors
    "ui-black": "#000",
    "ui-white": "#FFF",
    ...useColorPack(
      "tw",
      [
        "amber",
        "blue",
        "cyan",
        "emerald",
        "fuchsia",
        "gray",
        "green",
        "indigo",
        "lime",
        "neutral",
        "orange",
        "pink",
        "purple",
        "red",
        "rose",
        "sky",
        "slate",
        "stone",
        "teal",
        "violet",
        "yellow",
        "zinc",
      ],
      "-"
    ),
    // spacing
    "spacing-2xs": "4px",
    "spacing-xs": "8px",
    "spacing-s": "12px",
    "spacing-m": "16px",
    "spacing-l": "20px",
    "spacing-xl": "24px",
    "spacing-2xl": "28px",
    // shape
    "shape-none": "0px",
    "shape-xs": "2px",
    "shape-s": "4px",
    "shape-m": "6px",
    "shape-l": "8px",
    "shape-xl": "12px",
    "shape-full": "9999px",
    // typeface
    "typeface-archivo": "Archivo",
    "typeface-inter": "Inter",
    // typesize
    "typesize-heading-1": "1.5em",
    "typesize-heading-2": "1.25em",
    "typesize-heading-3": "1em",
    "typesize-heading-4": "0.875em",
    "typesize-heading-5": "0.75em",
    "typesize-heading-6": "0.6875em",
    "typesize-title-s": "0.875em",
    "typesize-title-m": "1em",
    "typesize-title-l": "1.125em",
    "typesize-body-s": "0.6875em",
    "typesize-body-m": "0.875em",
    "typesize-body-l": "1em",
  },
  themes: {
    seerist: {
      ...referenceColorTokens("tw", "emerald", "primary", "-"),
      ...referenceColorTokens("tw", "stone", "neutral", "-"),
      ...referenceColorTokens("tw", "rose", "error", "-"),
      "typeface-content": "typeface-inter",
    },
    example: {
      ...referenceColorTokens("tw", "indigo", "primary", "-"),
      ...referenceColorTokens("tw", "slate", "neutral", "-"),
      ...referenceColorTokens("tw", "red", "error", "-"),
      "typeface-content": "typeface-archivo",
    },
  },
  modes: {
    dark: {
      "ui-primary": "tw-primary-500",
      "ui-on-primary": "tw-primary-800",
      "ui-primary-tonal": "tw-primary-300",
      "ui-on-primary-tonal": "tw-primary-900",
      "ui-surface": "tw-neutral-900",
      "ui-on-surface": "tw-neutral-100",
      "ui-surface-container": "tw-neutral-800",
      "ui-on-surface-container": "tw-neutral-50",
      "ui-outline": "tw-neutral-700",
    },
    light: {
      "ui-primary": "tw-primary-600",
      "ui-on-primary": "tw-primary-200",
      "ui-primary-tonal": "tw-primary-700",
      "ui-on-primary-tonal": "tw-primary-100",
      "ui-surface": "tw-neutral-100",
      "ui-on-surface": "tw-neutral-900",
      "ui-surface-container": "tw-neutral-200",
      "ui-on-surface-container": "ui-black",
      "ui-outline": "tw-neutral-300",
    },
  },
  roles: {
    // component tokens should go here
  },
});