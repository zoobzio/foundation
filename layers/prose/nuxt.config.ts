import { defineNuxtConfig } from "nuxt/config";
import highlights from "./config/highlights";
import elements from "./elements.config";

export default defineNuxtConfig({
  extends: ["@foundation/blocks"],
  modules: ["@nuxt/content"],
  content: {
    database: process.env.DATABASE_URL
      ? {
          type: "postgresql",
          url: process.env.DATABASE_URL,
        }
      : undefined,
    build: {
      markdown: {
        highlight: {
          theme: {
            default: highlights,
          },
          langs: [
            "json",
            "js",
            "ts",
            "tsx",
            "vue",
            "css",
            "html",
            "bash",
            "md",
            "mdc",
            "yaml",
            "go",
            "sql",
          ],
        },
      },
    },
  },
  untheme: {
    elements: {
      // Table of Contents
      "toc-root": elements.tocRoot,
      "toc-content": elements.tocContent,
      "toc-item": elements.tocItem,

      // Attribution
      "attribution-root": elements.attributionRoot,
      "attribution-container": elements.attributionContainer,
      "attribution-meta": elements.attributionMeta,
      "attribution-author": elements.attributionAuthor,
      "attribution-published": elements.attributionPublished,
      "attribution-tags": elements.attributionTags,

      // Content Grid
      "content-grid": elements.contentGrid,
      "content-grid-item": elements.contentGridItem,
      "content-grid-title": elements.contentGridTitle,
      "content-grid-description": elements.contentGridDescription,
      "content-grid-meta": elements.contentGridMeta,
      "content-grid-author": elements.contentGridAuthor,
      "content-grid-published": elements.contentGridPublished,

      // Surround (Prev/Next)
      "surround-root": elements.surroundRoot,
      "surround-prev": elements.surroundPrev,
      "surround-next": elements.surroundNext,
      "surround-label": elements.surroundLabel,
      "surround-title": elements.surroundTitle,
      "surround-prev-description": elements.surroundPrevDescription,
      "surround-next-description": elements.surroundNextDescription,

      // Content Filters
      "content-filters-section": elements.contentFiltersSection,

      // Content Accordion
      "content-accordion": elements.contentAccordion,

      // Content Search
      "content-search-root": elements.contentSearchRoot,
      "content-search-status": elements.contentSearchStatus,
      "content-search-results": elements.contentSearchResults,
      "content-search-group": elements.contentSearchGroup,
      "content-search-group-title": elements.contentSearchGroupTitle,
      "content-search-result": elements.contentSearchResult,
      "content-search-result-title": elements.contentSearchResultTitle,
      "content-search-result-separator": elements.contentSearchResultSeparator,
      "content-search-result-date": elements.contentSearchResultDate,
    },
  },
});
