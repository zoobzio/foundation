<script lang="ts">
import type { DataFormProps } from "../../../types/data-form-widget";
</script>

<script setup lang="ts" generic="T">
const { form, pt } = defineProps<DataFormProps<T>>();

useLazyAsyncData(`init-form-${useId()}`, form.init, { server: false });

const el = useTemplateRef("el");
defineExpose({ el });

const ctx = computed(() => ({ form }));

// Passthrough
const rootPT = usePassthrough(pt?.root, { props: {}, handlers: {} });
const toolbarPT = usePassthrough(pt?.toolbar, { props: {}, handlers: {} });
const titlePT = usePassthrough(pt?.title, { props: {}, handlers: {} });
const scrollerPT = usePassthrough(pt?.scroller, { props: {}, handlers: {} });
const gridPT = usePassthrough(pt?.grid, { props: {}, handlers: {} });
const footerPT = usePassthrough(pt?.footer, { props: {}, handlers: {} });
const submitPT = usePassthrough(pt?.submit, { props: {}, handlers: {} });
const resetPT = usePassthrough(pt?.reset, { props: {}, handlers: {} });

const onSubmit = (e: Event) => {
  e.preventDefault();
  form.submit();
};
</script>

<template>
  <Group
    ref="el"
    v-bind="rootPT.props"
    class="f-data-form"
    v-on="rootPT.handlers"
  >
    <slot name="toolbar" v-bind="ctx">
      <Group
        v-bind="toolbarPT.props"
        class="f-data-form-toolbar"
        v-on="toolbarPT.handlers"
      >
        <Span
          v-bind="titlePT.props"
          class="f-data-form-title"
          v-on="titlePT.handlers"
        >
          {{ form.title }}
        </Span>
      </Group>
    </slot>

    <Scroller v-bind="scrollerPT.props" v-on="scrollerPT.handlers">
      <template #content>
        <form class="f-data-form-inner" @submit="onSubmit">
          <Group
            v-bind="gridPT.props"
            class="f-data-form-grid"
            v-on="gridPT.handlers"
          >
            <DataFormField
              v-for="field in form.fields"
              :key="String(field.key)"
              :form="form"
              :field="field"
              :pt="pt?.fields?.[field.key]"
            >
              <template v-for="(_, name) in $slots" :key="name" #[name]="slotProps">
                <slot :name="name" v-bind="slotProps" />
              </template>
            </DataFormField>
          </Group>
        </form>
      </template>
    </Scroller>

    <slot name="footer" v-bind="ctx">
      <Group
        v-bind="footerPT.props"
        class="f-data-form-footer"
        v-on="footerPT.handlers"
      >
        <Button
          v-bind="resetPT.props"
          type="button"
          class="f-data-form-reset"
          v-on="resetPT.handlers"
          @click="form.reset()"
        >
          Reset
        </Button>
        <Button
          v-bind="submitPT.props"
          type="button"
          :disabled="form.submitting.value"
          class="f-data-form-submit"
          v-on="submitPT.handlers"
          @click="onSubmit"
        >
          {{ form.submitting.value ? "Submitting..." : "Submit" }}
        </Button>
      </Group>
    </slot>
  </Group>
</template>
