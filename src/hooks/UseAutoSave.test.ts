import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useAutoSave } from './UseAutoSave';
import { Edge, Node } from '@xyflow/react';

describe('useAutoSave', () => {
  it('should set up and clean up the effect correctly', () => {
    const mockSetIsSaving = vi.fn();
    const nodes = [] as Node[];
    const edges = [] as Edge[];
    const validationErrors = [];

    // Simulate unmounting to trigger cleanup
    const { unmount } = renderHook(() =>
      useAutoSave(nodes, edges, validationErrors, mockSetIsSaving)
    );
    unmount();
    expect(mockSetIsSaving).not.toHaveBeenCalled();
  });

  it('should debounce save calls', async () => {
    vi.useFakeTimers();
    const mockSetIsSaving = vi.fn();
    const nodes = [
      { id: '1', type: 'start' },
      { id: '2', type: 'api', data: { url: '' } },
      { id: '3', type: 'end' },
    ] as Node[];
    const edges = [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
    ] as Edge[];
    const validationErrors = [];

    renderHook(() => useAutoSave(nodes, edges, validationErrors, mockSetIsSaving));

    // Run all timers to trigger the debounced save
    vi.runAllTimers();
    expect(mockSetIsSaving).toHaveBeenCalled();

    vi.useRealTimers();
  });
});
