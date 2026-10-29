import type { BrowserHooks } from "./types/browser";
import type { CodeHooks } from "./types/code";
import type { EditorHooks } from "./types/editor";
import type { FormHooks } from "./types/form";
import type { Logger } from "./types/log";
import type { IconAlias } from "./types/icon";
import type { TableHooks } from "./types/table";

// The item types of @zoobzio/vue are interfaces, so the layer widens the
// ones its wrappers draw icons for by declaration merging: the field joins
// the one type the vue package, the layer, and the app all share, and the
// wrapper's slot default reads it with the scope the component passes.
declare module "@zoobzio/vue/types/components/menu" {
  interface MenuItem {
    icon?: IconAlias;
  }
}

declare module "#app" {
  interface NuxtApp {
    $log: Logger;
    $logger: (name?: string) => Logger;
  }
  interface RuntimeNuxtHooks
    extends BrowserHooks, CodeHooks, EditorHooks, FormHooks, TableHooks {}
}

export {};
