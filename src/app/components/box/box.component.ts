import {
  Component,
  Input,
  Signal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { Box, Cat, Item, Room } from '../../app';
import { Router, RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { UndoService } from '../../services/undo.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavbarService } from '../../services/navbar.service';
import { StorageService } from '../../services/storage.service';
import iconConfig from '../../icon.config';
import { AppIconComponent } from '../app-icon/app-icon.component';
import { TrailComponent } from '../trail/trail.component';

@Component({
  selector: 'app-box',
  standalone: true,
  imports: [
    NgFor,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    AppIconComponent,
    MatToolbarModule,
    RouterModule,
    TrailComponent,
  ],
  templateUrl: './box.component.html',
  styleUrl: './box.component.css',
})
export class BoxComponent {
  @Input() id: string | undefined = undefined;
  @Input() simple: boolean = false;

  route: ActivatedRoute = inject(ActivatedRoute);

  public box: Box | undefined;
  public items: Signal<Item[]> = signal([]);
  public mappedCats: Map<string, Cat | undefined> = new Map();
  public icon = iconConfig;
  public trail: (Room | Box)[] = [];

  constructor(
    private data: StorageService,
    private router: Router,
    private undo: UndoService,
    private navbar: NavbarService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.box = this.data.getBox(this.id);
      this.items = this.data.getItemsByBox(this.id);
      this.mapCats();
      this.navbar.update(['itemAdd'], { boxId: this.id });
      this.trail = this.data.getTrail(this.id);
    }
  }

  private mapCats(): void {
    this.mappedCats.clear();
    for (const item of this.items()) {
      if (item.catID)
        this.mappedCats.set(item.id, this.data.getCat(item.catID));
    }
  }

  deleteBox(id: string | undefined) {
    if (id) {
      let resetFn = this.data.removeBox(id);
      this.undo.push(resetFn as any);
      this.router.navigateByUrl('/');
    }
  }

  sortFn(a: Item, b: Item) {
    return a.name.toLowerCase() < b.name.toLowerCase()
      ? -1
      : a.name.toLowerCase() == b.name.toLowerCase()
      ? 0
      : 1;
  }
}
