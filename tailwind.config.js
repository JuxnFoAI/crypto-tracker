/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: "class",
  theme: {
    extend: {
      // Design tokens — mantener sincronizados con :root en src/styles.scss
      colors: {
        "bg-primary": "#0f1117",
        "bg-card": "#1a1d27",
        accent: "#3b82f6",
        success: "#22c55e",
        danger: "#ef4444",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};
