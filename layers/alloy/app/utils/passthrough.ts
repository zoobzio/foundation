export const passthrough = <P, E = {}>(
  userPT: Passthrough<P, E> | undefined,
  localPT: Recipe<P, E>,
): Recipe<P, E> => ({
  props: { ...localPT.props, ...userPT?.props },
  handlers: { ...localPT.handlers, ...userPT?.handlers },
});
