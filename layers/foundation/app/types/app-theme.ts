export interface AppThemePassthrough {
  root?: Passthrough<GroupProps>;
  trigger?: Passthrough<FabProps>;
  dialog?: Passthrough<DialogProps, DialogEmits>;
  command?: Passthrough<CommandProps, CommandEmits>;
}

export interface AppThemeProps {
  pt?: AppThemePassthrough;
}
