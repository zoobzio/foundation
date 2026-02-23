import { widgetRegistry } from "../utils/widgetRegistry";
import StatsWidget from "../components/Widget/Stats.vue";
import TableWidget from "../components/Widget/Table.vue";
import UsersWidget from "../components/Widget/Users.vue";

export default defineNuxtPlugin(() => {
  widgetRegistry.register("stats", StatsWidget);
  widgetRegistry.register("table", TableWidget);
  widgetRegistry.register("users", UsersWidget);
});
