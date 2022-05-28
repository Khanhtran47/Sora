module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "airbnb-typescript",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "import/extensions": [
      "error",
      "ignorePackages",
      { ts: "never", tsx: "never" },
    ],
    "react/jsx-filename-extension": ["warn", { extensions: [".tsx"] }],
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
  },
  settings: {
    "import/resolver": {
      typescript: {},
    },
  },
}
