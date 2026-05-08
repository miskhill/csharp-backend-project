import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AgricultureDashboard } from '../models/agriculture-dashboard';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly dashboardUrl = '/api/dashboard';

  // The page asks this service for dashboard data instead of mixing HTTP code into the component.
  // That keeps the component focused on display logic and makes the API contract easier to test.
  public getDashboard(): Observable<AgricultureDashboard> {
    return this.http.get<AgricultureDashboard>(this.dashboardUrl);
  }
}
