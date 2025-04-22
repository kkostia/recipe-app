import { Routes } from '@angular/router'; // import route
import { HomePage } from './home/home.page'; // import of home page
import { RecipeResultPage } from './recipe-result/recipe-result.page'; // import of recipe-result page

export const appRoutes: Routes = [  
  { path: '', component: HomePage }, // setting up default path
  { path: 'recipe-result', component: RecipeResultPage }, // setting up path to recipe-result
];
