/**
 * Centralized UI Components.
 * Production-grade, reusable components using design tokens.
 */

import {
	Box,
	Button as ChakraButton,
	Spinner,
	Text,
	VStack,
	Center,
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
} from "@chakra-ui/react";
import type { ButtonProps } from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";

// =============================================================================
// BUTTON COMPONENT (used internally by ErrorState)
// =============================================================================

interface AppButtonProps extends ButtonProps {
	variant?: "primary" | "secondary" | "ghost" | "danger";
}

function AppButton({
	variant = "primary",
	children,
	...props
}: AppButtonProps) {
	const variantMap = {
		primary: { colorScheme: "brand" },
		secondary: { variant: "outline" as const },
		ghost: { variant: "ghost" as const },
		danger: { colorScheme: "red" },
	};

	return (
		<ChakraButton {...variantMap[variant]} {...props}>
			{children}
		</ChakraButton>
	);
}

// =============================================================================
// LOADING COMPONENT
// =============================================================================

interface LoadingStateProps {
	size?: "sm" | "md" | "lg" | "xl";
	message?: string;
}

export function LoadingState({
	size = "xl",
	message = "Loading...",
}: LoadingStateProps) {
	return (
		<Center py={12} role="status" aria-live="polite">
			<VStack spacing={4}>
				<Spinner
					size={size}
					thickness="4px"
					speed="0.65s"
					emptyColor="gray.200"
					color="brand.500"
				/>
				{message && (
					<Text fontSize="sm" color="gray.600">
						{message}
					</Text>
				)}
			</VStack>
		</Center>
	);
}

// =============================================================================
// ERROR COMPONENT
// =============================================================================

interface ErrorStateProps {
	title?: string;
	message: string;
	onRetry?: () => void;
}

export function ErrorState({
	title = "Something went wrong",
	message,
	onRetry,
}: ErrorStateProps) {
	return (
		<Box py={12} px={4} maxW="md" mx="auto">
			<Alert
				status="error"
				variant="subtle"
				flexDirection="column"
				alignItems="center"
				justifyContent="center"
				textAlign="center"
				height="auto"
				py={6}
				rounded="lg"
				bg="red.50"
			>
				<AlertIcon boxSize="40px" mr={0} color="red.500" />
				<AlertTitle mt={4} mb={1} fontSize="lg" color="gray.900">
					{title}
				</AlertTitle>
				<AlertDescription maxWidth="sm" color="gray.600">
					{message}
				</AlertDescription>

				{onRetry && (
					<AppButton
						variant="secondary"
						mt={6}
						size="sm"
						leftIcon={<RepeatIcon />}
						onClick={onRetry}
					>
						Try Again
					</AppButton>
				)}
			</Alert>
		</Box>
	);
}
