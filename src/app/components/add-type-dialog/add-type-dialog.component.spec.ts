import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTypeDialogComponent } from './add-type-dialog.component';

describe('AddTypeDialogComponent', () => {
  let component: AddTypeDialogComponent;
  let fixture: ComponentFixture<AddTypeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTypeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
