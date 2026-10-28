/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        campus: {
          50: '#F0F5FF',
          100: '#E5EDFF',
          200: '#CDDCFF',
          300: '#9BB8FF',
          400: '#648CFF',
          500: '#3B68FB',
          600: '#1D4ED8',
          700: '#1E3E62',
          800: '#102A43',
          900: '#0B192C',
          950: '#060D17',
        },
        navy: {
          50: '#F4F7FB',
          100: '#E7EFF6',
          200: '#C9DCED',
          300: '#9CBFDF',
          400: '#669CCC',
          500: '#3D7CB6',
          600: '#2A6195',
          700: '#1E4770',
          800: '#15314D',
          900: '#0F2135',
          950: '#08121D',
        },
        tealAccent: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(11, 25, 44, 0.05), 0 1px 2px -1px rgba(11, 25, 44, 0.05)',
        'card-hover': '0 10px 25px -5px rgba(11, 25, 44, 0.08), 0 8px 10px -6px rgba(11, 25, 44, 0.04)',
        'glow': '0 0 20px -5px rgba(59, 130, 246, 0.3)',
      }
    },
  },
  plugins: [],
}
