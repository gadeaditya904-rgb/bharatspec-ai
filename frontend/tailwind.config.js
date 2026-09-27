/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          50: '#f0f5fa',
          100: '#e1ecf5',
          200: '#c3d9ec',
          300: '#94bfe0',
          400: '#5e9ed0',
          500: '#3880be',
          600: '#2665a3',
          700: '#1e5184',
          800: '#1b446e',
          900: '#0f2942',
          950: '#0a1a2c',
        },
        navy: {
          800: '#0B1D3A',
          900: '#061326',
          950: '#030A14'
        },
        saffron: {
          500: '#FF9933',
          600: '#E67E17',
        },
        indiaGreen: {
          600: '#138808',
          700: '#0E6406',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
