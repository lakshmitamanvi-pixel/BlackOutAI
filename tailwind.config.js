/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        oled: '#0F172A',
        surface: {
          dark: '#0B1120',
          card: '#1E293B',
          border: '#334155',
          highlight: '#475569',
        },
        panic: {
          red: {
            DEFAULT: '#EF4444',
            dark: '#7F1D1D',
            bg: '#450A0A',
            glow: '#DC2626',
          },
          amber: {
            DEFAULT: '#F59E0B',
            dark: '#78350F',
            bg: '#451A03',
            glow: '#D97706',
          },
          green: {
            DEFAULT: '#10B981',
            dark: '#064E3B',
            bg: '#022C22',
            glow: '#059669',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Consolas', 'monospace'],
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
}

