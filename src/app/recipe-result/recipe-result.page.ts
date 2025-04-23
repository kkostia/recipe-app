import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { IonicModule } from '@ionic/angular';  
import { CommonModule } from '@angular/common'; 

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

  constructor(private route: ActivatedRoute, private recipeService: RecipeService) {
    // Grab the meal ID from the URL
    this.route.queryParams.subscribe(params => {
      const mealId = params['mealId'];
      
      // Make sure we have something to look up
      if (mealId) {
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
          }
          
          // All done loading
          this.loading = false;
        });
      }
    });
  }
}