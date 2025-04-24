import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  // Using Ionic Storage to save favorites between sessions
  private favoriteRecipes: any[] = [];
  private storageReady = false;
  
  constructor(private http: HttpClient, private storage: Storage) {
    // Initialize storage and load saved favorites when the app starts
    this.initStorage();
  }

  // Initialize the storage
  async initStorage() {
    await this.storage.create();
    this.storageReady = true;
    await this.loadFavorites();
  }

  // This function searches for meals by ingredient
  // I'm using the filter API endpoint since we just need the basic info first
  getRecipesByIngredient(ingredient: string): Observable<any> {
    return this.http.get(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
  }

  // After finding a recipe, we need the full details
  // The lookup endpoint gives us ingredients, instructions, etc.
  getRecipeDetailsById(id: string): Observable<any> {
    return this.http.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  }
  
  // Favorites functionality
  
  // Load favorites from storage
  private async loadFavorites() {
    if (!this.storageReady) await this.initStorage();
    
    const saved = await this.storage.get('favoriteRecipes');
    // Had an error before when there were no saved recipes
    if (saved) {
      try {
        this.favoriteRecipes = saved;
      } catch(e) {
        // If there's an error, just start with empty array
        this.favoriteRecipes = [];
      }
    }
  }
  
  // Save favorites to storage
  private async saveFavorites() {
    if (!this.storageReady) await this.initStorage();
    await this.storage.set('favoriteRecipes', this.favoriteRecipes);
  }
  
  // Add a recipe to favorites
  async addToFavorites(recipe: any) {
    // Make sure we don't add duplicates
    if (!this.isFavorite(recipe.idMeal)) {
      // Just saving the fields we need to show in favorites list
      const favoriteRecipe = {
        idMeal: recipe.idMeal,
        strMeal: recipe.strMeal,
        strMealThumb: recipe.strMealThumb,
        dateAdded: new Date().toISOString() // Might use this later to sort by newest
      };
      this.favoriteRecipes.push(favoriteRecipe);
      await this.saveFavorites();
    }
  }
  
  // Remove a recipe from favorites
  async removeFromFavorites(recipeId: string) {
    this.favoriteRecipes = this.favoriteRecipes.filter(recipe => recipe.idMeal !== recipeId);
    await this.saveFavorites();
  }
  
  // Check if a recipe is in favorites
  isFavorite(recipeId: string): boolean {
    return this.favoriteRecipes.some(recipe => recipe.idMeal === recipeId);
  }
  
  // Get all favorite recipes
  getFavorites(): any[] {
    return this.favoriteRecipes;
  }
}
