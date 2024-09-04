import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DbService } from '../db.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { Box, Cat } from '../app';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-edit-item',
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './add-edit-item.component.html',
  styleUrl: './add-edit-item.component.css'
})
export class AddEditItemComponent {

  id: number | undefined = undefined;
  isAddMode: boolean = true;
  form: FormGroup;
  boxes: Box[] = [];
  cats: Cat[] = []

  constructor(
    private route: ActivatedRoute,
    private data: DbService
  ) {

    this.form = new FormGroup({
      name: new FormControl(''),
      description: new FormControl(''),
      boxID: new FormControl(''),
      tags: new FormControl([]),
      catID: new FormControl(''),
    });


  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.params['id']);
    this.boxes = this.data.getBoxes()
    this.cats = this.data.getCategories()
    this.isAddMode = !this.id;



    if (!this.isAddMode && this.id) {
      let x = this.data.getItem(this.id)
      if (x) {
        this.form.patchValue(x);
      }
    }
  }

  remove(tag: string) {
    let tags = this.form.get("tags")?.value
    const index = tags.indexOf(tag);
    if (index < 0) {
      return tags;
    }

    tags.splice(index, 1);
    return [...tags];
  }

  add(event: MatChipInputEvent) {

    const value = (event.value || '').trim();
    let tags = this.form.get("tags")?.value
    // Add our keyword
    if (value) {
      this.form.patchValue({ tags: [...tags, value]})
    }

    // Clear the input value
    event.chipInput!.clear();

  }
}
