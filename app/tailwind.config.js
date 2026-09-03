/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Cairo', 'Tajawal', 'system-ui', 'sans-serif'],
      },
      colors: {
        // هوية المطعم: أحمر قرميدي، برتقالي مشوي، بيج
        brick: {
          50: '#FBEAE6',
          100: '#F4CAC0',
          400: '#C6543A',
          500: '#B5442E',
          600: '#973A27',
          700: '#7A2E1F',
        },
        ember: {
          400: '#F0954A',
          500: '#E67E22',
          600: '#C96A17',
        },
        sand: {
          50: '#FFFBF5',
          100: '#FFF3E2',
          200: '#F6E7CE',
        },
      },
      boxShadow: {
        card: '0 2px 10px rgba(0,0,0,.06)',
      },
    },
  },
  plugins: [],
}
