import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { IonicModule, ToastController } from '@ionic/angular';  
import { CommonModule } from '@angular/common'; 
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-recipe-result',
  standalone: true,
  templateUrl: './recipe-result.page.html',
  styleUrls: ['./recipe-result.page.scss'],
  imports: [IonicModule, CommonModule],  // Needed for our HTML template
})
export class RecipeResultPage {
  // Main variables
  recipe: any = null;         // Where we'll store all the recipe data
  ingredients: string[] = []; // List of ingredients with measurements
  loading = true;             // Used for the loading spinner
  currentIngredient = '';     // Need to remember this for "another recipe" button
  allRecipeIds: string[] = []; // All recipe IDs for the ingredient
  usedRecipeIds: string[] = []; // Keeping track of recipes we've already shown

  constructor(
    private route: ActivatedRoute, 
    private recipeService: RecipeService,
    private toastController: ToastController
  ) {
    // Grab the meal ID from the URL
    this.route.queryParams.subscribe(params => {
      const mealId = params['mealId'];
      this.currentIngredient = params['ingredient'];
      
      // Make sure we have something to look up
      if (mealId) {
        // Remember this recipe ID so we don't show it again
        this.usedRecipeIds.push(mealId);
        this.loadRecipe(mealId);
        
        // Load all recipes for this ingredient for the "another recipe" button
        if (this.currentIngredient) {
          this.loadAllRecipesForIngredient();
        }
      }
    });
  }
  
  // Moved this to its own function so we can reuse it
  loadRecipe(mealId: string) {
    // Show the user we're loading
    this.loading = true;
    
    // Look up the full recipe details
    this.recipeService.getRecipeDetailsById(mealId).subscribe(res => {
      // Got the recipe data!
      this.recipe = res.meals?.[0];
      this.ingredients = [];
      
      // If we found a valid recipe, process the ingredients
      if (this.recipe) {
        // The API is weird - ingredients are numbered 1-20
        // Had to loop through them to make a proper list
        for (let i = 1; i <= 20; i++) {
          const ingredient = this.recipe[`strIngredient${i}`];
          const measure = this.recipe[`strMeasure${i}`];
          
          // Skip empty ingredients
          if (ingredient && ingredient.trim()) {
            this.ingredients.push(`${measure?.trim() ?? ''} ${ingredient.trim()}`.trim());
          }
        }
        
        // Save ingredient for "another recipe" feature
        if (!this.currentIngredient && this.recipe.strIngredient1) {
          this.currentIngredient = this.recipe.strIngredient1;
          this.loadAllRecipesForIngredient();
        }
      }
      
      // All done loading
      this.loading = false;
    });
  }
  
  // Gets all recipes for an ingredient so we can pick random ones
  loadAllRecipesForIngredient() {
    this.recipeService.getRecipesByIngredient(this.currentIngredient).subscribe(res => {
      if (res.meals && res.meals.length > 0) {
        // Save all the meal IDs
        this.allRecipeIds = res.meals.map((meal: any) => meal.idMeal);
      }
    });
  }
  
  // For the "another recipe" button - shows a different recipe with same ingredient
  showAnotherRecipe() {
    // Don't do anything if we're already loading or have no options
    if (this.loading || this.allRecipeIds.length === 0) {
      return;
    }
    
    // Filter out recipes we've already shown
    let unusedRecipes = this.allRecipeIds.filter(id => !this.usedRecipeIds.includes(id));
    
    // If we've shown all recipes, start over
    if (unusedRecipes.length === 0) {
      // Keep only the current recipe as used
      const currentId = this.usedRecipeIds[this.usedRecipeIds.length - 1];
      this.usedRecipeIds = [currentId];
      // Now all recipes except current one are available again
      unusedRecipes = this.allRecipeIds.filter(id => !this.usedRecipeIds.includes(id));
    }
    
    // Pick a random recipe from the unused ones
    if (unusedRecipes.length > 0) {
      const randomIndex = Math.floor(Math.random() * unusedRecipes.length);
      const newRecipeId = unusedRecipes[randomIndex];
      
      // Remember that we've used this recipe
      this.usedRecipeIds.push(newRecipeId);
      
      // Load the new recipe
      this.loadRecipe(newRecipeId);
    }
  }
  
  // Favorites functionality
  
  // Checks if the current recipe is in favorites
  isFavorite(): boolean {
    // Sometimes the recipe isn't loaded yet
    if (!this.recipe) return false;
    return this.recipeService.isFavorite(this.recipe.idMeal);
  }
  
  // Toggles favorite status
  toggleFavorite() {
    if (!this.recipe) return;
    
    // If it's already a favorite, remove it
    if (this.isFavorite()) {
      this.recipeService.removeFromFavorites(this.recipe.idMeal);
    } else {
      // Otherwise add it to favorites
      this.recipeService.addToFavorites(this.recipe);
    }
  }
  
  // Share recipe using Capacitor Share plugin
  async shareRecipe() {
    if (!this.recipe) return;
    
    // Format ingredients as a list
    const ingredientsList = this.ingredients.map(item => `- ${item}`).join('\n');
    
    // Create shareable content
    const shareText = `Check out this recipe for ${this.recipe.strMeal}!\n\n` +
      `Ingredients:\n${ingredientsList}\n\n` +
      `Instructions:\n${this.recipe.strInstructions}\n\n` +
      `Shared from Recipe Finder App`;
    
    await Share.share({
      title: `Recipe: ${this.recipe.strMeal}`,
      text: shareText,
      dialogTitle: 'Share this recipe'
    });
    
    this.showSuccess('Recipe shared successfully!');
  }
  
  // Show a success message to the user
  async showSuccess(message: string) {
    const successMessage = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: 'dark',
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    });
    
    await successMessage.present();
  }
}