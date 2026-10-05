/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primaryBlue: {
          50: 'var(--color-primaryBlue-50)',
          500: 'var(--color-primaryBlue-500)',
          600: 'var(--color-primaryBlue-600)',
          1000: 'var(--color-primaryBlue-1000)',
        },
        ink: '#191C1E',
        navy: '#0B1C30',
        muted: '#434654',
        steel: '#495E8A',
        border: {
          DEFAULT: '#C4C6D4',
          light: '#E2E8F0',
        },
      },
      fontFamily: {
        // Self-hosted variable fonts (see src/main.ts) — no Google Fonts request.
        heading: ['"Hanken Grotesk Variable"', 'Hanken Grotesk', 'system-ui', 'sans-serif'],
        body: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono Variable"', 'JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
