/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'max-w-420': { max: '420px' }, // Custom breakpoint
      },
      backdropBlur: {
        lg: '20px', // Customize blur size
      },
      colors: {
        white: '#fff',
      },
    },
  },
  plugins: [],
}

