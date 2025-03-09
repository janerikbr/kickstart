import pluginJs from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import eslintPluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts,tsx}"] },
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      // order matters
      ["simple-import-sort"]: eslintPluginSimpleImportSort,
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    rules: {
      // Enable simple-import-sort rules
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
];
