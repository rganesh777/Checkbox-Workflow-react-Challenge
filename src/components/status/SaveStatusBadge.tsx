import { Button } from '@radix-ui/themes';
import { getSaveStatusColor, getSaveStatusIcon } from '@/utils/OtherFns';
import { SaveStatusBadgeProps } from '@/components/status/Status.types';

/** SaveStatusBadge - Badge component to display current save status
 */
export const SaveStatusBadge = ({
  isSaving,
  setShowStatusDialog,
}: SaveStatusBadgeProps): JSX.Element => {
  return (
    <Button
      variant="solid"
      color={getSaveStatusColor(isSaving)}
      size="2"
      onClick={() => setShowStatusDialog(true)}
      title={`Save Status: ${isSaving} - Click for details`}
    >
      {getSaveStatusIcon(isSaving)}
      {isSaving.toUpperCase()}
    </Button>
  );
};
