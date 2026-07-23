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
        surface: {
          base: '#F5F5F7',
          low: '#FAFAFC',
          card: '#FFFFFF',
          high: '#E5E5EA',
          border: '#E2E8F0',
        },
        brand: {
          blue: '#0071E3',
          dark: '#1D1D1F',
          gray: '#86868B',
          light: '#F5F5F7',
          accent: '#2997FF',
          emerald: '#10B981',
          amber: '#F59E0B',
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #0071E3 0%, #2997FF 100%)',
        'dark-gradient': 'linear-gradient(135deg, #1D1D1F 0%, #333336 100%)',
        'light-card-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #F5F5F7 100%)',
      },
      boxShadow: {
        'apple-sm': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'apple-md': '0 4px 20px rgba(0, 0, 0, 0.06)',
        'apple-lg': '0 12px 32px rgba(0, 0, 0, 0.08)',
        'brand-blue': '0 4px 14px rgba(0, 113, 227, 0.3)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-montserrat)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
