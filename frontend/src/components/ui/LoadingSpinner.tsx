/**
 * Loading spinner component.
 * Displays an animated spinner during data loading.
 */

import { Spinner, Text, VStack, Center } from "@chakra-ui/react";

interface LoadingSpinnerProps {
	size?: "sm" | "md" | "lg" | "xl";
	message?: string;
}

export function LoadingSpinner({
	size = "xl",
	message = "Loading...",
}: LoadingSpinnerProps) {
	return (
		<Center py={12} role="status" aria-live="polite">
			<VStack spacing={4}>
				<Spinner
					size={size}
					thickness="4px"
					speed="0.65s"
					emptyColor="gray.200"
					color="blue.500"
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
