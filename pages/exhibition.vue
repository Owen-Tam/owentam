<template>
  <div class="container">
    <div v-if="completed">
      <h2>
        Redirecting you to Owen's exhibition presentation in
        {{ time }} seconds...
      </h2>
      <p>If you are not redirected, please click <a :href="link">here</a></p>
    </div>
    <h2 v-else>Exhibition presentation is not available.</h2>
  </div>
</template>

<script setup>
const completed = ref(true);
let time = ref(3);
const link = ref("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
if (completed.value) {
  setTimeout(() => {
    try {
      navigateTo(link.value, {
        external: true,
      });
    } catch (error) {
      console.error("Error navigating to link:", error);
    }
  }, time.value * 1000);
}

useHead({
  title: "Exhibition - Owen Tam",
});
</script>

<style scoped>
p {
  margin-top: 1rem;
}
a {
  color: var(--primary);
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;
}
</style>
