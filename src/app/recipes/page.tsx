
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getRecipes } from '@/lib/placeholder-data'; // Fetch placeholder data
import type { Recipe } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Recipes | FlavorVerse',
  description: 'Browse all available recipes.',
};

export default async function RecipesPage() {
  const recipes: Recipe[] = await getRecipes();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-primary">Explore Recipes</h1>
      {recipes.length === 0 ? (
        <p className="text-muted-foreground">No recipes found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <Link key={recipe.id} href={`/recipes/${recipe.id}`} passHref>
              <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer rounded-lg border">
                <div className="relative w-full aspect-video">
                  <Image
                    src={recipe.coverImageUrl}
                    alt={`Cover image for ${recipe.title}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={recipes.indexOf(recipe) < 3} // Prioritize loading images for the first few recipes
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg text-primary">{recipe.title}</CardTitle>
                  <CardDescription className="text-sm text-foreground/80 line-clamp-2">
                    {recipe.description}
                  </CardDescription>
                </CardHeader>
                {/* Removed CardContent as description is in header now */}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
