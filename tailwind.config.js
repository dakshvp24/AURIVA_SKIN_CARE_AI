/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#EEF2EA',
          100: '#DDE4D8',
          200: '#A9B5A1',
          300: '#71836B',
          400: '#55735A',
          500: '#3F5945', // Deep Sage Green Primary
          600: '#26382C', // Dark Forest Green
          700: '#1F3025',
          800: '#18241C',
          900: '#101712',
        },
        ivory: {
          50: '#FFFFFF',
          100: '#F8F5EF', // Warm Ivory Primary Background
          200: '#F2EDE3', // Soft Cream
          300: '#E8DED0', // Soft Beige Accent
          400: '#D8C7B0', // Warm Sand Accent
          500: '#DED9D0', // Soft Border
        },
        aurivatext: {
          primary: '#20251F',
          secondary: '#62675F',
          muted: '#8A8D86',
        },
        terracotta: {
          DEFAULT: '#B85C50',
          50: '#FDF6F5',
          100: '#F7E7E5',
          500: '#B85C50',
          600: '#9E4A3F',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Outfit"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(38, 56, 44, 0.035)',
        'elevated': '0 14px 40px rgba(38, 56, 44, 0.06)',
        'pill': '0 2px 10px rgba(63, 89, 69, 0.12)',
      }
    },
  },
  plugins: [],
}
