export const useCopyHeadingLink = (id: Ref<string | undefined> | string | undefined) => {
  const idRef = isRef(id) ? id : ref(id);
  const route = useRoute();
  const copied = ref(false);

  let timeout: NodeJS.Timeout | undefined;

  const copyLink = async () => {
    if (!idRef.value) return;

    // Construct full URL with hash
    const baseUrl = useRequestURL();
    const url = `${baseUrl.origin}${route.path}#${idRef.value}`;

    try {
      await navigator.clipboard.writeText(url);
      copied.value = true;

      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        copied.value = false;
      }, 2000);
    } catch (err) {
      console.error("Failed to copy heading link:", err);
    }
  };

  onUnmounted(() => {
    if (timeout) clearTimeout(timeout);
  });

  return {
    copied: readonly(copied),
    copyLink,
  };
};
