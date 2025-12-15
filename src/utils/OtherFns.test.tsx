import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { getBlockConfig, getSaveStatusColor, getSaveStatusIcon } from './OtherFns';

describe('OtherFns', () => {
  describe('getBlockConfig', () => {
    it('returns correct config for "start" block type', () => {
      const config = getBlockConfig('start');
      expect(config).toEqual({ label: 'Start' });
    });

    it('returns correct config for "form" block type', () => {
      const config = getBlockConfig('form');
      expect(config).toEqual({
        label: 'Form',
        customName: 'Form',
        fields: [],
      });
    });

    it('returns default config for unknown block type', () => {
      const config = getBlockConfig('unknownType');
      expect(config).toEqual({ label: 'unknownType' });
    });
  });

  describe('getSaveStatusColor', () => {
    it('returns "red" for "error" status', () => {
      expect(getSaveStatusColor('error')).toBe('red');
    });

    it('returns "blue" for "saving" status', () => {
      expect(getSaveStatusColor('saving')).toBe('blue');
    });

    it('returns "green" for "saved" status', () => {
      expect(getSaveStatusColor('saved')).toBe('green');
    });

    it('returns "gray" for "idle" status', () => {
      expect(getSaveStatusColor('idle')).toBe('gray');
    });
  });

  describe('getSaveStatusIcon', () => {
    it('returns CheckCircleIcon for "saved" status', () => {
      const icon = getSaveStatusIcon('saved');
      const { getByTestId } = render(icon);
      expect(getByTestId('check-circle-icon')).toBeInTheDocument();
    });

    it('returns Loader for "saving" status', () => {
      const icon = getSaveStatusIcon('saving');
      const { getByTestId } = render(icon);
      expect(getByTestId('loader')).toBeInTheDocument();
    });

    it('returns AlertCircle for "idle" status', () => {
      const icon = getSaveStatusIcon('idle');
      const { getByTestId } = render(icon);
      expect(getByTestId('alert-circle')).toBeInTheDocument();
    });

    it('returns CircleX for "error" status', () => {
      const icon = getSaveStatusIcon('error');
      const { getByTestId } = render(icon);
      expect(getByTestId('circle-x')).toBeInTheDocument();
    });
  });
});
