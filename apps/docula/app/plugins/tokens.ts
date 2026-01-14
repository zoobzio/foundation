export default defineNuxtPlugin(() => {
  // Interactive elements
  defineTokens("a", {
    text: "sys-primary",
    "text-hover": "sys-primary",
    "text-active": "sys-primary-active",
    "text-focus": "sys-primary",
    "text-disabled": "sys-on-surface",
    "background-hover": "ref-color-transparent",
    "font-size": "ref-text-base",
    "font-weight": "ref-font-bold",
    "font-weight-hover": "ref-font-bold",
    "font-weight-active": "ref-font-bold",
    "font-weight-focus": "ref-font-bold",
    "line-height": "ref-leading-normal",
    "text-decoration": "ref-decoration-none",
    "text-decoration-hover": "ref-decoration-underline",
    cursor: "ref-cursor-pointer",
    "cursor-disabled": "ref-cursor-default",
    "box-shadow-focus": "ref-shadow-focus-ring",
  });

  defineTokens("button", {
    background: "ref-color-transparent",
    text: "sys-on-surface-variant",
    "text-hover": "sys-on-surface",
    "text-active": "sys-on-surface",
    "background-hover": "sys-hover",
    "background-active": "sys-active",
    cursor: "ref-cursor-pointer",
    "padding-left": "ref-spacing-lg",
    "padding-right": "ref-spacing-lg",
    "padding-top": "ref-spacing-md",
    "padding-bottom": "ref-spacing-md",
    "outline-color": "sys-focus",
    "outline-width": "ref-outline-width-medium",
    "font-weight": "ref-font-bold",
    "font-weight-hover": "ref-font-bold",
    "font-weight-active": "ref-font-bold",
    "font-weight-focus": "ref-font-bold",
    "background-focus": "sys-hover",
    "box-shadow-focus": "ref-shadow-focus-inset",
    "opacity-disabled": "ref-opacity-50",
    "cursor-disabled": "ref-cursor-default",
  });

  defineTokens("card", {
    background: "sys-surface",
    "box-shadow": "ref-shadow-md",
  });

  defineTokens("link", {
    text: "sys-primary",
    "text-hover": "sys-primary-hover",
    "text-decoration": "ref-none",
  });

  defineTokens("group", {
    display: "ref-display-inline-flex",
    "flex-direction": "ref-flex-row",
    "align-items": "ref-align-center",
    "justify-content": "ref-justify-start",
    gap: "ref-none",
  });

  // Accordion
  defineTokens("accordion-trigger", {
    background: "ref-color-transparent",
    text: "sys-on-surface-variant",
    cursor: "ref-cursor-pointer",
    "font-size": "ref-text-base",
    "font-weight": "ref-font-bold",
    "text-align": "ref-text-align-start",
    display: "ref-display-flex",
    "align-items": "ref-align-center",
    "justify-content": "ref-justify-between",
    gap: "ref-spacing-xs",
    width: "ref-full",
    "padding-left": "ref-spacing-md",
    "padding-right": "ref-spacing-md",
    "padding-top": "ref-spacing-sm",
    "padding-bottom": "ref-spacing-sm",
    "font-weight-selected": "ref-font-bold",
    "font-weight-hover": "ref-font-bold",
    "font-weight-active": "ref-font-bold",
    "font-weight-focus": "ref-font-bold",
    "font-weight-selected-hover": "ref-font-bold",
    "font-weight-selected-active": "ref-font-bold",
    "font-weight-selected-focus": "ref-font-bold",
    "background-focus": "sys-hover",
    "box-shadow-focus": "ref-shadow-focus-inset",
    "background-selected-focus": "sys-hover",
    "box-shadow-selected-focus": "ref-shadow-focus-inset",
  });

  defineTokens("accordion-trigger-content", {
    display: "ref-display-inline-flex",
    "align-items": "ref-align-center",
    gap: "ref-spacing-xs",
  });

  defineTokens("accordion-content", {
    background: "ref-color-transparent",
    text: "sys-on-surface",
    "font-size": "ref-text-base",
  });

  // Breadcrumbs
  defineTokens("breadcrumbs-root", {});

  defineTokens("breadcrumbs-list", {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-row",
    "align-items": "ref-align-center",
    gap: "ref-spacing-xs",
    "list-style-type": "ref-list-none",
  });

  defineTokens("breadcrumbs-item", {
    display: "ref-display-inline-flex",
    "align-items": "ref-align-center",
    gap: "ref-spacing-xs",
  });

  defineTokens("breadcrumbs-link", {
    text: "sys-on-surface-variant",
    "text-hover": "sys-primary",
    "text-active": "sys-primary-active",
    "text-focus": "sys-on-surface",
    "background-hover": "ref-color-transparent",
    "font-size": "ref-text-sm",
    "font-weight": "ref-font-bold",
    "font-weight-hover": "ref-font-bold",
    "font-weight-active": "ref-font-bold",
    "font-weight-focus": "ref-font-bold",
    "text-decoration": "ref-decoration-none",
    "text-decoration-hover": "ref-decoration-underline",
    display: "ref-display-inline-flex",
    "align-items": "ref-align-center",
    gap: "ref-spacing-2xs",
    cursor: "ref-cursor-pointer",
    "box-shadow-focus": "ref-shadow-focus-ring",
  });

  defineTokens("breadcrumbs-current", {
    text: "sys-primary",
    "font-size": "ref-text-sm",
    "font-weight": "ref-font-bold",
    "text-decoration": "ref-decoration-none",
    display: "ref-display-inline-flex",
    "align-items": "ref-align-center",
    gap: "ref-spacing-2xs",
  });

  defineTokens("breadcrumbs-separator", {
    display: "ref-display-inline-flex",
    "align-items": "ref-align-center",
    "justify-content": "ref-justify-center",
  });

  // Layout
  defineTokens("aside", {
    display: "ref-display-block",
    top: "ref-position-zero",
    position: "ref-position-sticky",
    background: "sys-surface",
    text: "sys-on-surface",
    "border-color": "ref-color-transparent",
    width: "ref-full",
  });

  defineTokens("header", {
    background: "sys-surface",
    text: "sys-on-surface",
    gap: "ref-spacing-md",
    display: "ref-display-grid",
    "grid-template-columns": "ref-layout-trifold",
    "grid-column": "ref-grid-col-span-all",
    "align-items": "ref-align-center",
    "border-bottom-style": "ref-border-style-solid",
    "border-bottom-width": "ref-border-width-thin",
    "border-color": "sys-outline",
    width: "ref-full",
    height: "ref-height-header",
    "padding-left": "ref-spacing-lg",
    "padding-right": "ref-spacing-lg",
    position: "ref-position-sticky",
    top: "ref-position-zero",
    "z-index": "ref-z-sticky",
  });

  defineTokens("footer", {
    background: "sys-surface",
    text: "sys-on-surface",
    gap: "ref-spacing-md",
    display: "ref-display-grid",
    "grid-template-columns": "ref-layout-trifold",
    "grid-column": "ref-grid-col-span-all",
    "align-items": "ref-align-center",
    "border-top-style": "ref-border-style-solid",
    "border-top-width": "ref-border-width-thin",
    "border-color": "sys-outline",
    width: "ref-full",
    "max-width": "ref-width-container",
    "margin-left": "ref-auto",
    "margin-right": "ref-auto",
  });

  defineTokens("main", {
    background: "sys-surface",
    text: "sys-on-surface",
    height: "ref-viewport-height",
    "min-height": "ref-viewport-height",
    "max-height": "ref-viewport-height",
    width: "ref-full",
    display: "ref-display-grid",
    "grid-template-columns": "ref-full",
    "grid-template-rows": "ref-grid-rows-header-content-footer",
  });

  defineTokens("section", {
    background: "ref-color-transparent",
    text: "sys-on-surface",
    display: "ref-display-flex",
    "flex-direction": "ref-flex-col",
    gap: "ref-spacing-lg",
    "padding-top": "ref-spacing-lg",
    "padding-right": "ref-spacing-lg",
    "padding-bottom": "ref-spacing-lg",
    "padding-left": "ref-spacing-lg",
    "min-width": "ref-none",
  });

  defineTokens("article", {
    background: "ref-color-transparent",
    text: "sys-on-surface",
    "line-height": "ref-leading-relaxed",
    display: "ref-display-block",
  });

  defineTokens("nav", {
    background: "ref-color-transparent",
    text: "sys-on-surface",
    position: "ref-position-sticky",
    top: "ref-height-header",
    height: "ref-height-aside",
    "overflow-y": "ref-overflow-auto",
  });

  defineTokens("container", {
    display: "ref-display-grid",
    "grid-template-columns": "ref-layout-sidebar-right",
    "max-width": "ref-width-container",
    "margin-left": "ref-auto",
    "margin-right": "ref-auto",
  });

  // Checkbox
  defineTokens("checkbox-root", {
    display: "ref-display-inline-flex",
    "align-items": "ref-align-center",
    "justify-content": "ref-justify-center",
    width: "ref-spacing-lg",
    height: "ref-spacing-lg",
    background: "sys-surface",
    "background-hover": "sys-hover",
    "background-selected": "sys-primary",
    "background-selected-hover": "sys-primary-hover",
    "border-top-width": "ref-border-width-thin",
    "border-right-width": "ref-border-width-thin",
    "border-bottom-width": "ref-border-width-thin",
    "border-left-width": "ref-border-width-thin",
    "border-top-style": "ref-border-style-solid",
    "border-right-style": "ref-border-style-solid",
    "border-bottom-style": "ref-border-style-solid",
    "border-left-style": "ref-border-style-solid",
    "border-color": "sys-outline",
    "border-color-selected": "sys-primary",
    "border-top-left-radius": "ref-radius-sm",
    "border-top-right-radius": "ref-radius-sm",
    "border-bottom-right-radius": "ref-radius-sm",
    "border-bottom-left-radius": "ref-radius-sm",
    cursor: "ref-cursor-pointer",
    "cursor-disabled": "ref-cursor-not-allowed",
    "opacity-disabled": "ref-opacity-50",
    "transition-duration": "ref-duration-fast",
    "transition-easing": "ref-ease-out",
  });

  defineTokens("checkbox-indicator", {
    display: "ref-display-flex",
    "align-items": "ref-align-center",
    "justify-content": "ref-justify-center",
    text: "sys-on-primary",
    "font-size": "ref-text-sm",
  });

  // Avatar
  defineTokens("avatar-root", {
    width: "ref-spacing-2xl",
    height: "ref-spacing-2xl",
    "border-top-left-radius": "ref-radius-full",
    "border-top-right-radius": "ref-radius-full",
    "border-bottom-right-radius": "ref-radius-full",
    "border-bottom-left-radius": "ref-radius-full",
    "overflow-x": "ref-overflow-hidden",
    "overflow-y": "ref-overflow-hidden",
    display: "ref-display-inline-flex",
  });

  defineTokens("avatar-image", {
    width: "ref-full",
    height: "ref-full",
    "object-fit": "ref-object-cover",
    display: "ref-display-block",
  });

  defineTokens("avatar-fallback", {
    width: "ref-full",
    height: "ref-full",
    background: "sys-surface-container",
    text: "sys-on-surface",
    display: "ref-display-inline-flex",
    "align-items": "ref-align-center",
    "justify-content": "ref-justify-center",
    "font-size": "ref-text-base",
    "font-weight": "ref-font-medium",
  });

  // Input
  defineTokens("input", {
    background: "sys-surface",
    text: "sys-on-surface",
    "font-size": "ref-text-base",
    "font-weight": "ref-font-normal",
    "padding-top": "ref-spacing-sm",
    "padding-right": "ref-spacing-md",
    "padding-bottom": "ref-spacing-sm",
    "padding-left": "ref-spacing-md",
    "border-top-width": "ref-border-width-thin",
    "border-right-width": "ref-border-width-thin",
    "border-bottom-width": "ref-border-width-thin",
    "border-left-width": "ref-border-width-thin",
    "border-top-style": "ref-border-style-solid",
    "border-right-style": "ref-border-style-solid",
    "border-bottom-style": "ref-border-style-solid",
    "border-left-style": "ref-border-style-solid",
    "border-color": "sys-outline",
    width: "ref-full",
  });

  // Label
  defineTokens("label", {
    text: "sys-on-surface",
    "font-size": "ref-text-sm",
    "font-weight": "ref-font-medium",
    display: "ref-display-block",
  });

  // Icon
  defineTokens("icon", {
    text: "ref-color-current",
    opacity: "ref-opacity-100",
    display: "ref-display-inline-flex",
    "align-items": "ref-align-center",
    "justify-content": "ref-justify-center",
    width: "ref-width-1em",
    height: "ref-height-1em",
  });

  // Img
  defineTokens("img", {
    display: "ref-display-block",
    "max-width": "ref-full",
    height: "ref-auto",
    "margin-top": "ref-spacing-lg",
    "margin-bottom": "ref-spacing-lg",
  });

  // Select
  defineTokens("select-root", {
    background: "ref-color-transparent",
  });

  defineTokens("select-trigger", {
    display: "ref-display-flex",
    "align-items": "ref-align-center",
    "justify-content": "ref-justify-between",
    gap: "ref-spacing-xs",
    background: "sys-surface",
    text: "sys-on-surface",
    "font-size": "ref-text-base",
    "font-weight": "ref-font-normal",
    "padding-top": "ref-spacing-sm",
    "padding-right": "ref-spacing-md",
    "padding-bottom": "ref-spacing-sm",
    "padding-left": "ref-spacing-md",
    "border-top-width": "ref-border-width-thin",
    "border-right-width": "ref-border-width-thin",
    "border-bottom-width": "ref-border-width-thin",
    "border-left-width": "ref-border-width-thin",
    "border-top-style": "ref-border-style-solid",
    "border-right-style": "ref-border-style-solid",
    "border-bottom-style": "ref-border-style-solid",
    "border-left-style": "ref-border-style-solid",
    "border-color": "sys-outline",
    "border-color-hover": "sys-outline",
    "border-color-focus": "sys-primary",
    "background-hover": "sys-hover",
    "background-focus": "sys-surface",
    "box-shadow-focus": "ref-shadow-focus-ring",
    cursor: "ref-cursor-pointer",
    width: "ref-full",
    "transition-duration": "ref-duration-fast",
    "transition-easing": "ref-ease-out",
  });

  defineTokens("select-content", {
    background: "sys-surface-container",
    text: "sys-on-surface",
    "padding-top": "ref-spacing-xs",
    "padding-right": "ref-spacing-xs",
    "padding-bottom": "ref-spacing-xs",
    "padding-left": "ref-spacing-xs",
    "border-top-width": "ref-border-width-thin",
    "border-right-width": "ref-border-width-thin",
    "border-bottom-width": "ref-border-width-thin",
    "border-left-width": "ref-border-width-thin",
    "border-top-style": "ref-border-style-solid",
    "border-right-style": "ref-border-style-solid",
    "border-bottom-style": "ref-border-style-solid",
    "border-left-style": "ref-border-style-solid",
    "border-color": "sys-outline",
    "z-index": "ref-z-dropdown",
    "max-height": "ref-width-md",
    "overflow-y": "ref-overflow-auto",
  });

  defineTokens("select-item", {
    background: "ref-color-transparent",
    text: "sys-on-surface",
    "text-hover": "sys-on-surface",
    "text-selected": "sys-primary",
    "text-selected-hover": "sys-primary",
    "background-hover": "sys-hover",
    "background-selected": "sys-surface-container-high",
    "background-selected-hover": "sys-hover",
    "padding-top": "ref-spacing-xs",
    "padding-right": "ref-spacing-md",
    "padding-bottom": "ref-spacing-xs",
    "padding-left": "ref-spacing-md",
    cursor: "ref-cursor-pointer",
    "font-size": "ref-text-base",
    "background-focus": "sys-hover",
    "box-shadow-focus": "ref-shadow-focus-inset",
    "background-selected-focus": "sys-hover",
    "transition-duration": "ref-duration-fast",
    "transition-easing": "ref-ease-out",
  });

  // Tags Input
  defineTokens("tags-input-root", {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-row",
    "flex-wrap": "ref-flex-wrap",
    "align-items": "ref-align-center",
    gap: "ref-spacing-xs",
    background: "sys-surface",
    text: "sys-on-surface",
    "padding-top": "ref-spacing-sm",
    "padding-right": "ref-spacing-md",
    "padding-bottom": "ref-spacing-sm",
    "padding-left": "ref-spacing-md",
    "border-top-width": "ref-border-width-thin",
    "border-right-width": "ref-border-width-thin",
    "border-bottom-width": "ref-border-width-thin",
    "border-left-width": "ref-border-width-thin",
    "border-top-style": "ref-border-style-solid",
    "border-right-style": "ref-border-style-solid",
    "border-bottom-style": "ref-border-style-solid",
    "border-left-style": "ref-border-style-solid",
    "border-color": "sys-outline",
  });

  defineTokens("tags-input-item", {
    display: "ref-display-inline-flex",
    "align-items": "ref-align-center",
    gap: "ref-spacing-2xs",
    background: "sys-surface-container-high",
    text: "sys-on-surface",
    "font-size": "ref-text-sm",
    "font-weight": "ref-font-medium",
    "white-space": "ref-whitespace-nowrap",
    "padding-left": "ref-spacing-sm",
    "padding-right": "ref-spacing-sm",
    "padding-top": "ref-spacing-2xs",
    "padding-bottom": "ref-spacing-2xs",
    "transition-duration": "ref-duration-fast",
    "transition-easing": "ref-ease-out",
  });

  defineTokens("tags-input-item-text", {
    "font-size": "ref-text-sm",
  });

  defineTokens("tags-input-item-delete", {
    display: "ref-display-inline-flex",
    "align-items": "ref-align-center",
    "justify-content": "ref-justify-center",
    background: "ref-color-transparent",
    "background-hover": "sys-hover",
    text: "sys-on-surface-variant",
    "text-hover": "sys-on-surface",
    cursor: "ref-cursor-pointer",
    "transition-duration": "ref-duration-fast",
    "transition-easing": "ref-ease-out",
  });

  defineTokens("tags-input-input", {
    background: "ref-color-transparent",
    text: "sys-on-surface",
    "font-size": "ref-text-base",
    "flex-grow": "ref-flex-1",
    "min-width": "ref-width-xs",
  });

  // Listbox
  defineTokens("listbox-root", {
    background: "ref-color-transparent",
  });

  defineTokens("listbox-content", {
    background: "ref-color-transparent",
    display: "ref-display-flex",
    "flex-direction": "ref-flex-col",
    gap: "ref-spacing-none",
  });

  defineTokens("listbox-item", {
    background: "ref-color-transparent",
    text: "sys-on-surface-variant",
    "text-hover": "sys-on-surface",
    "text-active": "sys-primary",
    "text-selected": "sys-primary",
    "text-selected-hover": "sys-primary",
    "background-hover": "sys-hover",
    "background-selected": "sys-surface-container-high",
    "background-selected-hover": "sys-hover",
    "box-shadow-selected": "ref-shadow-border-left",
    "box-shadow-selected-hover": "ref-shadow-border-left",
    "box-shadow-selected-active": "ref-shadow-border-left",
    "border-color": "ref-color-transparent",
    "padding-left": "ref-spacing-md",
    "padding-right": "ref-spacing-md",
    "padding-top": "ref-spacing-xs",
    "padding-bottom": "ref-spacing-xs",
    cursor: "ref-cursor-pointer",
    "cursor-disabled": "ref-cursor-not-allowed",
    "font-size": "ref-text-base",
    "text-selected-active": "sys-primary",
    "text-selected-focus": "sys-primary",
    display: "ref-display-flex",
    "align-items": "ref-align-center",
    "justify-content": "ref-justify-between",
    gap: "ref-spacing-sm",
    "background-focus": "sys-hover",
    "box-shadow-focus": "ref-shadow-focus-inset",
    "background-selected-focus": "sys-hover",
    "box-shadow-selected-focus": "ref-shadow-border-left-focus",
  });

  // Caption
  defineTokens("caption", {
    background: "ref-color-transparent",
    text: "sys-on-surface-variant",
    "font-size": "ref-text-base",
    "font-weight": "ref-font-bold",
    display: "ref-display-flex",
    "align-items": "ref-align-center",
    gap: "ref-spacing-xs",
    "padding-left": "ref-spacing-md",
    "padding-right": "ref-spacing-md",
    "padding-top": "ref-spacing-sm",
    "padding-bottom": "ref-spacing-sm",
  });

  // Chip
  defineTokens("chip", {
    background: "sys-surface-container-high",
    text: "sys-on-surface",
    "font-size": "ref-text-sm",
    "font-weight": "ref-font-medium",
    "white-space": "ref-whitespace-nowrap",
    display: "ref-display-inline-flex",
    "align-items": "ref-align-center",
    gap: "ref-spacing-2xs",
    "padding-left": "ref-spacing-sm",
    "padding-right": "ref-spacing-sm",
    "padding-top": "ref-spacing-2xs",
    "padding-bottom": "ref-spacing-2xs",
  });

  // Table of Contents
  defineTokens("toc-root", {
    background: "ref-color-transparent",
    display: "ref-display-flex",
    "flex-direction": "ref-flex-col",
  });

  defineTokens("toc-content", {
    background: "ref-color-transparent",
    display: "ref-display-flex",
    "flex-direction": "ref-flex-col",
    gap: "ref-spacing-none",
  });

  defineTokens("toc-item", {
    background: "ref-color-transparent",
    text: "sys-on-surface-variant",
    "text-hover": "sys-on-surface",
    "text-active": "sys-primary",
    "text-selected": "sys-primary",
    "text-selected-hover": "sys-primary",
    "background-hover": "sys-hover",
    "background-selected": "sys-surface-container-high",
    "background-selected-hover": "sys-hover",
    "box-shadow-selected": "ref-shadow-border-left",
    "box-shadow-selected-hover": "ref-shadow-border-left",
    "box-shadow-selected-active": "ref-shadow-border-left",
    "border-color": "ref-color-transparent",
    "padding-left": "ref-spacing-md",
    "padding-right": "ref-spacing-md",
    "padding-top": "ref-spacing-xs",
    "padding-bottom": "ref-spacing-xs",
    cursor: "ref-cursor-pointer",
    "font-size": "ref-text-base",
    "text-selected-active": "sys-primary",
    "text-selected-focus": "sys-primary",
    display: "ref-display-block",
    "background-focus": "sys-hover",
    "box-shadow-focus": "ref-shadow-focus-inset",
    "background-selected-focus": "sys-hover",
    "box-shadow-selected-focus": "ref-shadow-border-left-focus",
    "white-space": "ref-whitespace-nowrap",
    "overflow-x": "ref-overflow-hidden",
    "text-overflow": "ref-text-overflow-ellipsis",
  });

  // Content Accordion
  defineTokens("content-accordion", {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-col",
    gap: "ref-spacing-md",
    "padding-left": "ref-spacing-md",
    "border-left-width": "ref-border-width-thin",
    "border-left-style": "ref-border-style-solid",
    "border-color": "sys-outline",
  });

  // Content Grid
  defineTokens("content-grid", {
    display: "ref-display-grid",
    "grid-template-columns": "ref-layout-grid-3",
    gap: "ref-spacing-none",
  });

  defineTokens("content-grid-item", {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-col",
    "align-items": "ref-align-start",
    "justify-content": "ref-justify-start",
    gap: "ref-spacing-xs",
    "padding-top": "ref-spacing-md",
    "padding-right": "ref-spacing-lg",
    "padding-bottom": "ref-spacing-md",
    "padding-left": "ref-spacing-lg",
    "text-decoration": "ref-decoration-none",
    "border-top-width": "ref-border-width-thin",
    "border-right-width": "ref-border-width-thin",
    "border-bottom-width": "ref-border-width-thin",
    "border-left-width": "ref-border-width-thin",
    "border-top-style": "ref-border-style-solid",
    "border-right-style": "ref-border-style-solid",
    "border-bottom-style": "ref-border-style-solid",
    "border-left-style": "ref-border-style-solid",
    "border-color": "ref-color-transparent",
    "border-color-hover": "sys-outline",
    "border-color-active": "sys-outline",
    "border-color-focus": "sys-outline",
    "background-hover": "sys-hover",
    "background-focus": "sys-hover",
    "box-shadow-focus": "ref-shadow-focus-inset",
    cursor: "ref-cursor-pointer",
    "transition-duration": "ref-duration-fast",
    "transition-easing": "ref-ease-out",
  });

  defineTokens("content-grid-title", {
    text: "sys-on-surface",
    "font-size": "ref-text-base",
    "font-weight": "ref-font-bold",
  });

  defineTokens("content-grid-description", {
    text: "sys-on-surface-variant",
    "font-size": "ref-text-sm",
    "font-weight": "ref-font-normal",
  });

  defineTokens("content-grid-meta", {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-row",
    gap: "ref-spacing-sm",
    "align-items": "ref-align-center",
    "justify-content": "ref-justify-between",
    width: "ref-full",
  });

  defineTokens("content-grid-author", {
    display: "ref-display-inline-flex",
    "align-items": "ref-align-center",
    gap: "ref-spacing-2xs",
    text: "sys-on-surface-variant",
    "font-size": "ref-text-xs",
    "font-weight": "ref-font-normal",
    "white-space": "ref-whitespace-nowrap",
  });

  defineTokens("content-grid-published", {
    display: "ref-display-inline-flex",
    "align-items": "ref-align-center",
    gap: "ref-spacing-2xs",
    text: "sys-on-surface-variant",
    "font-size": "ref-text-xs",
    "font-weight": "ref-font-normal",
    "white-space": "ref-whitespace-nowrap",
  });

  // Attribution
  defineTokens("attribution-root", {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-col",
    gap: "ref-spacing-md",
    "border-top-width": "ref-border-width-thin",
    "border-top-style": "ref-border-style-solid",
    "border-color": "sys-outline",
    "padding-top": "ref-spacing-lg",
    "padding-bottom": "ref-spacing-lg",
  });

  defineTokens("attribution-container", {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-row",
    "justify-content": "ref-justify-between",
    "align-items": "ref-align-start",
    gap: "ref-spacing-md",
  });

  defineTokens("attribution-meta", {
    display: "ref-display-grid",
    "grid-template-columns": "ref-layout-sidebar-left",
    "align-items": "ref-align-center",
    gap: "ref-spacing-xs",
  });

  defineTokens("attribution-author", {
    text: "sys-on-surface",
    "font-size": "ref-text-base",
    "font-weight": "ref-font-bold",
    "white-space": "ref-whitespace-nowrap",
  });

  defineTokens("attribution-published", {
    text: "sys-on-surface-variant",
    "font-size": "ref-text-sm",
    "font-weight": "ref-font-normal",
    "white-space": "ref-whitespace-nowrap",
  });

  defineTokens("attribution-tags", {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-row",
    "flex-wrap": "ref-flex-wrap",
    "justify-content": "ref-justify-end",
    gap: "ref-spacing-xs",
  });

  // Surround (Prev/Next)
  defineTokens("surround-root", {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-row",
    width: "ref-full",
    gap: "ref-spacing-md",
  });

  defineTokens("surround-prev", {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-col",
    "align-items": "ref-align-start",
    "justify-content": "ref-justify-center",
    "flex-grow": "ref-flex-grow",
    "flex-basis": "ref-flex-basis-half",
    gap: "ref-spacing-xs",
    "padding-top": "ref-spacing-md",
    "padding-right": "ref-spacing-lg",
    "padding-bottom": "ref-spacing-md",
    "padding-left": "ref-spacing-lg",
    "text-decoration": "ref-decoration-none",
    "border-top-width": "ref-border-width-thin",
    "border-right-width": "ref-border-width-thin",
    "border-bottom-width": "ref-border-width-thin",
    "border-left-width": "ref-border-width-thin",
    "border-top-style": "ref-border-style-solid",
    "border-right-style": "ref-border-style-solid",
    "border-bottom-style": "ref-border-style-solid",
    "border-left-style": "ref-border-style-solid",
    "border-color": "sys-outline",
    "border-color-hover": "sys-outline",
    "border-color-active": "sys-outline",
    "border-color-focus": "sys-outline",
    "background-hover": "sys-hover",
    "background-focus": "sys-hover",
    "box-shadow-focus": "ref-shadow-focus-inset",
    cursor: "ref-cursor-pointer",
    "transition-duration": "ref-duration-fast",
    "transition-easing": "ref-ease-out",
  });

  defineTokens("surround-next", {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-col",
    "align-items": "ref-align-end",
    "justify-content": "ref-justify-center",
    "flex-grow": "ref-flex-grow",
    "flex-basis": "ref-flex-basis-half",
    gap: "ref-spacing-xs",
    "padding-top": "ref-spacing-md",
    "padding-right": "ref-spacing-lg",
    "padding-bottom": "ref-spacing-md",
    "padding-left": "ref-spacing-lg",
    "text-decoration": "ref-decoration-none",
    "border-top-width": "ref-border-width-thin",
    "border-right-width": "ref-border-width-thin",
    "border-bottom-width": "ref-border-width-thin",
    "border-left-width": "ref-border-width-thin",
    "border-top-style": "ref-border-style-solid",
    "border-right-style": "ref-border-style-solid",
    "border-bottom-style": "ref-border-style-solid",
    "border-left-style": "ref-border-style-solid",
    "border-color": "sys-outline",
    "border-color-hover": "sys-outline",
    "border-color-active": "sys-outline",
    "border-color-focus": "sys-outline",
    "background-hover": "sys-hover",
    "background-focus": "sys-hover",
    "box-shadow-focus": "ref-shadow-focus-inset",
    cursor: "ref-cursor-pointer",
    "transition-duration": "ref-duration-fast",
    "transition-easing": "ref-ease-out",
  });

  defineTokens("surround-label", {
    display: "ref-display-inline-flex",
    "align-items": "ref-align-center",
    gap: "ref-spacing-2xs",
    text: "sys-on-surface-variant",
    "font-size": "ref-text-sm",
    "font-weight": "ref-font-medium",
  });

  defineTokens("surround-title", {
    text: "sys-on-surface",
    "font-size": "ref-text-base",
    "font-weight": "ref-font-bold",
  });

  defineTokens("surround-prev-description", {
    text: "sys-on-surface-variant",
    "font-size": "ref-text-sm",
    "font-weight": "ref-font-normal",
  });

  defineTokens("surround-next-description", {
    text: "sys-on-surface-variant",
    "font-size": "ref-text-sm",
    "font-weight": "ref-font-normal",
    "text-align": "ref-text-align-end",
  });

  // Tree
  defineTokens("tree-root", {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-col",
  });

  defineTokens("tree-branch", {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-col",
    background: "ref-color-transparent",
    text: "sys-on-surface-variant",
    "text-hover": "sys-on-surface",
    "text-open": "sys-on-surface",
    "text-open-hover": "sys-on-surface",
    "background-hover": "sys-hover",
    cursor: "ref-cursor-pointer",
    "font-size": "ref-text-base",
    "font-weight": "ref-font-normal",
    "font-weight-hover": "ref-font-normal",
    "font-weight-active": "ref-font-normal",
    "font-weight-focus": "ref-font-normal",
    "font-weight-open": "ref-font-normal",
    "font-weight-open-hover": "ref-font-normal",
    "font-weight-open-active": "ref-font-normal",
    "font-weight-open-focus": "ref-font-normal",
    "background-focus": "sys-hover",
    "box-shadow-focus": "ref-shadow-focus-inset",
    "background-open-focus": "sys-hover",
    "box-shadow-open-focus": "ref-shadow-focus-inset",
  });

  defineTokens("tree-branch-content", {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-row",
    "align-items": "ref-align-center",
    "justify-content": "ref-justify-between",
    gap: "ref-spacing-xs",
    "padding-left": "ref-spacing-md",
    "padding-right": "ref-spacing-md",
    "padding-top": "ref-spacing-xs",
    "padding-bottom": "ref-spacing-xs",
  });

  defineTokens("tree-leaf", {
    background: "ref-color-transparent",
    text: "sys-on-surface-variant",
    "text-hover": "sys-on-surface",
    "text-active": "sys-primary",
    "text-selected": "sys-primary",
    "text-selected-hover": "sys-primary",
    "background-hover": "sys-hover",
    "background-selected": "sys-surface-container-high",
    "background-selected-hover": "sys-hover",
    "box-shadow-selected": "ref-shadow-border-left",
    "box-shadow-selected-hover": "ref-shadow-border-left",
    "box-shadow-selected-active": "ref-shadow-border-left",
    "border-color": "ref-color-transparent",
    cursor: "ref-cursor-pointer",
    "font-size": "ref-text-base",
    "text-selected-active": "sys-primary",
    "text-selected-focus": "sys-primary",
    display: "ref-display-flex",
    "flex-direction": "ref-flex-col",
    "background-focus": "sys-hover",
    "box-shadow-focus": "ref-shadow-focus-inset",
    "background-selected-focus": "sys-hover",
    "box-shadow-selected-focus": "ref-shadow-border-left-focus",
  });

  defineTokens("tree-leaf-content", {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-row",
    "align-items": "ref-align-center",
    gap: "ref-spacing-xs",
    "padding-left": "ref-spacing-md",
    "padding-right": "ref-spacing-md",
    "padding-top": "ref-spacing-xs",
    "padding-bottom": "ref-spacing-xs",
    text: "ref-inherit",
    "text-decoration": "ref-decoration-none",
    "font-weight": "ref-font-normal",
  });

  // Tabs
  defineTokens("tabs-root", {
    background: "ref-color-transparent",
  });

  defineTokens("tabs-list", {
    background: "ref-color-transparent",
    display: "ref-display-flex",
    "flex-direction": "ref-flex-row",
    gap: "ref-spacing-none",
    "border-bottom-width": "ref-border-width-thin",
    "border-bottom-style": "ref-border-style-solid",
    "border-color": "sys-outline",
  });

  defineTokens("tabs-trigger", {
    background: "ref-color-transparent",
    text: "sys-on-surface-variant",
    "text-hover": "sys-on-surface",
    "text-active": "sys-primary",
    "text-selected": "sys-primary",
    "text-selected-hover": "sys-primary",
    "text-selected-active": "sys-primary",
    "text-selected-focus": "sys-primary",
    "background-selected": "sys-surface-container-high",
    "border-bottom-width": "ref-hairline",
    "box-shadow-selected": "ref-shadow-border-bottom",
    "box-shadow-selected-hover": "ref-shadow-border-bottom",
    "box-shadow-selected-active": "ref-shadow-border-bottom",
    cursor: "ref-cursor-pointer",
    "font-size": "ref-text-base",
    "font-weight": "ref-font-bold",
    "font-weight-hover": "ref-font-bold",
    "font-weight-active": "ref-font-bold",
    "font-weight-focus": "ref-font-bold",
    "font-weight-selected": "ref-font-bold",
    "font-weight-selected-hover": "ref-font-bold",
    "font-weight-selected-active": "ref-font-bold",
    "font-weight-selected-focus": "ref-font-bold",
    "padding-left": "ref-spacing-lg",
    "padding-right": "ref-spacing-lg",
    "padding-top": "ref-spacing-md",
    "padding-bottom": "ref-spacing-md",
    display: "ref-display-flex",
    "align-items": "ref-align-center",
    "justify-content": "ref-justify-center",
    gap: "ref-spacing-md",
    "background-focus": "sys-hover",
    "box-shadow-focus": "ref-shadow-focus-inset",
    "background-selected-focus": "sys-hover",
    "box-shadow-selected-focus": "ref-shadow-border-bottom-focus",
  });

  defineTokens("tabs-content", {
    background: "ref-color-transparent",
    text: "sys-on-surface",
    "font-size": "ref-text-base",
  });

  // Table
  defineTokens("table", {
    display: "ref-display-table",
    width: "ref-full",
    "border-collapse": "ref-border-collapse",
    "border-top-width": "ref-border-width-thin",
    "border-right-width": "ref-border-width-thin",
    "border-left-width": "ref-border-width-thin",
    "border-top-style": "ref-border-style-solid",
    "border-right-style": "ref-border-style-solid",
    "border-left-style": "ref-border-style-solid",
    "border-color": "sys-outline",
    "margin-top": "ref-spacing-lg",
    "margin-bottom": "ref-spacing-lg",
  });

  defineTokens("thead", {
    display: "ref-display-table-header-group",
    background: "sys-surface-container",
  });

  defineTokens("tbody", {
    display: "ref-display-table-row-group",
  });

  defineTokens("tr", {
    display: "ref-display-table-row",
    "border-bottom-width": "ref-border-width-thin",
    "border-bottom-style": "ref-border-style-solid",
    "border-color": "sys-outline",
  });

  defineTokens("th", {
    display: "ref-display-table-cell",
    text: "sys-on-surface",
    "font-weight": "ref-font-bold",
    "font-size": "ref-text-sm",
    "padding-top": "ref-spacing-sm",
    "padding-right": "ref-spacing-md",
    "padding-bottom": "ref-spacing-sm",
    "padding-left": "ref-spacing-md",
    "text-align": "ref-text-align-start",
    "border-bottom-width": "ref-border-width-thin",
    "border-bottom-style": "ref-border-style-solid",
    "border-color": "sys-outline",
  });

  defineTokens("td", {
    display: "ref-display-table-cell",
    text: "sys-on-surface",
    "font-size": "ref-text-sm",
    "padding-top": "ref-spacing-sm",
    "padding-right": "ref-spacing-md",
    "padding-bottom": "ref-spacing-sm",
    "padding-left": "ref-spacing-md",
    "border-bottom-width": "ref-border-width-thin",
    "border-bottom-style": "ref-border-style-solid",
    "border-color": "sys-outline",
  });

  // Tooltip
  defineTokens("tooltip-content", {
    background: "sys-surface-container",
    text: "sys-on-surface",
    "font-size": "ref-text-sm",
    "padding-left": "ref-spacing-xs",
    "padding-right": "ref-spacing-xs",
    "padding-top": "ref-spacing-xs",
    "padding-bottom": "ref-spacing-xs",
    "border-top-width": "ref-border-width-thin",
    "border-right-width": "ref-border-width-thin",
    "border-bottom-width": "ref-border-width-thin",
    "border-left-width": "ref-border-width-thin",
    "border-top-style": "ref-border-style-solid",
    "border-right-style": "ref-border-style-solid",
    "border-bottom-style": "ref-border-style-solid",
    "border-left-style": "ref-border-style-solid",
    "border-color": "sys-outline",
    "z-index": "ref-z-tooltip",
    display: "ref-display-inline-flex",
    "align-items": "ref-align-center",
    gap: "ref-spacing-xs",
  });

  // Navigator
  defineTokens("navigator-root", {
    display: "ref-display-flex",
    "align-items": "ref-align-center",
    position: "ref-position-relative",
  });

  defineTokens("navigator-list", {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-row",
    "align-items": "ref-align-center",
    gap: "ref-spacing-none",
  });

  defineTokens("navigator-item", {
    display: "ref-display-flex",
  });

  defineTokens("navigator-trigger", {
    background: "ref-color-transparent",
    text: "sys-on-surface-variant",
    "text-hover": "sys-on-surface",
    "text-active": "sys-on-surface",
    "text-open": "sys-on-surface",
    "text-open-hover": "sys-on-surface",
    "text-open-active": "sys-on-surface",
    "text-selected": "sys-primary",
    "text-selected-hover": "sys-primary",
    "text-selected-active": "sys-primary",
    "background-open": "sys-surface-container-high",
    "background-hover": "sys-hover",
    "background-open-hover": "sys-hover",
    "background-selected": "ref-color-transparent",
    "background-selected-hover": "sys-hover",
    "box-shadow-selected": "ref-shadow-border-bottom",
    "box-shadow-selected-hover": "ref-shadow-border-bottom",
    "box-shadow-selected-active": "ref-shadow-border-bottom",
    cursor: "ref-cursor-pointer",
    "font-size": "ref-text-base",
    "font-weight": "ref-font-bold",
    "font-weight-hover": "ref-font-bold",
    "font-weight-active": "ref-font-bold",
    "font-weight-focus": "ref-font-bold",
    "font-weight-open": "ref-font-bold",
    "font-weight-open-hover": "ref-font-bold",
    "font-weight-open-active": "ref-font-bold",
    "font-weight-open-focus": "ref-font-bold",
    "font-weight-selected": "ref-font-bold",
    "font-weight-selected-hover": "ref-font-bold",
    "font-weight-selected-active": "ref-font-bold",
    "font-weight-selected-focus": "ref-font-bold",
    "padding-left": "ref-spacing-lg",
    "padding-right": "ref-spacing-lg",
    "padding-top": "ref-spacing-md",
    "padding-bottom": "ref-spacing-md",
    display: "ref-display-flex",
    "align-items": "ref-align-center",
    "justify-content": "ref-justify-center",
    gap: "ref-spacing-xs",
    "background-focus": "sys-hover",
    "box-shadow-focus": "ref-shadow-focus-inset",
    "background-open-focus": "sys-hover",
    "box-shadow-open-focus": "ref-shadow-focus-inset",
    "background-selected-focus": "sys-hover",
    "box-shadow-selected-focus": "ref-shadow-border-bottom-focus",
  });

  defineTokens("navigator-link", {
    background: "ref-color-transparent",
    text: "sys-on-surface-variant",
    "text-hover": "sys-on-surface",
    "text-active": "sys-on-surface",
    "text-focus": "sys-on-surface",
    "text-selected": "sys-primary",
    "text-selected-hover": "sys-primary",
    "text-selected-active": "sys-primary",
    "text-selected-focus": "sys-primary",
    "background-hover": "sys-hover",
    "background-selected": "ref-color-transparent",
    "background-selected-hover": "sys-hover",
    "box-shadow-selected": "ref-shadow-border-bottom",
    "box-shadow-selected-hover": "ref-shadow-border-bottom",
    "box-shadow-selected-active": "ref-shadow-border-bottom",
    cursor: "ref-cursor-pointer",
    "font-size": "ref-text-base",
    "font-weight": "ref-font-bold",
    "font-weight-hover": "ref-font-bold",
    "font-weight-active": "ref-font-bold",
    "font-weight-focus": "ref-font-bold",
    "font-weight-selected": "ref-font-bold",
    "font-weight-selected-hover": "ref-font-bold",
    "font-weight-selected-active": "ref-font-bold",
    "font-weight-selected-focus": "ref-font-bold",
    "padding-left": "ref-spacing-lg",
    "padding-right": "ref-spacing-lg",
    "padding-top": "ref-spacing-md",
    "padding-bottom": "ref-spacing-md",
    display: "ref-display-flex",
    "align-items": "ref-align-center",
    gap: "ref-spacing-xs",
    "text-decoration": "ref-decoration-none",
    "background-focus": "sys-hover",
    "box-shadow-focus": "ref-shadow-focus-inset",
    "background-selected-focus": "sys-hover",
    "box-shadow-selected-focus": "ref-shadow-border-bottom-focus",
  });

  defineTokens("navigator-content", {
    background: "sys-surface-container",
    text: "sys-on-surface",
    "padding-top": "ref-spacing-sm",
    "padding-right": "ref-spacing-sm",
    "padding-bottom": "ref-spacing-sm",
    "padding-left": "ref-spacing-sm",
    "border-top-width": "ref-border-width-thin",
    "border-right-width": "ref-border-width-thin",
    "border-bottom-width": "ref-border-width-thin",
    "border-left-width": "ref-border-width-thin",
    "border-top-style": "ref-border-style-solid",
    "border-right-style": "ref-border-style-solid",
    "border-bottom-style": "ref-border-style-solid",
    "border-left-style": "ref-border-style-solid",
    "border-color": "sys-outline",
    display: "ref-display-flex",
    "flex-direction": "ref-flex-col",
    gap: "ref-spacing-none",
    width: "ref-max",
  });

  defineTokens("navigator-viewport", {
    position: "ref-position-absolute",
    top: "ref-position-zero",
    "overflow-x": "ref-overflow-hidden",
    "overflow-y": "ref-overflow-hidden",
  });

  defineTokens("navigator-viewport-wrapper", {
    position: "ref-position-absolute",
    top: "ref-position-full-gap-sm",
    left: "ref-position-zero",
    "z-index": "ref-z-dropdown",
    display: "ref-display-flex",
    "justify-content": "ref-justify-start",
    width: "ref-full",
  });

  defineTokens("navigator-indicator", {
    background: "sys-primary",
    height: "ref-hairline",
    position: "ref-position-absolute",
    bottom: "ref-position-zero",
    "z-index": "ref-z-base",
  });

  defineTokens("navigator-grid", {
    display: "ref-display-grid",
    "grid-template-columns": "ref-layout-sidebar-left",
    "grid-template-rows": "ref-layout-split",
    gap: "ref-spacing-sm",
  });

  defineTokens("navigator-card", {
    background: "sys-surface-container",
    text: "sys-on-surface-variant",
    "text-hover": "sys-on-surface",
    "text-active": "sys-on-surface",
    "text-focus": "sys-on-surface",
    "background-hover": "sys-surface-container-high",
    cursor: "ref-cursor-pointer",
    "font-size": "ref-text-base",
    "font-weight": "ref-font-bold",
    "font-weight-hover": "ref-font-bold",
    "font-weight-active": "ref-font-bold",
    "font-weight-focus": "ref-font-bold",
    "padding-left": "ref-spacing-md",
    "padding-right": "ref-spacing-md",
    "padding-top": "ref-spacing-md",
    "padding-bottom": "ref-spacing-md",
    display: "ref-display-flex",
    "flex-direction": "ref-flex-col",
    "align-items": "ref-align-start",
    "justify-content": "ref-justify-start",
    gap: "ref-spacing-xs",
    "text-decoration": "ref-decoration-none",
    "border-top-width": "ref-border-width-thin",
    "border-right-width": "ref-border-width-thin",
    "border-bottom-width": "ref-border-width-thin",
    "border-left-width": "ref-border-width-thin",
    "border-top-style": "ref-border-style-solid",
    "border-right-style": "ref-border-style-solid",
    "border-bottom-style": "ref-border-style-solid",
    "border-left-style": "ref-border-style-solid",
    "border-color": "sys-outline",
    "background-focus": "sys-surface-container-high",
    "box-shadow-focus": "ref-shadow-focus-inset",
    "transition-duration": "ref-duration-fast",
    "transition-easing": "ref-ease-out",
  });

  defineTokens("navigator-featured", {
    background: "sys-surface-container-high",
    text: "sys-on-surface-variant",
    "text-hover": "sys-on-surface",
    "text-active": "sys-on-surface",
    "text-focus": "sys-on-surface",
    "background-hover": "sys-surface-container-highest",
    cursor: "ref-cursor-pointer",
    "font-size": "ref-text-lg",
    "font-weight": "ref-font-bold",
    "font-weight-hover": "ref-font-bold",
    "font-weight-active": "ref-font-bold",
    "font-weight-focus": "ref-font-bold",
    "padding-left": "ref-spacing-lg",
    "padding-right": "ref-spacing-lg",
    "padding-top": "ref-spacing-lg",
    "padding-bottom": "ref-spacing-lg",
    display: "ref-display-flex",
    "flex-direction": "ref-flex-col",
    "align-items": "ref-align-start",
    "justify-content": "ref-justify-start",
    gap: "ref-spacing-sm",
    "text-decoration": "ref-decoration-none",
    "border-top-width": "ref-border-width-thin",
    "border-right-width": "ref-border-width-thin",
    "border-bottom-width": "ref-border-width-thin",
    "border-left-width": "ref-border-width-thin",
    "border-top-style": "ref-border-style-solid",
    "border-right-style": "ref-border-style-solid",
    "border-bottom-style": "ref-border-style-solid",
    "border-left-style": "ref-border-style-solid",
    "border-color": "sys-outline",
    "grid-row": "ref-grid-row-span-all",
    "background-focus": "sys-surface-container-highest",
    "box-shadow-focus": "ref-shadow-focus-inset",
    "transition-duration": "ref-duration-fast",
    "transition-easing": "ref-ease-out",
  });

  defineTokens("navigator-card-description", {
    "font-size": "ref-text-xs",
    "font-weight": "ref-font-normal",
  });

  defineTokens("navigator-featured-description", {
    "font-size": "ref-text-sm",
    "font-weight": "ref-font-normal",
  });

  // Dialog
  defineTokens("dialog-overlay", {
    background: "sys-surface",
    opacity: "ref-opacity-50",
    position: "ref-position-fixed",
    top: "ref-position-zero",
    left: "ref-position-zero",
    right: "ref-position-zero",
    bottom: "ref-position-zero",
    "z-index": "ref-z-overlay",
  });

  defineTokens("dialog-content", {
    background: "sys-surface-container",
    text: "sys-on-surface",
    position: "ref-position-fixed",
    top: "ref-position-half",
    left: "ref-position-half",
    transform: "ref-transform-center",
    width: "ref-width-xl",
    "max-height": "ref-viewport-60",
    "overflow-y": "ref-overflow-hidden",
    "border-top-width": "ref-border-width-thin",
    "border-right-width": "ref-border-width-thin",
    "border-bottom-width": "ref-border-width-thin",
    "border-left-width": "ref-border-width-thin",
    "border-top-style": "ref-border-style-solid",
    "border-right-style": "ref-border-style-solid",
    "border-bottom-style": "ref-border-style-solid",
    "border-left-style": "ref-border-style-solid",
    "border-color": "sys-outline",
    "z-index": "ref-z-modal",
  });

  defineTokens("dialog-title", {
    display: "ref-display-block",
    text: "sys-on-surface",
    "font-size": "ref-text-lg",
    "font-weight": "ref-font-bold",
    "padding-top": "ref-spacing-md",
    "padding-right": "ref-spacing-md",
    "padding-bottom": "ref-spacing-xs",
    "padding-left": "ref-spacing-md",
  });

  defineTokens("dialog-description", {
    display: "ref-display-block",
    text: "sys-on-surface-variant",
    "font-size": "ref-text-sm",
    "padding-top": "ref-spacing-xs",
    "padding-right": "ref-spacing-md",
    "padding-bottom": "ref-spacing-md",
    "padding-left": "ref-spacing-md",
    "border-bottom-width": "ref-border-width-thin",
    "border-bottom-style": "ref-border-style-solid",
    "border-color": "sys-outline-variant",
  });

  // Typography
  defineTokens("p", {
    text: "sys-on-surface",
    "font-size": "ref-text-base",
    "font-weight": "ref-font-normal",
    "line-height": "ref-leading-normal",
    display: "ref-display-block",
    "margin-top": "ref-spacing-base",
    "margin-bottom": "ref-spacing-base",
  });

  defineTokens("h1", {
    text: "sys-on-surface",
    "font-size": "ref-text-4xl",
    "font-weight": "ref-font-bold",
    "line-height": "ref-leading-tighter",
    display: "ref-display-block",
    "margin-top": "ref-spacing-none",
    "margin-bottom": "ref-spacing-xl",
  });

  defineTokens("h2", {
    text: "sys-on-surface",
    "font-size": "ref-text-2xl",
    "font-weight": "ref-font-bold",
    "line-height": "ref-leading-snug",
    display: "ref-display-block",
    "margin-top": "ref-spacing-2xl",
    "margin-bottom": "ref-spacing-lg",
    "scroll-margin-top": "ref-scroll-lg",
  });

  defineTokens("h3", {
    text: "sys-on-surface",
    "font-size": "ref-text-xl",
    "font-weight": "ref-font-semibold",
    "line-height": "ref-leading-cozy",
    display: "ref-display-block",
    "margin-top": "ref-spacing-xl",
    "margin-bottom": "ref-spacing-sm",
    "scroll-margin-top": "ref-scroll-lg",
  });

  defineTokens("h4", {
    text: "sys-on-surface",
    "font-size": "ref-text-base",
    "font-weight": "ref-font-semibold",
    "line-height": "ref-leading-normal",
    display: "ref-display-block",
    "margin-top": "ref-spacing-lg",
    "margin-bottom": "ref-spacing-xs",
    "scroll-margin-top": "ref-scroll-lg",
  });

  defineTokens("h5", {
    text: "sys-on-surface-variant",
    "font-size": "ref-text-base",
    "font-weight": "ref-font-semibold",
    "line-height": "ref-leading-normal",
    display: "ref-display-block",
    "margin-top": "ref-spacing-lg",
    "margin-bottom": "ref-spacing-xs",
    "scroll-margin-top": "ref-scroll-lg",
  });

  defineTokens("h6", {
    text: "sys-on-surface-variant",
    "font-size": "ref-text-base",
    "font-weight": "ref-font-medium",
    "line-height": "ref-leading-normal",
    display: "ref-display-block",
    "margin-top": "ref-spacing-lg",
    "margin-bottom": "ref-spacing-xs",
    "scroll-margin-top": "ref-scroll-lg",
  });

  defineTokens("code", {
    text: "sys-on-surface",
    background: "sys-surface-container",
    "font-family": "ref-font-mono",
    "font-size": "ref-text-sm",
    "padding-top": "ref-spacing-none",
    "padding-right": "ref-spacing-2xs",
    "padding-bottom": "ref-spacing-none",
    "padding-left": "ref-spacing-2xs",
    "border-top-width": "ref-border-width-thin",
    "border-right-width": "ref-border-width-thin",
    "border-bottom-width": "ref-border-width-thin",
    "border-left-width": "ref-border-width-thin",
    "border-top-style": "ref-border-style-solid",
    "border-right-style": "ref-border-style-solid",
    "border-bottom-style": "ref-border-style-solid",
    "border-left-style": "ref-border-style-solid",
    "border-color": "sys-outline",
    display: "ref-display-inline-block",
  });

  defineTokens("kbd", {
    text: "sys-on-surface",
    background: "sys-surface-container-high",
    "font-family": "ref-font-mono",
    "font-size": "ref-text-xs",
    "font-weight": "ref-font-semibold",
    "padding-top": "ref-spacing-2xs",
    "padding-right": "ref-spacing-2xs",
    "padding-bottom": "ref-spacing-2xs",
    "padding-left": "ref-spacing-2xs",
    "border-top-width": "ref-border-width-thin",
    "border-right-width": "ref-border-width-thin",
    "border-bottom-width": "ref-border-width-thin",
    "border-left-width": "ref-border-width-thin",
    "border-top-style": "ref-border-style-solid",
    "border-right-style": "ref-border-style-solid",
    "border-bottom-style": "ref-border-style-solid",
    "border-left-style": "ref-border-style-solid",
    "border-color": "sys-outline",
    display: "ref-display-inline-flex",
    "align-items": "ref-align-center",
    gap: "ref-spacing-2xs",
  });

  defineTokens("pre", {
    text: "sys-on-surface",
    background: "sys-surface-container",
    "font-family": "ref-font-mono",
    "font-size": "ref-text-sm",
    "padding-top": "ref-spacing-md",
    "padding-right": "ref-spacing-md",
    "padding-bottom": "ref-spacing-md",
    "padding-left": "ref-spacing-md",
    "border-top-width": "ref-border-width-thin",
    "border-right-width": "ref-border-width-thin",
    "border-bottom-width": "ref-border-width-thin",
    "border-left-width": "ref-border-width-thin",
    "border-top-style": "ref-border-style-solid",
    "border-right-style": "ref-border-style-solid",
    "border-bottom-style": "ref-border-style-solid",
    "border-left-style": "ref-border-style-solid",
    "border-color": "sys-outline",
    display: "ref-display-block",
    "overflow-x": "ref-overflow-auto",
    "margin-top": "ref-spacing-base",
    "margin-bottom": "ref-spacing-base",
  });

  defineTokens("strong", {
    "font-weight": "ref-font-bold",
    display: "ref-display-inline",
  });

  defineTokens("em", {
    "font-style": "ref-font-italic",
    display: "ref-display-inline",
  });

  defineTokens("del", {
    "text-decoration": "ref-decoration-line-through",
    display: "ref-display-inline",
  });

  defineTokens("blockquote", {
    text: "sys-on-surface-variant",
    "font-style": "ref-font-italic",
    "border-left-width": "ref-border-width-thick",
    "border-left-style": "ref-border-style-solid",
    "border-color": "sys-outline",
    "padding-left": "ref-spacing-lg",
    "margin-top": "ref-spacing-xl",
    "margin-bottom": "ref-spacing-xl",
    display: "ref-display-block",
  });

  defineTokens("hr", {
    "border-top-width": "ref-border-width-thin",
    "border-top-style": "ref-border-style-solid",
    "border-color": "sys-outline",
    "margin-top": "ref-spacing-2xl",
    "margin-bottom": "ref-spacing-2xl",
    display: "ref-display-block",
  });

  defineTokens("ul", {
    "list-style-type": "ref-list-disc",
    "padding-left": "ref-spacing-xl",
    "margin-top": "ref-spacing-base",
    "margin-bottom": "ref-spacing-base",
    display: "ref-display-block",
  });

  defineTokens("ol", {
    "list-style-type": "ref-list-decimal",
    "padding-left": "ref-spacing-xl",
    "margin-top": "ref-spacing-base",
    "margin-bottom": "ref-spacing-base",
    display: "ref-display-block",
  });

  defineTokens("li", {
    display: "ref-display-list-item",
    "margin-top": "ref-spacing-xs",
    "margin-bottom": "ref-spacing-xs",
  });

  // Content Search
  defineTokens("content-search-root", {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-col",
    "max-height": "ref-full",
    "overflow-y": "ref-overflow-hidden",
  });

  defineTokens("content-search-status", {
    text: "sys-on-surface-variant",
    "font-size": "ref-text-sm",
    "text-align": "ref-text-align-center",
    "padding-top": "ref-spacing-md",
    "padding-bottom": "ref-spacing-md",
  });

  defineTokens("content-search-results", {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-col",
    "flex-grow": "ref-flex-grow",
    "flex-shrink": "ref-flex-shrink",
    "min-height": "ref-none",
    "overflow-y": "ref-overflow-auto",
  });

  defineTokens("content-search-result", {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-row",
    "align-items": "ref-align-center",
    gap: "ref-spacing-xs",
    "padding-top": "ref-spacing-sm",
    "padding-right": "ref-spacing-md",
    "padding-bottom": "ref-spacing-sm",
    "padding-left": "ref-spacing-md",
    background: "ref-color-transparent",
    "background-hover": "sys-hover",
    "box-shadow-focus": "ref-shadow-focus-inset",
    cursor: "ref-cursor-pointer",
    "text-align": "ref-text-align-start",
    width: "ref-full",
    "transition-duration": "ref-duration-fast",
    "transition-easing": "ref-ease-out",
  });

  defineTokens("content-search-result-title", {
    text: "sys-on-surface",
    "font-size": "ref-text-sm",
    "font-weight": "ref-font-bold",
    "white-space": "ref-whitespace-nowrap",
    "overflow-x": "ref-overflow-hidden",
    "text-overflow": "ref-text-overflow-ellipsis",
  });

  defineTokens("content-search-group", {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-col",
  });

  defineTokens("content-search-group-title", {
    text: "sys-on-surface-variant",
    "font-size": "ref-text-xs",
    "font-weight": "ref-font-bold",
    "padding-top": "ref-spacing-sm",
    "padding-right": "ref-spacing-md",
    "padding-bottom": "ref-spacing-xs",
    "padding-left": "ref-spacing-md",
  });

  defineTokens("content-search-result-separator", {
    display: "ref-display-inline-flex",
    "align-items": "ref-align-center",
    "justify-content": "ref-justify-center",
    text: "sys-on-surface-variant",
  });

  defineTokens("content-search-result-date", {
    text: "sys-on-surface-variant",
    "font-size": "ref-text-xs",
    "margin-left": "ref-auto",
    "white-space": "ref-whitespace-nowrap",
  });

  // Command (used by ContentSearch)
  defineTokens("command-root", {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-col",
    "max-height": "ref-full",
    "overflow-x": "ref-overflow-hidden",
    "overflow-y": "ref-overflow-hidden",
  });

  defineTokens("command-input", {
    background: "sys-surface",
    text: "sys-on-surface",
    "border-top-width": "ref-border-width-none",
    "border-right-width": "ref-border-width-none",
    "border-bottom-width": "ref-border-width-thin",
    "border-left-width": "ref-border-width-none",
    "border-top-style": "ref-border-style-none",
    "border-right-style": "ref-border-style-none",
    "border-bottom-style": "ref-border-style-solid",
    "border-left-style": "ref-border-style-none",
    "border-color": "sys-outline-variant",
    "border-color-hover": "sys-outline-variant",
    "border-color-focus": "sys-outline-variant",
    "outline-width": "ref-outline-width-none",
    "padding-top": "ref-spacing-sm",
    "padding-right": "ref-spacing-md",
    "padding-bottom": "ref-spacing-sm",
    "padding-left": "ref-spacing-md",
    "font-size": "ref-text-sm",
    width: "ref-full",
    "box-shadow-focus": "ref-shadow-focus-inset",
  });

  defineTokens("command-content", {
    position: "ref-position-relative",
    display: "ref-display-flex",
    "flex-direction": "ref-flex-col",
    "flex-grow": "ref-flex-grow",
    "flex-shrink": "ref-flex-shrink",
    "min-height": "ref-none",
    "overflow-y": "ref-overflow-auto",
  });

  defineTokens("command-viewport", {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-col",
    "flex-grow": "ref-flex-grow",
    "min-height": "ref-none",
  });

  defineTokens("command-group", {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-col",
  });

  defineTokens("command-label", {
    text: "sys-on-surface-variant",
    "font-size": "ref-text-xs",
    "font-weight": "ref-font-bold",
    "padding-top": "ref-spacing-sm",
    "padding-right": "ref-spacing-md",
    "padding-bottom": "ref-spacing-xs",
    "padding-left": "ref-spacing-md",
  });

  defineTokens("command-item", {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-row",
    "align-items": "ref-align-center",
    gap: "ref-spacing-xs",
    "padding-top": "ref-spacing-sm",
    "padding-right": "ref-spacing-md",
    "padding-bottom": "ref-spacing-sm",
    "padding-left": "ref-spacing-md",
    background: "ref-color-transparent",
    "background-hover": "sys-hover",
    "background-selected": "sys-hover",
    "box-shadow-focus": "ref-shadow-focus-inset",
    cursor: "ref-cursor-pointer",
    "text-align": "ref-text-align-start",
    width: "ref-full",
    "transition-duration": "ref-duration-fast",
    "transition-easing": "ref-ease-out",
  });

  defineTokens("command-empty", {
    text: "sys-on-surface-variant",
    "font-size": "ref-text-sm",
    "text-align": "ref-text-align-center",
    "padding-top": "ref-spacing-md",
    "padding-bottom": "ref-spacing-md",
  });
});
