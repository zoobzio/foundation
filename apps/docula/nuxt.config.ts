import { defineNuxtConfig } from "nuxt/config";
import blocks from "@foundation/blocks/elements";
import prose from "@foundation/prose/elements";
import elements from "./elements.config";

export default defineNuxtConfig({
  compatibilityDate: "2025-11-17",
  extends: ["@foundation/prose"],
  modules: ["nuxt-typed-router"],
  app: {
    head: {
      title: "Docula",
      meta: [
        {
          name: "description",
          content: "Documentation site built with Foundation",
        },
      ],
    },
  },
  untheme: {
    elements: {
      // Blocks: Interactive elements
      a: blocks.a,
      button: blocks.button,
      card: blocks.card,
      link: blocks.link,
      group: blocks.group,

      // Blocks: Accordion
      "accordion-root": blocks.accordionRoot,
      "accordion-item": blocks.accordionItem,
      "accordion-header": blocks.accordionHeader,
      "accordion-trigger": blocks.accordionTrigger,
      "accordion-trigger-content": blocks.accordionTriggerContent,
      "accordion-content": blocks.accordionContent,

      // Blocks: Breadcrumbs
      "breadcrumbs-root": blocks.breadcrumbsRoot,
      "breadcrumbs-list": blocks.breadcrumbsList,
      "breadcrumbs-item": blocks.breadcrumbsItem,
      "breadcrumbs-link": blocks.breadcrumbsLink,
      "breadcrumbs-current": blocks.breadcrumbsCurrent,
      "breadcrumbs-separator": blocks.breadcrumbsSeparator,

      // Blocks: Checkbox
      "checkbox-root": blocks.checkboxRoot,
      "checkbox-indicator": blocks.checkboxIndicator,

      // Blocks: Layout
      aside: blocks.aside,
      header: blocks.header,
      footer: blocks.footer,
      main: blocks.main,
      section: blocks.section,
      article: blocks.article,
      nav: blocks.nav,

      // Blocks: Avatar
      "avatar-root": blocks.avatarRoot,
      "avatar-image": blocks.avatarImage,
      "avatar-fallback": blocks.avatarFallback,

      // Blocks: Icon
      icon: blocks.icon,

      // Blocks: Img
      img: blocks.img,

      // Blocks: Input
      input: blocks.input,

      // Blocks: Label
      label: blocks.label,

      // Blocks: Caption
      caption: blocks.caption,

      // Blocks: Chip
      chip: blocks.chip,

      // Blocks: Select
      "select-root": blocks.selectRoot,
      "select-trigger": blocks.selectTrigger,
      "select-content": blocks.selectContent,
      "select-item": blocks.selectItem,

      // Blocks: Tags Input
      "tags-input-root": blocks.tagsInputRoot,
      "tags-input-item": blocks.tagsInputItem,
      "tags-input-item-text": blocks.tagsInputItemText,
      "tags-input-item-delete": blocks.tagsInputItemDelete,
      "tags-input-input": blocks.tagsInputInput,
      "tags-input-clear": blocks.tagsInputClear,

      // Blocks: Listbox
      "listbox-root": blocks.listboxRoot,
      "listbox-content": blocks.listboxContent,
      "listbox-item": blocks.listboxItem,

      // Blocks: Table
      table: blocks.table,
      thead: blocks.thead,
      tbody: blocks.tbody,
      tr: blocks.tr,
      th: blocks.th,
      td: blocks.td,

      // Blocks: Tabs
      "tabs-root": blocks.tabsRoot,
      "tabs-list": blocks.tabsList,
      "tabs-trigger": blocks.tabsTrigger,
      "tabs-content": blocks.tabsContent,

      // Blocks: Tree
      "tree-root": blocks.treeRoot,
      "tree-branch": blocks.treeBranch,
      "tree-branch-content": blocks.treeBranchContent,
      "tree-branch-label": blocks.treeBranchLabel,
      "tree-leaf": blocks.treeLeaf,
      "tree-leaf-content": blocks.treeLeafContent,

      // Blocks: Tooltip
      "tooltip-content": blocks.tooltipContent,

      // Blocks: Navigator
      "navigator-root": blocks.navigatorRoot,
      "navigator-list": blocks.navigatorList,
      "navigator-item": blocks.navigatorItem,
      "navigator-trigger": blocks.navigatorTrigger,
      "navigator-link": blocks.navigatorLink,
      "navigator-content": blocks.navigatorContent,
      "navigator-viewport": blocks.navigatorViewport,
      "navigator-viewport-wrapper": blocks.navigatorViewportWrapper,
      "navigator-indicator": blocks.navigatorIndicator,
      "navigator-grid": blocks.navigatorGrid,
      "navigator-card": blocks.navigatorCard,
      "navigator-card-title": blocks.navigatorCardTitle,
      "navigator-card-description": blocks.navigatorCardDescription,
      "navigator-featured": blocks.navigatorFeatured,
      "navigator-featured-title": blocks.navigatorFeaturedTitle,
      "navigator-featured-description": blocks.navigatorFeaturedDescription,

      // Blocks: Dialog
      "dialog-overlay": blocks.dialogOverlay,
      "dialog-content": blocks.dialogContent,
      "dialog-title": blocks.dialogTitle,
      "dialog-description": blocks.dialogDescription,

      // Blocks: Popover
      "popover-trigger": blocks.popoverTrigger,
      "popover-content": blocks.popoverContent,
      "popover-arrow": blocks.popoverArrow,
      "popover-close": blocks.popoverClose,

      // Blocks: Command
      "command-root": blocks.commandRoot,
      "command-input": blocks.commandInput,
      "command-content": blocks.commandContent,
      "command-viewport": blocks.commandViewport,
      "command-group": blocks.commandGroup,
      "command-label": blocks.commandLabel,
      "command-item": blocks.commandItem,
      "command-empty": blocks.commandEmpty,

      // Blocks: Typography
      p: blocks.p,
      h1: blocks.h1,
      h2: blocks.h2,
      h3: blocks.h3,
      h4: blocks.h4,
      h5: blocks.h5,
      h6: blocks.h6,
      code: blocks.code,
      kbd: blocks.kbd,
      pre: blocks.pre,
      strong: blocks.strong,
      em: blocks.em,
      del: blocks.del,
      blockquote: blocks.blockquote,
      hr: blocks.hr,
      ul: blocks.ul,
      ol: blocks.ol,
      li: blocks.li,

      // Prose: Table of Contents
      "toc-root": prose.tocRoot,
      "toc-content": prose.tocContent,
      "toc-item": prose.tocItem,

      // Prose: Attribution
      "attribution-root": prose.attributionRoot,
      "attribution-container": prose.attributionContainer,
      "attribution-meta": prose.attributionMeta,
      "attribution-author": prose.attributionAuthor,
      "attribution-published": prose.attributionPublished,
      "attribution-tags": prose.attributionTags,

      // Prose: Content Grid
      "content-grid": prose.contentGrid,
      "content-grid-item": prose.contentGridItem,
      "content-grid-title": prose.contentGridTitle,
      "content-grid-description": prose.contentGridDescription,
      "content-grid-meta": prose.contentGridMeta,
      "content-grid-author": prose.contentGridAuthor,
      "content-grid-published": prose.contentGridPublished,

      // Prose: Surround (Prev/Next)
      "surround-root": prose.surroundRoot,
      "surround-prev": prose.surroundPrev,
      "surround-next": prose.surroundNext,
      "surround-label": prose.surroundLabel,
      "surround-title": prose.surroundTitle,
      "surround-prev-description": prose.surroundPrevDescription,
      "surround-next-description": prose.surroundNextDescription,

      // Prose: Content Filters
      "content-filters-section": prose.contentFiltersSection,

      // Prose: Content Accordion
      "content-accordion": prose.contentAccordion,

      // Prose: Content Search
      "content-search-root": prose.contentSearchRoot,
      "content-search-status": prose.contentSearchStatus,
      "content-search-results": prose.contentSearchResults,
      "content-search-group": prose.contentSearchGroup,
      "content-search-group-title": prose.contentSearchGroupTitle,
      "content-search-result": prose.contentSearchResult,
      "content-search-result-title": prose.contentSearchResultTitle,
      "content-search-result-separator": prose.contentSearchResultSeparator,
      "content-search-result-date": prose.contentSearchResultDate,

      // Docula: App-specific
      "community-root": elements.communityRoot,
      "community-content": elements.communityContent,
      "community-item": elements.communityItem,
      container: elements.container,
    },
  },
});
