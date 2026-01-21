export default defineAppConfig({
  title: "Sentinel",
  collection: {
    key: "sentinel",
    title: "Sentinel",
    description: "Event-driven Go library documentation",
    repo: "https://github.com/zoobzio/sentinel",
    navIcons: {
      Learn: "learn",
      Guides: "guides",
      Integrations: "integration",
      Reference: "reference",
    },
  },
  giscus: {
    repo: "zoobzio/sentinel",
    repoId: "R_kgDOPG39ag",
    category: "General",
    categoryId: "DIC_kwDOPG39as4C1AU6",
  },
  version: {
    current: "v1.0.0",
    versions: ["v2.0.0", "v1.0.0"],
    latest: "v2.0.0",
  },
});
