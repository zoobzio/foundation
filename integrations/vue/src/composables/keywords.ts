import type { KeywordsMatchMode } from "../types/components/keywords";
import type { Ref } from "vue";

import { computed, ref, watch } from "vue";
import { parse, build } from "../utils/keywords";

/**
 * Edits a keyword expression (`+term -"phrase" || ...`) as include and
 * exclude tag lists plus a match mode. Each edit rebuilds the expression and
 * writes it to the model.
 *
 * @param model - The keyword expression.
 */
export const useKeywords = (model: Ref<string>) => {
  const includeInput = ref("");
  const excludeInput = ref("");

  const parsed = computed(() => parse(model.value));

  // The mode must survive an empty include list, which encodes no mode.
  const isOrMode = computed(() => model.value.includes("||"));
  const mode = ref<KeywordsMatchMode>(isOrMode.value ? "or" : "and");
  watch(isOrMode, (v) => {
    mode.value = v ? "or" : "and";
  });

  const rebuild = (nextInclude: string[], nextExclude: string[]) => {
    model.value = build(nextInclude, nextExclude, mode.value);
  };

  const include = computed<string[]>({
    get: () => parsed.value.include,
    set: (val) => {
      const kept = parsed.value.exclude.filter((t) => !val.includes(t));
      rebuild(val, kept);
    },
  });

  const exclude = computed<string[]>({
    get: () => parsed.value.exclude,
    set: (val) => {
      const kept = parsed.value.include.filter((t) => !val.includes(t));
      rebuild(kept, val);
    },
  });

  watch(mode, () => rebuild(parsed.value.include, parsed.value.exclude));

  const activeCount = computed(
    () => parsed.value.include.length + parsed.value.exclude.length,
  );

  const setMode = (value: string) => {
    if (value === "and" || value === "or") mode.value = value;
  };

  const addTag = (term: string, target: "include" | "exclude") => {
    if (!term) return;
    if (target === "include") {
      if (include.value.includes(term)) return;
      include.value = [...include.value, term];
    } else {
      if (exclude.value.includes(term)) return;
      exclude.value = [...exclude.value, term];
    }
  };

  const removeTag = (term: string, target: "include" | "exclude") => {
    if (target === "include") {
      include.value = include.value.filter((t) => t !== term);
    } else {
      exclude.value = exclude.value.filter((t) => t !== term);
    }
  };

  const handleInput = (raw: string, target: "include" | "exclude"): string => {
    if (raw.startsWith('"')) {
      if (raw.endsWith('"') && raw.length > 2) {
        addTag(raw.slice(1, -1), target);
        return "";
      }
      return raw;
    }
    if (raw.endsWith(" ")) {
      const term = raw.trim();
      if (term) addTag(term, target);
      return "";
    }
    return raw;
  };

  const onIncludeInput = (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      includeInput.value = handleInput(event.target.value, "include");
    }
  };

  const onExcludeInput = (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      excludeInput.value = handleInput(event.target.value, "exclude");
    }
  };

  const onIncludeKeydown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const term = includeInput.value.trim().replace(/^"|"$/g, "");
      if (term) addTag(term, "include");
      includeInput.value = "";
    }
    const last = include.value.at(-1);
    if (
      event.key === "Backspace" &&
      !includeInput.value &&
      last !== undefined
    ) {
      removeTag(last, "include");
    }
  };

  const onExcludeKeydown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const term = excludeInput.value.trim().replace(/^"|"$/g, "");
      if (term) addTag(term, "exclude");
      excludeInput.value = "";
    }
    const last = exclude.value.at(-1);
    if (
      event.key === "Backspace" &&
      !excludeInput.value &&
      last !== undefined
    ) {
      removeTag(last, "exclude");
    }
  };

  return {
    mode,
    include,
    exclude,
    includeInput,
    excludeInput,
    activeCount,
    setMode,
    onIncludeInput,
    onExcludeInput,
    onIncludeKeydown,
    onExcludeKeydown,
  };
};
