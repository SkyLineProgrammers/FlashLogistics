import { TestBed, inject } from '@angular/core/testing';

import { BlueExServicesService } from './blue-ex-services.service';

describe('BlueExServicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BlueExServicesService]
    });
  });

  it('should be created', inject([BlueExServicesService], (service: BlueExServicesService) => {
    expect(service).toBeTruthy();
  }));
});
