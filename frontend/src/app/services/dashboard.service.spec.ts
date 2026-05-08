import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardService, provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(DashboardService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('requests the agriculture dashboard from the backend API', () => {
    service.getDashboard().subscribe((dashboard) => {
      expect(dashboard.title).toBe('Crop usage dashboard');
    });

    const request = httpTestingController.expectOne('/api/dashboard');

    expect(request.request.method).toBe('GET');

    request.flush({
      title: 'Crop usage dashboard',
      subtitle: 'Demo data',
      summaryMetrics: [],
      weeklyUsage: [],
      cropDistribution: [],
      fieldInsights: []
    });
  });
});
