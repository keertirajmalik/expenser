import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: env.NODE_ENV === "test" ? false : "/",
      proxy: {
        "/cxf": {
          target: env.VITE_APP_DEV_BACKEND_URL,
          proxyTimeout: 1000 * 3600,
          timeout: 1000 * 3600,
          secure: false,
          changeOrigin: true,
        },
      },
    },
  };
});
