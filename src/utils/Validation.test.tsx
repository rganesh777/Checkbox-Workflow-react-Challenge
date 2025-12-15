import { describe, it, expect } from 'vitest';
import {
  validateStartEndNodes,
  isAddBlockBtnDisabled,
  validateURL,
  validateWorkflow,
} from './Validation';
import { Edge, Node } from '@xyflow/react';

describe('Validation Utils', () => {
  describe('validateStartEndNodes', () => {
    it('returns error when multiple start nodes are present', () => {
      const nodes = [
        { id: '1', type: 'start' },
        { id: '2', type: 'start' },
      ] as Node[];
      const result = validateStartEndNodes(nodes, 'start');
      expect(result).toEqual({
        id: 'multiple-start-nodes',
        type: 'error',
        message: 'Workflow must have exactly one start block',
        nodeId: '2',
      });
    });

    it('returns info when no other node is present', () => {
      const nodes = [{ id: '1', type: 'start' }] as Node[];
      const result = validateStartEndNodes(nodes, 'end');
      expect(result).toEqual({
        id: 'no-end-node',
        type: 'info',
        message: 'Workflow must have a end block',
      });
    });

    it('returns null when exactly one start/end node is present', () => {
      const nodes = [{ id: '1', type: 'start' }] as Node[];
      const result = validateStartEndNodes(nodes, 'start');
      expect(result).toBeNull();
    });
  });

  describe('isAddBlockBtnDisabled', () => {
    it('returns true if start node already exists and trying to add another start node', () => {
      const nodes = [{ id: '1', type: 'start' }] as Node[];
      const result = isAddBlockBtnDisabled('start', nodes);
      expect(result).toBe(true);
    });

    it('returns false if adding end node when no end node exists', () => {
      const nodes = [{ id: '1', type: 'start' }] as Node[];
      const result = isAddBlockBtnDisabled('end', nodes);
      expect(result).toBe(false);
    });

    it('returns false if adding start node when no start node exists', () => {
      const nodes = [{ id: '1', type: 'end' }] as Node[];
      const result = isAddBlockBtnDisabled('start', nodes);
      expect(result).toBe(false);
    });
    it('returns true if end node already exists and trying to add another end node', () => {
      const nodes = [{ id: '1', type: 'end' }] as Node[];
      const result = isAddBlockBtnDisabled('end', nodes);
      expect(result).toBe(true);
    });
  });

  describe('validateURL', () => {
    it('returns true for invalid URL', () => {
      const invalidUrl = 'ftp://url.com';
      const result = validateURL(invalidUrl);
      expect(result).toBe(true);
    });

    it('returns false for valid URL', () => {
      const validUrl = 'https://url.com';
      const result = validateURL(validUrl);
      expect(result).toBe(false);
    });
  });

  describe('validateWorkflow', () => {
    it('returns errors for missing start and end nodes and no edges', () => {
      const nodes = [
        { id: 'node_0', position: { x: 0, y: 0 }, type: 'api', data: { url: 'http://url.com' } },
      ] as Node[];
      const edges = [] as Edge[];
      const result = validateWorkflow(nodes, edges);
      expect(result).toEqual([
        {
          id: 'no-start-node',
          type: 'info',
          message: 'Workflow must have a start block',
        },
        {
          id: 'no-end-node',
          type: 'info',
          message: 'Workflow must have a end block',
        },
        {
          id: 'no-edges',
          message: 'All nodes must be properly connected',
          type: 'info',
        },
      ]);
    });

    it('returns error for API node with missing URL', () => {
      const nodes = [
        { id: '1', type: 'start' },
        { id: '2', type: 'api', data: { url: '' } },
        { id: '3', type: 'end' },
      ] as Node[];
      const edges = [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3' },
      ] as Edge[];
      const result = validateWorkflow(nodes, edges);
      expect(result).toEqual([
        {
          id: 'api-node-missing-url-2',
          type: 'error',
          message: 'API Node - URL is missing.',
          nodeId: '2',
        },
      ]);
    });

    it('returns error for API node with invalid URL', () => {
      const nodes = [
        { id: '1', type: 'start' },
        { id: '2', type: 'api', data: { url: 'ftp://invalid-url.com' } },
        { id: '3', type: 'end' },
      ] as Node[];
      const edges = [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3' },
      ] as Edge[];
      const result = validateWorkflow(nodes, edges);
      expect(result).toEqual([
        {
          id: 'api-node-invalid-url-2',
          type: 'error',
          message: 'API Node - invalid URL format.',
          nodeId: '2',
        },
      ]);
    });

    it('returns empty array when no validation errors are found', () => {
      const nodes = [
        { id: '1', type: 'start' },
        { id: '2', type: 'api', data: { url: 'https://valid-url.com' } },
        { id: '3', type: 'end' },
      ] as Node[];
      const edges = [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3' },
      ] as Edge[];
      const result = validateWorkflow(nodes, edges);
      expect(result).toEqual([]);
    });
  });
});
