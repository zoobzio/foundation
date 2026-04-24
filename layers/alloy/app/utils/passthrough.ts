export const passthrough = <P, E = {}>(
  userPT: Passthrough<P, E> | undefined,
  localPT: Passthrough<P, E>,
): Recipe<P, E> => ({
  props: { ...localPT.props, ...userPT?.props } as Recipe<P, E>["props"],
  handlers: { ...localPT.handlers, ...userPT?.handlers } as Recipe<
    P,
    E
  >["handlers"],
});
