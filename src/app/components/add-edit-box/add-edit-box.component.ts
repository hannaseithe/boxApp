import { Component, Signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { StorageService } from '../../services/storage.service';
import { Box, Room, RoomWithBoxes } from '../../app';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-edit-box',
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
    MatOptionModule,
    MatSelectModule,
  ],
  templateUrl: './add-edit-box.component.html',
  styleUrl: './add-edit-box.component.css',
})
export class AddEditBoxComponent {
  form: FormGroup;
  id: string | undefined = undefined;
  isAddMode = false;
  rooms: Signal<Room[]>;
  boxes: Signal<Box[]>;
  groupedBoxes: RoomWithBoxes[];

  constructor(
    private route: ActivatedRoute,
    private data: StorageService,
    private router: Router,
    private location: Location,
    private fb: NonNullableFormBuilder
  ) {
    this.form = this.fb.group({
      name: '',
      description: '',
      boxID: '',
      roomID: '',
    });
    this.boxes = this.data.Boxes;
    this.rooms = this.data.Rooms;
    this.groupedBoxes = this.data.getAllRoomsWithBoxes();
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    if (!this.isAddMode && this.id) {
      let x = this.data.getBox(this.id);
      if (x) {
        this.form.patchValue(x);
      }
    }
    if (this.isAddMode) {
        let roomID = this.route.snapshot.queryParams['roomId'];
      if (roomID) {
        this.form.patchValue({ roomID: roomID });
      }
    }

  }

  onSubmit() {
    let formBox = this.form.value;
    formBox.id = this.id ? this.id : undefined;
    let editedBox = this.data.addUpdateBox(formBox);
    this.router.navigateByUrl('/box/' + editedBox?.id);
  }

  select(selected: string) {
    switch (selected) {
      case 'room':
        this.form.get('boxID')?.reset();
        break;
      case 'box':
        this.form.get('roomID')?.reset();
        break;
      default:
        break;
    }
  }

  cancel() {
    this.location.back();
  }
}
