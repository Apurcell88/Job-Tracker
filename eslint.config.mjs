// eslint.config.js
import { defineConfig } from "eslint-define-config";
import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

export default defineConfig([
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    ignores: ["src/generated/**"], // <- important: ignore Prisma-generated code
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
    },
    rules: {
      "@typescript-eslint/no-require-imports": "error",
    },
  },
]);
