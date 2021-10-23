import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportTypesDialogComponent } from './import-types-dialog.component';

describe('ImportTypesDialogComponent', () => {
  let component: ImportTypesDialogComponent;
  let fixture: ComponentFixture<ImportTypesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportTypesDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportTypesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
