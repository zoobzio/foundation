import { defineBuildConfig } from "obuild/config";

/**
 * `hast` is a types-only module, provided by `@types/hast`, which the
 * dependency check does not match by name. External here, so the
 * declarations refer to the consumer's `hast` rather than a bundled copy.
 */
export default defineBuildConfig({
  entries: [
    {
      type: "bundle",
      input: ["./src/index.ts"],
      outDir: ".dist",
      rolldown: { external: ["hast"] },
    },
  ],
});
