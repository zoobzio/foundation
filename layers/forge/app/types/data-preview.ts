// ---------------------------------------------------------------------------
// Field type — drives rendering in the fields panel
// ---------------------------------------------------------------------------

export type PreviewFieldType = "text" | "markdown";

// ---------------------------------------------------------------------------
// Field definition — consumer provides these like table columns
// ---------------------------------------------------------------------------

export interface PreviewField<T> {
  key: keyof T;
  label: string;
  type?: PreviewFieldType;
}

// ---------------------------------------------------------------------------
// Content variant — discriminated union for renderer selection
// ---------------------------------------------------------------------------

export interface CodeContentVariant<T> {
  type: "code";
  key: keyof T;
  language: string;
  externalUrl?: string;
  filename?: string;
}

// Future variants:
// export interface PdfContentVariant<T> { type: "pdf"; key: keyof T; }
// export interface ImageContentVariant<T> { type: "image"; key: keyof T; }

export type ContentVariant<T> = CodeContentVariant<T>;

// ---------------------------------------------------------------------------
// Config the consumer provides to the factory
// ---------------------------------------------------------------------------

export interface DataPreviewConfig<T> {
  fields: PreviewField<T>[];
  content: ContentVariant<T>;
  fetch: () => Promise<T>;
}

// ---------------------------------------------------------------------------
// Reactive state interface — returned by the factory
// ---------------------------------------------------------------------------

export interface Preview<T> {
  // Reactive state
  loading: Ref<boolean>;
  initialized: Ref<boolean>;
  data: Ref<T | null>;

  // Static config
  readonly fields: PreviewField<T>[];
  readonly content: ContentVariant<T>;

  // Getters
  contentValue: ComputedRef<string>;
  fieldValue: (key: keyof T) => unknown;

  // Actions
  fetch: () => Promise<void>;
  init: () => Promise<boolean>;
  getSnapshot: () => DataPreviewSnapshot;
  restoreSnapshot: (snapshot: DataPreviewSnapshot) => void;
}
