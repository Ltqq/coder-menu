
'use client'; // Required for client-side state and interactions

import { useState, useEffect } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button'; // Import buttonVariants
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getManageableIngredients, addIngredient, updateIngredient, deleteIngredient } from '@/lib/placeholder-data';
import type { ManageableIngredient } from '@/lib/types';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose, // Import DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from '@/components/ui/skeleton'; // For loading state


// Metadata cannot be used directly in client components easily
// export const metadata: Metadata = {
//   title: 'Manage Ingredients | Admin',
//   description: 'Add, edit, or delete ingredients.',
// };

export default function AdminIngredientsPage() {
  const [ingredients, setIngredients] = useState<ManageableIngredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false); // For add/edit actions
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // Track deleting ID
  const [editingIngredient, setEditingIngredient] = useState<ManageableIngredient | null>(null);
  const [newIngredientName, setNewIngredientName] = useState('');
  const [editIngredientName, setEditIngredientName] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { toast } = useToast();

  // Fetch ingredients on mount
  useEffect(() => {
    async function loadIngredients() {
      setIsLoading(true);
      try {
        const fetchedIngredients = await getManageableIngredients();
        setIngredients(fetchedIngredients);
      } catch (error) {
        console.error('Failed to fetch ingredients:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not load ingredients.',
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadIngredients();
  }, [toast]);

  // Reset edit form when editingIngredient changes
  useEffect(() => {
    if (editingIngredient) {
      setEditIngredientName(editingIngredient.name);
      setIsEditDialogOpen(true);
    } else {
       setEditIngredientName('');
       setIsEditDialogOpen(false); // Close dialog if no ingredient is being edited
    }
  }, [editingIngredient]);

  const handleAddIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIngredientName.trim()) {
       toast({ variant: 'destructive', title: 'Error', description: 'Ingredient name cannot be empty.' });
       return;
    }
    setIsProcessing(true);
    try {
      const added = await addIngredient({ name: newIngredientName.trim() });
      setIngredients((prev) => [...prev, added]);
      toast({ title: 'Success', description: `Ingredient "${added.name}" added.` });
      setNewIngredientName(''); // Clear input
      setIsAddDialogOpen(false); // Close dialog
    } catch (error) {
      console.error('Failed to add ingredient:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not add ingredient.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateIngredient = async (e: React.FormEvent) => {
     e.preventDefault();
    if (!editingIngredient || !editIngredientName.trim()) {
         toast({ variant: 'destructive', title: 'Error', description: 'Ingredient name cannot be empty.' });
        return;
    };
    setIsProcessing(true);
    try {
      const updated = await updateIngredient(editingIngredient.id, { name: editIngredientName.trim() });
      if (updated) {
        setIngredients((prev) =>
          prev.map((ing) => (ing.id === updated.id ? updated : ing))
        );
        toast({ title: 'Success', description: `Ingredient "${updated.name}" updated.` });
        setEditingIngredient(null); // Close dialog and clear editing state
      } else {
         throw new Error('Update failed in placeholder data.');
      }
    } catch (error) {
      console.error('Failed to update ingredient:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not update ingredient.' });
    } finally {
      setIsProcessing(false);
    }
  };


  const handleDeleteIngredient = async (id: string) => {
    setIsDeleting(id);
    try {
      const success = await deleteIngredient(id);
      if (success) {
        setIngredients((prev) => prev.filter((ing) => ing.id !== id));
        toast({ title: 'Success', description: 'Ingredient deleted.' });
      } else {
         throw new Error('Delete failed in placeholder data.');
      }
    } catch (error) {
      console.error('Failed to delete ingredient:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not delete ingredient.' });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <Card>
       <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Manage Ingredients</CardTitle>
          <CardDescription>
            Add, edit, or remove ingredients used in your recipes.
          </CardDescription>
        </div>
        {/* Add Ingredient Dialog Trigger */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1" onClick={() => setNewIngredientName('')}>
              <PlusCircle className="h-4 w-4" />
              Add Ingredient
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
             <form onSubmit={handleAddIngredient}>
                <DialogHeader>
                <DialogTitle>Add New Ingredient</DialogTitle>
                <DialogDescription>
                    Enter the name for the new ingredient.
                </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                    Name
                    </Label>
                    <Input
                    id="name"
                    value={newIngredientName}
                    onChange={(e) => setNewIngredientName(e.target.value)}
                    className="col-span-3"
                    disabled={isProcessing}
                    />
                </div>
                </div>
                <DialogFooter>
                 <DialogClose asChild>
                        <Button type="button" variant="outline" disabled={isProcessing}>Cancel</Button>
                    </DialogClose>
                <Button type="submit" disabled={isProcessing}>
                    {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Save Ingredient
                </Button>
                </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             {isLoading ? (
                 Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={`skel-ing-${index}`}>
                    <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                    <TableCell>
                        <div className="flex items-center justify-end gap-2">
                            <Skeleton className="h-7 w-7" />
                            <Skeleton className="h-7 w-7" />
                        </div>
                    </TableCell>
                    </TableRow>
                 ))
             ) : ingredients.length > 0 ? (
              ingredients.map((ingredient) => (
                <TableRow key={ingredient.id}>
                  <TableCell className="font-medium">{ingredient.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      {/* Edit Ingredient Dialog Trigger */}
                      <Dialog open={isEditDialogOpen && editingIngredient?.id === ingredient.id} onOpenChange={(open) => {
                          if (!open) setEditingIngredient(null); // Close if dialog is closed externally
                          // If opening, set the editing ingredient (handled by Button click)
                      }}>
                          <DialogTrigger asChild>
                             <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => setEditingIngredient(ingredient)}
                                disabled={!!isDeleting || isProcessing}
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                             {/* Form inside DialogContent */}
                             <form onSubmit={handleUpdateIngredient}>
                                 <DialogHeader>
                                    <DialogTitle>Edit Ingredient</DialogTitle>
                                    <DialogDescription>
                                        Update the name for "{editingIngredient?.name}".
                                    </DialogDescription>
                                 </DialogHeader>
                                 <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="edit-name" className="text-right">
                                        Name
                                        </Label>
                                        <Input
                                        id="edit-name"
                                        value={editIngredientName}
                                        onChange={(e) => setEditIngredientName(e.target.value)}
                                        className="col-span-3"
                                        disabled={isProcessing}
                                        />
                                    </div>
                                 </div>
                                 <DialogFooter>
                                     <DialogClose asChild>
                                         <Button type="button" variant="outline" onClick={() => setEditingIngredient(null)} disabled={isProcessing}>Cancel</Button>
                                     </DialogClose>
                                    <Button type="submit" disabled={isProcessing}>
                                        {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        Save Changes
                                    </Button>
                                 </DialogFooter>
                             </form>
                           </DialogContent>
                      </Dialog>

                      {/* Delete Ingredient Alert Dialog Trigger */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-7 w-7"
                            disabled={isDeleting === ingredient.id || isProcessing}
                          >
                            {isDeleting === ingredient.id ? (
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
                              This action cannot be undone. This will permanently delete the ingredient "{ingredient.name}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel disabled={!!isDeleting}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteIngredient(ingredient.id)}
                              disabled={!!isDeleting}
                              className={buttonVariants({ variant: "destructive" })}
                            >
                              {isDeleting === ingredient.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                              Delete
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
                <TableCell colSpan={2} className="h-24 text-center">
                  No ingredients found. Add one to get started.
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
