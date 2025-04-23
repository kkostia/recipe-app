import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  constructor(private http: HttpClient) {}

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
  
  // Got this working finally - needed for the "another recipe" feature
  // Returns a random recipe based on the same ingredient
  getRandomRecipeForIngredient(ingredient: string, currentId: string): Observable<any> {
    // Same endpoint as before, but we'll handle the random selection in the component
    return this.http.get(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
  }
}
