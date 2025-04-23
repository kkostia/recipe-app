import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../recipe.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorites',
  standalone: true,
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  imports: [IonicModule, CommonModule]
})
export class FavoritesPage {
  // Get favorites from the service
  get favorites() {
    return this.recipeService.getFavorites();
  }
  
  constructor(private recipeService: RecipeService, private router: Router) {
    // Didn't need any initialization here
  }
  
  // Format the date to look nicer
  formatDate(dateString: string): string {
    // Convert ISO string
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
  
  // Open the recipe details
  openRecipe(recipeId: string) {
    this.router.navigate(['/recipe-result'], { queryParams: { mealId: recipeId } });
  }
  
  // Remove from favorites 
  removeFromFavorites(event: Event, recipeId: string) {
    this.recipeService.removeFromFavorites(recipeId);
  }
  
  goToHomePage() {
    this.router.navigate(['/']);
  }
} 