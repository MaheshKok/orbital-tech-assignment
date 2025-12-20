/**
 * Unit tests for LoadingSpinner component.
 */

import { render } from "../../../test/testUtils";
import { screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { LoadingSpinner } from "../LoadingSpinner";

describe("LoadingSpinner", () => {
	it("should render with default message", () => {
		render(<LoadingSpinner />);
		// Use getAllByText since Chakra Spinner has a loading label too
		const loadingElements = screen.getAllByText("Loading...");
		expect(loadingElements.length).toBeGreaterThan(0);
	});

	it("should render with custom message", () => {
		render(<LoadingSpinner message="Fetching data..." />);
		expect(screen.getByText("Fetching data...")).toBeInTheDocument();
	});

	it("should have correct role for accessibility", () => {
		render(<LoadingSpinner />);
		expect(screen.getByRole("status")).toBeInTheDocument();
	});

	it("should have screen reader text", () => {
		render(<LoadingSpinner message="Loading data" />);
		expect(screen.getByText("Loading data")).toBeInTheDocument();
	});
});
