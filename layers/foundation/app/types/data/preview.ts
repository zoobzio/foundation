import type { Ref } from "#imports";

// ---------------------------------------------------------------------------
// Fields — the consumer declares these like table columns
// ---------------------------------------------------------------------------

export type PreviewFieldType = "text" | "markdown";

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
// Config the consumer provides to the factory — pure data.
// ---------------------------------------------------------------------------

export type Config<T> = {
  fields: PreviewField<T>[];
  content: ContentVariant<T>;
};

export type State<T> = {
  initialized: Ref<boolean>;
  loading: Ref<boolean>;
  data: Ref<T | null>;
};

/**
 * The consumer-supplied fetch mechanism — the record the preview displays.
 */
export type Actions<T> = {
  fetch: (service: Service<T>) => Promise<T>;
};

export type Service<T> = {
  readonly id: string;
  readonly config: Config<T>;
  readonly fields: PreviewField<T>[];
  readonly content: ContentVariant<T>;

  readonly initialized: boolean;
  readonly loading: boolean;
  readonly data: T | null;

  readonly contentValue: string;
  fieldValue(key: keyof T): unknown;

  init(): Promise<boolean>;
  fetch(): Promise<void>;
};

export type Events = {
  "preview:loaded": (event: { id: string }) => void;
};
