import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { mountPagination } from "#test/support/fixtures/components";

// Core tests stub the tier below: Group/Span/Button (common) and Fab/Select
// (core) are replaced by name, so assertions target the stubs by component name
// and their rendered text.
describe("Pagination", () => {
  describe("static", () => {
    const wrapper = mountPagination({ page: 5, count: 20, total: 200 });

    it("renders the root part", () => {
      expect(wrapper.findComponent({ name: "Group" }).exists()).toBe(true);
    });

    it("shows the page info text", () => {
      expect(wrapper.text()).toContain("Page 5 of 20 (200 results)");
    });

    it("renders page numbers with an ellipsis", () => {
      const texts = wrapper
        .findAllComponents({ name: "Button" })
        .map((b) => b.text().trim());
      expect(texts[0]).toBe("1");
      expect(texts).toContain("...");
      expect(texts[texts.length - 1]).toBe("20");
    });
  });

  describe("interaction", () => {
    it("emits update:page on a page-number click", async () => {
      const wrapper = mountPagination({ page: 5, count: 20, total: 200 });
      const first = wrapper
        .findAllComponents({ name: "Button" })
        .find((b) => b.text().trim() === "1");
      await first?.trigger("click");
      expect(wrapper.emitted("update:page")?.[0]).toEqual([1]);
    });

    it("emits update:size via Select", async () => {
      const wrapper = mountPagination({ page: 1, count: 10, total: 100 });
      wrapper.findComponent({ name: "Select" }).vm.$emit("update:modelValue", "50");
      await nextTick();
      expect(wrapper.emitted("update:size")?.[0]).toEqual([50]);
    });

    it("emits update:page via the nav Fab click handlers", async () => {
      const wrapper = mountPagination({ page: 5, count: 20, total: 200 });
      const fabs = wrapper.findAllComponents({ name: "Fab" });
      // Fabs are, in order: first, prev, next, last
      fabs[0].vm.$emit("click");
      fabs[1].vm.$emit("click");
      fabs[2].vm.$emit("click");
      fabs[3].vm.$emit("click");
      await nextTick();
      const pages = wrapper.emitted("update:page")?.map((e) => e[0]);
      expect(pages).toEqual([1, 4, 6, 20]);
    });

    it("clamps navigation to the valid range", async () => {
      const wrapper = mountPagination({ page: 1, count: 20, total: 200 });
      const fabs = wrapper.findAllComponents({ name: "Fab" });
      // On page 1, "prev" would target 0 — out of range, so no emit.
      fabs[1].vm.$emit("click");
      await nextTick();
      expect(wrapper.emitted("update:page")).toBeUndefined();
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto the root part", () => {
      const wrapper = mountPagination({ pt: { root: { class: "custom" } } });
      expect(wrapper.findComponent({ name: "Group" }).classes()).toContain("custom");
    });
  });
});
