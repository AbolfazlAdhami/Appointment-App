import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    env: {
      NODE_ENV: "test",
    },
    include: ["src/**/*.test.ts"],
    exclude: ["node_modules/**", "dist/**", "**/node_modules/**", "**/dist/**"],
  },
});
