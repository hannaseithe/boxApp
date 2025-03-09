import { Component } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { NasService } from '../../services/nas.service';

@Component({
  selector: 'app-nas-slider',
  standalone: true,
  imports: [
    MatSlideToggleModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './nas-slider.component.html',
  styleUrl: './nas-slider.component.css'
})
export class NasSliderComponent {
  wait=false
  errorMessage=""

  constructor(public nas:NasService){

  }

  public toggleNasLogin() {
    this.wait=true
    if (this.nas.loggedIn()) {
      this.wait = true
      this.nas.logout().subscribe({next: (response:any) => {
        this.wait = false
      },
    error: () => {
      this.wait = false;
      console.error('Failed to logout')
    }})
    } else {
      this.login()
    }
  }

  private login(){
      this.nas.selfLogin().subscribe({next: (response: any) => {
        if (response.QDocRoot.authPassed['#cdata-section'] === '1') {
          this.wait = false
          console.log('successful login')
        } else {
          this.errorMessage = 'Invalid credentials';
          this.wait = false
        }
      },
      error: (error:any) => {
        this.errorMessage = 'Error logging in';
        console.error(error);
        this.wait = false
      },})
  }

}
