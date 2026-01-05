/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#C62828', dark: '#8E0000' },
        accent: { DEFAULT: '#F4B400', dark: '#C79100' },
        success: '#2E7D32',
        warning: '#FFB300',
        error: '#E53935',
        neutral: {
          text: '#1F2933',
          secondary: '#6B7280',
          bg: '#FAFAFA',
          card: '#FFFFFF',
          border: '#E5E7EB',
        },
      },
    },
  },
  plugins: [],
};
