/**
 * Unit tests for chart data transformation utilities.
 */

import { transformToChartData, calculateTotalCredits } from '../chartDataTransform';
import type { UsageItem } from '../../types/usage';

describe('chartDataTransform', () => {
  describe('transformToChartData', () => {
    it('should return empty array for empty input', () => {
      expect(transformToChartData([])).toEqual([]);
    });

    it('should transform usage data into chart format', () => {
      const usage: UsageItem[] = [
        { message_id: 1, timestamp: '2024-04-29T02:00:00Z', credits_used: 50 },
        { message_id: 2, timestamp: '2024-04-29T14:00:00Z', credits_used: 30 },
        { message_id: 3, timestamp: '2024-04-30T10:00:00Z', credits_used: 20 },
      ];

      const result = transformToChartData(usage);

      expect(result).toHaveLength(2); // 2 unique dates
      expect(result[0]).toEqual({
        date: '29-04',
        fullDate: '29-04-2024',
        credits: 80, // 50 + 30
      });
      expect(result[1]).toEqual({
        date: '30-04',
        fullDate: '30-04-2024',
        credits: 20,
      });
    });

    it('should include days with zero usage in range', () => {
      const usage: UsageItem[] = [
        { message_id: 1, timestamp: '2024-04-29T02:00:00Z', credits_used: 50 },
        { message_id: 2, timestamp: '2024-05-01T10:00:00Z', credits_used: 20 },
      ];

      const result = transformToChartData(usage);

      expect(result).toHaveLength(3); // April 29, 30, May 1
      expect(result[0].credits).toBe(50);
      expect(result[1].credits).toBe(0); // April 30
      expect(result[2].credits).toBe(20);
    });

    it('should aggregate credits for the same day', () => {
      const usage: UsageItem[] = [
        { message_id: 1, timestamp: '2024-04-29T02:00:00Z', credits_used: 10 },
        { message_id: 2, timestamp: '2024-04-29T06:00:00Z', credits_used: 20 },
        { message_id: 3, timestamp: '2024-04-29T12:00:00Z', credits_used: 30 },
        { message_id: 4, timestamp: '2024-04-29T18:00:00Z', credits_used: 40 },
      ];

      const result = transformToChartData(usage);

      expect(result).toHaveLength(1);
      expect(result[0].credits).toBe(100); // 10 + 20 + 30 + 40
    });

    it('should format dates correctly', () => {
      const usage: UsageItem[] = [
        { message_id: 1, timestamp: '2024-01-05T10:00:00Z', credits_used: 50 },
      ];

      const result = transformToChartData(usage);

      expect(result[0].date).toBe('05-01');
      expect(result[0].fullDate).toBe('05-01-2024');
    });

    it('should round credits to 2 decimal places', () => {
      const usage: UsageItem[] = [
        { message_id: 1, timestamp: '2024-04-29T02:00:00Z', credits_used: 10.333 },
        { message_id: 2, timestamp: '2024-04-29T06:00:00Z', credits_used: 20.666 },
      ];

      const result = transformToChartData(usage);

      expect(result[0].credits).toBe(31); // Rounded
    });
  });

  describe('calculateTotalCredits', () => {
    it('should return 0 for empty array', () => {
      expect(calculateTotalCredits([])).toBe(0);
    });

    it('should sum all credits', () => {
      const usage: UsageItem[] = [
        { message_id: 1, timestamp: '2024-04-29T02:00:00Z', credits_used: 10 },
        { message_id: 2, timestamp: '2024-04-29T06:00:00Z', credits_used: 20 },
        { message_id: 3, timestamp: '2024-04-30T10:00:00Z', credits_used: 30 },
      ];

      expect(calculateTotalCredits(usage)).toBe(60);
    });

    it('should handle decimal credits', () => {
      const usage: UsageItem[] = [
        { message_id: 1, timestamp: '2024-04-29T02:00:00Z', credits_used: 10.5 },
        { message_id: 2, timestamp: '2024-04-29T06:00:00Z', credits_used: 20.25 },
      ];

      expect(calculateTotalCredits(usage)).toBe(30.75);
    });

    it('should round result to 2 decimal places', () => {
      const usage: UsageItem[] = [
        { message_id: 1, timestamp: '2024-04-29T02:00:00Z', credits_used: 10.333 },
        { message_id: 2, timestamp: '2024-04-29T06:00:00Z', credits_used: 20.666 },
      ];

      // 10.333 + 20.666 = 30.999, rounded to 31
      expect(calculateTotalCredits(usage)).toBe(31);
    });
  });
});
