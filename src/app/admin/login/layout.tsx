
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Login | FlavorVerse',
  description: 'Login to the FlavorVerse admin dashboard.',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout specifically does NOT include the main AdminLayout components
  // like the sidebar, ensuring the login page is separate.
  // It provides a simple container to center the login form.
  return (
     <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        {children}
     </div>
    );
}
