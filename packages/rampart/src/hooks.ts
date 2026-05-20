import type { AuthRole, AuthScope } from "./types";

declare module "nitropack/types" {
  interface NitroRuntimeHooks {
    "rampart:login": (data: { userId: string }) => void;
    "rampart:logout": () => void;
    "rampart:refresh": () => void;
    "rampart:expired": () => void;
  }
}

declare module "#app" {
  interface RuntimeNuxtHooks {
    "rampart:denied": (data: { roles?: AuthRole[]; scopes?: AuthScope[] }) => void;
  }
}
