import { Component, Input, inject } from '@angular/core';
import { DbService } from '../db.service';
import { NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card'
import { MatListModule} from '@angular/material/list'
import { Box, Item, uniqueId } from '../app';
import { Router, RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-box',
  standalone: true,
  imports: [NgFor, NgIf, MatCardModule, MatListModule, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './box.component.html',
  styleUrl: './box.component.css'
})
export class BoxComponent {
  @Input() id: uniqueId | undefined = undefined;
  @Input() simple: boolean = true;

  route: ActivatedRoute = inject(ActivatedRoute);

  

  public box:Box | undefined = undefined;

  constructor(private data:DbService,
    private router: Router
  ){
   if (this.route.snapshot.params['id']) { 
    this.id = this.route.snapshot.params['id'];
    this.simple = false;
   }
  }

  ngOnInit(): void {
    if ( this.id ) {this.box = this.data.getBox(this.id) };
  }

  deleteBox(id:uniqueId | undefined) {
    this.data.deleteBox(id)
    this.router.navigateByUrl("/")
  }

  sortFn(a: Item,b: Item) {
    return a.name.toLowerCase() < b.name.toLowerCase() ? -1: a.name.toLowerCase() == b.name.toLowerCase() ? 0:1
  }
}
