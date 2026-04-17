/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // src altındaki tüm React dosyalarını tara
  ],
  theme: {
    extend: {
      fontFamily: {
        // Montserrat fontunu burada tanımlıyoruz
        sans: ['Montserrat', 'sans-serif'],
      },
      borderRadius: {
        // İstersen özel radius isimleri tanımlayabilirsin
        'entry': '25px',
        'button': '45px',
      },
      colors: {
        // MindMeal kurumsal renklerini buraya sabitlersen her yerde kullanabilirsin
        brandOrange: '#CD7102',
        brandDarkOrange: '#B84712',
        appGray: '#E5E5E5',
      }
    },
  },
  plugins: [],
}