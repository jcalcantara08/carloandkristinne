import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/**
 * Flat config, native.
 *
 * eslint-config-next 16 ships real flat configs, so the FlatCompat shim that
 * older Next projects use is not needed here. Using it actually breaks:
 * @eslint/eslintrc tries to JSON.stringify a config object that now contains
 * a circular plugin reference.
 */
const eslintConfig = [
  { ignores: [".next/**", "node_modules/**", "next-env.d.ts", "public/**"] },
  ...nextCoreWebVitals,
  ...nextTypescript,
];

export default eslintConfig;
