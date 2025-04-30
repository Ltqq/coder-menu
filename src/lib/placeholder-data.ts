
import type { Recipe, ManageableIngredient, ManageableSeasoning } from './types';
import { v4 as uuidv4 } from 'uuid'; // Use uuid for generating unique IDs

// --- Placeholder Data ---
// Using let allows modification for simulation purposes
let placeholderRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Classic Tomato Pasta',
    description: 'A simple yet delicious pasta dish with a rich tomato sauce.',
    coverImageUrl: 'https://picsum.photos/seed/pasta1/400/300',
    finishedDishImageUrl: 'https://picsum.photos/seed/pasta1-finished/600/400',
    ingredients: [
      { id: 'i1', name: 'Pasta (Spaghetti)', quantity: '200g' },
      { id: 'i2', name: 'Canned Tomatoes (Chopped)', quantity: '1 can (400g)' },
      { id: 'i3', name: 'Onion', quantity: '1 medium' },
      { id: 'i4', name: 'Garlic', quantity: '2 cloves' },
    ],
    seasonings: [
      { id: 's1', name: 'Olive Oil', quantity: '2 tbsp' },
      { id: 's2', name: 'Salt', quantity: 'To taste' },
      { id: 's3', name: 'Black Pepper', quantity: 'To taste' },
      { id: 's4', name: 'Dried Oregano', quantity: '1 tsp' },
      { id: 's5', name: 'Sugar', quantity: 'Pinch (optional)' },
    ],
    instructions: [
      { step: 1, description: 'Cook pasta according to package directions. Drain and set aside.' },
      { step: 2, description: 'Finely chop the onion and garlic.' },
      { step: 3, description: 'Heat olive oil in a pan. Sauté onion until softened, then add garlic and cook for another minute until fragrant.' },
      { step: 4, description: 'Add canned tomatoes, oregano, salt, pepper, and a pinch of sugar (if using). Simmer for 15-20 minutes, stirring occasionally.' },
      { step: 5, description: 'Add the cooked pasta to the sauce and toss to combine.' },
      { step: 6, description: 'Serve hot, garnished with fresh basil or parmesan if desired.', imageUrl: 'https://picsum.photos/seed/pasta1-step6/300/200' },
    ],
    prepTime: '10 minutes',
    cookTime: '25 minutes',
    servings: 2,
  },
  {
    id: '2',
    title: 'Simple Chicken Stir-Fry',
    description: 'A quick and healthy stir-fry packed with vegetables and tender chicken.',
    coverImageUrl: 'https://picsum.photos/seed/stirfry2/400/300',
    finishedDishImageUrl: 'https://picsum.photos/seed/stirfry2-finished/600/400',
    ingredients: [
      { id: 'i5', name: 'Chicken Breast', quantity: '1 large' },
      { id: 'i6', name: 'Broccoli Florets', quantity: '1 cup' },
      { id: 'i7', name: 'Bell Pepper (any color)', quantity: '1' },
      { id: 'i3', name: 'Onion', quantity: '1/2 medium' },
      { id: 'i4', name: 'Garlic', quantity: '2 cloves' },
      { id: 'i8', name: 'Carrot', quantity: '1 medium' },
    ],
    seasonings: [
      { id: 's6', name: 'Soy Sauce', quantity: '3 tbsp' },
      { id: 's7', name: 'Sesame Oil', quantity: '1 tsp' },
      { id: 's10', name: 'Vegetable Oil', quantity: '2 tbsp' }, // Corrected ID
      { id: 's8', name: 'Cornstarch', quantity: '1 tbsp' },
      { id: 's9', name: 'Ginger (grated)', quantity: '1 tsp' },
      { id: 's3', name: 'Black Pepper', quantity: 'To taste' },
    ],
    instructions: [
      { step: 1, description: 'Cut chicken into bite-sized pieces. Toss with 1 tbsp soy sauce and cornstarch.' },
      { step: 2, description: 'Chop all vegetables (bell pepper, onion, garlic, carrot).' },
      { step: 3, description: 'Heat 1 tbsp vegetable oil in a wok or large skillet over high heat. Add chicken and stir-fry until cooked through. Remove chicken from wok.' },
      { step: 4, description: 'Add remaining 1 tbsp oil to the wok. Add onion, garlic, and ginger, stir-fry for 30 seconds.' },
      { step: 5, description: 'Add broccoli, bell pepper, and carrot. Stir-fry for 3-5 minutes until tender-crisp.' },
      { step: 6, description: 'Return chicken to the wok. Add remaining 2 tbsp soy sauce and sesame oil. Toss everything together.' },
      { step: 7, description: 'Serve immediately, optionally over rice.', imageUrl: 'https://picsum.photos/seed/stirfry2-step7/300/200'},
    ],
    prepTime: '15 minutes',
    cookTime: '15 minutes',
    servings: 2,
  },
];

let placeholderIngredients: ManageableIngredient[] = [
  { id: 'i1', name: 'Pasta (Spaghetti)' },
  { id: 'i2', name: 'Canned Tomatoes (Chopped)' },
  { id: 'i3', name: 'Onion' },
  { id: 'i4', name: 'Garlic' },
  { id: 'i5', name: 'Chicken Breast' },
  { id: 'i6', name: 'Broccoli Florets' },
  { id: 'i7', name: 'Bell Pepper (any color)' },
  { id: 'i8', name: 'Carrot' },
];

let placeholderSeasonings: ManageableSeasoning[] = [
  { id: 's1', name: 'Olive Oil' },
  { id: 's2', name: 'Salt' },
  { id: 's3', name: 'Black Pepper' },
  { id: 's4', name: 'Dried Oregano' },
  { id: 's5', name: 'Sugar' },
  { id: 's6', name: 'Soy Sauce' },
  { id: 's7', name: 'Sesame Oil' },
  { id: 's8', name: 'Cornstarch' },
  { id: 's9', name: 'Ginger (grated)' },
  { id: 's10', name: 'Vegetable Oil'},
];

const simulateDelay = (ms: number = 50) => new Promise(resolve => setTimeout(resolve, ms));

// --- Simulate fetching data ---
export const getRecipes = async (): Promise<Recipe[]> => {
  await simulateDelay();
  return placeholderRecipes;
};

export const getRecipeById = async (id: string): Promise<Recipe | undefined> => {
  await simulateDelay();
  return placeholderRecipes.find(recipe => recipe.id === id);
};

export const getManageableIngredients = async (): Promise<ManageableIngredient[]> => {
    await simulateDelay();
    return placeholderIngredients;
}

export const getManageableSeasonings = async (): Promise<ManageableSeasoning[]> => {
    await simulateDelay();
    return placeholderSeasonings;
}

export const getIngredientById = async (id: string): Promise<ManageableIngredient | undefined> => {
    await simulateDelay();
    return placeholderIngredients.find(ing => ing.id === id);
}

export const getSeasoningById = async (id: string): Promise<ManageableSeasoning | undefined> => {
    await simulateDelay();
    return placeholderSeasonings.find(seas => seas.id === id);
}


// --- Simulate CRUD Operations ---

// Recipes
export const addRecipe = async (recipeData: Omit<Recipe, 'id'>): Promise<Recipe> => {
    await simulateDelay(100); // Simulate DB insert time
    const newRecipe: Recipe = {
        ...recipeData,
        id: uuidv4(), // Generate a unique ID
        // Ensure nested items also get unique IDs if they don't have them
        ingredients: recipeData.ingredients.map(ing => ({ ...ing, id: ing.id || uuidv4() })),
        seasonings: recipeData.seasonings.map(sea => ({ ...sea, id: sea.id || uuidv4() })),
        // Step number is already present
    };
    placeholderRecipes.push(newRecipe);
    console.log('Added Recipe (Simulated):', newRecipe);
    return newRecipe;
};

export const updateRecipe = async (id: string, updatedData: Partial<Omit<Recipe, 'id'>>): Promise<Recipe | undefined> => {
    await simulateDelay(100);
    const recipeIndex = placeholderRecipes.findIndex(recipe => recipe.id === id);
    if (recipeIndex === -1) {
        console.log('Update Recipe Failed (Simulated): Not Found');
        return undefined;
    }
    // Simple merge, real update might need more complex logic
    const updatedRecipe = {
        ...placeholderRecipes[recipeIndex],
        ...updatedData,
        // Ensure nested items retain IDs or get new ones if added
         ingredients: updatedData.ingredients?.map(ing => ({ ...ing, id: ing.id || uuidv4() })) || placeholderRecipes[recipeIndex].ingredients,
         seasonings: updatedData.seasonings?.map(sea => ({ ...sea, id: sea.id || uuidv4() })) || placeholderRecipes[recipeIndex].seasonings,
    };
    placeholderRecipes[recipeIndex] = updatedRecipe;
    console.log('Updated Recipe (Simulated):', updatedRecipe);
    return updatedRecipe;
};

export const deleteRecipe = async (id: string): Promise<boolean> => {
    await simulateDelay(100);
    const initialLength = placeholderRecipes.length;
    placeholderRecipes = placeholderRecipes.filter(recipe => recipe.id !== id);
    const success = placeholderRecipes.length < initialLength;
    console.log(`Delete Recipe ${id} (Simulated): ${success ? 'Success' : 'Failed'}`);
    return success;
};

// Ingredients
export const addIngredient = async (ingredientData: Omit<ManageableIngredient, 'id'>): Promise<ManageableIngredient> => {
    await simulateDelay();
    const newIngredient: ManageableIngredient = {
        ...ingredientData,
        id: uuidv4(),
    };
    placeholderIngredients.push(newIngredient);
    console.log('Added Ingredient (Simulated):', newIngredient);
    return newIngredient;
};

export const updateIngredient = async (id: string, updatedData: Partial<Omit<ManageableIngredient, 'id'>>): Promise<ManageableIngredient | undefined> => {
    await simulateDelay();
    const index = placeholderIngredients.findIndex(ing => ing.id === id);
    if (index === -1) return undefined;
    placeholderIngredients[index] = { ...placeholderIngredients[index], ...updatedData };
    console.log('Updated Ingredient (Simulated):', placeholderIngredients[index]);
    return placeholderIngredients[index];
};

export const deleteIngredient = async (id: string): Promise<boolean> => {
    await simulateDelay();
    const initialLength = placeholderIngredients.length;
    placeholderIngredients = placeholderIngredients.filter(ing => ing.id !== id);
    const success = placeholderIngredients.length < initialLength;
     console.log(`Delete Ingredient ${id} (Simulated): ${success ? 'Success' : 'Failed'}`);
    return success;
};

// Seasonings
export const addSeasoning = async (seasoningData: Omit<ManageableSeasoning, 'id'>): Promise<ManageableSeasoning> => {
    await simulateDelay();
    const newSeasoning: ManageableSeasoning = {
        ...seasoningData,
        id: uuidv4(),
    };
    placeholderSeasonings.push(newSeasoning);
     console.log('Added Seasoning (Simulated):', newSeasoning);
    return newSeasoning;
};

export const updateSeasoning = async (id: string, updatedData: Partial<Omit<ManageableSeasoning, 'id'>>): Promise<ManageableSeasoning | undefined> => {
    await simulateDelay();
    const index = placeholderSeasonings.findIndex(sea => sea.id === id);
    if (index === -1) return undefined;
    placeholderSeasonings[index] = { ...placeholderSeasonings[index], ...updatedData };
    console.log('Updated Seasoning (Simulated):', placeholderSeasonings[index]);
    return placeholderSeasonings[index];
};

export const deleteSeasoning = async (id: string): Promise<boolean> => {
    await simulateDelay();
    const initialLength = placeholderSeasonings.length;
    placeholderSeasonings = placeholderSeasonings.filter(sea => sea.id !== id);
    const success = placeholderSeasonings.length < initialLength;
     console.log(`Delete Seasoning ${id} (Simulated): ${success ? 'Success' : 'Failed'}`);
    return success;
};
