import { useQuery } from "@tanstack/react-query";
interface IUsageItem {
	message_id: number;
	timestamp: string;
	report_name?: string;
	credits_used: number;
}

export interface IUsageResponse {
	usage: IUsageItem[];
}

// API function
async function fetchUsage(): Promise<IUsageResponse> {
	const response = await fetch("http://localhost:8000/usage");
	if (!response.ok) throw new Error("Failed to fetch usage");
	return response.json();
}

// Fetch all users
export function useUsage() {
	// TanStack Query
	return useQuery({
		queryKey: ["usage"],
		queryFn: fetchUsage,
	});
}
