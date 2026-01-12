import type { Metadata } from 'next';
import { Inter, Merriweather } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Providers from '@/components/Providers';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const merriweather = Merriweather({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sky Investment | Institutional Analysis',
  description: 'Professional investment research and market insights.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`} suppressHydrationWarning>
      <body className="antialiased bg-white text-gray-800 dark:bg-black dark:text-white/40 font-sans min-h-screen flex flex-col">
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Navbar />
            <main className="flex-grow w-full">
              {children}
            </main>
          </ThemeProvider>
        </Providers>       
      </body>     
    </html>
  );
}