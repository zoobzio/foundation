import { computed, toValue } from "#imports";
import type { AccordionEmits, AccordionProps } from "#foundation/types/core/accordion";
import type { AutocompleteEmits, AutocompleteProps } from "#foundation/types/core/autocomplete";
import type { AvatarEmits, AvatarProps } from "#foundation/types/core/avatar";
import type { CalendarEmits, CalendarProps } from "#foundation/types/core/calendar";
import type { CheckboxEmits, CheckboxProps } from "#foundation/types/core/checkbox";
import type { CodeViewEmits, CodeViewProps } from "#foundation/types/core/code-view";
import type { CommandEmits, CommandProps } from "#foundation/types/core/command";
import type { DateFiltersEmits, DateFiltersProps } from "#foundation/types/core/date-filters";
import type { DatePickerEmits, DatePickerProps } from "#foundation/types/core/date-picker";
import type { DateRangePickerEmits, DateRangePickerProps } from "#foundation/types/core/date-range-picker";
import type { DialogEmits, DialogProps } from "#foundation/types/core/dialog";
import type { FabEmits, FabProps } from "#foundation/types/core/fab";
import type { FacetsEmits, FacetsProps } from "#foundation/types/core/facets";
import type { HeroEmits, HeroProps } from "#foundation/types/core/hero";
import type { KeywordsEmits, KeywordsProps } from "#foundation/types/core/keywords";
import type { ListboxEmits, ListboxProps } from "#foundation/types/core/listbox";
import type { MarkdownEmits, MarkdownProps } from "#foundation/types/core/markdown";
import type { MenuEmits, MenuProps } from "#foundation/types/core/menu";
import type { MultiSelectEmits, MultiSelectProps } from "#foundation/types/core/multi-select";
import type { PaginationEmits, PaginationProps } from "#foundation/types/core/pagination";
import type { PopoverEmits, PopoverProps } from "#foundation/types/core/popover";
import type { RadioEmits, RadioProps } from "#foundation/types/core/radio";
import type { RangeCalendarEmits, RangeCalendarProps } from "#foundation/types/core/range-calendar";
import type { ScrollerEmits, ScrollerProps } from "#foundation/types/core/scroller";
import type { SegmentedControlEmits, SegmentedControlProps } from "#foundation/types/core/segmented-control";
import type { SelectEmits, SelectProps } from "#foundation/types/core/select";
import type { TabsEmits, TabsProps } from "#foundation/types/core/tabs";
import type { TagsInputEmits, TagsInputProps } from "#foundation/types/core/tags-input";
import type { ToastEmits, ToastProps } from "#foundation/types/core/toast";
import type { ToasterEmits, ToasterProps } from "#foundation/types/core/toaster";
import type { TooltipEmits, TooltipProps } from "#foundation/types/core/tooltip";
import { recipe } from "#foundation/utils/recipe";
import type { MaybeRefOrGetter } from "vue";
import type { Recipe, HtmlAttrs, EmitHandlers, DomHandlers } from "#foundation/types/core/recipe";

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
export const useAutocomplete = (props: PropsInput<AutocompleteProps>, handlers: HandlersInput<AutocompleteEmits>) => useRecipe(props, handlers);
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
export const useMarkdown = (props: PropsInput<MarkdownProps>, handlers: HandlersInput<MarkdownEmits>) => useRecipe(props, handlers);
export const useCodeView = (props: PropsInput<CodeViewProps>, handlers: HandlersInput<CodeViewEmits>) => useRecipe(props, handlers);
