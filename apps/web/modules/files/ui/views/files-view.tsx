'use client';

import { useState } from 'react';
import { usePaginatedQuery } from 'convex/react';
import { api } from '@workspace/backend/_generated/api';
import { PublicFile } from '@workspace/backend/private/files';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@workspace/ui/components/dropdown-menu';
import { InfiniteScrollTrigger } from '@workspace/ui/components/infinite-scroll-trigger';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@workspace/ui/components/table';
import { useInfiniteScroll } from '@workspace/ui/hooks/use-infinite-scroll';
import {
  FileIcon,
  MoreHorizontalIcon,
  PlusIcon,
  TrashIcon
} from 'lucide-react';
import { DeleteFileDialog } from '@/modules/files/ui/components/delete-file-dialog';
import { UploadDialog } from '@/modules/files/ui/components/upload-dialog';

export const FilesView = () => {
  const files = usePaginatedQuery(
    api.private.files.getFiles,
    {},
    {
      initialNumItems: 10
    }
  );

  const {
    topEleRef,
    handleLoadMore,
    canLoadMore,
    isLoadingMore,
    isLoadingFirstPage
  } = useInfiniteScroll({
    status: files.status,
    onLoadMore: files.loadMore,
    loadSize: 10
  });

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteFile, setDeleteFile] = useState<PublicFile | null>(null);

  const handleDeleteFile = (file: PublicFile) => {
    setDeleteFile(file);
    setDeleteDialogOpen(true);
  };

  return (
    <>
      <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
        <div className='px-4'>
          <h2 className='text-xl font-bold tracking-tight'>Knowledge Base</h2>
          <p className='text-muted-foreground text-sm'>
            Upload and manage documents for your AI assistant
          </p>
        </div>
      </div>
      <div className='flex h-full flex-1 flex-col'>
        <div className='flex items-center justify-end px-4'>
          <Button onClick={() => setUploadDialogOpen(true)}>
            <PlusIcon className='size-4' />
            Add File
          </Button>
        </div>
        <div className='m-4 overflow-hidden rounded-lg border'>
          <Table>
            <TableHeader className='bg-muted'>
              <TableRow>
                <TableHead className='px-6 py-4 font-medium'>Name</TableHead>
                <TableHead className='px-6 py-4 font-medium'>Type</TableHead>
                <TableHead className='px-6 py-4 font-medium'>Size</TableHead>
                <TableHead className='px-6 py-4 font-medium'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(() => {
                if (isLoadingFirstPage) {
                  return (
                    <TableRow>
                      <TableCell colSpan={4} className='h-24 text-center'>
                        Loading...
                      </TableCell>
                    </TableRow>
                  );
                }

                if (files.results.length === 0) {
                  return (
                    <TableRow>
                      <TableCell colSpan={4} className='h-24 text-center'>
                        No files found
                      </TableCell>
                    </TableRow>
                  );
                }

                return files.results.map((file) => (
                  <TableRow key={file.id} className='hover:bg-muted/50'>
                    <TableCell className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <FileIcon />
                        {file.name}
                      </div>
                    </TableCell>
                    <TableCell className='px-6 py-4'>
                      <Badge variant='outline'>{file.type}</Badge>
                    </TableCell>
                    <TableCell className='text-muted-foreground px-6 py-4'>
                      {file.size}
                    </TableCell>
                    <TableCell className='px-6 py-4'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='size-8 p-0'
                          >
                            <MoreHorizontalIcon />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem
                            className='text-destructive cursor-pointer'
                            onClick={() => handleDeleteFile(file)}
                          >
                            <TrashIcon className='size-4' />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ));
              })()}
            </TableBody>
          </Table>
          {!isLoadingFirstPage && files.results.length > 0 && (
            <div className='border-t'>
              <InfiniteScrollTrigger
                ref={topEleRef}
                canLoadMore={canLoadMore}
                isLoadingMore={isLoadingMore}
                onLoadMore={handleLoadMore}
              />
            </div>
          )}
        </div>
      </div>

      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
      />

      <DeleteFileDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        file={deleteFile}
        onDeleteCallback={() => {
          setDeleteFile(null);
        }}
      />
    </>
  );
};
