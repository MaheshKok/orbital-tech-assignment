/**
 * Sort Indicator Component.
 * Displays visual indicator for column sort state.
 */

import type { SortDirection } from '../../types/usage';

interface SortIndicatorProps {
  direction: SortDirection;
  priority?: number | null;
}

export function SortIndicator({ direction, priority }: SortIndicatorProps) {
  return (
    <span className="ml-2 inline-flex items-center">
      {direction === 'asc' && (
        <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      )}
      {direction === 'desc' && (
        <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      )}
      {direction === null && (
        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      )}
      {priority !== null && priority !== undefined && (
        <span className="ml-1 text-xs bg-blue-100 text-blue-700 rounded-full px-1.5 py-0.5 font-medium">
          {priority}
        </span>
      )}
    </span>
  );
}
