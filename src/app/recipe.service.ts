import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  // Using local storage to save favorites between sessions
  // Was going to use a database but this is much simpler for now
  private favoriteRecipes: any[] = [];
  
  constructor(private http: HttpClient) {
    // Load saved favorites when the app starts
    this.loadFavorites();
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
  
  // Load favorites from local storage
  private loadFavorites() {
    const saved = localStorage.getItem('favoriteRecipes');
    // Had an error before when there were no saved recipes
    if (saved) {
      try {
        this.favoriteRecipes = JSON.parse(saved);
      } catch(e) {
        // If parsing fails, just start with empty array
        this.favoriteRecipes = [];
      }
    }
  }
  
  // Save favorites to local storage
  private saveFavorites() {
    localStorage.setItem('favoriteRecipes', JSON.stringify(this.favoriteRecipes));
  }
  
  // Add a recipe to favorites
  addToFavorites(recipe: any) {
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
      this.saveFavorites();
    }
  }
  
  // Remove a recipe from favorites
  removeFromFavorites(recipeId: string) {
    this.favoriteRecipes = this.favoriteRecipes.filter(recipe => recipe.idMeal !== recipeId);
    this.saveFavorites();
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
