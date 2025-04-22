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
  imports: [IonicModule, FormsModule],  // all the imports we need
})
export class HomePage {
  ingredient = '';

  constructor(private recipeService: RecipeService, private router: Router) {}

  findRecipe() { // function that will be ran if the button "find recipe" is clicked.
    if (this.ingredient) {
      this.router.navigate(['/recipe-result'], { queryParams: { ingredient: this.ingredient } });
    };
  }
}
