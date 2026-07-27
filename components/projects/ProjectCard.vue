<template>
  <div class="card">
    <div class="card__header">
      <h3>{{ project.name }}</h3>
      <div class="card__links">
        <a
          v-if="project.demo"
          :href="project.demo"
          target="_blank"
          class="card__link"
        >
          <Icon name="uil:external-link-alt" /> Live Demo
        </a>
        <a :href="project.repo" target="_blank" class="card__link">
          <Icon name="uil:github" /> Source
        </a>
      </div>
    </div>
    <p class="card__problem">{{ project.problem }}</p>
    <p class="card__solution">{{ project.solution }}</p>
    <div class="card__tech">
      <p v-for="tech in project.tech" :key="tech" class="tech-tag">
        {{ tech }}
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  project: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.card {
  padding: 1.5rem;
  border: solid 2px var(--light-main-opacity-lower);
  border-radius: 12px;
  transition: border-color 300ms ease-in-out;
}
.card:hover {
  border-color: var(--primary);
}
.card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}
.card__header h3 {
  font-size: 1.5rem;
}
.card__links {
  display: flex;
  gap: 1rem;
}
.card__link {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  color: var(--primary);
  transition: color 200ms ease-in-out;
}
.card__link:hover {
  color: var(--primary-lighter);
  text-decoration: underline;
}
.card__problem,
.card__solution {
  margin-top: 0.8rem;
  font-size: 0.95rem;
  line-height: 1.6;
}
.card__problem {
  color: var(--light-main-opacity);
}
.card__solution {
  color: var(--light-main);
}
.card__tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}
.tech-tag {
  font-size: 0.8rem;
  padding: 0.25rem 0.6rem;
  border: solid 1px var(--light-main-opacity);
  border-radius: 100px;
  color: var(--light-main-opacity);
}
</style>
