/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      borderWidth: {
        '3': '3px',
      },
      borderColor: {
        'gradient-br-blue-green': 'linear-gradient(to right, #143F7E, #297B46)',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.border-gradient-br-blue-green': {
          'border-image': 'linear-gradient(to right, #143F7E, #297B46) 1',
        },
      }
      addUtilities(newUtilities)
    },
  ],
}
