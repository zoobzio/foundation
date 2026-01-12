export type MouseEvents = {
  click: [MouseEvent];
  dblclick: [MouseEvent];

  mousedown: [MouseEvent];
  mouseup: [MouseEvent];
  mousemove: [MouseEvent];

  mouseenter: [MouseEvent];
  mouseleave: [MouseEvent];

  mouseover: [MouseEvent];
  mouseout: [MouseEvent];

  contextmenu: [MouseEvent];
};

export type PointerEvents = {
  pointerdown: [PointerEvent];
  pointerup: [PointerEvent];
  pointermove: [PointerEvent];

  pointerenter: [PointerEvent];
  pointerleave: [PointerEvent];

  pointerover: [PointerEvent];
  pointerout: [PointerEvent];

  pointercancel: [PointerEvent];
};

export type KeyboardEvents = {
  keydown: [KeyboardEvent];
  keyup: [KeyboardEvent];
};

export type FocusEvents = {
  focus: [FocusEvent];
  blur: [FocusEvent];

  focusin: [FocusEvent];
  focusout: [FocusEvent];
};

export type DragEvents = {
  dragstart: [DragEvent];
  drag: [DragEvent];
  dragend: [DragEvent];

  dragenter: [DragEvent];
  dragover: [DragEvent];
  dragleave: [DragEvent];

  drop: [DragEvent];
};

export type TouchEvents = {
  touchstart: [TouchEvent];
  touchmove: [TouchEvent];
  touchend: [TouchEvent];
  touchcancel: [TouchEvent];
};

export type ClipboardEvents = {
  copy: [ClipboardEvent];
  cut: [ClipboardEvent];
  paste: [ClipboardEvent];
};

export type CompositionEvents = {
  compositionstart: [CompositionEvent];
  compositionupdate: [CompositionEvent];
  compositionend: [CompositionEvent];
};

export type InputEvents = {
  input: [InputEvent];
  beforeinput: [InputEvent];
  change: [Event];
};

export type UIEvents = {
  scroll: [Event];
  select: [Event];
};
