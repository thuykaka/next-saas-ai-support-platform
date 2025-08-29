import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@workspace/ui/components/dropdown-menu';
import { Skeleton } from '@workspace/ui/components/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@workspace/ui/components/table';
import {
  FileIcon,
  MoreHorizontalIcon,
  PlusIcon,
  TrashIcon
} from 'lucide-react';
import { createMockFiles } from '@/modules/files/ui/utils';

const mockFiles = createMockFiles(5);

export const FilesViewSkeleton = () => {
  return (
    <>
      <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
        <div className='p-4'>
          <h2 className='text-xl font-bold tracking-tight'>Knowledge Base</h2>
          <p className='text-muted-foreground text-sm'>
            Upload and manage documents for your AI assistant
          </p>
        </div>
      </div>
      <div className='flex h-full flex-1 flex-col'>
        <div className='flex items-center justify-end px-4'>
          <Skeleton className='h-10 w-[100px] rounded-md' />
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
              {mockFiles.map((file) => (
                <TableRow key={file.id} className='hover:bg-muted/50'>
                  <TableCell className='px-6 py-4'>
                    <div className='flex items-center gap-3'>
                      <FileIcon className='size-4' />
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
                      <DropdownMenuContent align='start'>
                        <DropdownMenuItem className='text-destructive cursor-pointer'>
                          <TrashIcon className='size-4' />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};
