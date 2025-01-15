/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        ant: "17px",
        sm: "18px",
        base: "20px",
        lg: "24px",
        xl: "28px",
        "2xl": "32px",
      },
      colors: {
        primary: "#FF7A00",
        secondary: "#4CC9C7",
        lightSecondary: "#52d9d7",
        sidebar: "#1EA19F",
        active: "#38CF2B",
        inactive: "#CF2B2B",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
