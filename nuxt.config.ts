// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  runtimeConfig: {
    appKey: 'ABC', // server
    public: {
      baseUrl: 'http://codercba.com' // server and client -> client_bundle.js
    }
  }
})
