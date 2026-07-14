import { ref, computed } from "vue";
import { vi } from "vitest";
import type { Preview, PreviewField, ContentVariant } from "#foundation/types/data/preview";

export interface FakePreviewData {
  title: string;
  status: string;
  language: string;
  summary: string;
  content: string;
}

export const fakePreviewFields: PreviewField<FakePreviewData>[] = [
  { key: "title", label: "Title" },
  { key: "status", label: "Status" },
  { key: "language", label: "Language" },
  { key: "summary", label: "Summary", type: "markdown" },
];

export const fakePreviewContent: ContentVariant<FakePreviewData> = {
  type: "code",
  key: "content",
  language: "json",
};

export const fakePreviewData: FakePreviewData = {
  title: "Test Document",
  status: "Active",
  language: "json",
  summary: "# Summary\n\nThis is a test.",
  content: '{"key": "value"}',
};

export interface MockPreviewOptions {
  data?: FakePreviewData | null;
  fields?: PreviewField<FakePreviewData>[];
  content?: ContentVariant<FakePreviewData>;
}

export const createMockPreview = (options: MockPreviewOptions = {}): Preview<FakePreviewData> => {
  const {
    data: initialData = fakePreviewData,
    fields = fakePreviewFields,
    content = fakePreviewContent,
  } = options;

  const data = ref<FakePreviewData | null>(initialData);

  return {
    loading: ref(false),
    initialized: ref(true),
    data,
    fields,
    content,
    contentValue: computed(() => {
      const d = data.value;
      if (!d) return "";
      return String(d[content.key]);
    }),
    fieldValue: (key: keyof FakePreviewData) => data.value?.[key] ?? "",
    fetch: vi.fn(async () => {}),
    init: vi.fn(async () => true),
    getSnapshot: vi.fn(() => ({})),
    restoreSnapshot: vi.fn(),
  };
};
