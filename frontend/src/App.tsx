import "./App.css";
import { Box, Button, Spinner, Text } from "@chakra-ui/react";
import { useUsage } from "./hooks/useUsage";
import UsageOverview from "./components/UsageOverview";
import ActivityLog from "./components/ActivityLog";

function App() {
	const { data: usage, isLoading, isError, refetch } = useUsage();

	if (isLoading) {
		return (
			<Box textAlign="center" py={10}>
				<Spinner size="xl" />
				<Text mt={4}>Loading usage...</Text>
			</Box>
		);
	}

	if (isError) {
		return (
			<Box textAlign="center" py={10}>
				<Text color="red.500">Error: {isError}</Text>
				<Button mt={4} onClick={() => refetch()}>
					Retry
				</Button>
			</Box>
		);
	}

	return (
		<>
			{usage && <UsageOverview usage={usage} />}
			{usage && <ActivityLog usage={usage} />}
		</>
	);
}

export default App;
