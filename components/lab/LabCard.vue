<template>
  <div class="lab-card" :class="`lab-card--${aspect}`" @click="openModal">
    <img :src="item.image" :alt="item.title" loading="lazy" />
  </div>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  aspect: {
    type: String,
    default: "square",
    validator: (v) => ["square", "portrait"].includes(v),
  },
});

const emit = defineEmits(["select"]);

function openModal() {
  emit("select", props.item);
}
</script>

<style scoped>
.lab-card {
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;
  scroll-snap-align: center;
  background: var(--background-color-lighter);
  transition: transform 300ms ease-in-out;
}
.lab-card:hover {
  transform: translateY(-4px);
}
.lab-card--square {
  width: min(70vw, 400px);
  aspect-ratio: 1;
}
.lab-card--portrait {
  width: min(52vw, 300px);
  aspect-ratio: 3 / 4;
}
img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>
