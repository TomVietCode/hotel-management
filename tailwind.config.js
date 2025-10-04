import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
    "./storage/framework/views/*.php",
    "./resources/views/**/*.blade.php",
    "./resources/js/**/*.tsx",
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ["Be Vietnam Pro", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: {
          50: "#e8f1fd",
          100: "#b6d3fa",
          200: "#93bdf8",
          300: "#629ff4",
          400: "#448df2",
          500: "#1570ef", 
          600: "#1366d9",
          700: "#0f50aa",
          800: "#0c3e83",
          900: "#092f64",
        },
        success: {
          50: "#E7F8F0",
          100: "#B6E9D1",
          200: "#92DEBA",
          300: "#60CF9B",
          400: "#41C588",
          500: "#12B76A", 
          600: "#10A760",
          700: "#0D824B",
          800: "#0A653A",
          900: "#084D2D",
        },
        warning: {
          50: "#FEF4E6",
          100: "#FDDDB3",
          200: "#FBCC8E",
          300: "#FAB55A",
          400: "#F9A63A",
          500: "#F79009", 
          600: "#E18308",
          700: "#AF6606",
          800: "#884F05",
          900: "#683C04",
        },
        danger: {
          50: "#FEECEB",
          100: "#FAC5C1",
          200: "#F8A9A3",
          300: "#F5827A",
          400: "#F36960",
          500: "#F04438", 
          600: "#DA3E33",
          700: "#AA3028",
          800: "#84251F",
          900: "#651D18",
        },
        grey: {
          50: "#F0F1F3",
          100: "#D0D3D9",
          200: "#B9BDC7",
          300: "#989FAD",
          400: "#858D9D",
          500: "#667085", 
          600: "#5D6679",
          700: "#48505E",
          800: "#383E49",
          900: "#2B2F38",
        },
      },
    },
  },

  plugins: [forms],
};
