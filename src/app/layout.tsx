
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google'; // Renamed for clarity
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { UtensilsCrossed } from 'lucide-react'; // Icon for logo

// Configure Inter font
const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans', // Use standard variable name based on docs
});


export const metadata: Metadata = {
  title: 'FlavorVerse - Delicious Recipes',
  description: 'Explore and manage your favorite recipes.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
       <head />
      {/* Apply the font variable to the body */}
      <body
         className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <UtensilsCrossed className="h-6 w-6 text-primary" />
              <span className="font-bold text-primary">FlavorVerse</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link
                href="/recipes"
                className="transition-colors hover:text-primary"
              >
                Recipes
              </Link>
              {/* Add Admin link later */}
              {/* <Link
                href="/admin"
                className="transition-colors hover:text-primary"
              >
                Admin
              </Link> */}
            </nav>
          </div>
        </header>
        <main className="flex-1 container py-8">
         {children}
        </main>
        <Toaster /> {/* Add Toaster here */}
      </body>
    </html>
  );
}
