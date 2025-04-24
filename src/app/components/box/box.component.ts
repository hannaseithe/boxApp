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
import { DragStateService } from '../../services/dragState.service';
import { MatChipsModule } from '@angular/material/chips';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

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
    MatChipsModule,
    DragDropModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './box.component.html',
  styleUrl: './box.component.css',
})
export class BoxComponent {
  @Input() id: string | null = null;
  @Input() simple: boolean = false;

  route: ActivatedRoute = inject(ActivatedRoute);

  public box: Box | undefined;
  public items: Signal<Item[]> = signal([]);
  public boxes: Signal<Box[]> = signal([]);
  public mappedCats: Map<string, Cat | undefined> = new Map();
  public icon = iconConfig;
  public trail: (Room | Box)[] = [];
  public itemNameControl = new FormControl('');
  public boxNameControl = new FormControl('');

  constructor(
    private data: StorageService,
    private router: Router,
    private undo: UndoService,
    private navbar: NavbarService,
    public drag: DragStateService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');

      this.getBox();
      if (this.id) {
        this.items = this.data.getItemsByBox(this.id);
        this.boxes = this.data.getBoxesByBox(this.id);
        this.mapCats();
        this.navbar.update(['itemAdd'], { boxId: this.id });
      }
    });
  }

  private getBox() {
    if (this.id) {
      this.box = this.data.getBox(this.id);
      if (this.box) {
        this.box.type = 'box';
      }

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

  sortFn(a: Item | Box, b: Item | Box) {
    return a.name.toLowerCase() < b.name.toLowerCase()
      ? -1
      : a.name.toLowerCase() == b.name.toLowerCase()
      ? 0
      : 1;
  }
  onDragStarted() {
    this.drag.registerDragged(() => this.getBox());
  }
  addItem() {
    const value = this.itemNameControl.value;
    if (value) {
      this.data.addUpdateItem({
        name: value,
        id: '',
        tags: [],
        boxID: this.box!.id,
      });
      this.itemNameControl.reset();
    }
  }
  addBox() {
    const value = this.boxNameControl.value;
    if (value) {
      this.data.addUpdateBox({ name: value, id: '', boxID: this.box!.id });
      this.boxNameControl.reset();
    }
  }
}
