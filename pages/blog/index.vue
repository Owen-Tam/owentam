<template>
  <div class="container">
    <div class="page__introduction">
      <h1>Blog</h1>
      <p>Here, I document my thoughts and journey.</p>
    </div>
    <div class="category-sorter">
      <button
        :class="buttonClass('articles')"
        @click="toggleCategory('articles')"
      >
        Articles
      </button>
      <button :class="buttonClass('CTF')" @click="toggleCategory('CTF')">
        CTF
      </button>
    </div>
    <div class="cards__container">
      <!-- <p>{{ show }}</p> -->
      <div v-if="show.length > 0" v-for="item in show" class="card">
        <NuxtLink :to="`/blog/${item.slug}`">
          <h3>
            {{ item.title }}
          </h3>
          <p class="item__date">{{ item.date }}</p>
          <p class="item__description">{{ item.description }}</p>
        </NuxtLink>
      </div>
      <div class="card" v-else><h4>No entries yet...</h4></div>
    </div>
  </div>
</template>
<script setup>
useHead({
  title: "Blog - Owen Tam",
});

const { data: CTF } = await useAsyncData("CTF", () =>
  queryCollection("CTF").all()
);
const { data: articles } = await useAsyncData("articles", () =>
  queryCollection("articles").all()
);
const show = computed(() => {
  const blog = [];
  Object.keys(categoryData.value).forEach((key) => {
    if (categoryData.value[key].selected && categoryData.value[key].data) {
      blog.push(...categoryData.value[key].data);
    }
  });

  return blog;
});

const categoryData = ref({
  articles: { selected: true, data: articles },
  CTF: { selected: true, data: CTF },
});

const buttonClass = (cat) => {
  return categoryData.value?.[cat].selected ? "selected" : "";
};

const toggleCategory = function (cat) {
  if (categoryData.value?.[cat]) {
    categoryData.value[cat].selected = !categoryData.value[cat].selected;
  }
};
</script>
<style scoped lang="scss">
h1 {
  font-size: 3rem;
}
.page__introduction {
  margin-bottom: 2rem;

  p {
    font-size: 1.1rem;
    line-height: 1.5;
    margin-top: 1rem;
  }
}

.category-sorter {
  display: flex;
  gap: 1rem;
  button {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    cursor: pointer;
    border: solid 2px var(--light-main-opacity);
    color: var(--light-main-opacity);
    background: none;
    font-size: 1.2rem;
    padding: 0.2rem 0.5rem;
    border-radius: 10px;
  }
  button.selected {
    color: black;
    background: var(--light-main);
  }
}
.cards__container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.card {
  padding-block: 1rem;
  margin-top: 1rem;
  h3 {
    margin-bottom: 0.2rem;
    font-size: 1.8rem;
  }
  .item__date {
    color: var(--light-main-opacity);
  }
  .item__description {
    margin-block: 0.8rem;
  }
}
.card:hover h3 {
  text-decoration: underline;
}
</style>
