import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BackendStatus } from '../models/backend-status';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BackendStatusService {
  private readonly http = inject(HttpClient);
  private readonly statusUrl = `${environment.apiBaseUrl}/api/status`;

  // The component asks the service for data instead of making HTTP requests directly.
  // That separation keeps display logic and data logic easy to follow.
  getStatus(): Observable<BackendStatus> {
    return this.http.get<BackendStatus>(this.statusUrl);
  }
}
