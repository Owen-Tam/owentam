// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },
  components: [
    {
      path: "~/components",
    },
  ],
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },

  modules: [
    "@nuxt/content",
    "@nuxt/fonts",
    "@nuxtjs/google-fonts",
    "@nuxt/icon",
    "@nuxtjs/mdc",
    "@nuxt/image",
  ],
  googleFonts: {
    display: "swap",
    families: {
      Raleway: {
        wght: "300..800",
        ital: "300..800",
      },
      Inter: {
        wght: "300..800",
        ital: "300..800",
      },
    },
  },
  content: {
    build: {
      markdown: {
        highlight: {
          theme: "one-dark-pro",
          langs: ["json", "cpp", "java", "py", "c", "asm"],
        },
      },
    },
  },
  mdc: {
    components: {
      prose: true,
    },
    highlight: {
      theme: "one-dark-pro",
      wrapperStyle: true,
    },
  },
});
