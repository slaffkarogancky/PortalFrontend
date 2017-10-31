import { TestBed, inject } from '@angular/core/testing';

import { AdregServiceService } from './adreg-service.service';

describe('AdregServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdregServiceService]
    });
  });

  it('should be created', inject([AdregServiceService], (service: AdregServiceService) => {
    expect(service).toBeTruthy();
  }));
});
