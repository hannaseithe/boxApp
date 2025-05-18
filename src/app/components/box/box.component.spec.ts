import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxComponent } from './box.component';
import { ActivatedRouteMock } from '../../mocks/activatedRouteMock';
import { ActivatedRoute, Router } from '@angular/router';
import { DragStateService } from '../../services/dragState.service';
import { NavbarService } from '../../services/navbar.service';
import { UndoService } from '../../services/undo.service';
import { StorageService } from '../../services/storage.service';
import { StorageServiceMock } from '../../mocks/storageServiceMock';
import { RouterMock } from '../../mocks/routerMock';
import { TrailComponent } from '../trail/trail.component';
import { MockComponent } from 'ng-mocks';
import { DragStateServiceMock } from '../../mocks/dragStateServiceMock';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

fdescribe('BoxComponent', () => {
  let component: BoxComponent;
  let fixture: ComponentFixture<BoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MockComponent(TrailComponent), NoopAnimationsModule],
      declarations: [BoxComponent],
      providers: [
        { provide: StorageService, useValue: new StorageServiceMock() },
        { provide: Router, useValue: new RouterMock() },
        { provide: UndoService, useValue: {} },
        { provide: NavbarService, useValue: {} },
        { provide: DragStateService, useValue: new DragStateServiceMock() },
        {
          provide: ActivatedRoute,
          useValue: new ActivatedRouteMock(),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
