import { isDev } from "../config/env";

export function logError(message: string, error?: unknown): void {
	if (!isDev) return;
	if (error === undefined) {
		console.error(message);
		return;
	}
	console.error(message, error);
}
