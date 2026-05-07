export {}

declare module "#app" {
  interface RuntimeNuxtHooks {
    "untheme:theme": (data: { from: string; to: string }) => void;
    "untheme:mode": (data: { from: "light" | "dark"; to: "light" | "dark" }) => void;
  }
}
