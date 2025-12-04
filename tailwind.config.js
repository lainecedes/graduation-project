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
                primary: '#5B5FFF',
                'primary-hover': '#4A4BF5',
                'primary-focus': '#7073FF',
                'primary-active': '#3B3BDB',
                'primary-100': '#DADAFE',

                background: '#F7F7FB',
                'background-dark': '#0F0F1A',

                'text-main': '#111111',
                'text-on-dark': '#EAEAF6',

                // refined white button set
                'btn-white': '#FFFFFF',
                'btn-white-hover': '#F8F8FF',
                'btn-white-active': '#F0F1FF',

                'btn-white-border': '#E5E7FF',
                'btn-white-border-hover': '#D4D6FF',
                'btn-white-border-active': '#C1C4FF',
            }
        },
    },
    plugins: [],
}

