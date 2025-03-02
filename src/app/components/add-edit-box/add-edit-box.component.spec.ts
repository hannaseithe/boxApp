import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditBoxComponent } from './add-edit-box.component';

describe('AddEditBoxComponent', () => {
  let component: AddEditBoxComponent;
  let fixture: ComponentFixture<AddEditBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
