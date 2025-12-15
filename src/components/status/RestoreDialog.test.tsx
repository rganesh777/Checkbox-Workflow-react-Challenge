import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RestoreDialog } from './RestoreDialog';

describe('RestoreDialog', () => {
  const mockSetShowRestoreDialog = vi.fn();
  const mockHandleRestoreWorkflow = vi.fn();

  it('renders correctly when showRestoreDialog is true', () => {
    const { getByText } = render(
      <RestoreDialog
        showRestoreDialog={true}
        setShowRestoreDialog={mockSetShowRestoreDialog}
        handleRestoreWorkflow={mockHandleRestoreWorkflow}
      />
    );
    expect(getByText('Restore Workflow')).toBeInTheDocument();
    expect(
      getByText('A saved workflow configuration was found. Would you like to restore it?')
    ).toBeInTheDocument();
    const restoreButton = getByText('Restore');
    const cancelButton = getByText('Discard');

    restoreButton.click();
    expect(mockHandleRestoreWorkflow).toHaveBeenCalled();

    cancelButton.click();
    expect(mockSetShowRestoreDialog).toHaveBeenCalledWith(false);
  });

  it('does not render when showRestoreDialog is false', () => {
    const { queryByText } = render(
      <RestoreDialog
        showRestoreDialog={false}
        setShowRestoreDialog={mockSetShowRestoreDialog}
        handleRestoreWorkflow={mockHandleRestoreWorkflow}
      />
    );
    expect(queryByText('Restore Workflow')).not.toBeInTheDocument();
  });
});
