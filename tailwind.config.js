/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'dark' : '#040B10',
        'primary' : '#4C9CC8',
        'secondary' : '#28546C',
        'orange' : '#28546C',
        'purple' : '#AD99AC',
        'info' : '#9AC3DB',
        'success' : '#33C95D',
        'danger' : '#C02626',
        'light' : '#EAEBEB',
        'grey' : '#BABABA'

      }
    },
  },
  plugins: [],
}

