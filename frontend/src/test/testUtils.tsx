/* eslint-disable react-refresh/only-export-components */
/**
 * Test utilities and wrappers.
 */

import type { ReactElement, ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import "@testing-library/jest-dom/jest-globals";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";

// Create a fresh QueryClient for each test
function createTestQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
				gcTime: 0,
			},
		},
	});
}

interface WrapperProps {
	children: ReactNode;
}

// Wrapper component that includes all providers
function AllProviders({ children }: WrapperProps) {
	const queryClient = createTestQueryClient();

	return (
		<ChakraProvider theme={theme}>
			<QueryClientProvider client={queryClient}>
				<BrowserRouter>{children}</BrowserRouter>
			</QueryClientProvider>
		</ChakraProvider>
	);
}

// Custom render function that wraps components with all providers
function customRender(
	ui: ReactElement,
	options?: Omit<RenderOptions, "wrapper">
) {
	return render(ui, { wrapper: AllProviders, ...options });
}

export { customRender as render };
