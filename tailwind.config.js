const withMT = require("@material-tailwind/react/utils/withMT");
 
module.exports = withMT({
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  darkmode : "class",
  theme: {
    extend: {},
  },
  plugins: [],
});