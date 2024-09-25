import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnassignedItemListComponent } from './unassigned-item-list.component';

describe('UnassignedItemListComponent', () => {
  let component: UnassignedItemListComponent;
  let fixture: ComponentFixture<UnassignedItemListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnassignedItemListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnassignedItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
