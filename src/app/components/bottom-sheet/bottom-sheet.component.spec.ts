import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomSheetComponent } from './bottom-sheet.component';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('BottomSheetComponent', () => {
  let component: BottomSheetComponent;
  let fixture: ComponentFixture<BottomSheetComponent>;
  let bottomSheetRefSpy: jasmine.SpyObj<
    MatBottomSheetRef<BottomSheetComponent>
  >;
  beforeEach(async () => {
    bottomSheetRefSpy = jasmine.createSpyObj('MatBottomSheetRef', ['dismiss']);
    const reset = () => {};
    reset.active = () => {};
    await TestBed.configureTestingModule({
      imports: [
        BottomSheetComponent,
        MatBottomSheetModule,
        NoopAnimationsModule,
      ],
      providers: [
        {
          provide: MAT_BOTTOM_SHEET_DATA,
          useValue: { reset },
        },
        { provide: MatBottomSheetRef, useValue: bottomSheetRefSpy },
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
