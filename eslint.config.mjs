import { defineConfig } from "eslint/config";
import config from "eslint-config-standard";


export default defineConfig([
  { files: ["**/*.{js,mjs,cjs}"] },
  config,
]);