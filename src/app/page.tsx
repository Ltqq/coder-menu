
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background">
      <Card className="w-[350px] shadow-lg rounded-lg border">
        <CardHeader>
          <CardTitle className="text-primary">Welcome to FlavorVerse</CardTitle>
          <CardDescription>Your culinary adventure starts here.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-foreground/80">
            Discover amazing recipes from around the world or manage your own culinary creations.
          </p>
          <Link href="/recipes" passHref>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Explore Recipes
            </Button>
          </Link>
           {/* Link to Admin - uncomment when admin is ready */}
           {/*
           <Link href="/admin" passHref>
             <Button variant="outline" className="w-full mt-2">
               Admin Dashboard
             </Button>
           </Link>
            */}
        </CardContent>
      </Card>
    </main>
  );
}
