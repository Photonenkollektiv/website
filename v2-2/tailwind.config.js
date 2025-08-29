/* Tailwind configuration migrated from v2-3 for v2-2 */
module.exports = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        dark: '#0b0a13',
        magenta: '#f4008f',
        cyan: '#00f1ff',
        purple: '#6a00ff'
      },
      fontFamily: {
        inter: ['var(--font-inter)', 'sans-serif'],
        akony: ['var(--font-akony)', 'sans-serif']
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }
    }
  },
  plugins: []
};
