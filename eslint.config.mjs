import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Skill pihak ketiga yang tinggal di direktori agent. Isinya kode orang
    // lain dan bisa berubah lewat `skills update`, jadi jangan di-lint.
    ".agents/**",
    ".claude/**",
    ".windsurf/**",
  ]),
]);

export default eslintConfig;
