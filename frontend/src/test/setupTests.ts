/**
 * Jest setup file.
 * Configures testing utilities and global mocks.
 */

import "@testing-library/jest-dom";

// Mock matchMedia for responsive components
Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: jest.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: jest.fn(),
		removeListener: jest.fn(),
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		dispatchEvent: jest.fn(),
	})),
});

// Mock ResizeObserver for chart components
class ResizeObserverMock {
	observe() {}
	unobserve() {}
	disconnect() {}
}

window.ResizeObserver = ResizeObserverMock;

// Mock scrollTo
window.scrollTo = jest.fn();
