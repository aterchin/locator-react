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
                    200: '#201d23',
                    DEFAULT: '#5944d4',
                    light: '#a3d1eb',
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
