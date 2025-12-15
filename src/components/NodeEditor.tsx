import { useState, useEffect, useRef, memo } from 'react';
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Text,
  TextField,
  Select,
  Checkbox,
  IconButton,
  Separator,
} from '@radix-ui/themes';
import { Node } from '@xyflow/react';
import { Trash2, X, Plus } from 'lucide-react';
import { FormField } from './nodes/FormNode';
import { ConditionalRoute } from './nodes/ConditionalNode';
import type { FormNodeData } from './nodes/FormNode';
import type { ApiNodeData } from './nodes/ApiNode';
import type { ConditionalNodeData } from './nodes/ConditionalNode';
import type { ValidationError, WorkflowNodeData } from './WorkflowEditor.types';

interface NodeEditorProps {
  node: Node;
  onUpdate: (nodeId: string, data: Partial<WorkflowNodeData>) => void;
  onClose: () => void;
  onDelete: (nodeId: string) => void;
  errors: ValidationError[];
  formFields?: string[];
}

/**
 * NodeEditor - Configuration panel for editing node properties
 * Displays different fields based on the node type
 */
export const NodeEditor = memo<NodeEditorProps>(
  ({ node, onUpdate, onClose, onDelete, errors, formFields }) => {
    const [formData, setFormData] = useState<WorkflowNodeData>(
      node.data as unknown as WorkflowNodeData
    );
    console.log('NodeEditor render for node:', formData, node.data);
    const [autoCompleteOpen, setAutoCompleteOpen] = useState(false);
    const [filterFields, setFilterFields] = useState(formFields as string[]);
    const autoCompleteRef = useRef<HTMLDivElement>(null);

    // Update formData when node or node.data changes
    useEffect(() => {
      setFormData(node.data as unknown as WorkflowNodeData);
    }, [node.id, node.data]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          autoCompleteRef.current &&
          !autoCompleteRef.current.contains(event.target as HTMLElement)
        ) {
          setAutoCompleteOpen(false);
        }
      };

      if (autoCompleteOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [autoCompleteOpen]);

    const checkFieldErrors = (fieldId: string | string[]) =>
      errors.some(({ id, nodeId }) => {
        return (
          nodeId === node.id &&
          (Array.isArray(fieldId) ? fieldId.some((fid) => id.includes(fid)) : id.includes(fieldId))
        );
      });

    const urlError = checkFieldErrors([`api-node-missing-url`, `api-node-invalid-url`]);
    const formNameError = checkFieldErrors('custom-name-too-short');
    const condNameError = checkFieldErrors('conditional-node-custom-name-too-short');
    const condEvalFieldError = checkFieldErrors('missing-field-to-evaluate');
    const condValueError = checkFieldErrors('missing-value');

    const handleChange = (field: string, value: string | FormField[] | ConditionalRoute[]) => {
      const newData = { ...formData, [field]: value };
      setFormData(newData);
      onUpdate(node.id, newData);

      if (
        field === 'fieldToEvaluate' &&
        formFields?.length > 0 &&
        (value as string).trim() !== ''
      ) {
        const filtered =
          formFields.filter((f) => f.toLowerCase().includes(String(value).toLowerCase())) || [];
        setFilterFields(filtered);
      } else {
        setFilterFields(formFields || []);
      }
    };

    const addField = () => {
      const newField = {
        id: `field_${Date.now()}`,
        name: '',
        label: '',
        type: 'string' as const,
        required: false,
      };
      const formNodeData = formData as FormNodeData;
      const newFields = [...(formNodeData.fields || []), newField];
      handleChange('fields', newFields);
    };

    const removeField = (fieldId: string) => {
      const formNodeData = formData as FormNodeData;
      const newFields = (formNodeData.fields || []).filter((f) => f.id !== fieldId);
      handleChange('fields', newFields);
    };

    const updateField = (
      fieldId: string,
      fieldProp: keyof FormField,
      value: string | boolean | string[]
    ) => {
      const formNodeData = formData as FormNodeData;
      const newFields = (formNodeData.fields || []).map((f) =>
        f.id === fieldId ? { ...f, [fieldProp]: value } : f
      );
      handleChange('fields', newFields);
    };

    const addDropdownOption = (fieldId: string) => {
      const formNodeData = formData as FormNodeData;
      const newFields = (formNodeData.fields || []).map((f) =>
        f.id === fieldId ? { ...f, options: [...(f.options || []), ''] } : f
      );
      handleChange('fields', newFields);
    };

    const updateDropdownOption = (fieldId: string, optionIndex: number, value: string) => {
      const formNodeData = formData as FormNodeData;
      const newFields = (formNodeData.fields || []).map((f) => {
        if (f.id === fieldId) {
          const newOptions = [...(f.options || [])];
          newOptions[optionIndex] = value;
          return { ...f, options: newOptions };
        }
        return f;
      });
      handleChange('fields', newFields);
    };

    const removeDropdownOption = (fieldId: string, optionIndex: number) => {
      const formNodeData = formData as FormNodeData;
      const newFields = (formNodeData.fields || []).map((f) => {
        if (f.id === fieldId) {
          const newOptions = [...(f.options || [])];
          newOptions.splice(optionIndex, 1);
          return { ...f, options: newOptions };
        }
        return f;
      });
      handleChange('fields', newFields);
    };

    return (
      <Card style={{ width: '350px', height: '100%', position: 'relative', overflowY: 'auto' }}>
        <Flex direction="column" gap="4" p="4" height="calc(100vh - 120px)" overflowY="auto">
          <Flex justify="between" align="center">
            <Heading size="4">Edit {node.type}</Heading>
            <Flex gap="2">
              <IconButton
                variant="ghost"
                size="1"
                color="red"
                onClick={() => onDelete(node.id)}
                title="Delete node (Delete/Backspace)"
              >
                <Trash2 size={16} />
              </IconButton>
              <IconButton variant="ghost" size="1" onClick={onClose} title="Close editor">
                <X size={16} />
              </IconButton>
            </Flex>
          </Flex>

          {node.type === 'form' && (
            <Flex direction="column" gap="4">
              <Box>
                <Text size="2" weight="medium" mb="2">
                  Form Name
                </Text>
                <TextField.Root
                  value={(formData as FormNodeData).customName || ''}
                  onChange={(e) => handleChange('customName', e.target.value)}
                  placeholder="Enter form name"
                  color={formNameError ? 'red' : 'gray'}
                  variant={formNameError ? 'soft' : 'classic'}
                />
                {formNameError && (
                  <Text size="1" color="red" mt="2">
                    Name must be at least 2 characters long.
                  </Text>
                )}
              </Box>

              <Separator size="4" />

              <Flex justify="between" align="center">
                <Text size="2" weight="bold">
                  Fields
                </Text>
                <Button size="1" onClick={addField} style={{ gap: '4px' }}>
                  <Plus size={14} />
                  Add Field
                </Button>
              </Flex>

              {((formData as FormNodeData).fields || []).map((field, index) => {
                const formFieldNameError = errors.some(
                    ({ id, nodeId }) =>
                      (nodeId === node.id &&
                        id === `form-node-field-missing-name-${node.id}-${field.id}`) ||
                      id === `form-node-field-invalid-name-${node.id}-${field.id}`
                  ),
                  formFieldLabelError = errors.some(
                    ({ id, nodeId }) =>
                      nodeId === node.id &&
                      id === `form-node-field-missing-label-${node.id}-${field.id}`
                  );
                return (
                  <Card
                    key={field.id}
                    variant="surface"
                    style={{ padding: '12px', backgroundColor: 'var(--gray-3)' }}
                  >
                    <Flex direction="column" gap="3">
                      <Flex justify="between" align="center">
                        <Text size="1" weight="bold" color="gray">
                          Field {index + 1}
                        </Text>
                        <IconButton
                          size="1"
                          variant="ghost"
                          color="red"
                          onClick={() => removeField(field.id)}
                        >
                          <Trash2 size={14} />
                        </IconButton>
                      </Flex>

                      <Box>
                        <Text size="1" mb="2">
                          Field Name
                        </Text>
                        <TextField.Root
                          size="1"
                          value={field.name || ''}
                          onChange={(e) => updateField(field.id, 'name', e.target.value)}
                          placeholder="field_name"
                          color={formFieldNameError ? 'red' : 'gray'}
                          variant={formFieldNameError ? 'soft' : 'classic'}
                        />
                        {formFieldNameError && (
                          <Text size="1" color="red" mt="2">
                            Field name must be at least 2 characters long and alphanumeric.
                          </Text>
                        )}
                      </Box>

                      <Box>
                        <Text size="1" mb="2">
                          Label
                        </Text>
                        <TextField.Root
                          size="1"
                          value={field.label || ''}
                          onChange={(e) => updateField(field.id, 'label', e.target.value)}
                          placeholder="Display Label"
                          color={formFieldLabelError ? 'red' : 'gray'}
                          variant={formFieldLabelError ? 'soft' : 'classic'}
                        />
                        {formFieldLabelError && (
                          <Text size="1" color="red" mt="2">
                            Field label must be at least 2 characters long.
                          </Text>
                        )}
                      </Box>

                      <Box>
                        <Text size="1" mb="2">
                          Type
                        </Text>
                        <Select.Root
                          value={field.type || 'string'}
                          onValueChange={(val) => updateField(field.id, 'type', val)}
                          size="1"
                        >
                          <Select.Trigger />
                          <Select.Content>
                            <Select.Item value="string">String</Select.Item>
                            <Select.Item value="number">Number</Select.Item>
                            <Select.Item value="dropdown">Dropdown</Select.Item>
                            <Select.Item value="checkbox">Checkbox</Select.Item>
                          </Select.Content>
                        </Select.Root>
                      </Box>

                      {field.type === 'dropdown' && (
                        <Box>
                          <Flex justify="between" align="center" mb="2">
                            <Text size="1">Options</Text>
                            <Button
                              size="1"
                              variant="soft"
                              onClick={() => addDropdownOption(field.id)}
                              style={{ gap: '2px' }}
                            >
                              <Plus size={12} />
                            </Button>
                          </Flex>
                          <Flex direction="column" gap="2">
                            {(field.options || []).map((option, optIndex) => (
                              <Flex key={optIndex} gap="2" align="center">
                                <TextField.Root
                                  size="1"
                                  value={option}
                                  onChange={(e) =>
                                    updateDropdownOption(field.id, optIndex, e.target.value)
                                  }
                                  placeholder={`Option ${optIndex + 1}`}
                                  style={{ flex: 1 }}
                                />
                                <IconButton
                                  size="1"
                                  variant="ghost"
                                  color="red"
                                  onClick={() => removeDropdownOption(field.id, optIndex)}
                                >
                                  <X size={12} />
                                </IconButton>
                              </Flex>
                            ))}
                          </Flex>
                        </Box>
                      )}

                      <Flex gap="2" align="center" style={{ marginTop: '4px' }}>
                        <Checkbox
                          checked={field.required || false}
                          onCheckedChange={(checked) => updateField(field.id, 'required', checked)}
                          size="1"
                        />
                        <Text size="1">Required</Text>
                      </Flex>
                    </Flex>
                  </Card>
                );
              })}

              {(!(formData as FormNodeData).fields ||
                (formData as FormNodeData).fields?.length === 0) && (
                <Box p="3">
                  <Text size="2" align="center" color="gray">
                    No fields added yet
                  </Text>
                </Box>
              )}
            </Flex>
          )}

          {node.type === 'api' && (
            <Flex direction="column" gap="4">
              <Box>
                <Text size="2" weight="medium" mb="2">
                  API URL
                </Text>
                <TextField.Root
                  type="url"
                  required
                  pattern="https?://.*"
                  color={urlError ? 'red' : 'gray'}
                  variant={urlError ? 'soft' : 'classic'}
                  value={(formData as ApiNodeData).url || ''}
                  onChange={(e) => handleChange('url', e.target.value)}
                  placeholder="https://api.example.com"
                />
                {urlError && (
                  <Text size="1" color="red" mt="2">
                    Please enter a valid URL starting with http:// or https://
                  </Text>
                )}
              </Box>
              <Box>
                <Text size="2" weight="medium" mb="2">
                  Method
                </Text>
                <Select.Root
                  value={(formData as ApiNodeData).method || 'GET'}
                  onValueChange={(val) => handleChange('method', val)}
                >
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value="GET">GET</Select.Item>
                    <Select.Item value="POST">POST</Select.Item>
                    <Select.Item value="PUT">PUT</Select.Item>
                    <Select.Item value="DELETE">DELETE</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Box>
            </Flex>
          )}

          {node.type === 'conditional' && (
            <Flex direction="column" gap="4">
              <Box>
                <Text size="2" weight="medium" mb="2">
                  Condition Name
                </Text>
                <TextField.Root
                  value={(formData as ConditionalNodeData).customName || ''}
                  onChange={(e) => handleChange('customName', e.target.value)}
                  placeholder="Enter condition name"
                  color={condNameError ? 'red' : 'gray'}
                  variant={condNameError ? 'soft' : 'classic'}
                />
                {condNameError && (
                  <Text size="1" color="red" mt="2">
                    Name must be at least 3 characters long.
                  </Text>
                )}
              </Box>
              <Box ref={autoCompleteRef} style={{ position: 'relative' }}>
                <Text size="2" weight="medium" mb="2">
                  Field to Evaluate
                </Text>

                <TextField.Root
                  value={(formData as ConditionalNodeData).fieldToEvaluate || ''}
                  onChange={(e) => handleChange('fieldToEvaluate', e.target.value)}
                  placeholder="Start typing... field_name"
                  color={condEvalFieldError ? 'red' : 'gray'}
                  variant={condEvalFieldError ? 'soft' : 'classic'}
                  onFocus={() => setAutoCompleteOpen(true)}
                />
                {autoCompleteOpen && filterFields.length > 0 && (
                  <Box
                    width="100%"
                    maxHeight="150px"
                    position="absolute"
                    top="60px"
                    overflowY="auto"
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      zIndex: 99,
                    }}
                  >
                    {filterFields.map((field) => (
                      <Text
                        size="2"
                        as="div"
                        key={field}
                        style={{
                          padding: '4px 8px',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--gray-4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        onClick={() => {
                          handleChange('fieldToEvaluate', field);
                          setAutoCompleteOpen(false);
                          setFilterFields([]);
                        }}
                      >
                        {field}
                      </Text>
                    ))}
                  </Box>
                )}
                {condEvalFieldError && (
                  <Text size="1" color="red" mt="2">
                    Please specify the field to evaluate.
                  </Text>
                )}
              </Box>
              <Box>
                <Text size="2" weight="medium" mb="2">
                  Operator
                </Text>
                <Select.Root
                  value={(formData as ConditionalNodeData).operator || 'equals'}
                  onValueChange={(val) => handleChange('operator', val)}
                >
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value="equals">Equals</Select.Item>
                    <Select.Item value="not_equals">Not Equals</Select.Item>
                    <Select.Item value="is_empty">Is Empty</Select.Item>
                    <Select.Item value="greater_than">Greater Than</Select.Item>
                    <Select.Item value="less_than">Less Than</Select.Item>
                    <Select.Item value="contains">Contains</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Box>
              <Box>
                <Text size="2" weight="medium" mb="2">
                  Value
                </Text>
                <TextField.Root
                  value={(formData as ConditionalNodeData).value || ''}
                  onChange={(e) => handleChange('value', e.target.value)}
                  placeholder="comparison value"
                  color={condValueError ? 'red' : 'gray'}
                  variant={condValueError ? 'soft' : 'classic'}
                />
                {condValueError && (
                  <Text size="1" color="red" mt="2">
                    Please specify a value for comparison.
                  </Text>
                )}
              </Box>

              <Separator size="4" />

              <Text size="2" weight="bold">
                Routes
              </Text>

              {((formData as ConditionalNodeData).routes || []).map((route) => (
                <Card
                  key={route.id}
                  variant="surface"
                  style={{
                    padding: '12px',
                    backgroundColor: route.id === 'true' ? 'var(--green-3)' : 'var(--red-3)',
                  }}
                >
                  <Flex direction="column" gap="2">
                    <Flex justify="between" align="center">
                      <Text size="2" weight="bold" color={route.id === 'true' ? 'green' : 'red'}>
                        {route.id.toUpperCase()} Path
                      </Text>
                    </Flex>

                    <Box>
                      <Text size="1" mb="2">
                        Route Label
                      </Text>
                      <TextField.Root
                        size="1"
                        value={route.label || ''}
                        onChange={(e) => {
                          const conditionalData = formData as ConditionalNodeData;
                          const newRoutes = (conditionalData.routes || []).map((r) =>
                            r.id === route.id ? { ...r, label: e.target.value } : r
                          );
                          handleChange('routes', newRoutes);
                        }}
                        placeholder={
                          route.id === 'true' ? 'e.g., Yes, Success' : 'e.g., No, Failed'
                        }
                      />
                    </Box>

                    <Box>
                      <Text size="1" mb="2">
                        Description (optional)
                      </Text>
                      <TextField.Root
                        size="1"
                        value={route.condition || ''}
                        onChange={(e) => {
                          const conditionalData = formData as ConditionalNodeData;
                          const newRoutes = (conditionalData.routes || []).map((r) =>
                            r.id === route.id ? { ...r, condition: e.target.value } : r
                          );
                          handleChange('routes', newRoutes);
                        }}
                        placeholder="Describe this path"
                      />
                    </Box>
                  </Flex>
                </Card>
              ))}
            </Flex>
          )}
        </Flex>
      </Card>
    );
  }
);

NodeEditor.displayName = 'NodeEditor';
