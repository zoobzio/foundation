import type { BrowserHooks } from "./types/browser";
import type { CodeHooks } from "./types/code";
import type { EditorHooks } from "./types/editor";
import type { FormHooks } from "./types/form";
import type { Logger } from "./types/log";
import type { IconAlias } from "./types/icon";
import type { TableHooks } from "./types/table";
import type { AppMessage } from "./types/text";

// The text the packages carry admits the app's messages: a `label`,
// `placeholder` or `hint` of any service or component takes a key of the
// app's contract, or a key with its values, in place of a string. The
// contract extends @zoobzio/prose, so the components' own keys are among
// them. The layer resolves every message at its boundary — a wrapper's
// slot defaults and props map, a factory — so the components and the
// services, which know only strings, never see one.
declare module "@zoobzio/kit" {
  interface TextMap {
    app: AppMessage;
  }
}

// The item types of @zoobzio/vue and the action descriptors of the headless
// packages are interfaces, so the layer widens the ones its wrappers draw
// icons for by declaration merging: the field joins the one type the
// package, the layer, and the app all share, and the wrapper's slot default
// reads it with the scope the component passes. A row, file, folder, or
// bulk action extends its descriptor, so an `icon` set in `createTable` or
// `createBrowser` reaches the service's live action and the menu item
// built from it.
declare module "@zoobzio/vue/types/common" {
  interface Option {
    icon?: IconAlias;
  }
}

declare module "@zoobzio/vue/types/components/menu" {
  interface MenuItem {
    icon?: IconAlias;
  }
}

declare module "@zoobzio/vue/types/components/breadcrumb" {
  interface BreadcrumbItem {
    icon?: IconAlias;
  }
}

declare module "@zoobzio/vue/types/components/directory" {
  interface DirectoryItem {
    icon?: IconAlias;
  }
}

declare module "@zoobzio/vue/types/components/facets" {
  interface FacetItem {
    icon?: IconAlias;
  }
}

// A column's `icon` is drawn before its header, and carried onto its query
// field by the table and onto its column-manager option by the vue table,
// so the search and the manager draw it beside the column's label.
declare module "@zoobzio/table" {
  interface ActionDescriptor {
    icon?: IconAlias;
  }
  interface DataTableColumn<T> {
    icon?: IconAlias;
  }
}

// A query field's or literal's `icon` is carried onto its option by the
// service, so the autocomplete draws it before the label in the panel, and
// a field's in the trail. A literal that names none draws `search`.
declare module "@zoobzio/query" {
  interface Field {
    icon?: IconAlias;
  }
  interface Literal {
    icon?: IconAlias;
  }
  interface Option {
    icon?: IconAlias;
  }
}

declare module "@zoobzio/browser" {
  interface ActionDescriptor {
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
