import { defineUnthemeConfig } from "@untheme/nuxt/config";
import { preset } from "@untheme/aurora";

import abyss from "@untheme/aurora/themes/abyss";
import dracula from "@untheme/aurora/themes/dracula";

export default defineUnthemeConfig({
  theme: preset.define({ id: "foundation", name: "Foundation" }),
  themes: { abyss, dracula },
  input: {
    text: "md",
    color: "dark",
    depth: "default",
    motion: "default",
    radius: "default",
    density: "default",
    contrast: "default",
    vibrancy: "balanced",
  },
});
