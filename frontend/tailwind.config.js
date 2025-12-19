/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'green-primary': '#10B981',
        'green-dark': '#064E3B',
        'green-soft': '#ECFDF5',
        'blue-navy': '#1E3A8A',
        'blue-primary': '#3B82F6',
        'blue-soft': '#EFF6FF',
        'purple-primary': '#6D28D9',
        'purple-soft': '#FAF5FF',
        'neon-mint': '#00FF8A',
        'gold-warm': '#F59E0B',
        'bg-main': '#0F172A',
        'bg-body': '#020617',
        'bg-light': '#F9FAFB',
        'text-main': '#0F172A',
        'text-muted': '#6B7280',
        'border-subtle': '#E5E7EB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'fadeInUp': 'fadeInUp 0.6s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 10px rgba(0, 255, 138, 0.5)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 20px rgba(0, 255, 138, 0.8)' },
        },
      },
    },
  },
  plugins: [],
}
