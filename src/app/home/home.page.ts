import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [IonicModule, FormsModule], // Needed for the page to work
})
export class HomePage {
  // Storing what the user types in the search box
  ingredient = '';

  constructor(private recipeService: RecipeService, private router: Router) {}

  // Gets called when the search button is clicked
  findRecipe() {
    // First we need to find recipes that match the ingredient
    this.recipeService.getRecipesByIngredient(this.ingredient).subscribe(res => {
      // If we found some recipes
      if (res.meals && res.meals.length > 0) {
        // Grab the first recipe's ID 
        const mealId = res.meals[0].idMeal;
        
        // Go to the details page and send the ID along
        this.router.navigate(['/recipe-result'], { queryParams: { mealId: mealId } });
      } else {
        // Let the user know if we couldn't find anything
        alert('No recipes found for this ingredient. Please try another ingredient.');
      }
    });
  }
}
