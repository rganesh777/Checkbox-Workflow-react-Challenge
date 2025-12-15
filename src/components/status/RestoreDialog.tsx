import { Flex, AlertDialog, Button } from '@radix-ui/themes';
import { RestoreDialogProps } from '@/components/status/Status.types';

/** RestoreDialog - Dialog component to restore a saved workflow
 */
export const RestoreDialog = ({
  showRestoreDialog,
  setShowRestoreDialog,
  handleRestoreWorkflow,
}: RestoreDialogProps): JSX.Element => {
  const handleDiscardWorkflow = () => {
    localStorage.removeItem('workflow-autosave');
    setShowRestoreDialog(false);
  };

  return (
    <AlertDialog.Root open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>Restore Workflow</AlertDialog.Title>
        <AlertDialog.Description size="3">
          A saved workflow configuration was found. Would you like to restore it?
        </AlertDialog.Description>
        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray" onClick={() => handleDiscardWorkflow()}>
              Discard
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant="solid" color="blue" onClick={handleRestoreWorkflow}>
              Restore
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};
