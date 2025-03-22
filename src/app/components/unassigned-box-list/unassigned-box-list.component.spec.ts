import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnassignedBoxListComponent } from './unassigned-box-list.component';

describe('UnassignedBoxListComponent', () => {
  let component: UnassignedBoxListComponent;
  let fixture: ComponentFixture<UnassignedBoxListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnassignedBoxListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnassignedBoxListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
