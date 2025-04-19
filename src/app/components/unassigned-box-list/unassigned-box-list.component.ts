import { Component, effect, Signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Box, Item, Room, RoomWithBoxes } from '../../app';
import { MatCardModule } from '@angular/material/card';
import {
  MatChipSelectionChange,
  MatChipsModule,
} from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { StorageService } from '../../services/storage.service';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import iconConfig from '../../icon.config';
import { AppIconComponent } from '../app-icon/app-icon.component';

@Component({
  selector: 'app-unassigned-box-list',
  standalone: true,
  imports: [
    RouterModule,
    MatChipsModule,
    MatToolbarModule,
    AppIconComponent,
    MatButtonModule,
    MatSelectModule,
    MatListModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatCardModule,
  ],
  templateUrl: './unassigned-box-list.component.html',
  styleUrl: './unassigned-box-list.component.css',
})
export class UnassignedBoxListComponent {
  boxes: Signal<Box[]>;
  rooms: Room[] = [];
  groupedBoxes: RoomWithBoxes[];
  formGroup: FormGroup;
  icon = iconConfig;

  constructor(
    private data: StorageService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.boxes = this.data.UnassignedBoxes;
    this.rooms = this.data.Rooms();
    this.groupedBoxes = this.data.getAllRoomsWithBoxes();
    this.formGroup = this.fb.group({});

    effect(() => {
      if (this.boxes().length == 0) {
        this.router.navigateByUrl('');
      }
    });
  }

  ngOnInit(): void {
    this.boxes().forEach((box) => {
      this.formGroup.addControl(box.id, new FormControl(false));
    });
  }

  getControl(boxId: string): FormControl {
    return this.formGroup.get(boxId) as FormControl;
  }

  assignToRoom(box: Box, event: any) {
    this.data.addUpdateBox({ ...box, roomID: event.value });
  }

  assignToBox(box: Box, event: any) {
    this.data.addUpdateBox({ ...box, boxID: event.value });
  }
  delete(box: Box) {
    this.data.removeBox(box.id);
  }

  private getSelectedBoxes() {
    const formValues = this.formGroup.value;
    return Object.keys(formValues).filter((key) => formValues[key]);
  }

  assignSelectedToRoom(event: any, selectControl: MatSelect) {
    const roomID = event.value;
    this.getSelectedBoxes().forEach((id) => {
      const box = this.boxes().find((box) => box.id == id);
      if (box) {
        this.data.addUpdateBox({ ...box, roomID: roomID });
      }
    });
    selectControl.value = null;
    selectControl.writeValue(null);
  }

  assignSelectedToBox(event: any, selectControl: MatSelect) {
    const boxID = event.value;
    this.getSelectedBoxes().forEach((id) => {
      const box = this.boxes().find((box) => box.id == id);
      if (box) {
        this.data.addUpdateBox({ ...box, boxID: boxID });
      }
    });
    selectControl.value = null;
    selectControl.writeValue(null);
  }

  deleteSelected() {
    const selectedBoxes = this.getSelectedBoxes();
    selectedBoxes.forEach((id) => this.data.removeBox(id));
  }

  onChipChange(event: MatChipSelectionChange, boxId: string) {
    const control = this.getControl(boxId);
    control.setValue(event.selected);
    control.markAsDirty();
    this.formGroup.updateValueAndValidity();
  }

  sortFn(a: Box, b: Box) {
    return a.name.toLowerCase() < b.name.toLowerCase()
      ? -1
      : a.name.toLowerCase() == b.name.toLowerCase()
      ? 0
      : 1;
  }
}
