export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='bg-background flex max-h-screen min-h-screen items-center justify-center'>
      {children}
    </main>
  );
};
