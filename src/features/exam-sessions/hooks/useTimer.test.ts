import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useTimer } from './useTimer';

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Loading state (zero or undefined duration)', () => {
    it('should return loading state when durationMinutes is 0', () => {
      const { result } = renderHook(() =>
        useTimer({
          startedAt: new Date().toISOString(),
          durationMinutes: 0,
        })
      );

      expect(result.current.isLoading).toBe(true);
      expect(result.current.formattedTime).toBe('--:--');
      expect(result.current.remainingMs).toBe(Infinity);
      expect(result.current.isCritical).toBe(false);
      expect(result.current.isExpired).toBe(false);
      expect(result.current.timeColor).toBe('text-muted-foreground');
    });

    it('should NOT call onExpire when durationMinutes is 0', () => {
      const onExpire = vi.fn();

      renderHook(() =>
        useTimer({
          startedAt: new Date().toISOString(),
          durationMinutes: 0,
          onExpire,
        })
      );

      // Advance time by 5 seconds
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(onExpire).not.toHaveBeenCalled();
    });

    it('should NOT call onCritical when durationMinutes is 0', () => {
      const onCritical = vi.fn();

      renderHook(() =>
        useTimer({
          startedAt: new Date().toISOString(),
          durationMinutes: 0,
          onCritical,
        })
      );

      // Advance time by 5 seconds
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(onCritical).not.toHaveBeenCalled();
    });

    it('should transition from loading to active when durationMinutes changes from 0 to valid value', () => {
      const startedAt = new Date().toISOString();
      const { result, rerender } = renderHook(
        ({ durationMinutes }) =>
          useTimer({
            startedAt,
            durationMinutes,
          }),
        {
          initialProps: { durationMinutes: 0 },
        }
      );

      // Initially in loading state
      expect(result.current.isLoading).toBe(true);
      expect(result.current.formattedTime).toBe('--:--');

      // Update to valid duration
      rerender({ durationMinutes: 60 });

      // Should transition to active state
      expect(result.current.isLoading).toBe(false);
      expect(result.current.formattedTime).not.toBe('--:--');
    });
  });

  describe('Normal countdown behavior', () => {
    it('should calculate remaining time correctly', () => {
      // Start time is 30 minutes ago
      const startedAt = new Date(Date.now() - 30 * 60 * 1000).toISOString();
      const durationMinutes = 60;

      const { result } = renderHook(() =>
        useTimer({
          startedAt,
          durationMinutes,
        })
      );

      expect(result.current.isLoading).toBe(false);
      expect(result.current.remainingMs).toBeGreaterThan(29 * 60 * 1000);
      expect(result.current.remainingMs).toBeLessThanOrEqual(30 * 60 * 1000);
      expect(result.current.isExpired).toBe(false);
    });

    it('should update remaining time every second', () => {
      const startedAt = new Date(Date.now() - 10 * 1000).toISOString();
      const durationMinutes = 5;

      const { result } = renderHook(() =>
        useTimer({
          startedAt,
          durationMinutes,
        })
      );

      const initialRemaining = result.current.remainingMs;

      // Advance time by 1 second
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.remainingMs).toBeLessThan(initialRemaining);
    });

    it('should format time correctly', () => {
      // Start 58 minutes and 30 seconds ago, duration 60 minutes
      const startedAt = new Date(Date.now() - 58.5 * 60 * 1000).toISOString();
      const durationMinutes = 60;

      const { result } = renderHook(() =>
        useTimer({
          startedAt,
          durationMinutes,
        })
      );

      // Should have about 1:30 remaining
      expect(result.current.formattedTime).toMatch(/^0[01]:(2[0-9]|3[0-9]|40)$/);
    });
  });

  describe('Critical time warning', () => {
    it('should mark time as critical when less than 5 minutes remain', () => {
      // Start 57 minutes ago, duration 60 minutes (3 minutes remaining)
      const startedAt = new Date(Date.now() - 57 * 60 * 1000).toISOString();
      const durationMinutes = 60;

      const { result } = renderHook(() =>
        useTimer({
          startedAt,
          durationMinutes,
        })
      );

      expect(result.current.isCritical).toBe(true);
      expect(result.current.timeColor).toBe('text-orange-600');
    });

    it('should call onCritical callback once when time becomes critical', () => {
      const onCritical = vi.fn();

      // Start 5 minutes and 2 seconds ago (just above critical threshold)
      const startedAt = new Date(Date.now() - (5 * 60 + 2) * 1000).toISOString();
      const durationMinutes = 10;

      renderHook(() =>
        useTimer({
          startedAt,
          durationMinutes,
          onCritical,
        })
      );

      // Advance by 3 seconds to cross the critical threshold
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(onCritical).toHaveBeenCalledTimes(1);

      // Advance more time, should not be called again
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(onCritical).toHaveBeenCalledTimes(1);
    });
  });

  describe('Expiry behavior', () => {
    it('should mark as expired when time runs out', () => {
      // Start 61 minutes ago, duration 60 minutes (already expired)
      const startedAt = new Date(Date.now() - 61 * 60 * 1000).toISOString();
      const durationMinutes = 60;

      const { result } = renderHook(() =>
        useTimer({
          startedAt,
          durationMinutes,
        })
      );

      expect(result.current.isExpired).toBe(true);
      expect(result.current.timeColor).toBe('text-red-600');
      expect(result.current.formattedTime).toBe('00:00');
    });

    it('should call onExpire callback once when timer expires', () => {
      const onExpire = vi.fn();

      // Start 59 minutes and 58 seconds ago (2 seconds remaining)
      const startedAt = new Date(Date.now() - (59 * 60 + 58) * 1000).toISOString();
      const durationMinutes = 60;

      renderHook(() =>
        useTimer({
          startedAt,
          durationMinutes,
          onExpire,
        })
      );

      // Advance by 3 seconds to expire
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(onExpire).toHaveBeenCalledTimes(1);

      // Advance more time, should not be called again
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(onExpire).toHaveBeenCalledTimes(1);
    });

    it('should call onExpire immediately if already expired on mount', () => {
      const onExpire = vi.fn();

      // Start 61 minutes ago, duration 60 minutes (already expired)
      const startedAt = new Date(Date.now() - 61 * 60 * 1000).toISOString();
      const durationMinutes = 60;

      renderHook(() =>
        useTimer({
          startedAt,
          durationMinutes,
          onExpire,
        })
      );

      // Wait for the first interval tick (1 second)
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(onExpire).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge cases', () => {
    it('should handle negative durationMinutes', () => {
      const { result } = renderHook(() =>
        useTimer({
          startedAt: new Date().toISOString(),
          durationMinutes: -10,
        })
      );

      expect(result.current.isLoading).toBe(true);
      expect(result.current.formattedTime).toBe('--:--');
    });

    it('should handle very large durationMinutes', () => {
      const startedAt = new Date().toISOString();
      const durationMinutes = 10000; // ~7 days

      const { result } = renderHook(() =>
        useTimer({
          startedAt,
          durationMinutes,
        })
      );

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isExpired).toBe(false);
      expect(result.current.isCritical).toBe(false);
    });

    it('should clean up interval on unmount', () => {
      const { unmount } = renderHook(() =>
        useTimer({
          startedAt: new Date().toISOString(),
          durationMinutes: 60,
        })
      );

      const intervalCount = vi.getTimerCount();
      unmount();

      // After unmount, interval should be cleared
      expect(vi.getTimerCount()).toBeLessThan(intervalCount);
    });
  });
});
