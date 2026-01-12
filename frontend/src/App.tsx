import "./App.css";
import { Box, Button, Spinner, Text } from "@chakra-ui/react";
import { useUsage } from "./hooks/useUsage";
import UsageOverview from "./components/UsageOverview";
import ActivityLog from "./components/ActivityLog";

function App() {
	const { data: usage, isLoading, error, refetch } = useUsage();

	if (isLoading) {
		return (
			<Box textAlign="center" py={10}>
				<Spinner size="xl" />
				<Text mt={4}>Loading usage...</Text>
			</Box>
		);
	}

	if (error) {
		return (
			<Box textAlign="center" py={10}>
				<Text color="red.500">Error: {error.message}</Text>
				<Button mt={4} onClick={() => refetch()}>
					Retry
				</Button>
			</Box>
		);
	}

	return (
		<Box minH="100vh" bg="gray.50" py={10} px={4}>
			<Box maxW="7xl" mx="auto">
				{usage && <UsageOverview usage={usage} />}
				{usage && <ActivityLog usage={usage} />}
			</Box>
		</Box>
	);
}

export default App;
