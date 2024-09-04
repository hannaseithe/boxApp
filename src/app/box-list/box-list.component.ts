import { Component } from '@angular/core';
import { DbService } from '../db.service';
import { Box } from '../app';
import { NgFor, NgIf } from '@angular/common';
import { BoxComponent } from '../box/box.component';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-box-list',
  standalone: true,
  imports: [NgFor, NgIf, BoxComponent, MatCardModule, 
    MatButtonModule,
    RouterModule],
  templateUrl: './box-list.component.html',
  styleUrl: './box-list.component.css'
})
export class BoxListComponent {
  public boxes:Box[] = [];
  constructor(private data:DbService){}
  ngOnInit(): void {
   this.boxes = this.data.getBoxes()
  }

  public clearStorage(event: Event) {
    this.data.clearStorage()
  }

  public initStorage(event: Event) {
    this.data.init()
  }
}
