/**
 * TypeScript type definitions for usage data.
 * These mirror the backend API contract.
 */

export interface UsageItem {
  message_id: number;
  timestamp: string;
  report_name?: string; // Optional - omitted when not a report
  credits_used: number;
}

export interface UsageResponse {
  usage: UsageItem[];
}

export type SortDirection = 'asc' | 'desc' | null;

export type SortableColumn = 'report_name' | 'credits_used';

export interface SortEntry {
  column: SortableColumn;
  direction: 'asc' | 'desc';
}

export interface ChartDataPoint {
  date: string;      // X-axis label: DD-MM
  fullDate: string;  // Tooltip: DD-MM-YYYY
  credits: number;   // Y-axis value
}
