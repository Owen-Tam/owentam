<template>
  <div class="global-container">
    <GlobalNavBar> </GlobalNavBar>
    <NuxtLayout
      ><div class="content-container"><NuxtPage /></div
    ></NuxtLayout>
    <GlobalFooter> </GlobalFooter>
  </div>
</template>
<script setup>
const route = useRoute();
</script>
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
:root {
  --background-color: #080e1d;
  --background-color-darker: hsl(220, 60%, 5%);
  --background-color-lighter: hsl(220, 60%, 10%);
  --primary: #059fff;
  --primary-lighter: hsl(203, 100%, 60%);
  --primary-lightest: hsl(203, 100%, 80%);
  --info: oklch(80.9% 0.105 251.813);
  --success: #10b981;
  --warning: #f59e0b;
  --error: #f43f5e;
  --light-main: #fff;
  --light-main-opacity: rgba(255, 255, 255, 0.6);
  --light-main-opacity-lower: rgba(255, 255, 255, 0.3);
}
button,
p,
a,
h1,
h2,
h3,
h4,
h5,
h6,
li {
  font-family: "Poppins", sans-serif;
  color: var(--light-main);
}

a {
  text-decoration: none;
  color: inherit;
}
html {
  scrollbar-gutter: stable;
}
body {
  background: var(--background-color);
}
.global-container {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}
.content-container {
  display: flex;
  justify-content: center;
}
.container {
  width: min(80vw, 748px);
}
</style>
