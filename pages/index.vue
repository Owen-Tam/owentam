<template>
  <div class="container">
    <div class="introduction">
      <h1>Hi, I am <span class="introduction--highlight">Owen Tam</span>.</h1>
      <p>
        I am a secondary school student in Hong Kong interested in Innovation &
        Technology.
      </p>
      <p>
        My passion for technology stems from a fascination with how innovative
        solutions with emerging technologies can transform people's lives and do
        good in the world.
      </p>
    </div>
    <div class="links">
      <a target="_blank" href="https://github.com/Owen-Tam"
        ><Icon name="uil:github" size="2.5em"
      /></a>
      <a target="_blank" href="https://www.linkedin.com/in/owen-tam-ho-wang/"
        ><Icon name="uil:linkedin" size="2.5em"
      /></a>
      <a href="mailto:owenhwtam@gmail.com" target="_blank"
        ><Icon name="uil:envelope" size="2.5em"
      /></a>
    </div>
  </div>
</template>
<script setup>
useHead({
  title: "Landing - Owen Tam",
});
</script>
<style scoped>
h1 {
  font-size: 3rem;
}
p {
  font-size: 1.1rem;
  line-height: 1.5;
  margin-top: 1rem;
}
.container {
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.links {
  display: flex;
  gap: 1.2rem;
  color: white;
  margin-top: 1.5rem;
}
.links a {
  transform: translateY(0px);
  transition: transform 300ms ease-in-out;
}
.links a:hover {
  transform: translateY(-8px);
}
.introduction--highlight {
  color: var(--primary);
}
</style>
