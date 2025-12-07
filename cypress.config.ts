import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
    env: {
      FRONTEND_URL:
        process.env.FRONTEND_URL || "https://garagehub.app.fslab.dev",
      API_URL:
        process.env.API_URL || "https://gestao-estoque-api.app.fslab.dev",
    },
  },
});
