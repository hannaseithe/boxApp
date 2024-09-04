import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DbService } from '../db.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-edit-item',
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './add-edit-item.component.html',
  styleUrl: './add-edit-item.component.css'
})
export class AddEditItemComponent {

  id: number | undefined = undefined;
  isAddMode: boolean = true;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private data: DbService
  ) {

    this.form = new FormGroup({
      name: new FormControl(''),
      description: new FormControl(''),
      boxId: new FormControl(''),
      tags: new FormControl(''),
      cat: new FormControl(''),
    });

  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.params['id']);
    this.isAddMode = !this.id;



    if (!this.isAddMode && this.id) {
      let x = this.data.getItem(this.id)
      if (x) {
        this.form.patchValue(x);
      }
    }
  }

}
