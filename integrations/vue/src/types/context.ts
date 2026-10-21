/**
 * A component view model with the component's `id`.
 */
export type Context<Ctx extends object> = Ctx & {
  id: string;
};
