export default defineNuxtRouteMiddleware(() => {
  const { latest } = useVersion();

  if (latest) {
    return navigateTo(`/${latest}`, { redirectCode: 302 });
  }
});
