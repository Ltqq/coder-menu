
'use client'; // Required for client-side state and interactions

import { useState, useEffect } from 'react';
import type { Metadata } from 'next';
import { Button, buttonVariants } from '@/components/ui/button'; // Import buttonVariants
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getManageableSeasonings, addSeasoning, updateSeasoning, deleteSeasoning } from '@/lib/placeholder-data';
import type { ManageableSeasoning } from '@/lib/types';
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
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from '@/components/ui/skeleton'; // For loading state

// Metadata cannot be used directly in client components easily
// export const metadata: Metadata = {
//   title: 'Manage Seasonings | Admin',
//   description: 'Add, edit, or delete seasonings.',
// };

export default function AdminSeasoningsPage() {
  const [seasonings, setSeasonings] = useState<ManageableSeasoning[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false); // For add/edit actions
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // Track deleting ID
  const [editingSeasoning, setEditingSeasoning] = useState<ManageableSeasoning | null>(null);
  const [newSeasoningName, setNewSeasoningName] = useState('');
  const [editSeasoningName, setEditSeasoningName] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { toast } = useToast();

  // Fetch seasonings on mount
  useEffect(() => {
    async function loadSeasonings() {
      setIsLoading(true);
      try {
        const fetchedSeasonings = await getManageableSeasonings();
        setSeasonings(fetchedSeasonings);
      } catch (error) {
        console.error('Failed to fetch seasonings:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not load seasonings.',
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadSeasonings();
  }, [toast]);

   // Reset edit form when editingSeasoning changes
  useEffect(() => {
    if (editingSeasoning) {
      setEditSeasoningName(editingSeasoning.name);
      setIsEditDialogOpen(true);
    } else {
       setEditSeasoningName('');
       setIsEditDialogOpen(false); // Close dialog if no seasoning is being edited
    }
  }, [editingSeasoning]);

  const handleAddSeasoning = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSeasoningName.trim()) {
       toast({ variant: 'destructive', title: 'Error', description: 'Seasoning name cannot be empty.' });
       return;
    }
    setIsProcessing(true);
    try {
      const added = await addSeasoning({ name: newSeasoningName.trim() });
      setSeasonings((prev) => [...prev, added]);
      toast({ title: 'Success', description: `Seasoning "${added.name}" added.` });
      setNewSeasoningName(''); // Clear input
      setIsAddDialogOpen(false); // Close dialog
    } catch (error) {
      console.error('Failed to add seasoning:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not add seasoning.' });
    } finally {
      setIsProcessing(false);
    }
  };

   const handleUpdateSeasoning = async (e: React.FormEvent) => {
     e.preventDefault();
    if (!editingSeasoning || !editSeasoningName.trim()) {
         toast({ variant: 'destructive', title: 'Error', description: 'Seasoning name cannot be empty.' });
        return;
    };
    setIsProcessing(true);
    try {
      const updated = await updateSeasoning(editingSeasoning.id, { name: editSeasoningName.trim() });
      if (updated) {
        setSeasonings((prev) =>
          prev.map((sea) => (sea.id === updated.id ? updated : sea))
        );
        toast({ title: 'Success', description: `Seasoning "${updated.name}" updated.` });
        setEditingSeasoning(null); // Close dialog and clear editing state
      } else {
         throw new Error('Update failed in placeholder data.');
      }
    } catch (error) {
      console.error('Failed to update seasoning:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not update seasoning.' });
    } finally {
      setIsProcessing(false);
    }
  };


  const handleDeleteSeasoning = async (id: string) => {
    setIsDeleting(id);
    try {
      const success = await deleteSeasoning(id);
      if (success) {
        setSeasonings((prev) => prev.filter((sea) => sea.id !== id));
        toast({ title: 'Success', description: 'Seasoning deleted.' });
      } else {
         throw new Error('Delete failed in placeholder data.');
      }
    } catch (error) {
      console.error('Failed to delete seasoning:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not delete seasoning.' });
    } finally {
      setIsDeleting(null);
    }
  };


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Manage Seasonings</CardTitle>
          <CardDescription>
            Add, edit, or remove seasonings used in your recipes.
          </CardDescription>
        </div>
        {/* Add Seasoning Dialog Trigger */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1" onClick={() => setNewSeasoningName('')}>
              <PlusCircle className="h-4 w-4" />
              Add Seasoning
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleAddSeasoning}>
              <DialogHeader>
                <DialogTitle>Add New Seasoning</DialogTitle>
                <DialogDescription>
                  Enter the name for the new seasoning.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newSeasoningName}
                    onChange={(e) => setNewSeasoningName(e.target.value)}
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
                  Save Seasoning
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
                  <TableRow key={`skel-sea-${index}`}>
                  <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                  <TableCell>
                      <div className="flex items-center justify-end gap-2">
                          <Skeleton className="h-7 w-7" />
                          <Skeleton className="h-7 w-7" />
                      </div>
                  </TableCell>
                  </TableRow>
              ))
            ) : seasonings.length > 0 ? (
              seasonings.map((seasoning) => (
                <TableRow key={seasoning.id}>
                  <TableCell className="font-medium">{seasoning.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                     {/* Edit Seasoning Dialog Trigger */}
                      <Dialog open={isEditDialogOpen && editingSeasoning?.id === seasoning.id} onOpenChange={(open) => {
                          if (!open) setEditingSeasoning(null);
                      }}>
                          <DialogTrigger asChild>
                             <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => setEditingSeasoning(seasoning)}
                                disabled={!!isDeleting || isProcessing}
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                             <form onSubmit={handleUpdateSeasoning}>
                                 <DialogHeader>
                                    <DialogTitle>Edit Seasoning</DialogTitle>
                                    <DialogDescription>
                                        Update the name for "{editingSeasoning?.name}".
                                    </DialogDescription>
                                 </DialogHeader>
                                 <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="edit-name" className="text-right">
                                        Name
                                        </Label>
                                        <Input
                                        id="edit-name"
                                        value={editSeasoningName}
                                        onChange={(e) => setEditSeasoningName(e.target.value)}
                                        className="col-span-3"
                                        disabled={isProcessing}
                                        />
                                    </div>
                                 </div>
                                 <DialogFooter>
                                      <DialogClose asChild>
                                          <Button type="button" variant="outline" onClick={() => setEditingSeasoning(null)} disabled={isProcessing}>Cancel</Button>
                                      </DialogClose>
                                    <Button type="submit" disabled={isProcessing}>
                                        {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        Save Changes
                                    </Button>
                                 </DialogFooter>
                             </form>
                           </DialogContent>
                      </Dialog>

                      {/* Delete Seasoning Alert Dialog Trigger */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-7 w-7"
                            disabled={isDeleting === seasoning.id || isProcessing}
                          >
                            {isDeleting === seasoning.id ? (
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
                              This action cannot be undone. This will permanently delete the seasoning "{seasoning.name}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel disabled={!!isDeleting}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteSeasoning(seasoning.id)}
                              disabled={!!isDeleting}
                              className={buttonVariants({ variant: "destructive" })}
                            >
                              {isDeleting === seasoning.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
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
                   No seasonings found. Add one to get started.
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
