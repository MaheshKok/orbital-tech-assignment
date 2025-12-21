/**
 * Error Boundary Component.
 * Catches JavaScript errors anywhere in the child component tree.
 */

import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import {
	Box,
	Button,
	Container,
	Heading,
	Text,
	VStack,
	Icon,
} from "@chakra-ui/react";
import { WarningTwoIcon } from "@chakra-ui/icons";
import { isDev, isProd } from "../../config/env";

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
	errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
			errorInfo: null,
		};
	}

	static getDerivedStateFromError(error: Error): Partial<State> {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		this.setState({ errorInfo });

		// Log error to monitoring service in production
		if (isProd) {
			// TODO: Send to error monitoring service (Sentry, etc.)
			console.error("Uncaught error:", error, errorInfo);
		}
	}

	handleReset = (): void => {
		this.setState({ hasError: false, error: null, errorInfo: null });
	};

	handleReload = (): void => {
		window.location.reload();
	};

	render(): ReactNode {
		if (this.state.hasError) {
			// Custom fallback provided
			if (this.props.fallback) {
				return this.props.fallback;
			}

			// Default error UI
			return (
				<Container maxW="lg" py={16}>
					<VStack spacing={6} textAlign="center">
						<Icon as={WarningTwoIcon} boxSize={16} color="red.500" />
						<Heading size="lg" color="gray.800">
							Something went wrong
						</Heading>
						<Text color="gray.600" maxW="md">
							We encountered an unexpected error. Please try refreshing the
							page. If the problem persists, contact support.
						</Text>

						{/* Show error details in development */}
						{isDev && this.state.error && (
							<Box
								w="full"
								p={4}
								bg="red.50"
								borderRadius="md"
								textAlign="left"
								fontSize="sm"
								fontFamily="mono"
								overflow="auto"
							>
								<Text fontWeight="bold" color="red.700" mb={2}>
									{this.state.error.name}: {this.state.error.message}
								</Text>
								{this.state.errorInfo && (
									<Text color="red.600" whiteSpace="pre-wrap">
										{this.state.errorInfo.componentStack}
									</Text>
								)}
							</Box>
						)}

						<VStack spacing={3}>
							<Button colorScheme="brand" onClick={this.handleReload}>
								Reload Page
							</Button>
							<Button variant="ghost" onClick={this.handleReset}>
								Try Again
							</Button>
						</VStack>
					</VStack>
				</Container>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
