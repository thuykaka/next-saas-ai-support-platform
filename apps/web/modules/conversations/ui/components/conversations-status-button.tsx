import { Doc } from '@workspace/backend/_generated/dataModel';
import { Button } from '@workspace/ui/components/button';
import { Hint } from '@workspace/ui/components/hint';
import {
  ArrowRightIcon,
  ArrowUpIcon,
  CheckIcon,
  Loader2Icon
} from 'lucide-react';

type ConversationsStatusButtonProps = {
  status: Doc<'conversations'>['status'];
  onClick: () => void;
  isSubmitting?: boolean;
};

const LoadingButton = () => {
  return (
    <>
      <Loader2Icon className='mr-2 h-4 w-4 animate-spin' />
      <span>Updating status...</span>
    </>
  );
};

export const ConversationsStatusButton = ({
  status,
  onClick,
  isSubmitting
}: ConversationsStatusButtonProps) => {
  return (
    <>
      {status === 'resolved' ? (
        <Hint text='Make as unresolved'>
          <Button
            onClick={onClick}
            size='sm'
            variant='tertiary'
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <LoadingButton />
            ) : (
              <>
                <CheckIcon className='mr-2 h-4 w-4' />
                Resolved
              </>
            )}
          </Button>
        </Hint>
      ) : status === 'escalated' ? (
        <Hint text='Make as resolved'>
          <Button
            onClick={onClick}
            size='sm'
            variant='warning'
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <LoadingButton />
            ) : (
              <>
                <ArrowUpIcon className='mr-2 h-4 w-4' />
                Escalated
              </>
            )}
          </Button>
        </Hint>
      ) : (
        <Hint text='Make as escalated'>
          <Button
            onClick={onClick}
            size='sm'
            variant='destructive'
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <LoadingButton />
            ) : (
              <>
                <ArrowRightIcon className='mr-2 h-4 w-4' />
                Unresolved
              </>
            )}
          </Button>
        </Hint>
      )}
    </>
  );
};
