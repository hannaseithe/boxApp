import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  TestBedStatic,
  tick,
} from '@angular/core/testing';

import { AddEditItemComponent } from './add-edit-item.component';
import { HarnessLoader } from '@angular/cdk/testing';
import { ActivatedRouteMock } from 'src/app/mocks/activatedRouteMock';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { StorageServiceMock } from 'src/app/mocks/storageServiceMock';
import { RouterMock } from 'src/app/mocks/routerMock';
import { LocationMock } from 'src/app/mocks/locationMock';
import { MatCardModule } from '@angular/material/card';
import {
  FormBuilder,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { AppIconComponent } from '../app-icon/app-icon.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { StorageService } from 'src/app/services/storage.service';
import { NasService } from 'src/app/services/nas.service';
import { NasServiceMock } from 'src/app/mocks/nasServiceMock';
import { UndoServiceMock } from 'src/app/mocks/undoServiceMock';
import { MatDialogMock } from 'src/app/mocks/matDialogMock';
import { UndoService } from 'src/app/services/undo.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CatListComponent } from '../cat-list/cat-list.component';
import { By } from '@angular/platform-browser';

async function waitForImage(
  fixture: ComponentFixture<any>
): Promise<HTMLElement> {
  let img: HTMLElement | null = null;
  const start = performance.now();
  while (performance.now() - start < 3000) {
    fixture.detectChanges();
    await fixture.whenStable();
    img = fixture.nativeElement.querySelector('img[alt="Image"]');
    if (img) return img;
    await new Promise((r) => setTimeout(r, 50));
  }
  throw new Error('Image not found within 3s');
}

describe('AddEditItemComponent', () => {
  let component: AddEditItemComponent;
  let fixture: ComponentFixture<AddEditItemComponent>;
  let loader: HarnessLoader;
  let instantiateComponent = async (
    TestBed: TestBedStatic,
    activatedRouteMock: ActivatedRouteMock
  ) => {
    TestBed.overrideProvider(ActivatedRoute, { useValue: activatedRouteMock });
    fixture = TestBed.createComponent(AddEditItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    fixture.detectChanges();
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  };
  const storageServiceMock = new StorageServiceMock();
  const nasMock = new NasServiceMock();
  const matDialogMock = new MatDialogMock();

  beforeEach(async () => {
    const router = new RouterMock();
    const location = new LocationMock();

    const undoMock = new UndoServiceMock();

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatCardModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatListModule,
        MatSelectModule,
        MatChipsModule,
        AppIconComponent,
        MatButtonModule,
        RouterModule,
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
        { provide: NasService, useValue: nasMock },
        { provide: UndoService, useValue: undoMock },
        { provide: MatDialog, useValue: matDialogMock },
        { provide: NonNullableFormBuilder, useClass: FormBuilder },
      ],
    }).compileComponents();
  });

  it('should create component in edit mode', async () => {
    await instantiateComponent(
      TestBed,
      new ActivatedRouteMock({ id: '1' }, { roomId: '2' })
    );

    expect(storageServiceMock.getItem).toHaveBeenCalledWith('1');

    expect(component).toBeTruthy();
    const nameInput: HTMLInputElement = fixture.nativeElement.querySelector(
      'input[formControlName="name"]'
    );
    expect(nameInput.value).toBe('1. Item');

    expect(component.form.get('roomID')?.value).toBe('2');
    expect(component.form.get('catID')?.value).toBe('1');
    fixture.detectChanges();
    const matSelect: HTMLElement = fixture.nativeElement.querySelector(
      'mat-select[formControlName="roomID"]'
    );
    expect(matSelect.textContent).toBe(`2. Room`);
    const matSelect2: HTMLElement = fixture.nativeElement.querySelector(
      'mat-select[formControlName="catID"]'
    );
    expect(matSelect2.textContent).toBe(`1. Category`);

    expect(storageServiceMock.getItem).toHaveBeenCalledWith('1');
    expect(nasMock.loggedIn).toHaveBeenCalled();
    expect(nasMock.fetchThumbnail).toHaveBeenCalledWith('pic1.jpg', 100);
    expect(component.isAddMode).toBeFalse();
  });
  it('should create component in add mode', async () => {
    await instantiateComponent(
      TestBed,
      new ActivatedRouteMock({}, { roomId: '2' })
    );
    expect(component.isAddMode).toBeTrue();
  });
  it('should show Image when thumbnail is clicked', async () => {
    await instantiateComponent(
      TestBed,
      new ActivatedRouteMock({ id: '1' }, {})
    );

    const img = await waitForImage(fixture);
    expect(img).toBeTruthy();
  });
  it('should openDialog when Button is clicked', async () => {
    await instantiateComponent(
      TestBed,
      new ActivatedRouteMock({ id: '1' }, {})
    );

    const buttons: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('button')
    );
    const button1 = buttons.find(
      (button) => button.textContent?.trim() === 'New Category'
    );
    const button2 = buttons.find(
      (button) => button.textContent?.trim() === 'Edit Category'
    );

    button1?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(matDialogMock.open).toHaveBeenCalledWith(CatListComponent, {
      data: { addNew: true },
    });

    button2?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(matDialogMock.open).toHaveBeenCalledWith(CatListComponent, {
      data: { addNew: false },
    });
  });
  it('should disable submit button if form is invalid', async () => {
    await instantiateComponent(TestBed, new ActivatedRouteMock({}, {}));
    const button = fixture.debugElement.query(
      By.css('button[type="submit"]')
    ).nativeElement;
    expect(button).toBeTruthy();
    expect(button.hasAttribute('disabled')).toBeTrue();

    component.form.patchValue({ description: 'Something' });

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.form.valid).toBeFalse();
    expect(button.hasAttribute('disabled')).toBeTrue();
  });
  it('should upload on NAS on Submit if file was selected', async () => {
    await instantiateComponent(
      TestBed,
      new ActivatedRouteMock({ id: '1' }, {})
    );

    const button = fixture.debugElement.query(
      By.css('button[type="submit"]')
    ).nativeElement;
    expect(button).toBeTruthy();
    expect(button.hasAttribute('disabled')).toBeTrue();
    expect(button.textContent?.trim()).toBe('Save');

    component.onFileSelect({ target: { files: [{ name: 'file.jpg' }] } });

    fixture.detectChanges();
    await fixture.whenStable();

    const chips: HTMLElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('mat-chip')
    );
    const targetChip = chips.find((chip) =>
      chip.textContent?.trim().includes('File to upload: file.jpg')
    );

    expect(targetChip).toBeTruthy();
    expect(targetChip?.hasAttribute('disabled')).toBeTrue();

    expect(button.textContent?.trim()).toBe('Save & Upload');

    component.form.markAsDirty();
    expect(button.hasAttribute('disabled')).toBeFalse();

    button.click();

    fixture.detectChanges();
    await fixture.whenStable();

    expect(nasMock.uploadFile).toHaveBeenCalled();
    expect(storageServiceMock.addUpdateItem).toHaveBeenCalled();
  });
});
