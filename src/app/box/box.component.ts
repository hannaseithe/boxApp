import { Component, Input, Signal, computed, inject } from '@angular/core';
import { DbService } from '../db.service';
import { NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card'
import { MatListModule} from '@angular/material/list'
import { Box, Item, uniqueId } from '../app';
import { Router, RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UndoService } from '../undo.service';

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

  

  public box: Signal<Box | undefined> ;

  constructor(private data:DbService,
    private router: Router,
    private undo: UndoService
  ){
  
    this.id = this.route.snapshot.params['id'];
    this.box = computed(() => this.data.Boxes().find(box=> box.id == this.id))
    this.simple = false;
   
  }

  ngOnInit(): void {
  }

  deleteBox(id:uniqueId | undefined) {
    let resetFn = this.data.deleteBox(id)
    this.undo.push(resetFn as any)
    this.router.navigateByUrl("/")
  }

  sortFn(a: Item,b: Item) {
    return a.name.toLowerCase() < b.name.toLowerCase() ? -1: a.name.toLowerCase() == b.name.toLowerCase() ? 0:1
  }
}
