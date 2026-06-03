import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "../api/src/generated/swagger.json",
  output: "./src/client",
  plugins: [
    "@hey-api/client-axios",
    "@hey-api/sdk",
    "@hey-api/typescript",
  ],
});