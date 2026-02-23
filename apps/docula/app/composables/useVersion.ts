export const useVersion = () => {
  const route = useRoute();
  const appConfig = useAppConfig();
  const versionConfig = appConfig.version;

  const versions = versionConfig?.versions ?? [];
  const latest = versionConfig?.latest ?? versions[0] ?? "";

  // Extract current version from URL path (e.g., /v1.0.0/guides/intro -> v1.0.0)
  const current = computed(() => {
    const match = route.path.match(/^\/(v[\d.]+)/);
    return match ? match[1] : "";
  });

  const isLatest = computed(() => {
    return !current.value || current.value === latest;
  });

  return {
    current,
    versions,
    latest,
    isLatest,
  };
};
