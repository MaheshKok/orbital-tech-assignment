import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
	initialColorMode: "light",
	useSystemColorMode: false,
};

const theme = extendTheme({
	config,
	colors: {
		brand: {
			50: "#EEF2FF",
			100: "#E0E7FF",
			200: "#C7D2FE",
			300: "#A5B4FC",
			400: "#818CF8",
			500: "#6366F1", // Primary Brand Color
			600: "#4F46E5",
			700: "#4338CA",
			800: "#3730A3",
			900: "#312E81",
			950: "#1E1B4B",
		},
		accent: {
			400: "#38BDF8", // Cyan for nice gradients
			500: "#0EA5E9",
		},
		gray: {
			50: "#F8FAFC", // Cool grays (Slate)
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
	},
	fonts: {
		heading: "'Inter', sans-serif",
		body: "'Inter', sans-serif",
	},
	styles: {
		global: {
			body: {
				bg: "gray.50",
				color: "gray.900",
			},
		},
	},
	components: {
		Card: {
			baseStyle: {
				container: {
					bg: "white",
					rounded: "xl",
					borderWidth: "1px",
					borderColor: "gray.200",
					shadow: "sm",
					transition: "all 0.2s ease-in-out",
					_hover: {
						shadow: "md",
						transform: "translateY(-2px)",
						borderColor: "brand.300",
					},
				},
				header: {
					pb: 2,
				},
				body: {
					pt: 2,
				},
			},
		},
		Button: {
			variants: {
				primary: {
					bgGradient: "linear(to-r, brand.600, brand.500)",
					color: "white",
					_hover: {
						bgGradient: "linear(to-r, brand.700, brand.600)",
						shadow: "md",
					},
					_active: {
						bg: "brand.700",
					},
				},
			},
		},
		Badge: {
			baseStyle: {
				px: 2,
				py: 0.5,
				rounded: "md",
				fontWeight: "medium",
				textTransform: "none",
			},
		},
		Table: {
			variants: {
				elegant: {
					table: {
						bg: "white",
					},
					thead: {
						th: {
							bg: "gray.50/80", // Glassy feel
							backdropFilter: "blur(8px)",
							color: "gray.500",
							textTransform: "uppercase",
							letterSpacing: "wider",
							fontSize: "xs",
							fontWeight: "semibold",
							borderBottomWidth: "1px",
							borderColor: "gray.200",
							py: 4,
							position: "sticky",
							top: 0,
							zIndex: 1,
						},
					},
					tbody: {
						tr: {
							transition: "background 0.2s",
							_hover: {
								bg: "brand.50",
							},
							"&:last-child td": {
								borderBottom: "none",
							},
						},
						td: {
							fontSize: "sm",
							py: 4,
							color: "gray.700",
							borderBottomWidth: "1px",
							borderColor: "gray.100",
						},
					},
				},
			},
		},
	},
});

export default theme;
