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
const { data: blogPage } = await useAsyncData("yeet", () =>
  queryCollection("CTF").where("slug", "=", route.params?.slug).first()
);
if (!blogPage.value) {
  navigateTo("/404");
}
// definePageMeta({
//   title: `${blogPage.value.title}`,
// });
const headings = blogPage.value.body.value.filter(
  (item) => item[0] === "h1" || item[0] === "h2" || item[0] === "h3"
);

const activeSection = ref([]);

// Setup IntersectionObserver to update active section
let observer = null;

onMounted(() => {
  const options = {};
  const headingsElements = document.querySelectorAll(
    ".content h1, .content h2, .content h3"
  );
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const heading = document.querySelector(`a[href='#${entry.target.id}']`);
      if (entry.isIntersecting) {
        // Add to activeSection if in view
        heading.classList.add("active");
      } else {
        // Remove active if not in view
        heading.classList.remove("active");
      }
    });
  }, options);

  // Add each section to the observer
  headingsElements.forEach((element) => {
    if (element && observer) {
      observer.observe(element);
    }
  });
});

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect();
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
