/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/components/**/*.{vue,js,ts}',
        './app/pages/**/*.{vue,js,ts}',
        './app/app.vue',
    ],
    theme: {
        extend: {
            fontFamily: {
                body: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
                heading: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
                mono: ['"Space Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
            },
            colors: {
                // Neon Tech Museum palette
                primary: '#5B5FFF',        // main action
                'primary-soft': '#8C52FF', // hover / secondary
                'primary-dark': '#3D3DF3', // active / focus

                accent: '#F25AFF',         // badges, highlights

                background: '#F7F7FB',     // app bg (light)
                'background-alt': '#EEEFFD',
                'background-dark': '#0F0F1A',

                'text-main': '#111111',    // body text
                'text-on-dark': '#EAEAF6', // text on dark / buttons
            },
        },
    },
    plugins: [],
}

