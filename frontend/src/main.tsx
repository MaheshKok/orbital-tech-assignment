/**
 * Application Entry Point.
 * Sets up React Query, Error Boundary, and renders the App.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";
import theme from "./theme";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { apiConfig } from "./config/env";

// Create a QueryClient instance with centralized config
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: apiConfig.retryCount,
			retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
		},
	},
});

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ErrorBoundary>
			<ChakraProvider theme={theme}>
				<QueryClientProvider client={queryClient}>
					<App />
				</QueryClientProvider>
			</ChakraProvider>
		</ErrorBoundary>
	</StrictMode>
);
