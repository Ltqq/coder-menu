
'use client'; // Required for useState, useEffect, and client-side interactions

import { useState, useEffect } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Button, buttonVariants } from '@/components/ui/button'; // Correctly import buttonVariants
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getRecipes, deleteRecipe } from '@/lib/placeholder-data'; // Using placeholder data for now
import type { Recipe } from '@/lib/types';
import Image from 'next/image';
import { PlusCircle, Edit, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton'; // For loading state

// export const metadata: Metadata = { // Metadata cannot be used in client components easily
//   title: 'Manage Recipes | Admin',
//   description: 'Add, edit, or delete recipes.',
// };

export default function AdminRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // Track deleting recipe ID
  const { toast } = useToast();
  const router = useRouter(); // Initialize router

  // Fetch recipes on component mount
  useEffect(() => {
    async function loadRecipes() {
      setIsLoading(true);
      try {
        const fetchedRecipes = await getRecipes();
        setRecipes(fetchedRecipes);
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not load recipes.',
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadRecipes();
  }, [toast]); // Add toast as dependency

  const handleDeleteRecipe = async (id: string) => {
    setIsDeleting(id);
    try {
      const success = await deleteRecipe(id);
      if (success) {
        setRecipes((prevRecipes) => prevRecipes.filter((r) => r.id !== id));
        toast({
          title: 'Success',
          description: 'Recipe deleted successfully.',
        });
      } else {
        throw new Error('Failed to delete recipe from placeholder data');
      }
    } catch (error) {
      console.error('Failed to delete recipe:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not delete the recipe.',
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEditClick = (id: string) => {
    router.push(`/admin/recipes/edit/${id}`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Manage Recipes</CardTitle>
          <CardDescription>
            View, add, edit, or delete recipes from your collection.
          </CardDescription>
        </div>
        <Link href="/admin/recipes/new" passHref>
          <Button size="sm" className="gap-1">
            <PlusCircle className="h-4 w-4" />
            Add Recipe
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Description</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading Skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell className="hidden sm:table-cell">
                    <Skeleton className="h-12 w-16 rounded-md" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-3/4 rounded" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-5 w-full rounded" />
                     <Skeleton className="mt-1 h-5 w-2/3 rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Skeleton className="h-7 w-7 rounded-md" />
                      <Skeleton className="h-7 w-7 rounded-md" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : recipes.length > 0 ? (
              recipes.map((recipe) => (
                <TableRow key={recipe.id}>
                  <TableCell className="hidden sm:table-cell">
                    <div className="relative h-12 w-16 rounded-md overflow-hidden border">
                      <Image
                        src={recipe.coverImageUrl}
                        alt={recipe.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="64px"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{recipe.title}</TableCell>
                  <TableCell className="hidden md:table-cell line-clamp-2">
                    {recipe.description}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      {/* Edit button - link to edit page */}
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleEditClick(recipe.id)} // Use router to navigate
                        disabled={!!isDeleting} // Disable if any recipe is being deleted
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      {/* Delete button with confirmation */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-7 w-7"
                            disabled={isDeleting === recipe.id}
                          >
                            {isDeleting === recipe.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                            <span className="sr-only">Delete</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently
                              delete the recipe "{recipe.title}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel disabled={!!isDeleting}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteRecipe(recipe.id)}
                              disabled={!!isDeleting}
                              className={buttonVariants({ variant: "destructive" })} // Use buttonVariants here
                            >
                               {isDeleting === recipe.id ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Deleting...
                                </>
                              ) : (
                                "Delete"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No recipes found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      {/* Add Pagination later if needed */}
    </Card>
  );
}
