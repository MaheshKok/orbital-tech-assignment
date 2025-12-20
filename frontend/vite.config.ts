import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
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
				target: process.env.BACKEND_URL || "http://localhost:8000",
				changeOrigin: true,
			},
			"/health": {
				target: process.env.BACKEND_URL || "http://localhost:8000",
				changeOrigin: true,
			},
		},
	},
});
