/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FFD700', // Gold/Yellow
          light: '#FFE44D',
          dark: '#FFC700',
        },
        dark: {
          DEFAULT: '#0A0A0A', // Matte Black
          surface: '#121212',
          lighter: '#1A1A1A',
        },
      },
      fontFamily: {
        heading: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(255, 215, 0, 0.4)',
        'glow-sm': '0 0 20px rgba(255, 215, 0, 0.3)',
        'glow-lg': '0 0 30px rgba(255, 215, 0, 0.5)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shine': 'shine 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 10px #FFD700', transform: 'scale(1)' },
          'to': { boxShadow: '0 0 20px #FFD700, 0 0 10px #FFD700', transform: 'scale(1.05)' },
        },
        shine: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
      }
    },
  },
  plugins: [],
}
