/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          400: '#FACC15',
          500: '#EAB308',
          600: '#CA8A04',
          700: '#A16207',
          amber: '#D4AF37'
        },
        dark: {
          900: '#0F1115',
          800: '#161920',
          700: '#202430',
          600: '#2D3344'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Outfit"', 'Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
