<template>
  <img
    :src="image"
    :alt="alt"
    class="image--regular"
    @click.stop="() => (showLightbox = !showLightbox)"
  />
  <Teleport to="body">
    <Transition enter-from-class="opacity-0" leave-to-class="opacity-0">
      <div
        v-if="showLightbox"
        class="background"
        @click.stop="() => (showLightbox = !showLightbox)"
      >
        <img :src="image" :alt="alt" />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps({
  src: {
    type: String,
    default: "",
  },
  alt: {
    type: String,
    default: "",
  },
});
import { filename } from "pathe/utils";

const glob = import.meta.glob("@/assets/content/**/*.png", { eager: true });
const images = Object.fromEntries(
  Object.entries(glob).map(([key, value]) => [filename(key), value.default])
);
const image = images[props["src"]];

const showLightbox = ref(false);
</script>
<style scoped>
.image--regular {
  max-width: 100%;
}
.background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}
</style>
