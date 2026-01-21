export const useVersion = () => {
  const appConfig = useAppConfig();
  const versionConfig = appConfig.version;

  const current = versionConfig?.current ?? "";
  const versions = versionConfig?.versions ?? [];
  const latest = versionConfig?.latest ?? versions[0] ?? "";
  const isLatest = !current || current === latest;

  return {
    current,
    versions,
    latest,
    isLatest,
  };
};
