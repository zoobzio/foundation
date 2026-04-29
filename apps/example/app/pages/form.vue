<script setup lang="ts">
const workspace = accessFormWorkspace();

await useAsyncData("form-workspace", () => workspace.init());

const { form } = useFakeForm();
</script>

<template>
  <Workspace :workspace="workspace">
    <template #header>
      <Header class="f-example-header">
        <H1>Data Form</H1>
        <P>A workspace demo with the data form widget.</P>
        <Anchor to="/" label="← Foundation Example" />
      </Header>
    </template>

    <template #form>
      <DataFormWidget :form="form" />
    </template>

    <template #sidebar>
      <Group class="f-form-sidebar">
        <H3>Form State</H3>
        <Group class="f-form-state">
          <Span class="f-form-state-label">Valid:</Span>
          <Chip :label="form.valid.value ? 'Yes' : 'No'" />
        </Group>
        <Group class="f-form-state">
          <Span class="f-form-state-label">Submitted:</Span>
          <Chip :label="form.submitted.value ? 'Yes' : 'No'" />
        </Group>
        <Group class="f-form-state">
          <Span class="f-form-state-label">Errors:</Span>
          <Chip :label="String(Object.keys(form.errors.value).length)" />
        </Group>
        <Button @click="form.reset()">Reset</Button>
      </Group>
    </template>
  </Workspace>
</template>
