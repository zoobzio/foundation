import { ref, computed } from "vue";
import { vi } from "vitest";
import type { Form, DataFormField } from "../../../layers/forge/app/types/data-form";

export interface FakeFormData {
  name: string;
  email: string;
  active: boolean;
}

export const fakeFormFields: DataFormField<FakeFormData>[] = [
  { key: "name", type: "text", label: "Name", placeholder: "Enter name", required: true, colspan: 6 },
  { key: "email", type: "email", label: "Email", placeholder: "Enter email", required: true, colspan: 6 },
  { key: "active", type: "checkbox", label: "Active", colspan: 12 },
];

export interface MockFormOptions {
  fields?: DataFormField<FakeFormData>[];
  values?: Partial<FakeFormData>;
  errors?: Record<string, string>;
  touched?: Set<string>;
}

export const createMockForm = (options: MockFormOptions = {}): Form<FakeFormData> => {
  const {
    fields = fakeFormFields,
    values: initialValues = {},
    errors: initialErrors = {},
    touched: initialTouched = new Set<string>(),
  } = options;

  const values = ref<Partial<FakeFormData>>(initialValues);
  const errors = ref<Record<string, string>>(initialErrors);
  const touched = ref<Set<string>>(initialTouched);
  const submitting = ref(false);
  const submitted = ref(false);

  return {
    values,
    errors,
    touched,
    submitting,
    submitted,
    valid: computed(() => Object.keys(errors.value).length === 0),
    title: "Test Form",
    fields,
    setValue: vi.fn(<K extends keyof FakeFormData>(key: K, value: FakeFormData[K]) => {
      values.value = { ...values.value, [key]: value };
    }),
    touch: vi.fn((key: keyof FakeFormData) => {
      const next = new Set(touched.value);
      next.add(String(key));
      touched.value = next;
    }),
    validate: vi.fn(() => Object.keys(errors.value).length === 0),
    validateField: vi.fn(),
    submit: vi.fn(async () => {}),
    reset: vi.fn(() => {
      values.value = {};
      errors.value = {};
      touched.value = new Set();
      submitted.value = false;
    }),
    getSnapshot: vi.fn(() => ({ values: {}, touched: [] })),
    restoreSnapshot: vi.fn(),
    init: vi.fn(async () => true),
    initialized: ref(true),
  };
};
