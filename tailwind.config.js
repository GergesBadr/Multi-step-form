/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./main.js"],
  theme: {
    fontFamily: {
      ubuntu: "Ubuntu, sans-serif",
    },
    extend: {
      colors: {
        "marine-blue": "hsl(213, 96%, 18%)",
        "purplish-blue": "hsl(243, 100%, 62%)",
        "pastel-blue": "hsl(228, 100%, 84%)",
        "Light-blue": "hsl(206, 94%, 87%)",
        "strawberry-red": "hsl(354, 84%, 57%)",
        "cool-gray": "hsl(231, 11%, 35%)",
        "light-gray": "hsl(229, 24%, 87%)",
        magnolia: "hsl(217, 100%, 97%)",
      },
    },
  },
  plugins: [],
};
