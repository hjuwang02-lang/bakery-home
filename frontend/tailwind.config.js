/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bakery: {
          50: '#FAF8F5',   // Warm cream
          100: '#F4EFEA',  // Rich milk cream
          200: '#E8DED2',  // Sand
          300: '#D5C4B1',  // Soft dough
          400: '#BAA28A',  // Golden crust
          500: '#A18266',  // Baked bread brown
          600: '#876547',  // Fresh toast
          700: '#6C4F35',  // Roasted coffee bean
          800: '#533C27',  // Dark chocolate wood
          900: '#3A291A',  // Deep espresso
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
