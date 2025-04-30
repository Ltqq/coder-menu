
import type { Metadata, ResolvingMetadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getRecipeById } from '@/lib/placeholder-data';
import type { Recipe, RecipeStep } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Utensils, Timer, Users, ChefHat, ListChecks, Leaf, CookingPot } from 'lucide-react'; // Use CookingPot
import { AspectRatio } from "@/components/ui/aspect-ratio";


type Props = {
  params: { id: string };
};

// Generate metadata dynamically based on the recipe
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
  const recipe = await getRecipeById(id);

  if (!recipe) {
    return {
      title: 'Recipe Not Found | FlavorVerse',
    };
  }

  return {
    title: `${recipe.title} | FlavorVerse`,
    description: recipe.description,
    openGraph: {
       images: [recipe.finishedDishImageUrl || recipe.coverImageUrl],
    }
  };
}


export default async function RecipeDetailPage({ params }: Props) {
  const recipe = await getRecipeById(params.id);

  if (!recipe) {
    notFound(); // Display a 404 page if recipe isn't found
  }

  const formatQuantity = (quantity: string) => {
    // Basic check if quantity is just a number, add 'x'
    // You might want more sophisticated logic here
    return /^\d+$/.test(quantity) ? `${quantity}x` : quantity;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="overflow-hidden rounded-lg border shadow-md">
        <CardHeader className="p-0">
          <AspectRatio ratio={16 / 9}>
             <Image
                src={recipe.finishedDishImageUrl}
                alt={`Finished dish: ${recipe.title}`}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 66vw"
                priority // Prioritize loading the main image
              />
          </AspectRatio>
           <div className="p-6">
             <CardTitle className="text-3xl font-bold mb-2 text-primary">{recipe.title}</CardTitle>
             <CardDescription className="text-muted-foreground mb-4">{recipe.description}</CardDescription>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                    {recipe.prepTime && (
                    <span className="flex items-center gap-1.5">
                        <Timer className="w-4 h-4" /> Prep: {recipe.prepTime}
                    </span>
                    )}
                    {recipe.cookTime && (
                    <span className="flex items-center gap-1.5">
                        <ChefHat className="w-4 h-4" /> Cook: {recipe.cookTime}
                    </span>
                    )}
                    {recipe.servings && (
                    <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" /> Serves: {recipe.servings}
                    </span>
                    )}
              </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="p-6 grid md:grid-cols-3 gap-8">
          {/* Ingredients & Seasonings Column */}
          <div className="md:col-span-1 space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-primary"><Leaf className="w-5 h-5"/> Ingredients</h3>
              <ul className="list-none space-y-1.5 text-foreground/90">
                {recipe.ingredients.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.name}</span>
                    <span className="text-muted-foreground">{item.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
             <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-primary"><CookingPot className="w-5 h-5"/> Seasonings</h3> {/* Use CookingPot */}
              <ul className="list-none space-y-1.5 text-foreground/90">
                {recipe.seasonings.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.name}</span>
                     <span className="text-muted-foreground">{item.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Instructions Column */}
          <div className="md:col-span-2">
             <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-primary"><ListChecks className="w-5 h-5"/> Instructions</h3>
            <ol className="space-y-6">
              {recipe.instructions.map((step) => (
                <li key={step.step} className="flex gap-4 items-start">
                  <span className="flex-shrink-0 mt-1 inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {step.step}
                  </span>
                  <div className="flex-grow">
                     <p className="text-foreground/90 leading-relaxed">{step.description}</p>
                     {step.imageUrl && (
                        <div className="mt-3 rounded-md overflow-hidden border shadow-sm">
                            <AspectRatio ratio={4 / 3}>
                                <Image
                                    src={step.imageUrl}
                                    alt={`Step ${step.step} illustration`}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                     sizes="(max-width: 768px) 80vw, 30vw"
                                />
                            </AspectRatio>
                        </div>
                     )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Optional: Generate static paths if you have a known set of recipes
// export async function generateStaticParams() {
//   const recipes = await getRecipes();
//   return recipes.map((recipe) => ({
//     id: recipe.id,
//   }));
// }
