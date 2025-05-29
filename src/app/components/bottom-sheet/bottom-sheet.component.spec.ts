import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomSheetComponent } from './bottom-sheet.component';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';

class MatBottomSheetRefMock {
  dismiss = jasmine.createSpy('dismiss');
}

fdescribe('BottomSheetComponent', () => {
  let component: BottomSheetComponent;
  let fixture: ComponentFixture<BottomSheetComponent>;
  let bottomSheetRefMock: MatBottomSheetRefMock;
  let matBottomSheetDataMock: any;

  beforeEach(async () => {
    matBottomSheetDataMock = { reset: () => {} }; // Mock the MAT_BOTTOM_SHEET_DATA with necessary properties
    bottomSheetRefMock = new MatBottomSheetRefMock();
    await TestBed.configureTestingModule({
      imports: [BottomSheetComponent],
      providers: [
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: matBottomSheetDataMock },
        { provide: MatBottomSheetRef, useValue: bottomSheetRefMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
