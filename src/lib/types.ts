
export interface Ingredient {
  id: string;
  name: string;
  quantity: string; // e.g., "2", "1 cup", "100g"
}

export interface Seasoning {
  id: string;
  name: string;
  quantity: string; // e.g., "1 tsp", "Pinch", "To taste"
}

export interface RecipeStep {
  step: number;
  description: string;
  imageUrl?: string; // Optional image for a specific step
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  coverImageUrl: string; // For list view
  finishedDishImageUrl: string; // For detail view
  ingredients: Ingredient[];
  seasonings: Seasoning[];
  instructions: RecipeStep[];
  prepTime?: string; // e.g., "15 minutes"
  cookTime?: string; // e.g., "30 minutes"
  servings?: number; // e.g., 4
}

// Types for Admin management (can be extended later)
export interface ManageableIngredient {
  id: string;
  name: string;
  // Add other relevant fields like unit, category, etc. if needed
}

export interface ManageableSeasoning {
  id: string;
  name: string;
  // Add other relevant fields like unit, category, etc. if needed
}
