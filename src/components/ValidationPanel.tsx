import { memo } from 'react';
import { ValidationPanelProps } from './WorkflowEditor.types';
import { Card, Flex, Heading, Badge, Callout, Text } from '@radix-ui/themes';
import { AlertCircle, Info } from 'lucide-react';

/**
 * ValidationPanel - Displays workflow validation errors
 * Shows a list of errors that need to be fixed in the workflow
 */
export const ValidationPanel: React.FC<ValidationPanelProps> = memo(({ errors }) => {
  const errorCount = errors.length;

  return (
    <Card style={{ width: '258px', height: 'calc(100vh - 400px - 32px - 80px)' }}>
      <Flex direction="column" gap="3" p="4" style={{ height: '100%', overflowY: 'auto' }}>
        <Flex justify="between" align="center">
          <Heading size="3">Errors</Heading>
          {errorCount > 0 && (
            <Badge color="red" size="1">
              {errorCount}
            </Badge>
          )}
        </Flex>

        <Flex direction="column" gap="2">
          {errors.length === 0 ? (
            <Callout.Root color="green" size="1">
              <Callout.Icon>
                <Info />
              </Callout.Icon>
              <Callout.Text>No errors found</Callout.Text>
            </Callout.Root>
          ) : (
            errors.map((error) => (
              <Callout.Root key={error.id} color={error.type === 'error' ? 'red' : 'blue'} size="1">
                <Callout.Icon>
                  <AlertCircle />
                </Callout.Icon>
                <Callout.Text>
                  {error.nodeId && (
                    <>
                      <Text size="2" color="red" weight="bold">
                        Node: {error.nodeId}
                      </Text>
                      <br />
                    </>
                  )}
                  {error.message}
                </Callout.Text>
              </Callout.Root>
            ))
          )}
        </Flex>
      </Flex>
    </Card>
  );
});

ValidationPanel.displayName = 'ValidationPanel';
