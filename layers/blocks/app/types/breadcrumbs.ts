export type BreadcrumbsProps = {
  items: Link[];
  separator?: IconAlias;
  tokens?: Tokens<
    | "breadcrumbs-root"
    | "breadcrumbs-list"
    | "breadcrumbs-item"
    | "breadcrumbs-link"
    | "breadcrumbs-current"
    | "breadcrumbs-separator"
  >;
};

export type BreadcrumbsEmits = {};

export const defineBreadcrumbs = useComponentRecipe<BreadcrumbsProps, BreadcrumbsEmits>();
