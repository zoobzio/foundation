export interface AppLocalePassthrough {
  root?: Passthrough<GroupProps>;
  trigger?: Passthrough<FabProps>;
  dialog?: Passthrough<DialogProps, DialogEmits>;
  command?: Passthrough<CommandProps, CommandEmits>;
}

export interface AppLocaleProps {
  pt?: AppLocalePassthrough;
}
