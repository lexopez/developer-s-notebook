// tailwind.config.js
export default {
  darkMode: "class", // This is the key!
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      spacing: {
        "viewport-x": "10vw",
        "viewport-y": "10vh",
      },
    },
  },
  plugins: [],
};
