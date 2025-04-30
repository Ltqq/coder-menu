
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Carrot, CookingPot } from 'lucide-react'; // Use CookingPot

export const metadata: Metadata = {
  title: 'Admin Dashboard | FlavorVerse',
  description: 'Overview of the FlavorVerse admin area.',
};

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Recipes
            </CardTitle>
            <CardDescription>Manage all your recipes.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/recipes" passHref>
              <Button size="sm">Manage Recipes</Button>
            </Link>
             {/* Placeholder count */}
            <p className="text-sm text-muted-foreground mt-4">XX recipes available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <Carrot className="w-5 h-5 text-primary" />
              Ingredients
            </CardTitle>
            <CardDescription>Add, edit, or remove ingredients.</CardDescription>
          </CardHeader>
          <CardContent>
             <Link href="/admin/ingredients" passHref>
               <Button size="sm">Manage Ingredients</Button>
            </Link>
            {/* Placeholder count */}
            <p className="text-sm text-muted-foreground mt-4">XX ingredients listed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CookingPot className="w-5 h-5 text-primary" /> {/* Use CookingPot */}
              Seasonings
            </CardTitle>
            <CardDescription>Add, edit, or remove seasonings.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/seasonings" passHref>
               <Button size="sm">Manage Seasonings</Button>
            </Link>
             {/* Placeholder count */}
            <p className="text-sm text-muted-foreground mt-4">XX seasonings listed</p>
          </CardContent>
        </Card>

        {/* Add more cards for other potential sections */}
      </div>
    </div>
  );
}
