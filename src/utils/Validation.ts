import { Edge, Node } from '@xyflow/react';
import { ValidationError } from '../components/WorkflowEditor.types';

/**
 * validateStartEndNodes - Validates that there is exactly one start or end node
 * @param nodes - Array of workflow nodes
 * @param type - 'start' or 'end'
 * @returns ValidationError if validation fails, otherwise null
 */
export const validateStartEndNodes = (nodes: Node[], type: string) => {
  const filteredNodes = nodes.filter((node) => node.type === type);
  const filteredNodesLength = filteredNodes.length;
  let error: ValidationError = null;
  if (filteredNodesLength > 1) {
    error = {
      id: `multiple-${type}-nodes`,
      type: 'error',
      message: `Workflow must have exactly one ${type} block`,
      nodeId: filteredNodes[filteredNodesLength - 1].id,
    };
  } else if (filteredNodesLength === 0) {
    error = {
      id: `no-${type}-node`,
      type: 'info',
      message: `Workflow must have a ${type} block`,
    };
  }
  return error;
};

/** isAddBlockBtnDisabled - Determines if the "Add Block" button should be disabled
 * for 'start' or 'end' blocks based on existing nodes
 * @param blockId - ID of the block to be added
 * @param nodes - Array of current workflow nodes
 * @returns boolean indicating if the button should be disabled
 */
export const isAddBlockBtnDisabled = (blockId: string, nodes: Node[]) => {
  const startNodeExists = nodes.some((node) => node.type === 'start');
  const endNodeExists = nodes.some((node) => node.type === 'end');
  return (blockId === 'start' && startNodeExists) || (blockId === 'end' && endNodeExists);
};

/** validateURL - Validates if a URL is in correct format
 * @param url - URL string to validate
 * @returns boolean indicating if the URL is invalid
 */
export const validateURL = (url: string): boolean => !/^https?:\/\/.+/.test(url);

/** validateWorkflow - Validates the entire workflow for various rules
 * @param nodes - Array of workflow nodes
 * @param edges - Array of workflow edges
 * @returns Array of ValidationError objects
 */
export const validateWorkflow = (nodes: Node[], edges: Edge[]): ValidationError[] => {
  const errors: ValidationError[] = [];

  const startNodesValidation = validateStartEndNodes(nodes, 'start');
  const endNodesValidation = validateStartEndNodes(nodes, 'end');

  if (startNodesValidation) {
    errors.push(startNodesValidation);
  }
  if (endNodesValidation) {
    errors.push(endNodesValidation);
  }

  const nodesByType = nodes.reduce(
    (acc, node) => {
      if (!acc[node.type]) acc[node.type] = [];
      acc[node.type].push(node);
      return acc;
    },
    {} as Record<string, Node[]>
  );

  const apiNodes = nodesByType.api || [];
  if (apiNodes.length > 0) {
    apiNodes.forEach((apiNode) => {
      if (!apiNode.data.url || String(apiNode.data.url).trim() === '') {
        errors.push({
          id: `api-node-missing-url-${apiNode.id}`,
          type: 'error',
          message: 'API Node - URL is missing.',
          nodeId: apiNode.id,
        });
      } else if (validateURL(String(apiNode.data.url))) {
        errors.push({
          id: `api-node-invalid-url-${apiNode.id}`,
          type: 'error',
          message: 'API Node - invalid URL format.',
          nodeId: apiNode.id,
        });
      }
    });
  }

  const formNodes = nodesByType.form || [];
  if (formNodes.length > 0) {
    formNodes.forEach((formNode) => {
      if (String(formNode.data.customName).trim().length < 3) {
        errors.push({
          id: `form-node-custom-name-too-short-${formNode.id}`,
          type: 'error',
          message: 'Form Node - Custom name must be at least 3 characters long.',
          nodeId: formNode.id,
        });
      }

      if (!Array.isArray(formNode.data.fields) || formNode.data.fields.length === 0) {
        errors.push({
          id: `form-node-missing-fields-${formNode.id}`,
          type: 'error',
          message: 'Form Node - At least one field is required.',
          nodeId: formNode.id,
        });
      } else {
        formNode.data.fields.forEach((field, index) => {
          if (String(field.label).trim().length < 2) {
            errors.push({
              id: `form-node-field-missing-label-${formNode.id}-${field.id}`,
              type: 'error',
              message: `Form Node - Field ${index + 1} label must be at least 2 characters long.`,
              nodeId: formNode.id,
            });
          }

          if (String(field.name).trim().length < 2) {
            errors.push({
              id: `form-node-field-missing-name-${formNode.id}-${field.id}`,
              type: 'error',
              message: `Form Node - Field ${index + 1} name must be at least 2 characters long.`,
              nodeId: formNode.id,
            });
          } else if (!/^[A-Za-z0-9]+$/.test(field.name)) {
            errors.push({
              id: `form-node-field-invalid-name-${formNode.id}-${field.id}`,
              type: 'error',
              message: `Form Node - Field ${index + 1} name contains invalid characters.`,
              nodeId: formNode.id,
            });
          }

          if (field.type === 'dropdown') {
            if (!Array.isArray(field.options) || field.options.length < 2) {
              errors.push({
                id: `form-node-field-dropdown-insufficient-options-${formNode.id}-${field.id}`,
                type: 'error',
                message: `Form Node - Field ${index + 1} dropdown must have at least 2 options.`,
                nodeId: formNode.id,
              });
            }

            if (field.options) {
              field.options.forEach((option, optIndex) => {
                if (String(option).trim().length < 2) {
                  errors.push({
                    id: `form-node-field-dropdown-empty-option-${formNode.id}-${field.id}-${optIndex}`,
                    type: 'error',
                    message: `Form Node - Field ${index + 1} dropdown option ${optIndex + 1} must be at least 2 characters long.`,
                    nodeId: formNode.id,
                  });
                }
              });
            }
          }
        });
      }
    });
  }

  const conditionalNodes = nodesByType.conditional || [];
  if (conditionalNodes.length > 0) {
    conditionalNodes.forEach((condNode) => {
      if (String(condNode.data.customName).trim().length < 3) {
        errors.push({
          id: `conditional-node-custom-name-too-short-${condNode.id}`,
          type: 'error',
          message: 'Conditional Node - Custom name must be at least 3 characters long.',
          nodeId: condNode.id,
        });
      }

      if (String(condNode.data.fieldToEvaluate).trim() === '') {
        errors.push({
          id: `conditional-node-missing-field-to-evaluate-${condNode.id}`,
          type: 'error',
          message: 'Conditional Node - Field to evaluate is required.',
          nodeId: condNode.id,
        });
      }

      if (condNode.data.operator !== 'is_empty' && String(condNode.data.value).trim() === '') {
        errors.push({
          id: `conditional-node-missing-value-${condNode.id}`,
          type: 'error',
          message: 'Conditional Node - Value is required.',
          nodeId: condNode.id,
        });
      }
    });
  }

  if (edges.length === 0) {
    errors.push({
      id: 'no-edges',
      type: 'info',
      message: 'All nodes must be properly connected',
    });
  } else {
    const connectedNodeIds = new Set<string>();

    edges.forEach((edge) => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });

    // Early exit optimization: check if any node is not connected
    const hasUnconnectedNodes = nodes.some((node) => !connectedNodeIds.has(node.id));
    if (hasUnconnectedNodes) {
      errors.push({
        id: 'unconnected-nodes',
        type: 'error',
        message: 'All nodes must be properly connected',
      });
    }
  }

  return errors;
};
