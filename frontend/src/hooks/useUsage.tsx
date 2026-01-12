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

function getBackendUrl(): string {
	const envUrl =
		typeof import.meta.env.VITE_BACKEND_URL === "string"
			? import.meta.env.VITE_BACKEND_URL
			: "";
	const url = envUrl.trim();
	if (!url) return "http://localhost:8000";
	return url.endsWith("/") ? url.slice(0, -1) : url;
}

// API function
async function fetchUsage(): Promise<IUsageResponse> {
	const backendUrl = getBackendUrl();
	const response = await fetch(`${backendUrl}/usage`);
	if (!response.ok) {
		const details = await response.text().catch(() => "");
		throw new Error(
			details
				? `Failed to fetch usage: ${details}`
				: `Failed to fetch usage (HTTP ${response.status})`
		);
	}
	return response.json();
}

// Fetch all users
export function useUsage() {
	// TanStack Query
	return useQuery<IUsageResponse, Error>({
		queryKey: ["usage"],
		queryFn: fetchUsage,
	});
}
