/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#3B82F6',
        secondary: '#64748B',
        accent: '#10B981',
        surface: '#FFFFFF',
        background: '#F8FAFC',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      animation: {
        'pulse-green': 'pulse-green 0.3s ease-in-out',
        'scale-up': 'scale-up 0.2s ease-out',
      },
      keyframes: {
        'pulse-green': {
          '0%': { transform: 'scale(0.8)', borderColor: '#10B981' },
          '100%': { transform: 'scale(1)', borderColor: '#10B981' },
        },
        'scale-up': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.02)' },
        },
      },
    },
  },
  plugins: [],
}