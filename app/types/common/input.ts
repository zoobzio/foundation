export type InputProps = {
  type?: "text" | "email" | "password" | "search" | "url" | "tel" | "number";
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  ariaDescribedby?: string;
  ariaInvalid?: boolean;
};
