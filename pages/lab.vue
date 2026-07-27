<template>
  <div class="container">
    <div class="page__introduction">
      <h1>Lab</h1>
      <p>Pixel art and creative experiments.</p>
    </div>
    <div class="lab__strip-wrapper">
      <button class="lab__arrow lab__arrow--left" @click="scrollStrip(-1)">
        <Icon name="uil:arrow-left" />
      </button>
      <div ref="stripRef" class="lab__strip">
        <LabCard
          v-for="item in labItems"
          :key="item.title"
          :item="item"
          :aspect="item.aspect"
          @select="selectedItem = $event"
        />
      </div>
      <button class="lab__arrow lab__arrow--right" @click="scrollStrip(1)">
        <Icon name="uil:arrow-right" />
      </button>
    </div>
    <Teleport to="body">
      <div
        v-if="selectedItem"
        class="modal__overlay"
        @click="selectedItem = null"
      >
        <div class="modal" @click.stop>
          <button class="modal__close" @click="selectedItem = null">
            &times;
          </button>
          <img
            :src="selectedItem.image"
            :alt="selectedItem.title"
            width="500"
            height="500"
            decoding="async"
            class="modal__image"
          />
          <div class="modal__details">
            <h2>{{ selectedItem.title }}</h2>
            <p>{{ selectedItem.description }}</p>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
useHead({
  title: "Lab - Owen Tam",
});

const selectedItem = ref(null);
const stripRef = ref(null);

function scrollStrip(direction) {
  if (!stripRef.value) return;
  const el = stripRef.value;
  const card = el.querySelector(".lab-card");
  if (!card) return;
  const step = card.offsetWidth + 24;
  const maxScroll = el.scrollWidth - el.clientWidth;
  const atEnd = el.scrollLeft >= maxScroll - 1;
  const atStart = el.scrollLeft <= 1;

  if (direction === 1 && atEnd) {
    el.scrollTo({ left: 0, behavior: "smooth" });
  } else if (direction === -1 && atStart) {
    el.scrollTo({ left: maxScroll, behavior: "smooth" });
  } else {
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  }
}

const labItems = [
  {
    title: "Untitled",
    description: "An artefact claimed by time — and a chicken. (64x64)",
    image: "/lab/car.webp",
    aspect: "square",
  },
  {
    title: "Voice from the Outer World",
    description:
      "A vast desert landscape interrupted by industrial structures. (128x180)",
    image: "/lab/desert.webp",
    aspect: "portrait",
  },
  {
    title: "Quid in silva est?",
    description:
      "Can you believe the rock is modelled after my face? Me neither. (188x188)",
    image: "/lab/forest.webp",
    aspect: "square",
  },
  {
    title: "The Island ",
    description:
      "One might wonder if the inhabitants of The Island, chained to the ground, are prisoners or masters of their predicament. (64x64)",
    image: "/lab/island.webp",
    aspect: "square",
  },
  {
    title: "Cat on a rock",
    description:
      "Is it a cat? Is it a fox? No, it's a cat on a rock. (100x100)",
    image: "/lab/rock.webp",
    aspect: "square",
  },
  {
    title: "A tree and a scene",
    description:
      "The audience questions if it is a sunset or a sunrise. (150x150)",
    image: "/lab/tree.webp",
    aspect: "square",
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

.lab__strip-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.lab__strip {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scroll-padding-inline: 0 1rem;
  padding: 0.5rem 0;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.lab__arrow {
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: solid 2px var(--light-main-opacity-lower);
  background: var(--background-color);
  color: var(--light-main);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    border-color 200ms ease-in-out,
    background 200ms ease-in-out;

  &:hover {
    border-color: var(--primary);
    background: rgba(255, 255, 255, 0.05);
  }
}

.modal__overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal {
  position: relative;
  background: var(--background-color-lighter);
  border: solid 2px var(--light-main-opacity-lower);
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  overflow: hidden;
}

.modal__close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: var(--background-color);
  border: solid 1px var(--light-main-opacity-lower);
  color: var(--light-main);
  font-size: 1.4rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 200ms ease-in-out;
  z-index: 1;

  &:hover {
    background: var(--primary);
    border-color: var(--primary);
  }
}

.modal__image {
  width: 100%;
  max-height: 500px;
  object-fit: contain;
  display: block;
  user-select: none;
  -webkit-user-drag: none;
}

.modal__details {
  padding: 1.25rem;

  h2 {
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 0.95rem;
    color: var(--light-main-opacity);
    line-height: 1.6;
  }
}
</style>
