import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import 'chart.js/auto';
import { forkJoin } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BaseChartDirective } from 'ng2-charts';

import { AgricultureDashboard, CropDistributionItem, DashboardSummaryMetric, FieldInsight, WeeklyUsagePoint } from '../../models/agriculture-dashboard';
import { BackendStatus } from '../../models/backend-status';
import { BackendStatusService } from '../../services/backend-status.service';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    BaseChartDirective,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  protected dashboard?: AgricultureDashboard;
  protected backendStatus?: BackendStatus;
  protected errorMessage = '';
  protected isLoading = true;
  protected weeklyUsageChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };
  protected cropDistributionChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: []
  };
  protected readonly weeklyUsageChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#5b4b33'
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#5b4b33',
          precision: 0
        },
        grid: {
          color: 'rgba(91, 75, 51, 0.12)'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#17301f',
          usePointStyle: true,
          pointStyle: 'rectRounded'
        }
      }
    }
  };
  protected readonly cropDistributionChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: false
      }
    }
  };

  constructor(
    private readonly backendStatusService: BackendStatusService,
    private readonly dashboardService: DashboardService
  ) {}

  // Angular calls ngOnInit once the component is ready.
  // We use that moment to load both dashboard data and backend status for the page.
  public ngOnInit(): void {
    forkJoin({
      dashboard: this.dashboardService.getDashboard(),
      status: this.backendStatusService.getStatus()
    }).subscribe({
      next: ({ dashboard, status }) => {
        this.dashboard = dashboard;
        this.backendStatus = status;
        this.buildWeeklyUsageChartData(dashboard.weeklyUsage);
        this.buildCropDistributionChartData(dashboard.cropDistribution);
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage =
          'The frontend started, but it could not load the dashboard API. Make sure dotnet run is still running on port 5050.';
        this.isLoading = false;
      }
    });
  }

  protected formatMetricValue(metric: DashboardSummaryMetric): string {
    const numericValue =
      metric.value % 1 === 0 ? metric.value.toLocaleString() : metric.value.toFixed(1);

    return metric.unit ? `${numericValue}${metric.unit}` : numericValue;
  }

  protected totalHectares(crops: CropDistributionItem[]): number {
    return crops.reduce((runningTotal, crop) => runningTotal + crop.hectares, 0);
  }

  protected metricTrendClass(metric: DashboardSummaryMetric): string {
    return `trend-${metric.changeDirection}`;
  }

  protected metricTrendIcon(metric: DashboardSummaryMetric): string {
    if (metric.changeDirection === 'down') {
      return 'south_east';
    }

    if (metric.changeDirection === 'steady') {
      return 'east';
    }

    return 'north_east';
  }

  protected fieldStatusClass(field: FieldInsight): string {
    return `field-status-${field.status.toLowerCase().replace(/\s+/g, '-')}`;
  }

  protected trackByMetricId(_index: number, metric: DashboardSummaryMetric): string {
    return metric.id;
  }

  protected trackByCrop(_index: number, crop: CropDistributionItem): string {
    return crop.crop;
  }

  protected trackByField(_index: number, field: FieldInsight): string {
    return field.fieldName;
  }

  private buildWeeklyUsageChartData(weeklyUsage: WeeklyUsagePoint[]): void {
    this.weeklyUsageChartData = {
      labels: weeklyUsage.map((point) => point.dayLabel),
      datasets: [
        {
          label: 'Soil tests',
          data: weeklyUsage.map((point) => point.soilTests),
          backgroundColor: '#6a994e',
          borderRadius: 10,
          maxBarThickness: 26
        },
        {
          label: 'Sensor checks',
          data: weeklyUsage.map((point) => point.sensorChecks),
          backgroundColor: '#386641',
          borderRadius: 10,
          maxBarThickness: 26
        },
        {
          label: 'Irrigation events',
          data: weeklyUsage.map((point) => point.irrigationEvents),
          backgroundColor: '#bc6c25',
          borderRadius: 10,
          maxBarThickness: 26
        }
      ]
    };
  }

  private buildCropDistributionChartData(cropDistribution: CropDistributionItem[]): void {
    this.cropDistributionChartData = {
      labels: cropDistribution.map((item) => item.crop),
      datasets: [
        {
          data: cropDistribution.map((item) => item.hectares),
          backgroundColor: cropDistribution.map((item) => item.color),
          hoverBackgroundColor: cropDistribution.map((item) => item.color),
          borderWidth: 0
        }
      ]
    };
  }
}
