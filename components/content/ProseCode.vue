<template>
  <code><slot /></code>
</template>
<style scoped>
code {
  color: var(--light-main-opacity);
  background-color: var(--background-color-lighter);
  padding: 0.2em 0.4em;
  border-radius: 4px;
  border: 1px solid var(--background-color-lighter);

  /* font-size: 0.9em; */
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
