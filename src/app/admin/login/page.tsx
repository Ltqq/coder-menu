
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { loginAction } from './actions'; // Import the server action
import { Loader2, UtensilsCrossed } from 'lucide-react'; // Import Loader2 and UtensilsCrossed

export default function AdminLoginPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    try {
        // Call the server action.
        // - On success: it throws NEXT_REDIRECT which Next.js handles.
        // - On failure: it returns { error: string }.
        const result = await loginAction(formData);

        // Only display an error if the action *returned* an error object.
        // Successful redirects are handled by Next.js catching the thrown error.
        if (result?.error) {
          const errorMessage = result.error;
          setError(errorMessage);
          toast({
            variant: 'destructive',
            title: "Login Failed",
            description: errorMessage,
          });
           setIsLoading(false); // Stop loading only if there was a returned error
        }
        // No 'else' needed: Successful login triggers redirect handled by Next.js framework.
        // setIsLoading(false) should NOT be called here on success, as the page will navigate away.

    } catch (err) {
        // Catch unexpected errors *during the action call itself* (e.g., network issues).
        // It should NOT catch the NEXT_REDIRECT error thrown by a successful redirect().
        // If it *does* catch NEXT_REDIRECT, that might indicate a deeper issue, but
        // for now, assume this catch is for other unexpected problems.
        console.error("Login form submission unexpected error:", err);

        // Check if the error is the specific redirect error, if so, let Next.js handle it.
        if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) {
           // Don't set error state or show toast, just let the redirect happen.
           // The finally block will still run, which is okay.
           console.log("Caught NEXT_REDIRECT, letting framework handle navigation.");
        } else {
            // Handle other unexpected errors
            const errorMessage = 'An unexpected error occurred during login. Please try again.';
            setError(errorMessage);
            toast({
                variant: 'destructive',
                title: "Login Error",
                description: errorMessage,
            });
            setIsLoading(false); // Stop loading on unexpected errors
        }
    }
    // Removed finally block - setIsLoading(false) is now handled conditionally
    // within the try/catch block to avoid setting it after a successful redirect starts.
    // finally {
    //     // This runs even if redirect is happening. Setting loading to false here
    //     // might cause a brief flash before navigation. Moved inside handlers.
    //     // setIsLoading(false);
    // }
  };

  return (
    // The surrounding div with flex centering is handled by LoginLayout
    <Card className="w-full max-w-sm">
      <form onSubmit={handleLogin}>
        <CardHeader className="space-y-2 text-center">
           <div className="flex justify-center items-center mb-2">
             <UtensilsCrossed className="h-8 w-8 text-primary" />
           </div>
          <CardTitle className="text-2xl font-bold">FlavorVerse Admin</CardTitle>
          <CardDescription>Enter your credentials below</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username" // Add name attribute for FormData
              type="text"
              placeholder="admin"
              required
              disabled={isLoading}
              autoComplete="username" // Add autocomplete hint
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password" // Add name attribute for FormData
              type="password"
              required
              disabled={isLoading}
              placeholder="password" // Example placeholder
              autoComplete="current-password" // Add autocomplete hint
            />
          </div>
          {error && (
            <p className="text-sm font-medium text-destructive">{error}</p>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Login
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
