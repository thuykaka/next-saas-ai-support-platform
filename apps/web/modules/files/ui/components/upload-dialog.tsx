'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useAction } from 'convex/react';
import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@workspace/ui/components/dialog';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState
} from '@workspace/ui/components/ui/kibo-ui/dropzone';
import { Loader2Icon } from 'lucide-react';

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFileUploadCallback?: () => void;
}

export const UploadDialog = ({
  open,
  onOpenChange,
  onFileUploadCallback
}: UploadDialogProps) => {
  const addFiles = useAction(api.private.files.addFile);

  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    category: '',
    filename: ''
  });

  const handleFileDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadFiles([file]);
      if (!uploadForm.filename) {
        setUploadForm((prev) => ({
          ...prev,
          filename: file.name
        }));
      }
    }
  };

  const handleUpload = async () => {
    if (uploadFiles.length === 0 || isUploading || !uploadForm.category) {
      return;
    }
    setIsUploading(true);

    try {
      const blobFile = uploadFiles[0];
      if (!blobFile) {
        return;
      }

      const fileName = uploadForm.filename || blobFile.name;

      const bytes = await blobFile.arrayBuffer();

      await addFiles({
        bytes,
        mimeType: blobFile.type || 'text/plain',
        fileName,
        category: uploadForm.category
      });

      onFileUploadCallback?.();

      handleCancel();

      toast.success('File uploaded successfully');
    } catch (error: any) {
      console.error('upload error', error);
      toast.error('Failed to upload file: ' + error?.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setUploadFiles([]);
    setUploadForm({
      category: '',
      filename: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a document to your knowledge base for AI-Powered search and
            retrieval.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-2'>
          <Label htmlFor='category'>Category</Label>
          <Input
            className='w-full'
            id='category'
            value={uploadForm.category}
            onChange={(e) =>
              setUploadForm((prev) => ({ ...prev, category: e.target.value }))
            }
            placeholder='e.g., "Customer Support", "Product Documentation", "Legal Documents"'
          />
        </div>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='filename'>
              File Name{' '}
              <span className='text-muted-foreground text-xs'>(optional)</span>
            </Label>
            <Input
              className='w-full'
              id='filename'
              value={uploadForm.filename}
              onChange={(e) =>
                setUploadForm((prev) => ({ ...prev, filename: e.target.value }))
              }
              placeholder='e.g., "customer-support.pdf", "product-documentation.docx", "legal-documents.docx"'
            />
          </div>

          <Dropzone
            accept={{
              'application/pdf': ['.pdf'],
              'text/csv': ['.csv'],
              'text/plain': ['.txt'],
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                ['.docx']
            }}
            disabled={isUploading}
            maxFiles={1}
            maxSize={1024 * 1024 * 10}
            minSize={1024}
            onDrop={handleFileDrop}
            onError={(error) => {
              console.error('dropfile error', error);
              toast.error(error.message);
            }}
            src={uploadFiles}
          >
            <DropzoneEmptyState />
            <DropzoneContent />
          </Dropzone>
        </div>
        <DialogFooter>
          <Button
            variant='outline'
            disabled={isUploading}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            disabled={
              uploadFiles.length === 0 || isUploading || !uploadForm.category
            }
            onClick={handleUpload}
          >
            {isUploading ? (
              <div className='flex items-center gap-2'>
                <Loader2Icon className='size-4 animate-spin' />
                Uploading...
              </div>
            ) : (
              'Upload'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
