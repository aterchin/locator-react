import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import colors from '@tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                'brand-primary': {
                    200: '#341930',
                    DEFAULT: '#830A0D',
                    light: '#d7afb0',
                },
                'brand-secondary': {
                    DEFAULT: '#696969',
                    light: '#8b8b8b',
                },
            },
        },
    },

    plugins: [forms],
};
