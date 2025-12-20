/**
 * Jest setup file.
 * Configures testing utilities and global mocks.
 */

import { jest } from "@jest/globals";
import { TextEncoder, TextDecoder } from "util";
import "@testing-library/jest-dom";

// Polyfill for TextEncoder/TextDecoder (required by react-router)
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

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
window.scrollTo = jest.fn() as unknown as typeof window.scrollTo;
