/**
 * Sort Indicator Component.
 * Displays visual indicator for column sort state.
 */

import { Icon, Badge, HStack } from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon, UpDownIcon } from "@chakra-ui/icons";
import type { SortDirection } from "../../types/usage";

interface SortIndicatorProps {
	direction: SortDirection;
	priority?: number | null;
}

export function SortIndicator({ direction, priority }: SortIndicatorProps) {
	return (
		<HStack
			spacing={1}
			ml={2}
			as="span"
			display="inline-flex"
			alignItems="center"
		>
			{direction === "asc" && (
				<Icon as={ChevronUpIcon} w={4} h={4} color="blue.600" />
			)}
			{direction === "desc" && (
				<Icon as={ChevronDownIcon} w={4} h={4} color="blue.600" />
			)}
			{direction === null && (
				<Icon as={UpDownIcon} w={3} h={3} color="gray.400" />
			)}
			{priority !== null && priority !== undefined && (
				<Badge
					ml={1}
					colorScheme="blue"
					variant="subtle"
					fontSize="xs"
					borderRadius="full"
					px={1.5}
				>
					{priority}
				</Badge>
			)}
		</HStack>
	);
}
