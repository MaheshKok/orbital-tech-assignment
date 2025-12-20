/**
 * Test utilities and wrappers.
 */

import type { ReactElement, ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>{children}</BrowserRouter>
		</QueryClientProvider>
	);
}

// Custom render function that wraps components with all providers
function customRender(
	ui: ReactElement,
	options?: Omit<RenderOptions, "wrapper">
) {
	return render(ui, { wrapper: AllProviders, ...options });
}

// Re-export everything from testing library
export * from "@testing-library/react";
export { customRender as render };
