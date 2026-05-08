import { of, NEVER, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { BackendStatusService } from '../../services/backend-status.service';
import { DashboardService } from '../../services/dashboard.service';

describe('HomeComponent', () => {
  beforeAll(() => {
    class ResizeObserverMock {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    }

    (window as unknown as { ResizeObserver?: typeof ResizeObserverMock }).ResizeObserver ??=
      ResizeObserverMock;
  });

  it('shows a loading state while waiting for the backend', () => {
    const fixture = createComponent({
      dashboardService: {
        getDashboard: () => NEVER
      }
    });

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Preparing the agriculture metrics');
  });

  it('renders dashboard content when both API calls succeed', () => {
    const fixture = createComponent();

    fixture.detectChanges();

    const pageText = fixture.nativeElement.textContent;

    expect(pageText).toContain('Crop usage dashboard');
    expect(pageText).toContain('Usage across the last 7 days');
    expect(pageText).toContain('Live status from the C# API');
  });

  it('shows an error message when the dashboard API cannot be reached', () => {
    const fixture = createComponent({
      dashboardService: {
        getDashboard: () => throwError(() => new Error('Backend offline'))
      }
    });

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Dashboard data could not be loaded');
    expect(fixture.nativeElement.textContent).toContain('Make sure dotnet run is still running on port 5050.');
  });

  function createComponent(overrides?: {
    dashboardService?: Partial<DashboardService>;
    backendStatusService?: Partial<BackendStatusService>;
  }) {
    const dashboardService = {
      getDashboard: () =>
        of({
          title: 'Crop usage dashboard',
          subtitle: 'Demo subtitle',
          summaryMetrics: [
            {
              id: 'active-farms',
              label: 'Active farms',
              value: 12,
              unit: '',
              changeText: '2 more than last week',
              changeDirection: 'up' as const
            }
          ],
          weeklyUsage: [
            {
              dayLabel: 'Mon',
              soilTests: 24,
              sensorChecks: 31,
              irrigationEvents: 10
            }
          ],
          cropDistribution: [
            {
              crop: 'Wheat',
              hectares: 160,
              color: '#386641'
            }
          ],
          fieldInsights: [
            {
              fieldName: 'North Orchard',
              crop: 'Wheat',
              moisturePercent: 71,
              lastTested: '2026-05-08',
              status: 'Optimal'
            }
          ]
        }),
      ...overrides?.dashboardService
    };
    const backendStatusService = {
      getStatus: () =>
        of({
          status: 'online',
          message: 'C# backend server is running.',
          serverUrl: 'http://localhost:5050',
          learningNote: 'Angular reads this endpoint to prove the frontend and backend are linked.'
        }),
      ...overrides?.backendStatusService
    };

    TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        {
          provide: DashboardService,
          useValue: dashboardService
        },
        {
          provide: BackendStatusService,
          useValue: backendStatusService
        }
      ]
    });

    return TestBed.createComponent(HomeComponent);
  }
});
