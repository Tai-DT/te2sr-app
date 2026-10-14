import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        // Stitch "Luminescent Precision" design system
        surface: {
          base: '#FAF8FF',
          low: '#F2F3FF',
          card: '#FFFFFF',
          high: '#DAE2FD',
          border: '#C4C5D7',
        },
        brand: {
          blue: '#0037B0',
          dark: '#131B2E',
          gray: '#434655',
          light: '#FAF8FF',
          accent: '#1D4ED8',
          emerald: '#006A48',
          amber: '#F59E0B',
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #0037B0 0%, #1D4ED8 100%)',
        'dark-gradient': 'linear-gradient(135deg, #1D1D1F 0%, #333336 100%)',
        'light-card-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #FAF8FF 100%)',
      },
      boxShadow: {
        'apple-sm': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'apple-md': '0 4px 20px rgba(0, 0, 0, 0.06)',
        'apple-lg': '0 12px 32px rgba(0, 0, 0, 0.08)',
        'brand-blue': '0 4px 14px rgba(0, 55, 176, 0.3)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
