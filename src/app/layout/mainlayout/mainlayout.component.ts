import { Component } from '@angular/core';
import { NavbarComponent } from '../../sharred/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-mainlayout',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './mainlayout.component.html',
  styleUrl: './mainlayout.component.css',
})
export class MainlayoutComponent {
  
}
