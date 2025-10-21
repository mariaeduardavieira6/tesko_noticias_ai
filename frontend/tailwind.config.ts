import type { Config } from "tailwindcss"

const config: Config = {
  // Tailwind v4
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {}, // se quiser fontes/cores extras depois, colocamos aqui
  },
  plugins: [], // podemos adicionar plugins depois; no v4 é opcional
}

export default {
  darkMode: "class",
  content: ["./src/app/**/*.{ts,tsx}","./src/components/**/*.{ts,tsx}","./src/lib/**/*.{ts,tsx}"],
}


