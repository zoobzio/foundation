// The drag composable over a plain order and a spy commit.
import { describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { useDrag } from "../../src/composables/drag";

const dragEvent = () =>
  ({ preventDefault: vi.fn(), dataTransfer: null }) as unknown as DragEvent;

const setup = (options?: { handle?: boolean }) => {
  const order = ref(["a", "b", "c"]);
  const move = vi.fn((key: string, toKey: string) => {
    const next = order.value.filter((k) => k !== key);
    next.splice(order.value.indexOf(toKey), 0, key);
    order.value = next;
  });
  return { order, move, drag: useDrag(order, move, options) };
};

describe("useDrag", () => {
  it("commits through move on drop and resets its state on end", () => {
    const { order, move, drag } = setup();
    drag.onDragStart("a", dragEvent());
    drag.onDragOver("c", dragEvent());
    expect(drag.dropSide.value).toBe("after");
    expect(drag.dropSideFor("c")).toBe("after");
    expect(drag.dropSideFor("b")).toBeNull();
    drag.onDrop("c", dragEvent());
    expect(move).toHaveBeenCalledWith("a", "c");
    expect(order.value).toEqual(["b", "c", "a"]);
    drag.onDragEnd();
    expect(drag.dragKey.value).toBeNull();
    expect(drag.dropKey.value).toBeNull();
  });

  it("reports before when the drop target precedes the dragged key", () => {
    const { drag } = setup();
    drag.onDragStart("c", dragEvent());
    drag.onDragOver("a", dragEvent());
    expect(drag.dropSide.value).toBe("before");
  });

  it("ignores a drag over or drop on the dragged key", () => {
    const { move, drag } = setup();
    drag.onDragStart("a", dragEvent());
    drag.onDragOver("a", dragEvent());
    expect(drag.dropKey.value).toBeNull();
    drag.onDrop("a", dragEvent());
    expect(move).toHaveBeenCalledWith("a", "a");
  });

  it("ignores a drop with no drag in progress", () => {
    const { move, drag } = setup();
    drag.onDrop("b", dragEvent());
    expect(move).not.toHaveBeenCalled();
  });

  it("clears the drop target only on a leave from that target", () => {
    const { drag } = setup();
    drag.onDragStart("a", dragEvent());
    drag.onDragOver("b", dragEvent());
    drag.onDragLeave("c");
    expect(drag.dropKey.value).toBe("b");
    drag.onDragLeave("b");
    expect(drag.dropKey.value).toBeNull();
  });

  it("gates draggable on the armed handle when handle is set", () => {
    const { drag } = setup({ handle: true });
    expect(drag.isDraggable("a")).toBe(false);
    drag.arm("a");
    expect(drag.isDraggable("a")).toBe(true);
    expect(drag.isDraggable("b")).toBe(false);
    drag.onDragStart("a", dragEvent());
    drag.disarm();
    expect(drag.armedKey.value).toBe("a");
    drag.onDragEnd();
    expect(drag.armedKey.value).toBeNull();
  });

  it("drags every item without a handle", () => {
    const { drag } = setup();
    expect(drag.itemAttrs("a").draggable).toBe(true);
  });

  it("bundles the item and handle listeners", () => {
    const { drag } = setup({ handle: true });
    const handle = drag.handleAttrs("b");
    handle.onMouseenter();
    expect(drag.itemAttrs("b").draggable).toBe(true);
    const item = drag.itemAttrs("b");
    item.onDragstart(dragEvent());
    expect(drag.isDragging("b")).toBe(true);
    drag.itemAttrs("c").onDragover(dragEvent());
    expect(drag.dropSideFor("c")).toBe("after");
    item.onDragend();
    expect(drag.isDragging("b")).toBe(false);
  });
});
