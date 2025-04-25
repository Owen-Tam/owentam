<template>
  <nav>
    <ul class="nav__body">
      <li><NuxtLink to="/">Home</NuxtLink></li>
      <li><NuxtLink to="/">Projects</NuxtLink></li>
      <li><NuxtLink to="/blog">Blog</NuxtLink></li>
    </ul>
  </nav>
</template>

<style scoped>
nav {
  padding-block: 3vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
.nav__body {
  display: flex;
  gap: 0.5rem;
  width: auto;
  list-style: none;
  align-items: center;
  justify-content: center;
  border-radius: 100px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: solid 2px white;
}
li {
  padding: 0.3rem 0.7rem;
  background: transparent;
  border-radius: 100px;

  transition: background 300ms ease-in-out;
}
li:hover {
  background: rgba(255, 255, 255, 0.205);
}
</style>
