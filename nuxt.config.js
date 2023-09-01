import colors from "vuetify/es5/util/colors"

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  server: {
    host: "0.0.0.0", // デフォルト: localhost,
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: "%s - Dream Diary",
    title: "Dream Diary",
    htmlAttrs: {
      lang: "ja",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: "「Dream Diary」は、あなたの目標達成を応援します。",
      },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    "@/plugins/axios-accessor",
    "@/plugins/date-format",
    "@/plugins/filter/date-filter",
    "@/plugins/filter/label-filter",
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    "@nuxt/typescript-build",
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    "@nuxtjs/axios",
    "@nuxtjs/auth",
    "@nuxtjs/dayjs",
    "@nuxtjs/style-resources",
    "@nuxtjs/proxy",
  ],

  env: {
    // これを設定しないとNuxtでprocess.env.NODE_ENVを取得したときにデフォルトの値になってしまう
    NODE_ENV: process.env.NODE_ENV,
  },

  styleResources: {
    scss: ["~/assets/variable.scss"],
  },

  axios: {
    baseURL: process.env.API_DOMAIN,
  },

  proxy: {
    "/api/": {
      target: process.env.API_DOMAIN,
      changeOrigin: true,
      secure: false,
    },
  },

  auth: {
    redirect: {
      login: false,
      logout: false,
      callback: false,
      home: false,
    },
    strategies: {
      local: {
        token: {
          property: "access_token",
        },
        user: {
          property: false,
          autoFetch: false,
        },
        endpoints: {
          login: { url: "/api/v1/auth/sign_in", method: "post", propertyName: "access_token" },
          logout: { url: "/api/v1/auth/sign_out", method: "delete" },
          user: { url: "/api/v1/auth/sessions", method: "get", propertyName: false },
        },
      },
    },
  },

  dayjs: {
    locales: ["en", "ja"],
    defaultLocale: "en",
    defaultTimeZone: "Asia/Tokyo",
    plugins: [
      "utc", // import 'dayjs/plugin/utc'
      "timezone", // import 'dayjs/plugin/timezone'
    ], // Your Day.js plugin
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: false,
      themes: {
        /* 以下追加 */
        light: {
          primary: "#350d36",
          surface: "#FFFFFF",
          accent: "#d1417e",
          secondary: "#61275a",
          background: "#1f0a1e",
          fontColor: "#ffffff",
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
