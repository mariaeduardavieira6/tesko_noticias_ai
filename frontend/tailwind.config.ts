// [CORREÇÃO] Removemos a importação do "Config"
// import type { Config } from "tailwindcss"

// [CORREÇÃO] Removemos o ": Config" da linha abaixo
const config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  // Isso força o Tailwind a gerar essas classes
  safelist: [
    'md:grid-cols-2',
    'lg:grid-cols-3',
  ],

  theme: {
    extend: {},
  },
  plugins: [],
}

export default config