import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SaveDialog } from './SaveDialog';
import type { SaveDialogProps } from './SaveDialog';

describe('SaveDialog', () => {
  const mockProps: SaveDialogProps = {
    showSaveDialog: true,
    setShowSaveDialog: vi.fn(),
  };

  it('renders without errors when open', () => {
    const { getByText } = render(<SaveDialog {...mockProps} />);
    expect(getByText('Workflow Saved')).toBeInTheDocument();
    expect(
      getByText(
        'Your workflow configuration has been saved to the browser console. Check the developer console for the complete configuration details.'
      )
    ).toBeInTheDocument();
    expect(getByText('Close')).toBeInTheDocument();
  });

  it('does not render content when closed', () => {
    const { queryByText } = render(<SaveDialog {...mockProps} showSaveDialog={false} />);
    expect(queryByText('Workflow Saved')).not.toBeInTheDocument();
  });
});
