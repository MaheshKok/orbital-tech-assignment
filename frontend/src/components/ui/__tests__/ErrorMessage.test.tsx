/**
 * Unit tests for ErrorMessage component.
 */

import { jest } from "@jest/globals";
import { render } from "../../../test/testUtils";
import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { screen, fireEvent } from "@testing-library/react";
import { ErrorMessage } from "../ErrorMessage";

describe("ErrorMessage", () => {
	it("should render with default title", () => {
		render(<ErrorMessage message="An error occurred" />);
		expect(screen.getByText("Something went wrong")).toBeInTheDocument();
		expect(screen.getByText("An error occurred")).toBeInTheDocument();
	});

	it("should render with custom title", () => {
		render(<ErrorMessage title="Custom Error" message="An error occurred" />);
		expect(screen.getByText("Custom Error")).toBeInTheDocument();
	});

	it("should render retry button when onRetry is provided", () => {
		const onRetry = jest.fn();
		render(<ErrorMessage message="An error occurred" onRetry={onRetry} />);
		expect(
			screen.getByRole("button", { name: /try again/i })
		).toBeInTheDocument();
	});

	it("should not render retry button when onRetry is not provided", () => {
		render(<ErrorMessage message="An error occurred" />);
		expect(
			screen.queryByRole("button", { name: /try again/i })
		).not.toBeInTheDocument();
	});

	it("should call onRetry when retry button is clicked", () => {
		const onRetry = jest.fn();
		render(<ErrorMessage message="An error occurred" onRetry={onRetry} />);

		fireEvent.click(screen.getByRole("button", { name: /try again/i }));

		expect(onRetry).toHaveBeenCalledTimes(1);
	});

	it("should have correct role for accessibility", () => {
		render(<ErrorMessage message="An error occurred" />);
		expect(screen.getByRole("alert")).toBeInTheDocument();
	});
});
