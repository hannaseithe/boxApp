import { Component, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ExcelDownloadComponent } from '../excel-download/excel-download.component';
import { ExcelUploadComponent } from '../excel-upload/excel-upload.component';
import { JsonExportComponent } from '../json-export/json-export.component';
import { JsonImportComponent } from '../json-import/json-import.component';
import { MatIconModule } from '@angular/material/icon';
import { NavigationStart, Router, RouterModule } from '@angular/router';
import { NavbarService } from '../../services/navbar.service';
import { Location } from '@angular/common';
import { SearchComponent } from "../search/search.component";
import { StorageService } from '../../services/storage.service';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { NasService } from '../../services/nas.service';
import { NasSliderComponent } from "../nas-slider/nas-slider.component";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    ExcelDownloadComponent,
    ExcelUploadComponent,
    JsonExportComponent,
    JsonImportComponent,
    MatIconModule,
    RouterModule,
    SearchComponent,
    NasSliderComponent
],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  public dynButs:Signal<any>
  public pageData:Signal<any>
  public doSearch = false

  constructor(private data:StorageService,
    private navBar:NavbarService,
    private location:Location,
    private router:Router,
    public nas:NasService
  ) {
    this.dynButs = this.navBar.inputData.buttons
    this.pageData = this.navBar.inputData.pageData
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationStart) { 
        this.navBar.update([],{})
      }
    });
  }



  public clearStorage(event: Event) {
    this.data.initializeNewDB([],[],[],[]);
  }

  goBack() {
    this.location.back()
  }

  activateSearch(){
    this.doSearch = true
    this.router.navigate(['/item-list'], {queryParams: {search:true}});
  }

  deactivateSearch() {
   this.doSearch = false
    
  }

}
