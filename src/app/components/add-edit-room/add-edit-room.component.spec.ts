import {
  ComponentFixture,
  TestBed,
  TestBedStatic,
} from '@angular/core/testing';

import { AddEditRoomComponent } from './add-edit-room.component';
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
import { MatSelectHarness } from '@angular/material/select/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

fdescribe('AddEditRoomComponent', () => {
  let component: AddEditRoomComponent;
  let fixture: ComponentFixture<AddEditRoomComponent>;
  let loader: HarnessLoader;
  let instantiateComponent = async (
    TestBed: TestBedStatic,
    activatedRouteMock: ActivatedRouteMock
  ) => {
    TestBed.overrideProvider(ActivatedRoute, { useValue: activatedRouteMock });
    fixture = TestBed.createComponent(AddEditRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    fixture.detectChanges();
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  };
  const storageServiceMock = new StorageServiceMock();

  beforeEach(async () => {
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
        AddEditRoomComponent,
      ],
      providers: [
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
  });

  it('should create component in edit mode', async () => {
    await instantiateComponent(
      TestBed,
      new ActivatedRouteMock({ id: '1' }, {})
    );
    expect(storageServiceMock.getRoom).toHaveBeenCalledWith('1');

    expect(component).toBeTruthy();
    const nameInput: HTMLInputElement = fixture.nativeElement.querySelector(
      'input[formControlName="name"]'
    );
    expect(nameInput.value).toBe('1. Room');
    expect(component.isAddMode).toBeFalse();
  });

  it('should create component in add mode', async () => {
    await instantiateComponent(TestBed, new ActivatedRouteMock({}, {}));

    expect(component).toBeTruthy();
    const nameInput: HTMLInputElement = fixture.nativeElement.querySelector(
      'input[formControlName="name"]'
    );
    expect(nameInput.value).toBe('');
    expect(component.isAddMode).toBeTrue();
  });
  it('should update Room in localStorage when form submitted', async () => {
    await instantiateComponent(
      TestBed,
      new ActivatedRouteMock({}, { roomId: 1 })
    );

    component.form.patchValue({
      name: 'Test Room',
      description: 'Some description',
    });
    component.form.markAsDirty();
    fixture.detectChanges();
    await fixture.whenStable();

    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    button.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(storageServiceMock.addUpdateRoom).toHaveBeenCalled();
  });
  it('should not submit the Form if the form is not valid', async () => {
    await instantiateComponent(TestBed, new ActivatedRouteMock({}, {}));
    component.form.markAsDirty();
    fixture.detectChanges();
    await fixture.whenStable();

    spyOn(component, 'onSubmit');
    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    button.click();

    expect(component.onSubmit).not.toHaveBeenCalled();
  });
});
