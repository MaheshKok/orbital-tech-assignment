/**
 * Design Tokens - Centralized Design System.
 *
 * Color Palette (3 Colors):
 * 1. Primary (Indigo) - Brand, actions, highlights
 * 2. Neutral (Slate) - Text, backgrounds, borders
 * 3. Semantic (Red) - Errors only
 */

// =============================================================================
// COLOR TOKENS
// =============================================================================

export const colors = {
	// Primary Brand Color - Indigo
	primary: {
		50: "#EEF2FF",
		100: "#E0E7FF",
		200: "#C7D2FE",
		300: "#A5B4FC",
		400: "#818CF8",
		500: "#6366F1", // Main brand color
		600: "#4F46E5",
		700: "#4338CA",
		800: "#3730A3",
		900: "#312E81",
	},

	// Neutral - Slate grays
	neutral: {
		0: "#FFFFFF",
		50: "#F8FAFC",
		100: "#F1F5F9",
		200: "#E2E8F0",
		300: "#CBD5E1",
		400: "#94A3B8",
		500: "#64748B",
		600: "#475569",
		700: "#334155",
		800: "#1E293B",
		900: "#0F172A",
	},

	// Semantic - Error only
	error: {
		50: "#FEF2F2",
		100: "#FEE2E2",
		500: "#EF4444",
		600: "#DC2626",
		700: "#B91C1C",
	},
} as const;

// =============================================================================
// SEMANTIC COLOR ALIASES
// =============================================================================

export const semanticColors = {
	// Backgrounds
	bg: {
		page: colors.neutral[50],
		surface: colors.neutral[0],
		surfaceHover: colors.neutral[100],
		muted: colors.neutral[100],
		accent: colors.primary[50],
	},

	// Text
	text: {
		primary: colors.neutral[900],
		secondary: colors.neutral[600],
		muted: colors.neutral[500],
		inverse: colors.neutral[0],
		accent: colors.primary[600],
	},

	// Borders
	border: {
		default: colors.neutral[200],
		muted: colors.neutral[100],
		accent: colors.primary[300],
	},

	// Interactive
	interactive: {
		default: colors.primary[500],
		hover: colors.primary[600],
		active: colors.primary[700],
		muted: colors.primary[100],
	},

	// Status
	status: {
		error: colors.error[500],
		errorBg: colors.error[50],
		errorText: colors.error[700],
	},
} as const;

// =============================================================================
// CHART COLORS (Using primary palette)
// =============================================================================

export const chartColors = {
	bar: {
		gradient: {
			start: colors.primary[500],
			end: colors.primary[400],
		},
	},
	grid: colors.neutral[200],
	axis: colors.neutral[200],
	tick: colors.neutral[500],
	cursor: colors.neutral[100],
} as const;

// =============================================================================
// COMPONENT TOKENS
// =============================================================================

export const componentTokens = {
	card: {
		bg: colors.neutral[0],
		border: colors.neutral[200],
		borderHover: colors.primary[300],
		shadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
		shadowHover: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
	},

	button: {
		primary: {
			bg: colors.primary[500],
			bgHover: colors.primary[600],
			bgActive: colors.primary[700],
			text: colors.neutral[0],
		},
		secondary: {
			bg: colors.neutral[0],
			bgHover: colors.neutral[100],
			border: colors.neutral[200],
			text: colors.neutral[700],
		},
		ghost: {
			bg: "transparent",
			bgHover: colors.neutral[100],
			text: colors.neutral[600],
		},
	},

	badge: {
		primary: {
			bg: colors.primary[50],
			text: colors.primary[700],
		},
		neutral: {
			bg: colors.neutral[100],
			text: colors.neutral[600],
		},
	},

	table: {
		headerBg: colors.neutral[50],
		headerText: colors.neutral[500],
		rowHover: colors.primary[50],
		border: colors.neutral[200],
		cellText: colors.neutral[700],
	},

	input: {
		bg: colors.neutral[0],
		border: colors.neutral[200],
		borderFocus: colors.primary[500],
		placeholder: colors.neutral[400],
	},
} as const;

// =============================================================================
// SPACING & SIZING
// =============================================================================

export const spacing = {
	xs: "0.25rem", // 4px
	sm: "0.5rem", // 8px
	md: "1rem", // 16px
	lg: "1.5rem", // 24px
	xl: "2rem", // 32px
	"2xl": "3rem", // 48px
} as const;

export const borderRadius = {
	sm: "0.25rem", // 4px
	md: "0.5rem", // 8px
	lg: "0.75rem", // 12px
	xl: "1rem", // 16px
	full: "9999px",
} as const;

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const typography = {
	fonts: {
		heading: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
		body: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
		mono: "'JetBrains Mono', 'Fira Code', monospace",
	},
	fontSizes: {
		xs: "0.75rem",
		sm: "0.875rem",
		md: "1rem",
		lg: "1.125rem",
		xl: "1.25rem",
		"2xl": "1.5rem",
		"3xl": "1.875rem",
		"4xl": "2.25rem",
	},
	fontWeights: {
		normal: 400,
		medium: 500,
		semibold: 600,
		bold: 700,
		extrabold: 800,
	},
} as const;
