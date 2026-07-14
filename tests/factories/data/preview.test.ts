import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPreview } from "#foundation/factories/data/preview";
import type { DataPreviewConfig, PreviewField, ContentVariant } from "#foundation/types/data/preview";

interface TestDoc {
  title: string;
  status: string;
  summary: string;
  content: string;
}

const fakeDoc: TestDoc = {
  title: "Test Report",
  status: "Active",
  summary: "# Summary\n\nSome content.",
  content: '{"key": "value"}',
};

const fields: PreviewField<TestDoc>[] = [
  { key: "title", label: "Title" },
  { key: "status", label: "Status" },
  { key: "summary", label: "Summary", type: "markdown" },
];

const contentVariant: ContentVariant<TestDoc> = {
  type: "code",
  key: "content",
  language: "json",
};

const fetchFn = vi.fn(async () => fakeDoc);

const config: DataPreviewConfig<TestDoc> = {
  fields,
  content: contentVariant,
  fetch: fetchFn,
};

const makePreview = (id = "test") => createPreview<TestDoc>(id, config)();

describe("createPreview", () => {
  beforeEach(() => {
    fetchFn.mockClear();
  });

  describe("defaults", () => {
    it("initializes with null data", () => {
      const preview = makePreview("data-test");
      expect(preview.data.value).toBeNull();
    });

    it("initializes not loading", () => {
      const preview = makePreview("loading-test");
      expect(preview.loading.value).toBe(false);
    });

    it("exposes fields from config", () => {
      const preview = makePreview("fields-test");
      expect(preview.fields).toEqual(fields);
    });

    it("exposes content variant from config", () => {
      const preview = makePreview("content-variant-test");
      expect(preview.content).toEqual(contentVariant);
      expect(preview.content.type).toBe("code");
    });

    it("exposes language on code variant", () => {
      const preview = makePreview("lang-test");
      if (preview.content.type === "code") {
        expect(preview.content.language).toBe("json");
      }
    });
  });

  describe("getters", () => {
    it("contentValue returns empty string when no data", () => {
      const preview = makePreview("content-null-test");
      expect(preview.contentValue.value).toBe("");
    });

    it("contentValue returns the content field after fetch", async () => {
      const preview = makePreview("content-data-test");
      await preview.fetch();
      expect(preview.contentValue.value).toBe('{"key": "value"}');
    });

    it("fieldValue returns empty string when no data", () => {
      const preview = makePreview("field-null-test");
      expect(preview.fieldValue("title")).toBe("");
    });

    it("fieldValue returns field values after fetch", async () => {
      const preview = makePreview("field-data-test");
      await preview.fetch();
      expect(preview.fieldValue("title")).toBe("Test Report");
      expect(preview.fieldValue("status")).toBe("Active");
      expect(preview.fieldValue("summary")).toBe("# Summary\n\nSome content.");
    });
  });

  describe("actions", () => {
    it("init calls fetch and sets initialized", async () => {
      const preview = makePreview("init-test");
      expect(preview.initialized.value).toBe(false);
      await preview.init();
      expect(preview.initialized.value).toBe(true);
      expect(fetchFn).toHaveBeenCalledOnce();
    });

    it("init is idempotent", async () => {
      const preview = makePreview("init-idempotent-test");
      await preview.init();
      await preview.init();
      expect(fetchFn).toHaveBeenCalledOnce();
    });

    it("fetch stores data", async () => {
      const preview = makePreview("fetch-data-test");
      await preview.fetch();
      expect(preview.data.value).toEqual(fakeDoc);
    });

    it("fetch sets loading during execution", async () => {
      let resolvePromise: () => void;
      const slowFetch = vi.fn(
        () => new Promise<TestDoc>((resolve) => {
          resolvePromise = () => resolve(fakeDoc);
        }),
      );
      const preview = createPreview<TestDoc>("loading-test-2", { ...config, fetch: slowFetch })();
      const promise = preview.fetch();
      expect(preview.loading.value).toBe(true);
      resolvePromise!();
      await promise;
      expect(preview.loading.value).toBe(false);
    });
  });

  describe("persistence", () => {
    it("getSnapshot returns empty object", () => {
      const preview = makePreview("snapshot-test");
      expect(preview.getSnapshot()).toEqual({});
    });

    it("restoreSnapshot is a no-op", () => {
      const preview = makePreview("restore-test");
      expect(() => preview.restoreSnapshot({})).not.toThrow();
    });
  });
});
