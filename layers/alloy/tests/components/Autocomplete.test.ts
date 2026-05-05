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
    it("shows dropdown with suggestions on focus and emits focus", async () => {
      const wrapper = mountAutocomplete();
      await wrapper.find(".f-autocomplete-input").trigger("focus");
      await nextTick();
      expect(wrapper.find(".f-autocomplete-dropdown").exists()).toBe(true);
      expect(wrapper.emitted("focus")).toBeTruthy();
      const items = wrapper.findAll(".f-autocomplete-item");
      expect(items).toHaveLength(3);
    });

    it("emits blur and hides dropdown after blur", async () => {
      vi.useFakeTimers();
      const wrapper = mountAutocomplete();
      await wrapper.find(".f-autocomplete-input").trigger("focus");
      await nextTick();
      await wrapper.find(".f-autocomplete-input").trigger("blur");
      vi.advanceTimersByTime(150);
      await nextTick();
      expect(wrapper.emitted("blur")).toBeTruthy();
      expect(wrapper.find(".f-autocomplete-dropdown").exists()).toBe(false);
      vi.useRealTimers();
    });
  });

  describe("panels", () => {
    it("renders step panels + suggestion panel and marks locked items", async () => {
      const wrapper = mountAutocomplete({
        steps: [{ label: "Status", value: "status", icon: "filter" }],
        suggestions: [{ label: "Active", value: "Active" }],
      });
      await wrapper.find(".f-autocomplete-input").trigger("focus");
      await nextTick();
      const panels = wrapper.findAll(".f-autocomplete-panel");
      expect(panels).toHaveLength(2);
      expect(wrapper.find(".f-autocomplete-item--locked").exists()).toBe(true);
    });

    it("highlights first suggestion by default and renders icons", async () => {
      const wrapper = mountAutocomplete();
      await wrapper.find(".f-autocomplete-input").trigger("focus");
      await nextTick();
      const highlighted = wrapper.find(".f-autocomplete-item--highlighted");
      expect(highlighted.exists()).toBe(true);
      expect(highlighted.text()).toContain("Search");
      expect(wrapper.findAll(".f-autocomplete-item-icon").length).toBeGreaterThan(0);
      expect(wrapper.findAll(".f-autocomplete-item-arrow").length).toBeGreaterThan(0);
    });

    it("shows empty state when showEmpty and no suggestions", async () => {
      const wrapper = mountAutocomplete({ suggestions: [], showEmpty: true });
      await wrapper.find(".f-autocomplete-input").trigger("focus");
      await nextTick();
      expect(wrapper.find(".f-autocomplete-empty").exists()).toBe(true);
      expect(wrapper.text()).toContain("No matches");
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
    it("ArrowDown moves highlight, ArrowUp moves back", async () => {
      const wrapper = mountAutocomplete();
      const input = wrapper.find(".f-autocomplete-input");
      await input.trigger("focus");
      await nextTick();
      await input.trigger("keydown", { key: "ArrowDown" });
      await nextTick();
      expect(wrapper.find(".f-autocomplete-item--highlighted").text()).toContain("Status");
      await input.trigger("keydown", { key: "ArrowDown" });
      await input.trigger("keydown", { key: "ArrowUp" });
      await nextTick();
      expect(wrapper.find(".f-autocomplete-item--highlighted").text()).toContain("Status");
    });

    it("ArrowDown skips disabled items", async () => {
      const wrapper = mountAutocomplete({
        suggestions: [
          { label: "A", value: "a" },
          { label: "B", value: "b", disabled: true },
          { label: "C", value: "c" },
        ],
      });
      const input = wrapper.find(".f-autocomplete-input");
      await input.trigger("focus");
      await nextTick();
      await input.trigger("keydown", { key: "ArrowDown" });
      await nextTick();
      expect(wrapper.find(".f-autocomplete-item--highlighted").text()).toContain("C");
    });

    it("ArrowDown does not go past last item", async () => {
      const wrapper = mountAutocomplete({
        suggestions: [{ label: "Only", value: "only" }],
      });
      const input = wrapper.find(".f-autocomplete-input");
      await input.trigger("focus");
      await nextTick();
      await input.trigger("keydown", { key: "ArrowDown" });
      await nextTick();
      expect(wrapper.find(".f-autocomplete-item--highlighted").text()).toContain("Only");
    });

    it("ArrowDown/Up skips leading and mid disabled items", async () => {
      const wrapper = mountAutocomplete({
        suggestions: [
          { label: "D1", value: "d1", disabled: true },
          { label: "D2", value: "d2", disabled: true },
          { label: "Enabled", value: "e" },
        ],
      });
      const input = wrapper.find(".f-autocomplete-input");
      await input.trigger("focus");
      await nextTick();
      await input.trigger("keydown", { key: "ArrowDown" });
      await nextTick();
      expect(wrapper.find(".f-autocomplete-item--highlighted").text()).toContain("Enabled");
    });
  });

  describe("keyboard — enter", () => {
    it("Enter emits select with highlighted item", async () => {
      const wrapper = mountAutocomplete();
      const input = wrapper.find(".f-autocomplete-input");
      await input.trigger("focus");
      await nextTick();
      await input.trigger("keydown", { key: "Enter" });
      expect(wrapper.emitted("select")?.[0]?.[0]).toEqual(
        expect.objectContaining({ value: "__search" }),
      );
    });

    it("Enter emits submit when no suggestions or not focused", async () => {
      const wrapper = mountAutocomplete({ modelValue: "hello", suggestions: [] });
      const input = wrapper.find(".f-autocomplete-input");
      await input.trigger("focus");
      await nextTick();
      await input.trigger("keydown", { key: "Enter" });
      expect(wrapper.emitted("submit")?.[0]).toEqual(["hello"]);
    });

    it("Enter emits submit instead of select when highlighted item is disabled", async () => {
      const wrapper = mountAutocomplete({
        modelValue: "test",
        suggestions: [{ label: "Only", value: "only", disabled: true }],
      });
      const input = wrapper.find(".f-autocomplete-input");
      await input.trigger("focus");
      await nextTick();
      await input.trigger("keydown", { key: "Enter" });
      expect(wrapper.emitted("select")).toBeFalsy();
      expect(wrapper.emitted("submit")?.[0]).toEqual(["test"]);
    });
  });

  describe("keyboard — forwarding", () => {
    it("forwards Backspace and Escape as keydown events", async () => {
      const wrapper = mountAutocomplete();
      const input = wrapper.find(".f-autocomplete-input");
      await input.trigger("focus");
      await nextTick();
      await input.trigger("keydown", { key: "Backspace" });
      await input.trigger("keydown", { key: "Escape" });
      const emitted = wrapper.emitted("keydown");
      expect(emitted).toBeTruthy();
      expect((emitted![0][0] as KeyboardEvent).key).toBe("Backspace");
      expect((emitted![1][0] as KeyboardEvent).key).toBe("Escape");
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
    const wrapper = mountAutocomplete({ modelValue: '"hello', hint: '"' });

    it("renders hint character and text", () => {
      expect(wrapper.find(".f-autocomplete-hint-char").text()).toBe('"');
      expect(wrapper.find(".f-autocomplete-hint-text").text()).toBe('"hello');
    });

    it("adds ghost class to input when hint present", () => {
      expect(wrapper.find(".f-autocomplete-input--ghost").exists()).toBe(true);
    });

    it("no ghost class without hint", () => {
      const noHint = mountAutocomplete();
      expect(noHint.find(".f-autocomplete-input--ghost").exists()).toBe(false);
    });
  });

  describe("onInput", () => {
    it("emits update:modelValue on input event", async () => {
      const wrapper = mountAutocomplete({ modelValue: "" });
      const input = wrapper.find(".f-autocomplete-input");

      const inputEvent = new Event("input", { bubbles: true });
      Object.defineProperty(inputEvent, "target", { value: { value: "typed" } });
      input.element.dispatchEvent(inputEvent);
      await nextTick();

      expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["typed"]);
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto root", () => {
      const wrapper = mountAutocomplete({ pt: { root: { props: { class: "custom" } } } });
      expect(wrapper.find(".f-autocomplete").classes()).toContain("custom");
    });
  });
});
