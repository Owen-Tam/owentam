<template>
  <div :class="alertClass" class="prose-alert">
    <Icon class="icon" :name="icon" size="1em" />
    <slot />
  </div>
</template>

<script setup>
import { computed } from "vue";

const { mode } = defineProps({
  mode: {
    type: String,
    validator: (value) =>
      ["success", "warning", "error", "info"].includes(value),
    default: "info",
  },
});

const alertClass = computed(() => "prose-alert--" + mode);

const icon = computed(() => {
  if (mode === "success") {
    return "uil:lightbulb-alt";
  } else if (mode === "warning") {
    return "uil:exclamation-circle";
  } else if (mode === "error") {
    return "uil:exclamation-circle";
  } else if (mode === "info") {
    return "uil:info-circle";
  }
});
</script>

<style scoped lang="scss">
.prose-alert {
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  margin: 1rem 0;
  display: block; /* Allow wrapping */
  position: relative;
  z-index: 0;
  .icon {
    float: left; /* Float the icon to the left */
    margin-right: 0.5rem; /* Add spacing between the icon and text */
  }
}

.prose-alert--success {
  background-color: #021b23;
  color: var(--success);
  border: 1px solid
    color-mix(in srgb, var(--background-color-lighter) 75%, var(--success));
}

.prose-alert--info {
  background-color: oklab(0.707 -0.0437502 -0.159094 / 0.1);
  border: 1px solid
    color-mix(in srgb, var(--background-color-lighter) 75%, var(--info));
  color: var(--info);
}

.prose-alert--warning {
  background-color: #272927;
  color: var(--warning);
  border: 1px solid
    color-mix(in srgb, var(--background-color-lighter), var(--warning));
}

.prose-alert--error {
  background-color: #271f31;
  color: var(--error);
  border: 1px solid
    color-mix(in srgb, var(--background-color-lighter) 75%, var(--error));
}
</style>
