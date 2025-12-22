/**
 * Zod schemas for API response validation.
 * Provides runtime type safety for external data.
 */

import { z } from "zod";

/**
 * Schema for a single usage item from the API.
 */
export const UsageItemSchema = z.object({
	message_id: z.number().int().positive(),
	timestamp: z.preprocess(
		(value) => {
			if (typeof value !== "string") return value;

			// If backend sends a timestamp without timezone info, assume UTC and append "Z".
			// This avoids Date parsing differences where no-offset timestamps are treated as local time.
			const noOffsetIso = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?$/;
			if (noOffsetIso.test(value)) {
				return `${value}Z`;
			}

			return value;
		},
		z.string().datetime({ offset: true })
	),
	report_name: z.string().optional(),
	credits_used: z.number().nonnegative(),
});

/**
 * Schema for the usage API response.
 */
export const UsageResponseSchema = z.object({
	usage: z.array(UsageItemSchema),
});

// Infer types from schemas for type safety (single source of truth)
export type UsageItem = z.infer<typeof UsageItemSchema>;
export type UsageResponse = z.infer<typeof UsageResponseSchema>;

// Backwards-compatible aliases
export type UsageItemFromSchema = UsageItem;
export type UsageResponseFromSchema = UsageResponse;
