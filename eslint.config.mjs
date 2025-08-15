// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import { FlatCompat } from "@eslint/eslintrc";
// import { defineConfig } from "eslint-define-config";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
// });

// export const eslintConfig = [
//   ...compat.extends("next/core-web-vitals", "next/typescript"),
// ];

// export default defineConfig({
//   root: true,
//   ignores: ["src/generated/**"],
//   extends: ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"],
//   parserOptions: {
//     ecmaVersion: 2022,
//     sourceType: "module",
//   },
//   rules: {
//     // any custom rules
//     "@typescript-eslint/no-require-imports": "error", // keeps it on for your own cod
//   },
// });

// eslint.config.js
import { defineConfig } from "eslint-define-config";
import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

export default defineConfig([
  // pull in Next.js recommended configs
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // your custom rules
  {
    ignores: ["src/generated/**"], // ignores Prisma-generated files
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
