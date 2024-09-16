import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { Box, Item, uniqueId } from '../app';
import { DbService } from '../db.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [
    NgFor, NgIf, 
    MatCardModule, 
    MatListModule, 
    MatButtonModule, 
    MatChipsModule, 
    MatFormFieldModule,
    MatIconModule,
    RouterModule, 
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css'
})
export class ItemComponent {

  id: uniqueId | undefined = undefined;
  boxId: number | undefined = undefined;
  item: Item | undefined = undefined;
  box: Box | undefined = undefined;

  route: ActivatedRoute = inject(ActivatedRoute);

  constructor(private data:DbService,
    private router: Router
  ) {
    if (this.route.snapshot.params['id']) { 
      this.id = this.route.snapshot.params['id'];
     }
     
  }
  ngOnInit(): void {
    if ( this.id ) {this.item = this.data.getItem(this.id) };
    if (this.item) {this.box = this.data.getBox(this.item.boxID) }
  }

  deleteItem(): void {
    this.data.deleteItem(this.item?.id as uniqueId)
    this.router.navigateByUrl('/box/'+this.item?.boxID)
  }

}
