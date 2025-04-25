<template>
  <NuxtLink :href="props.href" :target="props.target">
    <slot />
  </NuxtLink>
</template>
<style scoped>
a {
  color: var(--primary);
}
a:hover {
  text-decoration: underline;
  color: var(--primary-lighter);
}
</style>
<script setup lang="ts">
import type { PropType } from "vue";

const props = defineProps({
  href: {
    type: String,
    default: "",
  },
  target: {
    type: String as PropType<
      | "_blank"
      | "_parent"
      | "_self"
      | "_top"
      | (string & object)
      | null
      | undefined
    >,
    default: undefined,
    required: false,
  },
});
</script>
