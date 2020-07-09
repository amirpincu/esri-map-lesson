import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextShowWidget } from './text-show-widget.component';

describe('TextShowWidgetComponent', () => {
  let component: TextShowWidget;
  let fixture: ComponentFixture<TextShowWidget;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextShowWidget ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextShowWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
