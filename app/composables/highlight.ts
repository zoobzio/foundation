import { ref, toValue, watchEffect, type MaybeRefOrGetter } from "#imports";
import { codeToHast } from "shiki";
import { toHtml } from "hast-util-to-html";
import shikiTheme from "#foundation/utils/shiki-theme";

export const useHighlight = (code: MaybeRefOrGetter<string>, lang: MaybeRefOrGetter<string>) => {
  const highlighted = ref("");

  watchEffect(async () => {
    const c = toValue(code);
    const l = toValue(lang);
    if (!c || !l) {
      highlighted.value = "";
      return;
    }
    const tree = await codeToHast(c, { lang: l, theme: shikiTheme });
    const pre = tree.children.find(
      (n) => "tagName" in n && n.tagName === "pre",
    );
    if (!pre || !("children" in pre)) {
      highlighted.value = "";
      return;
    }
    const codeEl = pre.children.find(
      (n) => "tagName" in n && n.tagName === "code",
    );
    if (!codeEl || !("children" in codeEl)) {
      highlighted.value = "";
      return;
    }
    highlighted.value = toHtml(codeEl.children);
  });

  return highlighted;
};
