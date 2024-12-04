export default defineNuxtConfig({
  ssr: false,
  build: {
    transpile: ['ol']
  },
  css: [
    'bootstrap/dist/css/bootstrap.css',
    'bootstrap-vue-next/dist/bootstrap-vue-next.css',
  ],
  modules: [
'@pinia/nuxt',
    '@bootstrap-vue-next/nuxt'
  ],

  bootstrapVueNext: {
  
  }
})