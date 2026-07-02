/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      colors: {
        // Unified palette mapped to semantics
        background: '#FAFAFA',
        surface: '#FFFFFF',
        primary: {
          DEFAULT: '#111111',
          hover: '#27272A', // zinc-800
        },
        secondary: {
          DEFAULT: '#F4F4F5', // zinc-100
          hover: '#E4E4E7', // zinc-200
        },
        border: {
          DEFAULT: '#E4E4E7', // zinc-200
          hover: '#D4D4D8', // zinc-300
        },
        text: {
          primary: '#18181B', // zinc-900
          secondary: '#71717A', // zinc-500
          muted: '#A1A1AA', // zinc-400
        },
        success: {
          DEFAULT: '#10B981',
          bg: '#D1FAE5',
        },
        warning: {
          DEFAULT: '#F59E0B',
          bg: '#FEF3C7',
        },
        error: {
          DEFAULT: '#EF4444',
          bg: '#FEE2E2',
        },
      },
      boxShadow: {
        // 4-level elevation hierarchy
        'card': '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)',
        'dropdown': '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
        'toolbar': '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.02)',
        'modal': '0 20px 25px -5px rgba(0,0,0,0.08), 0 10px 10px -5px rgba(0,0,0,0.03)',
      },
      borderRadius: {
        'button': '9999px',
        'input': '0.75rem', // rounded-xl
        'card': '1rem', // rounded-2xl
        'modal': '1.5rem', // rounded-3xl
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
