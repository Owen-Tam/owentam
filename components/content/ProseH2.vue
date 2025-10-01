<template>
  <h2 :id="props.id">
    <a v-if="props.id && generate" :href="`#${props.id}`">
      <slot />
    </a>
    <slot v-else />
  </h2>
</template>

<script setup lang="ts">
import { computed, useRuntimeConfig } from "#imports";

const props = defineProps<{ id?: string }>();

const { headings } = useRuntimeConfig().public.mdc;
const generate = computed(
  () =>
    props.id &&
    ((typeof headings?.anchorLinks === "boolean" &&
      headings?.anchorLinks === true) ||
      (typeof headings?.anchorLinks === "object" && headings?.anchorLinks?.h2))
);
</script>
<style scoped>
h2 {
  margin-block: 2rem;
}
h2::after {
  content: "";
  display: block;
  height: 1px;
  margin-block: 0.5rem 0.8rem;
  width: 100%;
  background: var(--light-main-opacity-lower);
}
</style>
