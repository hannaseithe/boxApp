import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { Box, Item } from '../app';
import { DbService } from '../db.service';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [NgFor, MatCardModule, MatListModule, MatButtonModule, MatChipsModule, RouterModule],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css'
})
export class ItemComponent {

  id: number | undefined = undefined;
  boxId: number | undefined = undefined;
  item: Item | undefined = undefined;
  box: Box | undefined = undefined;

  route: ActivatedRoute = inject(ActivatedRoute);

  constructor(private data:DbService) {
    if (this.route.snapshot.params['id']) { 
      this.id = Number(this.route.snapshot.params['id']);
     }
     
  }
  ngOnInit(): void {
    if ( this.id ) {this.item = this.data.getItem(this.id) };
    if (this.item) {this.box = this.data.getBox(this.item.boxId) }
  }

}
