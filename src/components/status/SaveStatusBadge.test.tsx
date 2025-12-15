import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SaveStatusBadge } from './SaveStatusBadge';

describe('SaveStatusBadge', () => {
  const mockSetShowStatusDialog = vi.fn();

  it('renders correctly with "idle" status', () => {
    const { getByText, getByRole } = render(
      <SaveStatusBadge isSaving="idle" setShowStatusDialog={mockSetShowStatusDialog} />
    );
    expect(getByText('IDLE')).toBeInTheDocument();
    expect(getByRole('button')).toHaveAttribute('data-accent-color', 'gray');
  });

  it('renders correctly with "saving" status', () => {
    const { getByText, getByRole } = render(
      <SaveStatusBadge isSaving="saving" setShowStatusDialog={mockSetShowStatusDialog} />
    );
    expect(getByText('SAVING')).toBeInTheDocument();
    expect(getByRole('button')).toHaveAttribute('data-accent-color', 'blue');
  });

  it('renders correctly with "saved" status', () => {
    const { getByText, getByRole } = render(
      <SaveStatusBadge isSaving="saved" setShowStatusDialog={mockSetShowStatusDialog} />
    );
    expect(getByText('SAVED')).toBeInTheDocument();
    expect(getByRole('button')).toHaveAttribute('data-accent-color', 'green');
  });

  it('renders correctly with "error" status', () => {
    const { getByText, getByRole } = render(
      <SaveStatusBadge isSaving="error" setShowStatusDialog={mockSetShowStatusDialog} />
    );
    expect(getByText('ERROR')).toBeInTheDocument();
    expect(getByRole('button')).toHaveAttribute('data-accent-color', 'red');
  });

  it('calls setShowStatusDialog on button click', () => {
    const { getByRole } = render(
      <SaveStatusBadge isSaving="idle" setShowStatusDialog={mockSetShowStatusDialog} />
    );
    const button = getByRole('button');
    button.click();
    expect(mockSetShowStatusDialog).toHaveBeenCalledWith(true);
  });
});
