<template>
  <div class="container">
    <div class="page__introduction">
      <h1>Projects</h1>
      <p>A collection of my work across different domains.</p>
    </div>
    <div class="cards__container">
      <ProjectsProjectCard
        v-for="project in projects"
        :key="project.name"
        :project="project"
      />
    </div>
  </div>
</template>

<script setup>
useHead({
  title: "Projects - Owen Tam",
});

const projects = [
  {
    name: "Cyber Quest HK",
    repo: "https://github.com/Owen-Tam/cyber-quest-hk",
    demo: "https://cyberquesthk.netlify.app/",
    tech: ["GDScript", "Godot Engine"],
    problem:
      "Primary school students lack engaging ways to learn about cybersecurity and digital safety risks like deepfakes and AI threats.",
    solution:
      "A gamified educational game built in Godot where players journey through 'Cyberia' to defeat the 'Malware Master', featuring auto-validated challenges and boss battles that test cybersecurity knowledge.",
  },
  {
    name: "Code Quest",
    repo: "https://github.com/Owen-Tam/code-quest",
    tech: ["JavaScript"],
    problem:
      "Secondary school students from the DBS IT Development team need a hands-on way to learn web development fundamentals at home.",
    solution:
      "Built an interactive learning platform that teaches web development concepts through guided exercises and challenges, making it accessible for students to learn HTML, CSS, and JavaScript.",
  },
  {
    name: "ITDT Website",
    repo: "https://github.com/Owen-Tam/itdt-website",
    demo: "https://dbsitdt.netlify.app/",
    tech: ["Vue", "Nuxt"],
    problem:
      "The DBS IT Development Team needs a modern web presence to showcase projects and recruit members.",
    solution:
      "Developed the official website for the DBS IT Development Team using Vue and Nuxt, featuring project showcases, event photos, team information and a sign-up form.",
  },
  {
    name: "UAP Detection Deepfake Feature Map",
    repo: "https://github.com/Owen-Tam/uap-detection-deepfake-feature-map",
    tech: ["Python", "PyTorch", "Jupyter Notebook"],
    problem:
      "Deepfake detectors are vulnerable to Universal Adversarial Perturbations (UAPs), compromising their effectiveness against identity fraud and misinformation.",
    solution:
      "Developed a feature-map-based UAP detector using CNNs on MesoInception-4 intermediary feature maps, demonstrating that increasing UAP diversity in training data significantly improves generalisability to unseen attacks.",
  },
];
</script>

<style scoped lang="scss">
h1 {
  font-size: 2.5rem;
}
.page__introduction {
  margin-bottom: 2rem;

  p {
    font-size: 1.1rem;
    line-height: 1.5;
    margin-top: 1rem;
  }
}
.cards__container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
