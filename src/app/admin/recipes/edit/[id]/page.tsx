
'use client'; // Required for form handling and client-side state

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter, useParams } from 'next/navigation'; // Use App Router's router and params
import { useState, useEffect } from 'react'; // Import useState and useEffect

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Trash2, Upload, Loader2 } from 'lucide-react'; // Import Loader2
import { useToast } from "@/hooks/use-toast";
import { updateRecipe, getRecipeById, getManageableSeasonings } from "@/lib/placeholder-data"; // Import functions
import type { Recipe, ManageableSeasoning } from '@/lib/types'; // Import types
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import Select components
import { Skeleton } from "@/components/ui/skeleton"; // For loading state

// --- Zod Schema Definition (Reused from Add Recipe) ---

const IngredientSchema = z.object({
    name: z.string().min(1, "Ingredient name cannot be empty."),
    quantity: z.string().min(1, "Quantity cannot be empty."),
    id: z.string().optional(), // ID is important for existing items
});

const SeasoningSchema = z.object({
    name: z.string().min(1, "Please select a seasoning."), // Updated validation message
    quantity: z.string().min(1, "Quantity cannot be empty."),
    id: z.string().optional(), // ID is important
});

const RecipeStepSchema = z.object({
    description: z.string().min(5, "Step description must be at least 5 characters."),
    imageUrl: z.string().url().optional().or(z.literal("")), // Allow empty string or valid URL
    step: z.number().int().positive().optional(), // Keep step optional here, will be set on submit
});

const RecipeFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters.").max(100),
  description: z.string().min(10, "Description must be at least 10 characters.").max(500),
  coverImageUrl: z.string().min(1, "Cover Image URL is required.").url("Must be a valid URL."), // Basic URL validation
  finishedDishImageUrl: z.string().min(1, "Finished Dish Image URL is required.").url("Must be a valid URL."),
  prepTime: z.string().optional(),
  cookTime: z.string().optional(),
  servings: z.coerce.number().int().positive().optional().nullable(), // Ensure it's a positive integer or null/undefined
  ingredients: z.array(IngredientSchema).min(1, "At least one ingredient is required."),
  seasonings: z.array(SeasoningSchema).min(1, "At least one seasoning is required."),
  instructions: z.array(RecipeStepSchema).min(1, "At least one instruction step is required."),
});

type RecipeFormValues = z.infer<typeof RecipeFormSchema>;

// --- Component ---

export default function EditRecipePage() {
  const router = useRouter();
  const params = useParams();
  const recipeId = params.id as string; // Get recipe ID from URL
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true); // Loading state for recipe data
  const [availableSeasonings, setAvailableSeasonings] = useState<ManageableSeasoning[]>([]);
  const [isLoadingSeasonings, setIsLoadingSeasonings] = useState(true);

  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(RecipeFormSchema),
    defaultValues: async () => { // Use async defaultValues to fetch data
      setIsLoading(true);
      try {
        const recipe = await getRecipeById(recipeId);
        if (!recipe) {
          toast({ variant: "destructive", title: "Error", description: "Recipe not found." });
          router.push('/admin/recipes'); // Redirect if not found
          return {}; // Return empty object to avoid form errors before redirect
        }
        return {
            ...recipe,
            servings: recipe.servings || undefined, // Handle potential null/undefined
            // Ensure instructions have optional imageUrl set correctly for the form
            instructions: recipe.instructions.map(instr => ({
                ...instr,
                imageUrl: instr.imageUrl || "", // Use empty string for form if undefined
            })),
        };
      } catch (error) {
        console.error("Failed to fetch recipe:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not load recipe data." });
        router.push('/admin/recipes');
        return {};
      } finally {
        setIsLoading(false);
      }
    },
    mode: "onChange", // Validate on change
  });

 const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

 const { fields: seasoningFields, append: appendSeasoning, remove: removeSeasoning } = useFieldArray({
    control: form.control,
    name: "seasonings",
  });

 const { fields: instructionFields, append: appendInstruction, remove: removeInstruction } = useFieldArray({
    control: form.control,
    name: "instructions",
  });

  // Fetch available seasonings on mount
  useEffect(() => {
    async function loadSeasonings() {
      setIsLoadingSeasonings(true);
      try {
        const fetchedSeasonings = await getManageableSeasonings();
        setAvailableSeasonings(fetchedSeasonings);
      } catch (error) {
        console.error("Failed to fetch seasonings:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load seasonings for selection.",
        });
      } finally {
        setIsLoadingSeasonings(false);
      }
    }
    loadSeasonings();
  }, [toast]);


  // --- Server Action (Using Simulated Placeholder) ---
  async function onSubmit(data: RecipeFormValues) {
     console.log("Form Submitted for Update:", data); // Log data for debugging

     // Add/update step numbers to instructions
     const instructionsWithSteps = data.instructions.map((instr, index) => ({
         ...instr,
         step: index + 1,
         // Ensure imageUrl is either a valid URL or undefined, not an empty string for the type
         imageUrl: instr.imageUrl || undefined,
     }));

     // Prepare data for the updateRecipe function
     // No need to strip IDs here, update function expects them for nested items if they exist
     const recipePayload = {
         ...data,
         instructions: instructionsWithSteps,
         servings: data.servings || undefined, // Ensure servings is number or undefined
     };


    try {
        // --- Use the simulated updateRecipe function ---
        const updatedRecipe = await updateRecipe(recipeId, recipePayload);
        if (!updatedRecipe) {
            throw new Error("Update returned undefined");
        }
        console.log("Recipe updated (Simulated): ", updatedRecipe);
        toast({ title: "Success", description: "Recipe updated successfully!" });
        router.push('/admin/recipes'); // Redirect on success
    } catch (e) {
        console.error("Error updating recipe (Simulated): ", e);
        toast({ variant: "destructive", title: "Error", description: "Failed to update recipe." });
    }
  }

  if (isLoading) {
     return (
         <Card>
             <CardHeader>
                 <Skeleton className="h-8 w-3/4" />
                 <Skeleton className="h-4 w-1/2" />
             </CardHeader>
             <CardContent className="space-y-8">
                 {/* Basic Info Skeletons */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <Skeleton className="h-10 w-full" />
                     <Skeleton className="h-10 w-full" />
                     <Skeleton className="h-24 w-full md:col-span-2" />
                     <Skeleton className="h-10 w-full" />
                     <Skeleton className="h-10 w-full" />
                 </div>
                 <Separator />
                 {/* Ingredient Skeletons */}
                 <div>
                     <Skeleton className="h-6 w-1/4 mb-4" />
                     <div className="flex items-end gap-4 mb-4 p-4 border rounded-md bg-muted/50">
                         <Skeleton className="h-10 flex-1" />
                         <Skeleton className="h-10 w-1/3" />
                         <Skeleton className="h-9 w-9" />
                     </div>
                 </div>
                 <Separator />
                 {/* Seasoning Skeletons */}
                 <div>
                     <Skeleton className="h-6 w-1/4 mb-4" />
                     <div className="flex items-end gap-4 mb-4 p-4 border rounded-md bg-muted/50">
                         <Skeleton className="h-10 flex-1" />
                         <Skeleton className="h-10 w-1/3" />
                         <Skeleton className="h-9 w-9" />
                     </div>
                 </div>
                 <Separator />
                 {/* Instruction Skeletons */}
                 <div>
                    <Skeleton className="h-6 w-1/4 mb-4" />
                     <div className="flex items-start gap-4 mb-4 p-4 border rounded-md bg-muted/50">
                         <Skeleton className="h-6 w-6 rounded-full flex-shrink-0 mt-2.5" />
                         <div className="flex-grow space-y-2">
                             <Skeleton className="h-20 w-full" />
                             <Skeleton className="h-10 w-full" />
                         </div>
                         <Skeleton className="h-9 w-9 mt-2.5" />
                     </div>
                 </div>
                 {/* Button Skeleton */}
                 <div className="flex justify-end gap-2 pt-4">
                     <Skeleton className="h-10 w-20" />
                     <Skeleton className="h-10 w-24" />
                 </div>
             </CardContent>
         </Card>
     );
  }


  return (
    <Card>
        <CardHeader>
            <CardTitle>Edit Recipe: {form.getValues("title")}</CardTitle>
            <CardDescription>Update the details for this recipe.</CardDescription>
        </CardHeader>
        <CardContent>
             <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                 {/* --- Basic Info --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                            <Input placeholder="E.g., Classic Tomato Pasta" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField // Prep Time, Cook Time, Servings in one row for larger screens
                    control={form.control}
                    name="servings" // Link to servings field
                    render={({ field: servingsField }) => (
                         <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="prepTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Prep Time</FormLabel>
                                        <FormControl><Input placeholder="15 mins" {...field} value={field.value ?? ""} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                             />
                             <FormField
                                control={form.control}
                                name="cookTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cook Time</FormLabel>
                                        <FormControl><Input placeholder="30 mins" {...field} value={field.value ?? ""} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                             />
                            <FormItem>
                                <FormLabel>Servings</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="E.g., 4" {...servingsField} value={servingsField.value ?? ""} onChange={e => servingsField.onChange(e.target.value === '' ? null : parseInt(e.target.value))} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                         </div>
                     )}
                    />

                     <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                placeholder="A brief summary of the recipe..."
                                className="resize-y min-h-[100px]"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                    <FormField
                        control={form.control}
                        name="coverImageUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cover Image URL</FormLabel>
                                <FormControl>
                                    <div className="flex gap-2 items-center">
                                        <Input placeholder="https://..." {...field} />
                                        <Button type="button" variant="outline" size="icon" disabled>
                                            <Upload className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormDescription>URL for the image shown in the recipe list.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                     />
                    <FormField
                        control={form.control}
                        name="finishedDishImageUrl"
                        render={({ field }) => (
                             <FormItem>
                                <FormLabel>Finished Dish Image URL</FormLabel>
                                <FormControl>
                                    <div className="flex gap-2 items-center">
                                        <Input placeholder="https://..." {...field} />
                                         <Button type="button" variant="outline" size="icon" disabled>
                                            <Upload className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </FormControl>
                                 <FormDescription>URL for the main image on the recipe page.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                 <Separator />

                {/* --- Ingredients --- */}
                 <div>
                    <h3 className="text-lg font-medium mb-4">Ingredients</h3>
                    {ingredientFields.map((field, index) => (
                    <div key={field.id} className="flex items-end gap-4 mb-4 p-4 border rounded-md bg-muted/50">
                        <FormField
                        control={form.control}
                        name={`ingredients.${index}.name`}
                        render={({ field }) => (
                            <FormItem className="flex-1">
                             {index === 0 && <FormLabel>Name</FormLabel>}
                            <FormControl>
                                <Input placeholder="E.g., Flour" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name={`ingredients.${index}.quantity`}
                        render={({ field }) => (
                             <FormItem className="w-1/3">
                             {index === 0 && <FormLabel>Quantity</FormLabel>}
                            <FormControl>
                                <Input placeholder="E.g., 2 cups or 250g" {...field} />
                            </FormControl>
                             <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button
                         type="button"
                         variant="destructive"
                         size="icon"
                         onClick={() => removeIngredient(index)}
                         disabled={ingredientFields.length <= 1} // Disable removing the last one
                         className="h-9 w-9"
                         aria-label="Remove Ingredient"
                        >
                         <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                    ))}
                     <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendIngredient({ name: "", quantity: "" })}
                         className="mt-2"
                    >
                         <PlusCircle className="mr-2 h-4 w-4" /> Add Ingredient
                    </Button>
                 </div>

                 <Separator />

                 {/* --- Seasonings --- */}
                <div>
                    <h3 className="text-lg font-medium mb-4">Seasonings</h3>
                     {isLoadingSeasonings ? (
                         <div className="flex items-end gap-4 mb-4 p-4 border rounded-md bg-muted/50">
                             <div className="flex-1 space-y-2">
                                <Skeleton className="h-5 w-1/4" />
                                <Skeleton className="h-9 w-full" />
                             </div>
                              <div className="w-1/3 space-y-2">
                                 <Skeleton className="h-5 w-1/3" />
                                <Skeleton className="h-9 w-full" />
                             </div>
                             <Skeleton className="h-9 w-9" />
                         </div>
                    ) : (
                        seasoningFields.map((field, index) => (
                             <div key={field.id} className="flex items-end gap-4 mb-4 p-4 border rounded-md bg-muted/50">
                                <FormField
                                control={form.control}
                                name={`seasonings.${index}.name`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                    {index === 0 && <FormLabel>Name</FormLabel>}
                                    <Select onValueChange={field.onChange} value={field.value}> {/* Ensure value prop is set */}
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a seasoning" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                        {availableSeasonings.map((sea) => (
                                            <SelectItem key={sea.id} value={sea.name}>
                                            {sea.name}
                                            </SelectItem>
                                        ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`seasonings.${index}.quantity`}
                                    render={({ field }) => (
                                    <FormItem className="w-1/3">
                                        {index === 0 && <FormLabel>Quantity</FormLabel>}
                                        <FormControl>
                                            <Input placeholder="E.g., 1 tsp or To taste" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => removeSeasoning(index)}
                                disabled={seasoningFields.length <= 1}
                                className="h-9 w-9"
                                aria-label="Remove Seasoning"
                                >
                                <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))
                    )}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendSeasoning({ name: "", quantity: "" })} // Append with empty name initially
                        className="mt-2"
                        disabled={isLoadingSeasonings}
                    >
                        {isLoadingSeasonings ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <PlusCircle className="mr-2 h-4 w-4" />
                        )}
                         Add Seasoning
                    </Button>
                    {availableSeasonings.length === 0 && !isLoadingSeasonings && (
                        <p className="text-sm text-muted-foreground mt-2">
                            No seasonings found. Please <a href="/admin/seasonings" className="underline">manage seasonings</a> first.
                        </p>
                    )}
                </div>

                <Separator />

                {/* --- Instructions --- */}
                 <div>
                    <h3 className="text-lg font-medium mb-4">Instructions</h3>
                    {instructionFields.map((field, index) => (
                        <div key={field.id} className="flex items-start gap-4 mb-4 p-4 border rounded-md bg-muted/50">
                             <span className="flex-shrink-0 mt-2.5 inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                                {index + 1}
                             </span>
                            <div className="flex-grow space-y-2">
                                <FormField
                                control={form.control}
                                name={`instructions.${index}.description`}
                                render={({ field }) => (
                                    <FormItem>
                                     {index === 0 && <FormLabel>Step Description</FormLabel>}
                                    <FormControl>
                                        <Textarea placeholder="Describe this step..." {...field} className="min-h-[80px]"/>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                 <FormField
                                    control={form.control}
                                    name={`instructions.${index}.imageUrl`}
                                    render={({ field }) => (
                                        <FormItem>
                                         {index === 0 && <FormLabel>Optional Image URL</FormLabel>}
                                        <FormControl>
                                           <div className="flex gap-2 items-center">
                                                <Input type="url" placeholder="https://... (optional)" {...field} value={field.value ?? ""} />
                                                 <Button type="button" variant="outline" size="icon" disabled>
                                                    <Upload className="h-4 w-4" />
                                                </Button>
                                           </div>
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => removeInstruction(index)}
                                disabled={instructionFields.length <= 1}
                                className="h-9 w-9 mt-2.5" // Align button nicely
                                aria-label="Remove Step"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                     <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendInstruction({ description: "", imageUrl: "" })}
                    className="mt-2"
                    >
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Step
                    </Button>
                 </div>

                 <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => router.back()} disabled={form.formState.isSubmitting}>Cancel</Button>
                    <Button type="submit" disabled={form.formState.isSubmitting || isLoadingSeasonings || isLoading}>
                        {form.formState.isSubmitting ? (
                             <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Update Recipe"
                         )}
                    </Button>
                 </div>
                </form>
            </Form>
        </CardContent>
    </Card>
  );
}
