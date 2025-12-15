import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SaveWorkFlow } from './SaveWorkFlow';

describe('SaveWorkFlow', () => {
  const mockSetIsSaving = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    mockSetIsSaving.mockClear();
    vi.useFakeTimers();
  });

  it('saves workflow state to localStorage', () => {
    const nodes = [{ id: '1', type: 'start', position: { x: 0, y: 0 }, data: {} }];
    const edges = [{ id: 'e1-2', source: '1', target: '2', label: 'edge' }];

    SaveWorkFlow(nodes, edges, mockSetIsSaving);

    const savedData = localStorage.getItem('workflow-autosave');
    expect(savedData).not.toBeNull();

    const parsedData = JSON.parse(savedData as string);
    expect(parsedData.nodes).toHaveLength(1);
    expect(parsedData.edges).toHaveLength(1);
    expect(parsedData.metadata).toHaveProperty('name');
    expect(parsedData.metadata).toHaveProperty('version');
    expect(parsedData.metadata).toHaveProperty('lastSaved');
  });

  it('calls setIsSaving with correct statuses', () => {
    const nodes = [{ id: '1', type: 'start', position: { x: 0, y: 0 }, data: {} }];
    const edges = [{ id: 'e1-2', source: '1', target: '2', label: 'edge' }];

    SaveWorkFlow(nodes, edges, mockSetIsSaving);

    expect(mockSetIsSaving).toHaveBeenCalledWith('saving');

    // Simulate the timeout
    vi.advanceTimersByTime(1000);

    expect(mockSetIsSaving).toHaveBeenCalledWith('saved');
  });
});
