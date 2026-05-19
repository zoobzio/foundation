<template>
  <Group class="f-example-login">
    <H1>{{ $t("Signed out") }}</H1>
    <P>{{ $t("You are not currently signed in.") }}</P>
    <Anchor to="/" external label="Sign in →" />
  </Group>
</template>
