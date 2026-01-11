/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          cream: '#FEF6E4',
          paleBlue: '#E8F4F8',
          lightGreen: '#E8F5E9',
        },
        primary: {
          yellow: '#F4D35E',
          green: '#52B788',
          orange: '#FFB84D',
          blue: '#4ECDC4',
        },
        secondary: {
          pink: '#FF6B9D',
          purple: '#C77DFF',
          coral: '#FF8C42',
        },
        tracing: {
          active: '#52B788',
          offPath: '#FF8C42',
          dotted: '#999999',
        },
        text: {
          dark: '#2C3E50',
          light: '#FFFFFF',
        },
      },
      borderRadius: {
        lg: '12px',
        xl: '16px',
      },
      minHeight: {
        touch: '48px',
      },
      minWidth: {
        touch: '48px',
      },
    },
  },
  plugins: [],
};
