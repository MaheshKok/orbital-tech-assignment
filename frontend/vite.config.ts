import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");

	return {
		plugins: [react()],
		build: {
			rollupOptions: {
				output: {
					manualChunks: {
						vendor: ["react", "react-dom", "react-router-dom"],
						charts: ["recharts"],
						query: ["@tanstack/react-query"],
					},
				},
			},
			chunkSizeWarningLimit: 600,
		},
		server: {
			port: 5173,
			host: true, // Listen on all addresses (needed for Docker)
			watch: {
				usePolling: true, // Enable polling for Docker file watching
			},
			proxy: {
				"/usage": {
					target: env.BACKEND_URL || "http://localhost:8000",
					changeOrigin: true,
				},
				"/health": {
					target: env.BACKEND_URL || "http://localhost:8000",
					changeOrigin: true,
				},
			},
		},
	};
});
