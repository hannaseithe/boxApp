import { Component, ElementRef, output, Output, Signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DbService } from '../db.service';
import { NavbarService } from '../navbar.service';
import { Item } from '../app';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {

  items: Signal<Item[]>
  searchActive = output<boolean>()
  @ViewChild("searchInput") myInputField!: ElementRef;




  constructor(private data: DbService,
    private navBar: NavbarService
  ) {
    this.items = this.data.Items
    this.navBar.updateSearchResult(this.items())
    this.searchActive.emit(true)
  }

  ngAfterViewInit() {
    this.myInputField.nativeElement.focus();
  }

  onSearchChange(eventTarget: any) {
    if (eventTarget.value.length > 2) {
      this.navBar.updateSearchResult(this.items().filter(item => item.name.includes(eventTarget.value)))
    }

  }

  deactivateSearch() {
    this.searchActive.emit(false);
  }

}
