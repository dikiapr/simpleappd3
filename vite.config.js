import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import cors from "@koa/cors";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    cors: true,
    host: "0.0.0.0",
    port: 3000,
    configureServer: (server) => {
      server.middlewares.use(cors());
    },
  },
});
