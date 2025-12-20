import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
	initialColorMode: "light",
	useSystemColorMode: false,
};

const theme = extendTheme({
	config,
	colors: {
		brand: {
			50: "#eef2ff",
			100: "#e0e7ff",
			200: "#c7d2fe",
			300: "#a5b4fc",
			400: "#818cf8",
			500: "#6366f1",
			600: "#4f46e5",
			700: "#4338ca",
			800: "#3730a3",
			900: "#312e81",
		},
	},
	fonts: {
		heading: "'Inter', sans-serif",
		body: "'Inter', sans-serif",
	},
	components: {
		Card: {
			baseStyle: {
				container: {
					bg: "white",
					rounded: "lg",
					shadow: "sm",
					borderWidth: "1px",
					borderColor: "gray.200",
					p: 6,
				},
			},
		},
		Table: {
			variants: {
				simple: {
					th: {
						borderBottom: "1px",
						borderColor: "gray.200",
						bg: "gray.50",
						textTransform: "uppercase",
						fontSize: "xs",
						fontWeight: "semibold",
						letterSpacing: "wider",
						color: "gray.500",
						py: 3,
						px: 6,
					},
					td: {
						borderBottom: "1px",
						borderColor: "gray.200",
						py: 4,
						px: 6,
					},
				},
			},
		},
	},
});

export default theme;
