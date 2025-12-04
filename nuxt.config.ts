// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    vite: {
        server: {
            watch: {
                usePolling: true,
            },
        },
    },
    future: {
        compatibilityVersion: 4,
    },

    css: [
        '~/assets/css/tailwind.css',
        '~/assets/css/fonts.css',
    ],

    modules: ['@nuxt/content', '@nuxt/image', '@nuxtjs/tailwindcss'],
})
