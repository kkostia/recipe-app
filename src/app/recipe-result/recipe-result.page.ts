import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';  
import { CommonModule } from '@angular/common'; 
@Component({
  selector: 'app-recipe-result',
  standalone: true,
  templateUrl: './recipe-result.page.html',
  styleUrls: ['./recipe-result.page.scss'],
  imports: [IonicModule, CommonModule],  // all the imports we need
})
export class RecipeResultPage {
  recipe: any; // declaring variable

  constructor(private router: Router) {
    // if the data is available, it will assign it to the recipe variable
    this.recipe = this.router.getCurrentNavigation()?.extras?.state?.['recipe'];
  }
}
