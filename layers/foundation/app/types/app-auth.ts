export interface AppAuthPassthrough {
  root?: Passthrough<GroupProps>;
  trigger?: Passthrough<FabProps>;
}

export interface AppAuthProps {
  pt?: AppAuthPassthrough;
}
