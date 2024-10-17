import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DbService } from '../db.service';
import { uniqueId } from '../app';
import { Location } from '@angular/common';

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
  ],
  templateUrl: './add-edit-box.component.html',
  styleUrl: './add-edit-box.component.css'
})
export class AddEditBoxComponent {

  form: FormGroup;
  id:  uniqueId | undefined = undefined;
  isAddMode = false;

  constructor(private route: ActivatedRoute,
    private data: DbService,
    private router: Router,
    private location:Location
  ) {
    this.form = new FormGroup({
      name: new FormControl(''),
      description: new FormControl('')
    });
  }

  onSubmit() {
    let formBox = this.form.value
    formBox.id = this.id ? this.id : undefined
    let editedBox = this.data.updateBox(formBox);
    this.router.navigateByUrl('/box/'+ editedBox?.id )
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    if (!this.isAddMode && this.id) {
      let x = this.data.getBox(this.id)
      if (x) {
        this.form.patchValue(x);
      }
    }
  }

  cancel() {
    this.location.back()
  }

}
