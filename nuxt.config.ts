// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  runtimeConfig: {
    appKey: 'ABC', // server
    public: {
      baseUrl: 'http://codercba.com' // server and client -> client_bundle.js
    }
  },
  appConfig: {
    title: 'Hello Next3 HYKJ',
    theme: {
      primary: 'blue'
    }
  },
  app: {
    head: {
      title: 'HYKJ',
      charset: 'UTF-8',
      viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no",
      meta: [
        {
          name: 'keywords',
          content: '关键词'
        },
        {
          name: 'description',
          content: "页面描述"
        }
      ],
      link: [
        {
          rel: "shortcut icon",
          href: "favicon.icon",
          type: "image/x-icon"
        }
      ],
      style: [
        {
          children: `body{ color: red }`
        }
      ]
    },
  }
})
