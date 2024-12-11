/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "auth-bg": "url('/assets/images/signupImage.svg')",
      },
    },
  },
  plugins: [],
};
