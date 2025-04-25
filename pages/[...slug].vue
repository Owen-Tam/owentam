<template>
  <div class="container">
    <h1>404 Page not Found</h1>
    <NuxtLink to="/">Go back to home</NuxtLink>
  </div>
</template>
<script setup>
useHead({
  meta: [
    {
      title: "404 - Owen Tam",
    },
  ],
});
</script>
<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
h1 {
  font-size: 3rem;
  text-align: center;
  margin-top: 2rem;
}
a {
  color: var(--primary);
  margin-top: 2rem;
}
a:hover {
  text-decoration: underline;
}
</style>
