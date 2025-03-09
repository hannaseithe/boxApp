import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NasSliderComponent } from './nas-slider.component';

describe('NasSliderComponent', () => {
  let component: NasSliderComponent;
  let fixture: ComponentFixture<NasSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NasSliderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NasSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
