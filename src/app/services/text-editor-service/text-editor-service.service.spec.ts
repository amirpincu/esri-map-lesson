import { TestBed } from '@angular/core/testing';

import { TextEditorServiceService } from './text-editor-service.service';

describe('TextEditorServiceService', () => {
  let service: TextEditorServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextEditorServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
