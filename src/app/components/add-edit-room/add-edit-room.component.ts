import { Component } from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-edit-room',
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './add-edit-room.component.html',
  styleUrl: './add-edit-room.component.css',
})
export class AddEditRoomComponent {
  form: FormGroup;
  id: string | undefined = undefined;
  isAddMode = false;

  constructor(
    private fb: NonNullableFormBuilder,
    private route: ActivatedRoute,
    private data: StorageService,
    private router: Router,
    private location: Location
  ) {
    this.form = this.fb.group({
      name: '',
      description: '',
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    if (!this.isAddMode && this.id) {
      let x = this.data.getRoom(this.id);
      if (x) {
        this.form.patchValue(x);
      }
    }
  }

  onSubmit() {
    let formRoom = this.form.value;
    formRoom.id = this.id ? this.id : undefined;
    let editedRoom = this.data.addUpdateRoom(formRoom);
    this.router.navigateByUrl('/room/' + editedRoom?.id);
  }

  cancel() {
    this.location.back();
  }
}
