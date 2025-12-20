/**
 * Error message component.
 * Displays error states with retry option.
 */

import {
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	Button,
	Box,
} from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";

interface ErrorMessageProps {
	title?: string;
	message: string;
	onRetry?: () => void;
}

export function ErrorMessage({
	title = "Something went wrong",
	message,
	onRetry,
}: ErrorMessageProps) {
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
				<AlertIcon boxSize="40px" mr={0} />
				<AlertTitle mt={4} mb={1} fontSize="lg">
					{title}
				</AlertTitle>
				<AlertDescription maxWidth="sm" color="gray.600">
					{message}
				</AlertDescription>

				{onRetry && (
					<Button
						mt={6}
						colorScheme="red"
						size="sm"
						variant="outline"
						leftIcon={<RepeatIcon />}
						onClick={onRetry}
					>
						Try Again
					</Button>
				)}
			</Alert>
		</Box>
	);
}
