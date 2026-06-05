/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      colors: {
        // Azul royal del logo Volley Match
        brand: {
          50: '#eff3ff',
          100: '#dbe4ff',
          200: '#bccdff',
          300: '#93acff',
          400: '#6783fc',
          500: '#3f5cf0',
          600: '#2b46d6',
          700: '#2238b4',
          800: '#213291',
          900: '#213072',
          950: '#161d45',
        },
        // Dorado del balón (color de acento)
        accent: {
          50: '#fffbeb',
          100: '#fdf0c8',
          200: '#fbe08c',
          300: '#f9cd4f',
          400: '#f6ba26',
          500: '#f5b81e',
          600: '#d4920a',
          700: '#b06d0c',
          800: '#8f5511',
          900: '#764612',
        },
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgb(0 0 0 / 0.04), 0 4px 16px -4px rgb(0 0 0 / 0.08)',
        glow: '0 0 0 1px rgb(43 70 214 / 0.25), 0 8px 24px -8px rgb(43 70 214 / 0.45)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out both',
        'scale-in': 'scale-in 0.2s ease-out both',
      },
    },
  },
  plugins: [],
};
