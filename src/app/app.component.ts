import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [IonicModule, RouterOutlet, RouterModule], // all the imports we need
})
export class AppComponent {}
