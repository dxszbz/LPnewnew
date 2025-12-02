/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,md,mdx,js,ts,jsx,tsx,svelte,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f3f8ff',
          100: '#d9e9ff',
          500: '#2e6bff',
          600: '#1f4dd6',
          700: '#1239aa'
        },
        warning: {
          500: '#ff6b00',
          600: '#e85c00'
        },
        success: {
          500: '#0fba81'
        }
      },
      boxShadow: {
        glow: '0 20px 45px rgba(46,107,255,0.35)'
      },
      animation: {
        pulseCta: 'ctaPulse 1.8s ease-in-out infinite',
        progressStripes: 'stripe 1.2s linear infinite',
        floatBadge: 'floatBadge 3s ease-in-out infinite',
        wiggle: 'wiggle 4s ease-in-out infinite'
      },
      keyframes: {
        ctaPulse: {
          '0%,100%': { transform: 'scale(1)', boxShadow: '0 0 0 rgba(46,107,255,0.4)' },
          '50%': { transform: 'scale(1.04)', boxShadow: '0 0 30px rgba(46,107,255,0.55)' }
        },
        stripe: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '-60px 0' }
        },
        floatBadge: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        wiggle: {
          '0%,100%': { transform: 'rotate(0deg)' },
          '10%': { transform: 'rotate(-4deg)' },
          '20%': { transform: 'rotate(4deg)' },
          '30%': { transform: 'rotate(-3deg)' },
          '40%': { transform: 'rotate(3deg)' }
        }
      }
    }
  },
  plugins: []
};
