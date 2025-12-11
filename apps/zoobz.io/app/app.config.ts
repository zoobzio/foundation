export default defineAppConfig({
  collections: [
    {
      key: "blog",
      title: "Blog",
      description: "Personal blog posts",
      icon: "explore",
      to: "/blog",
    },
    {
      key: "pipz",
      title: "Pipz",
      description: "Type-safe pipeline composition for Go",
      icon: "explore",
      to: "/docs/pipz",
    },
    {
      key: "capitan",
      title: "Capitan",
      description: "Container orchestration for Go",
      icon: "explore",
      to: "/docs/capitan",
    },
  ],
});
