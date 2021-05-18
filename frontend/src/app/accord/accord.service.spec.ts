import { TestBed } from '@angular/core/testing';

import { AccordService } from './accord.service';

describe('AccordService', () => {
  let service: AccordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
