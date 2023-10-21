import { TestBed } from '@angular/core/testing';

import { SupabaseApiService } from './supabase-api.service';

describe('SupabaseApiService', () => {
  let service: SupabaseApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupabaseApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
