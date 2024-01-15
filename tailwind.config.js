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
                'brand-green': {
                    200: '#2e4237',
                    DEFAULT: '#029840',
                    light: '#9fffc7',
                },
                'brand-orange': {
                    DEFAULT: '#a23c1a',
                    light: '#efbeae',
                },
            },
        },
    },

    plugins: [forms],
};
