import type { SidebarNavGroup } from "./components/SidebarNav.vue";

declare module "nuxt/schema" {
  interface AppConfigInput {
    title?: string;
    navigation?: SidebarNavGroup[];
  }
}

export default defineAppConfig({
  title: "Appula",
  navigation: [
    {
      label: "General",
      icon: "home",
      items: [
        { label: "Dashboard", to: "/" },
        { label: "Settings", to: "/settings" },
      ],
    },
    {
      label: "Data",
      icon: "reference",
      items: [
        { label: "Users", to: "/users" },
        { label: "Reports", to: "/reports" },
      ],
    },
  ],
});
