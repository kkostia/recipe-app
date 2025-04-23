import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [IonicModule, RouterOutlet, RouterModule, CommonModule],
})
export class AppComponent {
  constructor() { }
}
