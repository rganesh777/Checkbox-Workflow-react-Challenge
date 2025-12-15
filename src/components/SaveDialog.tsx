import { AlertDialog, Flex, Button } from '@radix-ui/themes';

export type SaveDialogProps = {
  showSaveDialog: boolean;
  setShowSaveDialog: (open: boolean) => void;
};

/** SaveDialog - Dialog component to inform user that workflow has been saved
 */
export const SaveDialog = ({ showSaveDialog, setShowSaveDialog }: SaveDialogProps): JSX.Element => {
  return (
    <AlertDialog.Root open={showSaveDialog} onOpenChange={setShowSaveDialog}>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>Workflow Saved</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Your workflow configuration has been saved to the browser console. Check the developer
          console for the complete configuration details.
        </AlertDialog.Description>
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
};
