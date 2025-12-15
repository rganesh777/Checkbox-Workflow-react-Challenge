import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ValidationPanel } from './ValidationPanel';
import type { ValidationPanelProps } from './WorkflowEditor.types';

describe('ValidationPanel', () => {
  const mockErrors: ValidationPanelProps['errors'] = [
    {
      id: 'error-1',
      type: 'error',
      message: 'This is a test error message.',
      nodeId: 'node-1',
    },
    {
      id: 'info-1',
      type: 'info',
      message: 'This is a test info message.',
    },
  ];
  it('renders without errors', () => {
    const { getByText } = render(<ValidationPanel errors={mockErrors} />);
    expect(getByText('Errors')).toBeInTheDocument();
  });

  it('displays the correct number of errors', () => {
    const { getByText } = render(<ValidationPanel errors={mockErrors} />);
    expect(getByText('2')).toBeInTheDocument();
  });

  it('displays "No errors found" when there are no errors', () => {
    const { getByText } = render(<ValidationPanel errors={[]} />);
    expect(getByText('No errors found')).toBeInTheDocument();
  });

  it('displays error messages correctly', () => {
    const { getByText } = render(<ValidationPanel errors={mockErrors} />);
    expect(getByText('This is a test error message.')).toBeInTheDocument();
    expect(getByText('This is a test info message.')).toBeInTheDocument();
  });

  it('displays nodeId when present', () => {
    const { getByText } = render(<ValidationPanel errors={mockErrors} />);
    expect(getByText('Node: node-1')).toBeInTheDocument();
  });
});
