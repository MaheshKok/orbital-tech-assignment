/**
 * Unit tests for SortIndicator component.
 */

import { render } from "../../../test/testUtils";
import { screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { SortIndicator } from "../SortIndicator";

describe("SortIndicator", () => {
	it("should render ascending indicator", () => {
		const { container } = render(<SortIndicator direction="asc" />);
		const svg = container.querySelector("svg");
		expect(svg).toBeInTheDocument();
	});

	it("should render descending indicator", () => {
		const { container } = render(<SortIndicator direction="desc" />);
		const svg = container.querySelector("svg");
		expect(svg).toBeInTheDocument();
	});

	it("should render neutral indicator when direction is null", () => {
		const { container } = render(<SortIndicator direction={null} />);
		const svg = container.querySelector("svg");
		expect(svg).toBeInTheDocument();
	});

	it("should render priority badge when provided", () => {
		render(<SortIndicator direction="asc" priority={1} />);
		expect(screen.getByText("1")).toBeInTheDocument();
	});

	it("should not render priority badge when null", () => {
		render(<SortIndicator direction="asc" priority={null} />);
		expect(screen.queryByText("1")).not.toBeInTheDocument();
		expect(screen.queryByText("2")).not.toBeInTheDocument();
	});
});
