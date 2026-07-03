/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        graphite: '#16181C',
        paper: '#F8F7F4',
        slate: '#3C4147',
        forge: '#EE5A1E',
        // Derived surfaces — kept close to the base palette
        'graphite-2': '#22252B',
        'paper-2': '#EFEDE8',
        line: '#E3E1DB',
        'line-dark': '#2C3037',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        editorial: ['Fraunces', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(22, 24, 28, 0.05)',
        raised: '0 8px 28px rgba(22, 24, 28, 0.12)',
      },
    },
  },
  plugins: [],
};
