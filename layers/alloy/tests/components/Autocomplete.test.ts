import { describe, it, expect, vi } from "vitest";
import { nextTick } from "vue";
import { mountAutocomplete } from "../fixtures";

describe("Autocomplete", () => {
  describe("static", () => {
    const wrapper = mountAutocomplete();

    it("renders root with f-autocomplete class", () => {
      expect(wrapper.find(".f-autocomplete").exists()).toBe(true);
    });

    it("renders input with f-autocomplete-input class", () => {
      expect(wrapper.find(".f-autocomplete-input").exists()).toBe(true);
    });

    it("does not render dropdown when not focused", () => {
      expect(wrapper.find(".f-autocomplete-dropdown").exists()).toBe(false);
    });

    it("renders hint wrap", () => {
      expect(wrapper.find(".f-autocomplete-hint").exists()).toBe(true);
    });
  });

  describe("focus / blur", () => {
    it("shows dropdown with suggestions on focus", async () => {
      const wrapper = mountAutocomplete();
      await wrapper.find(".f-autocomplete-input").trigger("focus");
      await nextTick();
      expect(wrapper.find(".f-autocomplete-dropdown").exists()).toBe(true);
    });

    it("renders suggestion items when focused", async () => {
      const wrapper = mountAutocomplete();
      await wrapper.find(".f-autocomplete-input").trigger("focus");
      await nextTick();
      const items = wrapper.findAll(".f-autocomplete-item");
      expect(items).toHaveLength(3);
    });

    it("emits focus on input focus", async () => {
      const wrapper = mountAutocomplete();
      await wrapper.find(".f-autocomplete-input").trigger("focus");
      expect(wrapper.emitted("focus")).toBeTruthy();
    });

    it("emits blur after input blur (delayed)", async () => {
      vi.useFakeTimers();
      const wrapper = mountAutocomplete();
      await wrapper.find(".f-autocomplete-input").trigger("focus");
      await wrapper.find(".f-autocomplete-input").trigger("blur");
      vi.advanceTimersByTime(150);
      await nextTick();
      expect(wrapper.emitted("blur")).toBeTruthy();
      vi.useRealTimers();
    });

    it("hides dropdown after blur", async () => {
      vi.useFakeTimers();
      const wrapper = mountAutocomplete();
      await wrapper.find(".f-autocomplete-input").trigger("focus");
      await nextTick();
      await wrapper.find(".f-autocomplete-input").trigger("blur");
      vi.advanceTimersByTime(150);
      await nextTick();
      expect(wrapper.find(".f-autocomplete-dropdown").exists()).toBe(false);
      vi.useRealTimers();
    });
  });

  describe("panels", () => {
    it("renders step panels + suggestion panel when steps provided", async () => {
      const wrapper = mountAutocomplete({
        steps: [{ label: "Status", value: "status", icon: "filter" }],
        suggestions: [{ label: "Active", value: "Active" }],
      });
      await wrapper.find(".f-autocomplete-input").trigger("focus");
      await nextTick();
      const panels = wrapper.findAll(".f-autocomplete-panel");
      // 1 step panel + 1 suggestion panel
      expect(panels).toHaveLength(2);
    });

    it("marks step panel items as locked", async () => {
      const wrapper = mountAutocomplete({
        steps: [{ label: "Status", value: "status", icon: "filter" }],
        suggestions: [{ label: "Active", value: "Active" }],
      });
      await wrapper.find(".f-autocomplete-input").trigger("focus");
      await nextTick();
      expect(wrapper.find(".f-autocomplete-item--locked").exists()).toBe(true);
    });

    it("highlights first suggestion by default", async () => {
      const wrapper = mountAutocomplete();
      await wrapper.find(".f-autocomplete-input").trigger("focus");
      await nextTick();
      const highlighted = wrapper.find(".f-autocomplete-item--highlighted");
      expect(highlighted.exists()).toBe(true);
      expect(highlighted.text()).toContain("Search");
    });

    it("shows empty state when showEmpty and no suggestions", async () => {
      const wrapper = mountAutocomplete({ suggestions: [], showEmpty: true });
      await wrapper.find(".f-autocomplete-input").trigger("focus");
      await nextTick();
      expect(wrapper.find(".f-autocomplete-empty").exists()).toBe(true);
      expect(wrapper.text()).toContain("No matches");
    });

    it("renders item icons when provided", async () => {
      const wrapper = mountAutocomplete();
      await wrapper.find(".f-autocomplete-input").trigger("focus");
      await nextTick();
      expect(wrapper.findAll(".f-autocomplete-item-icon").length).toBeGreaterThan(0);
    });

    it("renders arrow icon for hasChildren items", async () => {
      const wrapper = mountAutocomplete();
      await wrapper.find(".f-autocomplete-input").trigger("focus");
      await nextTick();
      expect(wrapper.findAll(".f-autocomplete-item-arrow").length).toBeGreaterThan(0);
    });

    it("marks disabled items", async () => {
      const wrapper = mountAutocomplete({
        suggestions: [
          { label: "Active", value: "Active", disabled: true },
          { label: "Pending", value: "Pending" },
        ],
      });
      await wrapper.find(".f-autocomplete-input").trigger("focus");
      await nextTick();
      expect(wrapper.find(".f-autocomplete-item--disabled").exists()).toBe(true);
    });
  });

  describe("keyboard — arrow navigation", () => {
    it("ArrowDown moves highlight to next item", async () => {
      const wrapper = mountAutocomplete();
      await wrapper.find(".f-autocomplete-input").trigger("focus");
      await nextTick();
      await wrapper.find(".f-autocomplete-input").trigger("keydown", { key: "ArrowDown" });
      await nextTick();
      const highlighted = wrapper.find(".f-autocomplete-item--highlighted");
      expect(highlighted.text()).toContain("Status");
    });

    it("ArrowUp moves highlight to previous item", async () => {
      const wrapper = mountAutocomplete();
      await wrapper.find(".f-autocomplete-input").trigger("focus");
      await nextTick();
      // Move down twice then up once
      await wrapper.find(".f-autocomplete-input").trigger("keydown", { key: "ArrowDown" });
      await wrapper.find(".f-autocomplete-input").trigger("keydown", { key: "ArrowDown" });
      await wrapper.find(".f-autocomplete-input").trigger("keydown", { key: "ArrowUp" });
      await nextTick();
      const highlighted = wrapper.find(".f-autocomplete-item--highlighted");
      expect(highlighted.text()).toContain("Status");
    });

    it("ArrowDown skips disabled items", async () => {
      const wrapper = mountAutocomplete({
        suggestions: [
          { label: "A", value: "a" },
          { label: "B", value: "b", disabled: true },
          { label: "C", value: "c" },
        ],
      });
      await wrapper.find(".f-autocomplete-input").trigger("focus");
      await nextTick();
      await wrapper.find(".f-autocomplete-input").trigger("keydown", { key: "ArrowDown" });
      await nextTick();
      const highlighted = wrapper.find(".f-autocomplete-item--highlighted");
      expect(highlighted.text()).toContain("C");
    });

    it("ArrowDown does not go past last item", async () => {
      const wrapper = mountAutocomplete({
        suggestions: [{ label: "Only", value: "only" }],
      });
      await wrapper.find(".f-autocomplete-input").trigger("focus");
      await nextTick();
      await wrapper.find(".f-autocomplete-input").trigger("keydown", { key: "ArrowDown" });
      await nextTick();
      const highlighted = wrapper.find(".f-autocomplete-item--highlighted");
      expect(highlighted.text()).toContain("Only");
    });
  });

  describe("keyboard — enter", () => {
    it("Enter emits select with highlighted item", async () => {
      const wrapper = mountAutocomplete();
      await wrapper.find(".f-autocomplete-input").trigger("focus");
      await nextTick();
      await wrapper.find(".f-autocomplete-input").trigger("keydown", { key: "Enter" });
      expect(wrapper.emitted("select")?.[0]?.[0]).toEqual(
        expect.objectContaining({ value: "__search" }),
      );
    });

    it("Enter emits submit when no suggestions", async () => {
      const wrapper = mountAutocomplete({ modelValue: "hello", suggestions: [] });
      await wrapper.find(".f-autocomplete-input").trigger("focus");
      await nextTick();
      await wrapper.find(".f-autocomplete-input").trigger("keydown", { key: "Enter" });
      expect(wrapper.emitted("submit")?.[0]).toEqual(["hello"]);
    });

    it("Enter emits submit when not focused (no dropdown)", async () => {
      const wrapper = mountAutocomplete({ modelValue: "hello", suggestions: [] });
      await wrapper.find(".f-autocomplete-input").trigger("keydown", { key: "Enter" });
      expect(wrapper.emitted("submit")?.[0]).toEqual(["hello"]);
    });
  });

  describe("keyboard — forwarding", () => {
    it("forwards Backspace as keydown event", async () => {
      const wrapper = mountAutocomplete();
      await wrapper.find(".f-autocomplete-input").trigger("focus");
      await nextTick();
      await wrapper.find(".f-autocomplete-input").trigger("keydown", { key: "Backspace" });
      const emitted = wrapper.emitted("keydown");
      expect(emitted).toBeTruthy();
      expect((emitted![0][0] as KeyboardEvent).key).toBe("Backspace");
    });

    it("forwards Escape as keydown event", async () => {
      const wrapper = mountAutocomplete();
      await wrapper.find(".f-autocomplete-input").trigger("focus");
      await nextTick();
      await wrapper.find(".f-autocomplete-input").trigger("keydown", { key: "Escape" });
      const emitted = wrapper.emitted("keydown");
      expect(emitted).toBeTruthy();
      expect((emitted![0][0] as KeyboardEvent).key).toBe("Escape");
    });
  });

  describe("mouse interaction", () => {
    it("clicking a suggestion emits select", async () => {
      const wrapper = mountAutocomplete();
      await wrapper.find(".f-autocomplete-input").trigger("focus");
      await nextTick();
      const items = wrapper.findAll(".f-autocomplete-item");
      await items[1].trigger("mousedown");
      expect(wrapper.emitted("select")?.[0]?.[0]).toEqual(
        expect.objectContaining({ value: "status" }),
      );
    });

    it("clicking a locked step emits unwind", async () => {
      const wrapper = mountAutocomplete({
        steps: [{ label: "Status", value: "status", icon: "filter" }],
        suggestions: [{ label: "Active", value: "Active" }],
      });
      await wrapper.find(".f-autocomplete-input").trigger("focus");
      await nextTick();
      // The first item is the locked step
      const items = wrapper.findAll(".f-autocomplete-item");
      await items[0].trigger("mousedown");
      expect(wrapper.emitted("unwind")?.[0]).toEqual([0]);
    });

    it("clicking a disabled item does not emit select", async () => {
      const wrapper = mountAutocomplete({
        suggestions: [{ label: "Disabled", value: "d", disabled: true }],
      });
      await wrapper.find(".f-autocomplete-input").trigger("focus");
      await nextTick();
      await wrapper.findAll(".f-autocomplete-item")[0].trigger("mousedown");
      expect(wrapper.emitted("select")).toBeFalsy();
    });
  });

  describe("hint", () => {
    it("renders hint character when provided", () => {
      const wrapper = mountAutocomplete({ modelValue: '"hello', hint: '"' });
      expect(wrapper.find(".f-autocomplete-hint-char").text()).toBe('"');
    });

    it("renders model value in hint text", () => {
      const wrapper = mountAutocomplete({ modelValue: '"hello', hint: '"' });
      expect(wrapper.find(".f-autocomplete-hint-text").text()).toBe('"hello');
    });

    it("adds ghost class to input when hint present", () => {
      const wrapper = mountAutocomplete({ hint: '"' });
      expect(wrapper.find(".f-autocomplete-input--ghost").exists()).toBe(true);
    });

    it("no ghost class without hint", () => {
      const wrapper = mountAutocomplete();
      expect(wrapper.find(".f-autocomplete-input--ghost").exists()).toBe(false);
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto root", () => {
      const wrapper = mountAutocomplete({ pt: { root: { props: { class: "custom" } } } });
      expect(wrapper.find(".f-autocomplete").classes()).toContain("custom");
    });
  });
});
