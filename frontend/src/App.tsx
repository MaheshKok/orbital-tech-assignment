import UsageTable from "./ components/usageTable";
import "./App.css";
import { Box, Button, Spinner, Text } from "@chakra-ui/react";
import { useUsage } from "./hooks/useUsage";
import UsageAnalytics from "./ components/usageAnalytics";

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
      {usage && <UsageAnalytics usage={usage}/>}
  {usage &&  <UsageTable usage={usage}/>}
    </>
	);
}

export default App;
