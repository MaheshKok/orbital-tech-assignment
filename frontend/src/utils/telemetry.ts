import { isDev } from "../config/env";
import { logError } from "./logger";

export function reportClientError(error: unknown, context?: unknown): void {
	if (isDev) {
		logError("Client error reported:", { error, context });
	}
}
