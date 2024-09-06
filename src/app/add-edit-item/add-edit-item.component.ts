import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationStart, Router, RouterModule } from '@angular/router';
import { DbService } from '../db.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { Box, Cat, uniqueId } from '../app';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { filter } from 'rxjs';

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
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './add-edit-item.component.html',
  styleUrl: './add-edit-item.component.css'
})
export class AddEditItemComponent {

  id: uniqueId | undefined = undefined;
  isAddMode: boolean = true;
  form: FormGroup;
  boxes: Box[] = [];
  cats: Cat[] = []

  constructor(
    private route: ActivatedRoute,
    private data: DbService,
    private router: Router
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
    this.id = this.route.snapshot.params['id'];
    let boxID = this.route.snapshot.queryParams['boxId'];
    this.boxes = this.data.getBoxes()
    this.cats = this.data.getCategories()
    this.isAddMode = !this.id;

    if (boxID) {
      this.form.patchValue({ boxID: boxID })
    }

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

  onSubmit() {
    let formItem = this.form.value
    formItem.id = this.id ? this.id : undefined
    let editedItem = this.data.updateItem(formItem);
    console.log(editedItem)
    this.router.navigateByUrl('/item/'+ editedItem?.id )
  }

}
