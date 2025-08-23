'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useAction } from 'convex/react';
import { api } from '@workspace/backend/_generated/api';
import { PublicFile } from '@workspace/backend/private/files';
import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogFooter
} from '@workspace/ui/components/dialog';
import { Loader2Icon } from 'lucide-react';

interface DeleteFileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteCallback?: () => void;
  file: PublicFile | null;
}

export const DeleteFileDialog = ({
  open,
  onOpenChange,
  onDeleteCallback,
  file
}: DeleteFileDialogProps) => {
  const deleteFile = useAction(api.private.files.deleteFile);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!file) {
      return;
    }
    setIsDeleting(true);

    try {
      await deleteFile({
        entryId: file.id
      });
      onDeleteCallback?.();
      toast.success(`File: ${file.name} deleted successfully`);
      handleCancel();
    } catch (error: any) {
      console.error('delete file error', error);
      toast.error('Failed to delete file ' + error?.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete File</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this file? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        {file && (
          <div className='bg-muted/50 flex flex-col gap-2 rounded-lg border p-4'>
            <p className='font-medium'>{file.name}</p>
            <p className='text-muted-foreground text-sm'>
              Type: {file.type.toUpperCase()} | Size: {file.size}
            </p>
          </div>
        )}
        <DialogFooter>
          <Button
            variant='outline'
            onClick={handleCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            variant='destructive'
          >
            {isDeleting ? (
              <div className='flex items-center gap-2'>
                <Loader2Icon className='size-4 animate-spin' />
                Deleting...
              </div>
            ) : (
              'Delete'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
