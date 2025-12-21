/**
 * Chakra UI Theme Configuration.
 * Centralized theme using design tokens.
 */

import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
import { colors, typography } from "./tokens";

const config: ThemeConfig = {
	initialColorMode: "light",
	useSystemColorMode: false,
};

const theme = extendTheme({
	config,
	colors: {
		// Map tokens to Chakra color scheme
		brand: colors.primary,
		gray: colors.neutral,
		red: colors.error,
	},
	fonts: typography.fonts,
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
			variants: {
				elevated: {
					container: {
						shadow: "sm",
						_hover: {
							shadow: "lg",
						},
					},
				},
				outline: {
					container: {
						shadow: "none",
						borderWidth: "1px",
					},
				},
			},
		},
		Button: {
			baseStyle: {
				fontWeight: "semibold",
				rounded: "lg",
			},
			variants: {
				solid: {
					bg: "brand.500",
					color: "white",
					_hover: {
						bg: "brand.600",
						shadow: "md",
					},
					_active: {
						bg: "brand.700",
					},
				},
				outline: {
					borderColor: "gray.200",
					color: "gray.700",
					_hover: {
						bg: "gray.100",
						borderColor: "gray.300",
					},
				},
				ghost: {
					color: "gray.600",
					_hover: {
						bg: "gray.100",
					},
				},
				primary: {
					bg: "brand.500",
					color: "white",
					_hover: {
						bg: "brand.600",
						shadow: "md",
					},
					_active: {
						bg: "brand.700",
					},
				},
			},
			defaultProps: {
				colorScheme: "brand",
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
			variants: {
				subtle: {
					bg: "brand.50",
					color: "brand.700",
				},
				solid: {
					bg: "gray.700",
					color: "white",
				},
			},
		},
		Heading: {
			baseStyle: {
				color: "gray.900",
				fontWeight: "bold",
			},
		},
		Text: {
			baseStyle: {
				color: "gray.700",
			},
		},
		Stat: {
			baseStyle: {
				label: {
					color: "gray.500",
				},
				number: {
					color: "gray.900",
				},
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
							bg: "gray.50",
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
		Alert: {
			variants: {
				subtle: {
					container: {
						bg: "red.50",
					},
					icon: {
						color: "red.500",
					},
				},
			},
		},
		Spinner: {
			baseStyle: {
				color: "brand.500",
			},
		},
	},
});

export default theme;
export { colors, chartColors, componentTokens, typography } from "./tokens";
