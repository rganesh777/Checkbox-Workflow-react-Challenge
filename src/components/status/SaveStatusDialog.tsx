import { memo } from 'react';
import { Flex, AlertDialog, Button, Text, Grid } from '@radix-ui/themes';
import { getSaveStatusColor } from '@/utils/OtherFns';
import { SaveStatusDialogProps } from '@/components/status/Status.types';

/** SaveStatusDialog - Dialog component to display save status details
 */
export const SaveStatusDialog = memo(
  ({
    isSaving,
    savedWorkflow,
    showStatusDialog,
    setShowStatusDialog,
  }: SaveStatusDialogProps): JSX.Element => {
    const savedTime = savedWorkflow?.metadata.lastSaved
      ? new Date(savedWorkflow?.metadata.lastSaved).toLocaleString()
      : 'N/A';

    return (
      <AlertDialog.Root open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <AlertDialog.Content maxWidth="450px">
          <AlertDialog.Title>Saved Status</AlertDialog.Title>
          <AlertDialog.Description size="3" mb="4">
            Please find the details of the saved workflow below.
          </AlertDialog.Description>
          <Grid columns="140px auto" rows="4" gap="2" mb="4">
            <Text mb="2">Workflow Name:</Text>{' '}
            <strong>{savedWorkflow?.metadata.name || 'N/A'}</strong>
            <Text mb="2">Version:</Text> <strong>{savedWorkflow?.metadata.version || 'N/A'}</strong>
            <Text mb="2">Current Status:</Text>
            <Text mb="2" color={getSaveStatusColor(isSaving)} weight="bold">
              {isSaving.toUpperCase()}
            </Text>
            <Text mb="2">Last Saved At:</Text> <strong>{savedTime}</strong>
          </Grid>
          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Close
              </Button>
            </AlertDialog.Cancel>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    );
  }
);

SaveStatusDialog.displayName = 'SaveStatusDialog';
