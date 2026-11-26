/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ctga: '#002060',
        cjmf: '#FF0000',
        cpab: '#7030A0',
        sem: '#2F5597',
        abono: '#70AD47',
        'soft-green': '#E2EFDA',
        'soft-blue': '#B4C6E7',
        dif: '#FFFF00',
      },
    },
  },
  plugins: [],
};
