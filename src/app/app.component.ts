import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BoxListComponent } from './box-list/box-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BoxListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'boxApp';
}
