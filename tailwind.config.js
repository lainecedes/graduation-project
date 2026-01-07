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
                primary: '#4F52E6',
                'primary-hover': '#4547D6',
                'primary-focus': '#5E61EC',
                'primary-active': '#3B3BDB',
                'primary-100': '#DADAFE',

                background: '#F7F7FB',
                'background-alt': '#EFEFFF',
                'background-dark': '#0F0F1A',

                'text-main': '#111111',       // on light bg
                'text-muted': '#5B5F7A',
                'text-on-primary': '#FFFFFF',
                'text-on-dark': '#EAEAF6',

                success: '#00BE0A',

                danger: '#E5484D',
                'danger-bg': '#FDEAEA',
                'danger-hover': '#D63E44',
                'danger-active': '#B9373B',
                'danger-shadow': '#9D1C1C',
            }
        },
    },
    plugins: [],
}

