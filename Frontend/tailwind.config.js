/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: 'rgb(var(--bg-main) / <alpha-value>)', // Main bg
          800: 'rgb(var(--bg-card) / <alpha-value>)', // Cards
          700: 'rgb(var(--border-color) / <alpha-value>)', // Borders
        },
        gray: { 
          100: 'rgb(var(--text-main) / <alpha-value>)', // Main text
          300: 'rgb(var(--text-muted) / <alpha-value>)', 
          400: 'rgb(var(--text-muted) / <alpha-value>)', // Subtitles
          500: 'rgb(var(--text-light) / <alpha-value>)', // Medium
        },
        primary: {
          400: '#34d399', // emerald-400
          500: '#10b981', // emerald-500
          600: '#059669', // emerald-600
        },
        accent: {
          400: '#2dd4bf', // teal-400
          500: '#14b8a6', // teal-500
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
