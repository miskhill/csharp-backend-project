import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { BackendStatus } from '../../models/backend-status';
import { BackendStatusService } from '../../services/backend-status.service';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  protected backendStatus?: BackendStatus;
  protected errorMessage = '';
  protected isLoading = true;

  constructor(private readonly backendStatusService: BackendStatusService) {}

  // Angular calls ngOnInit once the component is ready.
  // We use that moment to load the backend status for the page.
  public ngOnInit(): void {
    this.backendStatusService.getStatus().subscribe({
      next: (status) => {
        this.backendStatus = status;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage =
          'The frontend started, but it could not reach the backend. Make sure dotnet run is still running on port 5050.';
        this.isLoading = false;
      }
    });
  }
}
