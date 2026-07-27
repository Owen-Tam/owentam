<template>
  <div class="container page__container" v-if="blogPage">
    <div class="block">
      <ul class="headings">
        <li
          v-for="(heading, index) in headings"
          :key="index"
          :class="[`level-${heading[0]}`]"
        >
          <NuxtLink :to="'#' + heading[1].id">{{ heading[2] }}</NuxtLink>
        </li>
      </ul>
    </div>
    <ContentRenderer class="content" :value="blogPage" prose />
    <div class="block"></div>
  </div>
  <div class="container-2" v-else>
    <h1>404 Page not Found</h1>
    <NuxtLink to="/">Go back to home</NuxtLink>
  </div>
</template>
<script setup>
const route = useRoute();
const { data: blogPage } = await useAsyncData("yeet", async () => {
  const CTF_data = await queryCollection("CTF")
    .where("slug", "=", route.params?.slug)
    .first();
  const articles_data = await queryCollection("articles")
    .where("slug", "=", route.params?.slug)
    .first();

  return CTF_data ? CTF_data : articles_data;
});

if (!blogPage.value) {
  navigateTo("/404");
}
useHead({
  title: `${blogPage.value.title} - Owen Tam`,
});
const headings = blogPage.value.body.value.filter(
  (item) => item[0] === "h1" || item[0] === "h2" || item[0] === "h3"
);

let scrollHandler = null;

onMounted(() => {
  const headingsElements = document.querySelectorAll(
    ".content h1, .content h2, .content h3"
  );
  const allLinks = document.querySelectorAll(".headings a[href^='#']");

  const updateActiveHeading = () => {
    const offset = 120;
    const activeIds = new Set();
    const levels = [];
    for (const h of headingsElements) {
      if (h.offsetTop <= window.scrollY + offset) {
        const level = parseInt(h.tagName[1]);
        while (levels.length && levels[levels.length - 1] >= level) {
          levels.pop();
          activeIds.delete(levels.pop());
        }
        levels.push(level);
        activeIds.add(h.id);
      }
    }
    allLinks.forEach((link) => {
      const id = link.getAttribute("href").slice(1);
      link.classList.toggle("active", activeIds.has(id));
    });
  };

  scrollHandler = () => requestAnimationFrame(updateActiveHeading);
  window.addEventListener("scroll", scrollHandler, { passive: true });
  updateActiveHeading();
});

onBeforeUnmount(() => {
  if (scrollHandler) {
    window.removeEventListener("scroll", scrollHandler);
  }
});
</script>
<style scoped lang="scss">
.page__container {
  position: relative;
  display: grid;
  grid-template-columns: 1fr min(80vw, 748px) 1fr;
  justify-content: center;
  width: min(92vw, 1300px);
}
.content
  :is(p, li, blockquote, h1, h2, h3, h4, h5, h6, pre, table, img):not(
    :last-child
  ) {
  margin-bottom: 1rem;
}
.block {
  position: relative;
  top: 20px;
  grid-column: span 1; /* Ensures it spans the entire 1fr */
  width: 100%; /* Optional: Ensures it takes up the full width */
}

.headings {
  list-style: none;
  font-size: 12px;
  width: clamp(80px, 10%, 300px);
  display: flex;
  flex-direction: column;
  margin-top: 5rem;
  gap: 0.3rem;
  position: fixed;

  li {
    text-overflow: ellipsis;
    color: var(--light-main-opacity);
    white-space: nowrap;
    overflow: hidden;
    &.level-h1 {
      margin-left: 0;
    }
    &.level-h2 {
      margin-left: 1rem;
    }
    &.level-h3 {
      margin-left: 2rem;
    }
    a {
      transition: color 200ms ease-in-out;
    }
    a.active {
      color: var(--primary-lighter);
    }
  }
}
@media (max-width: 1024px) {
  .block {
    display: none;
  }
  .page__container {
    grid-template-columns: min(80vw, 748px);
  }
}
</style>
