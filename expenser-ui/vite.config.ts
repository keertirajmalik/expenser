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
                    proxyTimeout: 60000, // 60 seconds
                    timeout: 60000,
                    secure: process.env.NODE_ENV === 'production',
                    changeOrigin: true,
                    configure: (proxy, _options) => {
                        proxy.on('error', (err, _req, _res) => {
                            console.log('proxy error', err);
                        });
                    },
                },
            },
        },
    };
});
