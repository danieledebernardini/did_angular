import { TestBed } from '@angular/core/testing';

import { DidService } from './did.service';

describe('DidService', () => {
  let service: DidService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DidService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
