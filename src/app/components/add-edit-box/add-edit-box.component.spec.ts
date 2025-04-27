import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditBoxComponent } from './add-edit-box.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ActivatedRouteMock } from '../../mocks/activatedRouteMock';
import { StorageService } from '../../services/storage.service';
import { StorageServiceMock } from '../../mocks/storageServiceMock';
import { RouterMock } from '../../mocks/routerMock';
import { LocationMock } from '../../mocks/locationMock';
import {
  FormBuilder,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

fdescribe('AddEditBoxComponent', () => {
  let component: AddEditBoxComponent;
  let fixture: ComponentFixture<AddEditBoxComponent>;

  beforeEach(async () => {
    let activatedRouteMock = new ActivatedRouteMock({
      id: '1234',
      roomID: '2',
    });
    const storageServiceMock = new StorageServiceMock();
    const router = new RouterMock();
    const location = new LocationMock();
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        RouterModule,
        MatOptionModule,
        MatSelectModule,
        AddEditBoxComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock,
        },
        {
          provide: StorageService,
          useValue: storageServiceMock,
        },
        {
          provide: Router,
          useValue: router,
        },
        {
          provide: Location,
          useValue: location,
        },
        { provide: NonNullableFormBuilder, useClass: FormBuilder },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
    const nameInput: HTMLInputElement = fixture.nativeElement.querySelector(
      'input[formControlName="name"]'
    );
    expect(nameInput.value).toBe('1. Box');

    expect(component.form.get('roomID')?.value).toBe('1');
    fixture.detectChanges();
    const matSelect: HTMLElement = fixture.nativeElement.querySelector(
      'mat-select[formControlName="roomID"]'
    );
    expect(matSelect.textContent).toBe(`1. Room`);
  });
});
