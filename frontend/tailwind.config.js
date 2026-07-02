/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Cybersecurity-themed blue/gray palette
        brand: {
          50: '#eef4ff',
          100: '#d9e6ff',
          200: '#b3ccff',
          300: '#84acf5',
          400: '#5688e0',
          500: '#3466c2',
          600: '#264e9c',
          700: '#1f3f7d',
          800: '#1a3364',
          900: '#152a51'
        },
        surface: {
          light: '#f5f7fa',
          dark: '#0f172a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
