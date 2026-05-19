export {}

declare module "#app" {
  interface RuntimeNuxtHooks {
    "rosetta:locale": (data: { from: string; to: string }) => void;
  }
}
