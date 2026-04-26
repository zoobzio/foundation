import type { MaybeRefOrGetter } from "vue";
import type { Recipe, HtmlAttrs, EmitHandlers, DomHandlers } from "../types/recipe";

type PropsInput<P> = MaybeRefOrGetter<P & HtmlAttrs>;
type HandlersInput<E> = MaybeRefOrGetter<EmitHandlers<E> & DomHandlers>;

const useRecipe = <Props, Emits = {}>(
  props: PropsInput<Props>,
  handlers: HandlersInput<Emits>,
) => computed<Recipe<Props, Emits>>(() => recipe<Props, Emits>(
  toValue(props),
  toValue(handlers),
));

export const useAccordion = (props: PropsInput<AccordionProps>, handlers: HandlersInput<AccordionEmits>) => useRecipe(props, handlers);
export const useAvatar = (props: PropsInput<AvatarProps>, handlers: HandlersInput<AvatarEmits>) => useRecipe(props, handlers);
export const useCalendar = (props: PropsInput<CalendarProps>, handlers: HandlersInput<CalendarEmits>) => useRecipe(props, handlers);
export const useCheckbox = (props: PropsInput<CheckboxProps>, handlers: HandlersInput<CheckboxEmits>) => useRecipe(props, handlers);
export const useCommand = (props: PropsInput<CommandProps>, handlers: HandlersInput<CommandEmits>) => useRecipe(props, handlers);
export const useDateFilters = (props: PropsInput<DateFiltersProps>, handlers: HandlersInput<DateFiltersEmits>) => useRecipe(props, handlers);
export const useDatePicker = (props: PropsInput<DatePickerProps>, handlers: HandlersInput<DatePickerEmits>) => useRecipe(props, handlers);
export const useDateRangePicker = (props: PropsInput<DateRangePickerProps>, handlers: HandlersInput<DateRangePickerEmits>) => useRecipe(props, handlers);
export const useDialog = (props: PropsInput<DialogProps>, handlers: HandlersInput<DialogEmits>) => useRecipe(props, handlers);
export const useFab = (props: PropsInput<FabProps>, handlers: HandlersInput<FabEmits>) => useRecipe(props, handlers);
export const useFacets = (props: PropsInput<FacetsProps>, handlers: HandlersInput<FacetsEmits>) => useRecipe(props, handlers);
export const useHero = (props: PropsInput<HeroProps>, handlers: HandlersInput<HeroEmits>) => useRecipe(props, handlers);
export const useKeywords = (props: PropsInput<KeywordsProps>, handlers: HandlersInput<KeywordsEmits>) => useRecipe(props, handlers);
export const useListbox = (props: PropsInput<ListboxProps>, handlers: HandlersInput<ListboxEmits>) => useRecipe(props, handlers);
export const useMenu = (props: PropsInput<MenuProps>, handlers: HandlersInput<MenuEmits>) => useRecipe(props, handlers);
export const useMultiSelect = (props: PropsInput<MultiSelectProps>, handlers: HandlersInput<MultiSelectEmits>) => useRecipe(props, handlers);
export const usePagination = (props: PropsInput<PaginationProps>, handlers: HandlersInput<PaginationEmits>) => useRecipe(props, handlers);
export const usePopover = (props: PropsInput<PopoverProps>, handlers: HandlersInput<PopoverEmits>) => useRecipe(props, handlers);
export const useRadio = (props: PropsInput<RadioProps>, handlers: HandlersInput<RadioEmits>) => useRecipe(props, handlers);
export const useRangeCalendar = (props: PropsInput<RangeCalendarProps>, handlers: HandlersInput<RangeCalendarEmits>) => useRecipe(props, handlers);
export const useScroller = (props: PropsInput<ScrollerProps>, handlers: HandlersInput<ScrollerEmits>) => useRecipe(props, handlers);
export const useSegmentedControl = (props: PropsInput<SegmentedControlProps>, handlers: HandlersInput<SegmentedControlEmits>) => useRecipe(props, handlers);
export const useSelect = (props: PropsInput<SelectProps>, handlers: HandlersInput<SelectEmits>) => useRecipe(props, handlers);
export const useTabs = (props: PropsInput<TabsProps>, handlers: HandlersInput<TabsEmits>) => useRecipe(props, handlers);
export const useTagsInput = (props: PropsInput<TagsInputProps>, handlers: HandlersInput<TagsInputEmits>) => useRecipe(props, handlers);
export const useToast = (props: PropsInput<ToastProps>, handlers: HandlersInput<ToastEmits>) => useRecipe(props, handlers);
export const useToaster = (props: PropsInput<ToasterProps>, handlers: HandlersInput<ToasterEmits>) => useRecipe(props, handlers);
export const useTooltip = (props: PropsInput<TooltipProps>, handlers: HandlersInput<TooltipEmits>) => useRecipe(props, handlers);
