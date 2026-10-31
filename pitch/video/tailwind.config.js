/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // Matrica deck palette
      colors: {
        ink: "#0e1215",
        panel: "#161c21",
        line: "#2a343c",
        fg: "#e9edef",
        muted: "#93a1ab",
        signal: "#ff7a1a",
        steel: "#6fa8d6",
        risk: "#ef6b62",
      },
    },
  },
  plugins: [],
};
