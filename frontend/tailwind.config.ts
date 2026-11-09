import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-in-out',
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.4s ease-out',
        'marquee': 'marquee 28s linear infinite',
        'kenburns': 'kenburns 24s ease-out infinite alternate',
        'pulse-subtle': 'pulseSubtle 2.5s ease-in-out infinite',
        'liquid-1': 'liquidOne 16s ease-in-out infinite alternate',
        'liquid-2': 'liquidTwo 20s ease-in-out infinite alternate',
        'liquid-3': 'liquidThree 18s ease-in-out infinite alternate',
        'liquid-glow': 'liquidGlow 8s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        kenburns: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.08)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        liquidOne: {
          '0%': { transform: 'translate3d(0, 0, 0) scale(1) rotate(0deg)' },
          '50%': { transform: 'translate3d(60px, -40px, 0) scale(1.15) rotate(45deg)' },
          '100%': { transform: 'translate3d(-40px, 50px, 0) scale(0.95) rotate(-30deg)' },
        },
        liquidTwo: {
          '0%': { transform: 'translate3d(0, 0, 0) scale(1) rotate(0deg)' },
          '50%': { transform: 'translate3d(-50px, 60px, 0) scale(1.2) rotate(-50deg)' },
          '100%': { transform: 'translate3d(50px, -30px, 0) scale(0.9) rotate(35deg)' },
        },
        liquidThree: {
          '0%': { transform: 'translate3d(0, 0, 0) scale(1.1)' },
          '50%': { transform: 'translate3d(30px, 40px, 0) scale(0.85)' },
          '100%': { transform: 'translate3d(-50px, -40px, 0) scale(1.18)' },
        },
        liquidGlow: {
          '0%, 100%': { opacity: '0.45', filter: 'blur(70px)' },
          '50%': { opacity: '0.8', filter: 'blur(95px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
