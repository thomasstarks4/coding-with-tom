/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // <- Important: Path to your components
  ],
  theme: {
    extend: {
      colors: {
        spirit: {
          brawler: '#f97316',
          sorcerer: '#a855f7',
          armor: '#06b6d4',
          aura: '#c084fc',
        },
        rarity: {
          common: '#9ca3af',
          rare: '#60a5fa',
          epic: '#a855f7',
          legendary: '#facc15',
          mythic: '#f87171',
        },
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 8px 2px currentColor' },
          '50%': { boxShadow: '0 0 20px 6px currentColor' },
        },
        dissolve: {
          '0%': { opacity: '1', transform: 'scale(1)', filter: 'blur(0px)' },
          '100%': { opacity: '0', transform: 'scale(0.3)', filter: 'blur(8px)' },
        },
      },
      animation: {
        shake: 'shake 0.4s ease-in-out',
        float: 'float 2s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        dissolve: 'dissolve 0.8s ease-out forwards',
      },
    },
  },
  plugins: [],
};
