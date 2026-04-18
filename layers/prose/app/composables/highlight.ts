import { codeToHast } from "shiki";
import { toHtml } from "hast-util-to-html";
import highlights from "../../config/highlights";

export const useHighlight = (code: string, lang: string) => {
  const { data } = useAsyncData(
    `highlight:${code}`,
    async () => {
      const tree = await codeToHast(code, { lang, theme: highlights });
      const pre = tree.children.find(
        (n): n is typeof n & { tagName: string } =>
          "tagName" in n && n.tagName === "pre",
      );
      const codeEl = pre?.children.find(
        (n): n is typeof n & { tagName: string } =>
          "tagName" in n && n.tagName === "code",
      );
      if (!codeEl) return "";
      return toHtml(codeEl.children);
    },
  );

  return data;
};
