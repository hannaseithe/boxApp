import { ChangeDetectorRef, Component, ElementRef, EventEmitter, output, Output, Signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NavbarService } from '../navbar.service';
import { Item } from '../app';
import { StorageService } from '../storage.service';

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
  @Output() searchFinished = new EventEmitter<void>();
  @ViewChild("searchInput") myInputField!: ElementRef;

  constructor(private data: StorageService,
    private navBar: NavbarService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
    this.items = this.data.Items
    this.navBar.updateSearchResult(this.items())
  }

  ngAfterViewInit() {
    this.myInputField.nativeElement.focus();
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  onSearchChange(eventTarget: any) {
    if (eventTarget.value.length > 2) {
      this.navBar.updateSearchResult(this.items().filter(item => item.name.includes(eventTarget.value)))
    } else {
      this.navBar.updateSearchResult(this.items())
    }

  }

  deactivateSearch() {
    this.searchFinished.emit();
  }

}
