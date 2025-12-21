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
	timestamp: z
		.string()
		.datetime({ offset: true })
		.or(z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)),
	report_name: z.string().optional(),
	credits_used: z.number().nonnegative(),
});

/**
 * Schema for the usage API response.
 */
export const UsageResponseSchema = z.object({
	usage: z.array(UsageItemSchema),
});

// Infer types from schemas for type safety
export type UsageItemFromSchema = z.infer<typeof UsageItemSchema>;
export type UsageResponseFromSchema = z.infer<typeof UsageResponseSchema>;
