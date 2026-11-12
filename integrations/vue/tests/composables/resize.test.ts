// The resize composable over a plain width record and a spy commit.
import { afterEach, describe, expect, it, vi } from "vitest";
import { useResize } from "../../src/composables/resize";
import { RESIZE_STEP } from "../../src/constants/resize";

const setup = (initial: Record<string, number> = {}, rendered = 120) => {
  const widths: Record<string, number> = { ...initial };
  const commit = vi.fn((key: string, width: number) => {
    widths[key] = width;
  });
  const reset = vi.fn();
  const item = document.createElement("div");
  const handle = document.createElement("span");
  item.append(handle);
  document.body.append(item);
  item.getBoundingClientRect = () => ({ width: rendered }) as DOMRect;
  const resize = useResize((key) => widths[key], commit, reset);
  return { widths, commit, reset, item, handle, resize };
};

const pointer = (handle: Element, clientX: number, over = {}) =>
  ({
    button: 0,
    pointerId: 1,
    clientX,
    currentTarget: handle,
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
    ...over,
  }) as unknown as PointerEvent;

const key = (handle: Element, name: string) =>
  ({
    key: name,
    currentTarget: handle,
    preventDefault: vi.fn(),
  }) as unknown as KeyboardEvent;

afterEach(() => {
  document.body.innerHTML = "";
});

describe("useResize", () => {
  it("commits the start width plus the pointer's travel as it moves", () => {
    const { commit, handle, resize } = setup({ a: 200 });
    const down = pointer(handle, 100);
    resize.onPointerDown("a", down);
    expect(down.preventDefault).toHaveBeenCalled();
    expect(resize.isResizing("a")).toBe(true);
    resize.onPointerMove("a", pointer(handle, 130));
    expect(commit).toHaveBeenLastCalledWith("a", 230);
    resize.onPointerMove("a", pointer(handle, 60));
    expect(commit).toHaveBeenLastCalledWith("a", 160);
    resize.onPointerEnd(pointer(handle, 60));
    expect(resize.resizeKey.value).toBeNull();
    resize.onPointerMove("a", pointer(handle, 500));
    expect(commit).toHaveBeenCalledTimes(2);
  });

  it("starts an unsized item from the rendered width of the handle's parent", () => {
    const { commit, handle, resize } = setup({}, 120);
    resize.onPointerDown("a", pointer(handle, 0));
    resize.onPointerMove("a", pointer(handle, 10));
    expect(commit).toHaveBeenLastCalledWith("a", 130);
  });

  it("flips the travel in a right-to-left context", () => {
    const { commit, item, handle, resize } = setup({ a: 200 });
    item.style.direction = "rtl";
    resize.onPointerDown("a", pointer(handle, 100));
    resize.onPointerMove("a", pointer(handle, 70));
    expect(commit).toHaveBeenLastCalledWith("a", 230);
  });

  it("ignores a secondary button and another pointer", () => {
    const { commit, handle, resize } = setup({ a: 200 });
    resize.onPointerDown("a", pointer(handle, 100, { button: 2 }));
    expect(resize.resizeKey.value).toBeNull();
    resize.onPointerDown("a", pointer(handle, 100));
    resize.onPointerMove("a", pointer(handle, 150, { pointerId: 2 }));
    resize.onPointerEnd(pointer(handle, 150, { pointerId: 2 }));
    expect(commit).not.toHaveBeenCalled();
    expect(resize.isResizing("a")).toBe(true);
  });

  it("steps by the arrow keys and resets on Enter and a double click", () => {
    const { commit, reset, handle, resize } = setup({ a: 200 });
    resize.onKeyDown("a", key(handle, "ArrowRight"));
    expect(commit).toHaveBeenLastCalledWith("a", 200 + RESIZE_STEP);
    resize.onKeyDown("a", key(handle, "ArrowLeft"));
    expect(commit).toHaveBeenLastCalledWith("a", 200);
    resize.onKeyDown("a", key(handle, "Tab"));
    expect(commit).toHaveBeenCalledTimes(2);
    resize.onKeyDown("a", key(handle, "Enter"));
    resize.handleAttrs("a").onDblclick();
    expect(reset).toHaveBeenCalledTimes(2);
    expect(reset).toHaveBeenLastCalledWith("a");
  });
});
