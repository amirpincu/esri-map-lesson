import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextEditDialogCompComponent } from './text-edit-dialog-comp.component';

describe('TextEditDialogCompComponent', () => {
  let component: TextEditDialogCompComponent;
  let fixture: ComponentFixture<TextEditDialogCompComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextEditDialogCompComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextEditDialogCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
