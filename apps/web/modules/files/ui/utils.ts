const fileNames = [
  'Report',
  'Invoice',
  'Resume',
  'Presentation',
  'Notes',
  'Summary',
  'Proposal',
  'Budget',
  'Meeting',
  'Analysis'
];
const extensions = ['pdf', 'docx', 'xlsx', 'pptx', 'txt'];

const sizes = ['85KB', '120KB', '240KB', '1.2MB', '3.4MB', '512KB'];

function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T;
}

export const createMockFiles = (count: number) =>
  Array.from({ length: count }, (_, index) => {
    const name = `${getRandom(fileNames)} ${index + 1}`;
    return {
      id: index,
      name,
      type: getRandom(extensions),
      size: getRandom(sizes)
    };
  });
