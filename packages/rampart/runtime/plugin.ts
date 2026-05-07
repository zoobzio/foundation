import { defineNuxtPlugin } from "#app";
import { useAuth } from "./composables";

export default defineNuxtPlugin({
  name: "rampart",
  setup() {
    // Trigger hydration from SSR context
    useAuth();
  },
});
