import { defineConfig } from "eslint-define-config";

export default defineConfig({
  // Extend Next.js and TypeScript recommended rules
  extends: ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"],

  // Ignore Prisma-generated files
  ignores: ["src/generated/**"],

  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },

  rules: {
    // Your custom rules
    "@typescript-eslint/no-explicit-any": "off", // turn off if you need to use 'any'
    "@typescript-eslint/no-require-imports": "off", // allows Prisma-generated requires
  },
});
