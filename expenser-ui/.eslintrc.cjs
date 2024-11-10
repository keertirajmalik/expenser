/* eslint-env node */
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["react", "@typescript-eslint", "prettier"],
  rules: {
    "react/prop-types": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "prettier/prettier": "error",
    "react/react-in-jsx-scope": "off", // Disable the rule
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
