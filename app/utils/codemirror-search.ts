import { StateEffect, StateField } from "@codemirror/state";
import { Decoration, EditorView, ViewPlugin } from "@codemirror/view";
import { SearchCursor } from "@codemirror/search";
import type { DecorationSet } from "@codemirror/view";
import type { Range } from "@codemirror/state";

const setSearchTerm = StateEffect.define<string>();
const setActiveIndex = StateEffect.define<number>();

interface SearchState {
  term: string;
  activeIndex: number;
}

const searchField = StateField.define<SearchState>({
  create: () => ({ term: "", activeIndex: 0 }),
  update(value, tr) {
    let next = value;
    for (const effect of tr.effects) {
      if (effect.is(setSearchTerm)) {
        next = { term: effect.value, activeIndex: 0 };
      } else if (effect.is(setActiveIndex)) {
        next = { ...next, activeIndex: effect.value };
      }
    }
    return next;
  },
});

const matchMark = Decoration.mark({ class: "cm-searchMatch" });
const activeMark = Decoration.mark({ class: "cm-searchMatch-selected" });

const searchHighlighter = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    matchCount = 0;
    matchPositions: { from: number; to: number }[] = [];

    constructor(view: EditorView) {
      this.decorations = this.buildDecorations(view);
    }

    update(update: {
      state: { field: (f: typeof searchField) => SearchState };
      startState: { field: (f: typeof searchField) => SearchState };
      docChanged: boolean;
      view: EditorView;
    }) {
      const state = update.state.field(searchField);
      const prev = update.startState.field(searchField);
      if (
        state.term !== prev.term ||
        state.activeIndex !== prev.activeIndex ||
        update.docChanged
      ) {
        this.decorations = this.buildDecorations(update.view);
      }
    }

    buildDecorations(view: EditorView) {
      const { term, activeIndex } = view.state.field(searchField);
      if (!term) {
        this.matchCount = 0;
        this.matchPositions = [];
        return Decoration.none;
      }

      const marks: Range<Decoration>[] = [];
      const positions: { from: number; to: number }[] = [];
      const cursor = new SearchCursor(view.state.doc, term);

      while (!cursor.next().done) {
        positions.push({ from: cursor.value.from, to: cursor.value.to });
      }

      this.matchCount = positions.length;
      this.matchPositions = positions;

      for (let i = 0; i < positions.length; i++) {
        const pos = positions[i]!;
        const mark = i === activeIndex ? activeMark : matchMark;
        marks.push(mark.range(pos.from, pos.to));
      }

      return Decoration.set(marks);
    }
  },
  { decorations: (v) => v.decorations },
);

export function codeViewSearch() {
  return [searchField, searchHighlighter];
}

export function dispatchSearch(view: EditorView, term: string) {
  view.dispatch({ effects: setSearchTerm.of(term) });
}

export function findNextMatch(view: EditorView) {
  const plugin = view.plugin(searchHighlighter);
  if (!plugin || plugin.matchCount === 0) return;
  const state = view.state.field(searchField);
  const next = (state.activeIndex + 1) % plugin.matchCount;
  view.dispatch({ effects: setActiveIndex.of(next) });
  const pos = plugin.matchPositions[next];
  if (pos) scrollToMatch(view, pos);
}

export function findPrevMatch(view: EditorView) {
  const plugin = view.plugin(searchHighlighter);
  if (!plugin || plugin.matchCount === 0) return;
  const state = view.state.field(searchField);
  const prev = (state.activeIndex - 1 + plugin.matchCount) % plugin.matchCount;
  view.dispatch({ effects: setActiveIndex.of(prev) });
  const pos = plugin.matchPositions[prev];
  if (pos) scrollToMatch(view, pos);
}

function scrollToMatch(view: EditorView, pos: { from: number; to: number }) {
  if (!pos) return;
  view.dispatch({
    effects: EditorView.scrollIntoView(pos.from, { y: "center" }),
  });
}
