/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      colors: {
        sage: {
          50: '#f4f7f0',
          100: '#e6eede',
          200: '#cddcbc',
          300: '#adc492',
          400: '#8aab68',
          500: '#6b8f49',
          600: '#527238',
          700: '#40592c',
          800: '#354826',
          900: '#2d3d22',
        },
        saffron: {
          50: '#fff9ed',
          100: '#fef1d3',
          200: '#fde0a5',
          300: '#fbca6d',
          400: '#f9a832',
          500: '#f78c10',
          600: '#e86d07',
          700: '#c15009',
          800: '#993f0f',
          900: '#7c3510',
        },
        rose: {
          skin: '#f9e8e2',
          mid: '#e8b4a0',
          deep: '#c47d63',
        },
        ink: '#1a1a2e',
        mist: '#f6f7f3',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'shimmer': 'shimmer 2s infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(24px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
