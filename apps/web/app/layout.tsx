import { Toaster } from '@workspace/ui/components/sonner';
import '@workspace/ui/globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { Geist, Geist_Mono } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import { Providers } from '@/components/providers';

const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans'
});

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono'
});

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} overflow-hidden overscroll-none font-sans antialiased`}
      >
        <NextTopLoader showSpinner={false} color='var(--primary)' />
        <Toaster richColors />
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: 'var(--primary)'
            }
          }}
        >
          <Providers>{children}</Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
