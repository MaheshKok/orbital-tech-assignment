/* eslint-disable react-refresh/only-export-components */
import "@testing-library/jest-dom";
import type { ReactElement } from "react";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, type RenderOptions } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// Wrapper component for tests
function TestProviders({ children }: { children: React.ReactNode }) {
	return (
		<ChakraProvider value={defaultSystem}>
			<MemoryRouter>{children}</MemoryRouter>
		</ChakraProvider>
	);
}

// Custom render function
function customRender(
	ui: ReactElement,
	options?: Omit<RenderOptions, "wrapper">
) {
	return render(ui, { wrapper: TestProviders, ...options });
}

// Re-export testing library utilities
export { screen, waitFor, within, fireEvent } from "@testing-library/react";
export { customRender as render };
