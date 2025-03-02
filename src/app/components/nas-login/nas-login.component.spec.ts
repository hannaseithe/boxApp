import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NasLoginComponent } from './nas-login.component';

describe('NasLoginComponent', () => {
  let component: NasLoginComponent;
  let fixture: ComponentFixture<NasLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NasLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NasLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
