import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonExportComponent } from './json-export.component';

describe('JsonExportComponent', () => {
  let component: JsonExportComponent;
  let fixture: ComponentFixture<JsonExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonExportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JsonExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
