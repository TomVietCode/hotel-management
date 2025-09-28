import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Be Vietnam Pro', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: {
                    50: '#e8f1fd',
                    100: '#b6d3fa',
                    200: '#93bdf8',
                    300: '#629ff4',
                    400: '#448df2',
                    500: '#1570ef',  // Màu cơ bản
                    600: '#1366d9',
                    700: '#0f50aa',
                    800: '#0c3e83',
                    900: '#092f64',
                  },
                success: '#41c588',
                warning: '#f9a63a',
                danger: '#f36960',
                grey: '#858d9d',
            }
        },
    },

    plugins: [forms],
};
