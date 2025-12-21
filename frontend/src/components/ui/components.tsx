/**
 * Centralized UI Components.
 * Production-grade, reusable components using design tokens.
 */

import type { ReactNode } from "react";
import {
	Box,
	Button as ChakraButton,
	Card as ChakraCard,
	CardBody,
	CardHeader,
	Flex,
	Heading,
	Icon,
	Spinner,
	Text,
	VStack,
	Center,
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	Badge as ChakraBadge,
} from "@chakra-ui/react";
import type { ButtonProps, CardProps, BadgeProps } from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
import type { IconType } from "react-icons";

// =============================================================================
// BUTTON COMPONENTS
// =============================================================================

interface AppButtonProps extends ButtonProps {
	variant?: "primary" | "secondary" | "ghost" | "danger";
}

export function AppButton({
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
// CARD COMPONENTS
// =============================================================================

interface StatCardProps {
	label: string;
	value: string | number;
	sublabel?: string;
	icon: IconType;
	iconColor?: string;
	iconBg?: string;
}

export function StatCard({
	label,
	value,
	sublabel,
	icon,
	iconColor = "brand.600",
	iconBg = "brand.50",
}: StatCardProps) {
	return (
		<ChakraCard variant="elevated">
			<CardBody>
				<Flex justify="space-between" align="flex-start">
					<Box>
						<Text color="gray.500" fontSize="sm" mb={1}>
							{label}
						</Text>
						<Text fontSize="4xl" fontWeight="800" color="gray.900">
							{value}
						</Text>
						{sublabel && (
							<Text fontSize="sm" color="gray.400" mt={2}>
								{sublabel}
							</Text>
						)}
					</Box>
					<Flex p={3} bg={iconBg} rounded="2xl" color={iconColor}>
						<Icon as={icon} w={6} h={6} />
					</Flex>
				</Flex>
			</CardBody>
		</ChakraCard>
	);
}

interface ContentCardProps extends CardProps {
	title?: string;
	subtitle?: string;
	headerAction?: ReactNode;
	children: ReactNode;
}

export function ContentCard({
	title,
	subtitle,
	headerAction,
	children,
	...props
}: ContentCardProps) {
	return (
		<ChakraCard {...props}>
			{(title || headerAction) && (
				<CardHeader borderBottomWidth="0" pb={0}>
					<Flex justify="space-between" align="center">
						<Box>
							{title && (
								<Heading size="md" color="gray.900">
									{title}
								</Heading>
							)}
							{subtitle && (
								<Text fontSize="sm" color="gray.500" mt={1}>
									{subtitle}
								</Text>
							)}
						</Box>
						{headerAction}
					</Flex>
				</CardHeader>
			)}
			<CardBody>{children}</CardBody>
		</ChakraCard>
	);
}

// =============================================================================
// BADGE COMPONENTS
// =============================================================================

interface AppBadgeProps extends BadgeProps {
	variant?: "primary" | "neutral" | "outline";
}

export function AppBadge({
	variant = "primary",
	children,
	...props
}: AppBadgeProps) {
	const variantStyles = {
		primary: { colorScheme: "brand", variant: "subtle" as const },
		neutral: { bg: "gray.100", color: "gray.600" },
		outline: { variant: "outline" as const, colorScheme: "gray" },
	};

	return (
		<ChakraBadge
			rounded="full"
			px={3}
			py={1}
			{...variantStyles[variant]}
			{...props}
		>
			{children}
		</ChakraBadge>
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

// =============================================================================
// EMPTY STATE COMPONENT
// =============================================================================

interface EmptyStateProps {
	message?: string;
	icon?: IconType;
}

export function EmptyState({
	message = "No data available",
	icon,
}: EmptyStateProps) {
	return (
		<Box
			textAlign="center"
			py={12}
			color="gray.500"
			bg="gray.50"
			rounded="xl"
			borderWidth="1px"
			borderColor="gray.200"
			borderStyle="dashed"
		>
			{icon && <Icon as={icon} boxSize={8} mb={3} color="gray.400" />}
			<Text>{message}</Text>
		</Box>
	);
}

// =============================================================================
// SECTION HEADER COMPONENT
// =============================================================================

interface SectionHeaderProps {
	title: string;
	subtitle?: string;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
	return (
		<Box>
			<Heading
				size="lg"
				mb={2}
				bgGradient="linear(to-r, brand.700, brand.500)"
				bgClip="text"
			>
				{title}
			</Heading>
			{subtitle && (
				<Text color="gray.600" fontSize="lg">
					{subtitle}
				</Text>
			)}
		</Box>
	);
}
