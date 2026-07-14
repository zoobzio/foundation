import { describe, it, expect, vi } from "vitest";
import { nextTick } from "vue";
import { mountPagination } from "#test/support/fixtures/components";

describe("Pagination", () => {
  describe("static", () => {
    const wrapper = mountPagination({ page: 5, pageCount: 20, total: 200 });

    it("renders root with f-pagination class", () => {
      expect(wrapper.find(".f-pagination").exists()).toBe(true);
    });

    it("shows page info text", () => {
      expect(wrapper.text()).toContain("Page 5 of 20 (200 results)");
    });

    it("renders page numbers with ellipsis", () => {
      const numbers = wrapper.findAll(".f-pagination-number");
      const texts = numbers.map((b) => b.text().trim());
      expect(texts[0]).toBe("1");
      expect(texts).toContain("...");
      expect(texts[texts.length - 1]).toBe("20");
    });
  });

  describe("interaction", () => {
    it("calls goToPage on page number click", async () => {
      const goToPage = vi.fn();
      const wrapper = mountPagination({ page: 5, pageCount: 20, total: 200, goToPage });
      const numbers = wrapper.findAll(".f-pagination-number");
      // Click the first page number (should be "1")
      await numbers[0].trigger("click");
      expect(goToPage).toHaveBeenCalledWith(1);
    });

    it("emits update:pageSize via Select", async () => {
      const wrapper = mountPagination({ page: 1, pageCount: 10, total: 100 });
      wrapper.findComponent({ name: "Select" }).vm.$emit("update:modelValue", "50");
      await nextTick();
      expect(wrapper.emitted("update:pageSize")?.[0]).toEqual([50]);
    });

    it("calls goToPage via nav Fab click handlers", async () => {
      const goToPage = vi.fn();
      const wrapper = mountPagination({ page: 5, pageCount: 20, total: 200, goToPage });
      const fabs = wrapper.findAllComponents({ name: "Fab" });
      // Fabs are: first, prev, next, last
      fabs[0].vm.$emit("click");
      fabs[1].vm.$emit("click");
      fabs[2].vm.$emit("click");
      fabs[3].vm.$emit("click");
      await nextTick();
      expect(goToPage).toHaveBeenCalledWith(1);
      expect(goToPage).toHaveBeenCalledWith(4);
      expect(goToPage).toHaveBeenCalledWith(6);
      expect(goToPage).toHaveBeenCalledWith(20);
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto root", () => {
      const wrapper = mountPagination({ pt: { root: { props: { class: "custom" } } } });
      expect(wrapper.find(".f-pagination").classes()).toContain("custom");
    });
  });
});
