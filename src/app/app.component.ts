import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BoxListComponent } from './box-list/box-list.component';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BoxListComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'boxApp';
}
