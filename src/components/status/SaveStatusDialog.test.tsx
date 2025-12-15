import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SaveStatusDialog } from './SaveStatusDialog';
import type { SaveStatusDialogProps } from '@/components/status/Status.types';

describe('SaveStatusDialog', () => {
  const mockProps: SaveStatusDialogProps = {
    isSaving: 'saved',
    savedWorkflow: {
      nodes: [],
      edges: [],
      metadata: {
        name: 'Test Workflow',
        version: '1.0.0',
        lastSaved: new Date().toISOString(),
      },
    },
    showStatusDialog: true,
    setShowStatusDialog: vi.fn(),
  };

  it('renders without errors when open', () => {
    const { getByText } = render(<SaveStatusDialog {...mockProps} />);
    expect(getByText('Last Saved At:')).toBeInTheDocument();
    expect(
      getByText(new Date(mockProps.savedWorkflow.metadata.lastSaved).toLocaleString())
    ).toBeInTheDocument();
  });

  it('does not render content when closed', () => {
    const { queryByText } = render(<SaveStatusDialog {...mockProps} showStatusDialog={false} />);
    expect(queryByText('Last Saved At:')).not.toBeInTheDocument();
  });
});
