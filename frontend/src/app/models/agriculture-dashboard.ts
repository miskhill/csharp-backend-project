// These interfaces describe the JSON returned by GET /api/dashboard.
// Keeping the contract in one place makes the service and page easier to understand.
export interface AgricultureDashboard {
  title: string;
  subtitle: string;
  summaryMetrics: DashboardSummaryMetric[];
  weeklyUsage: WeeklyUsagePoint[];
  cropDistribution: CropDistributionItem[];
  fieldInsights: FieldInsight[];
}

export interface DashboardSummaryMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  changeText: string;
  changeDirection: 'up' | 'down' | 'steady';
}

export interface WeeklyUsagePoint {
  dayLabel: string;
  soilTests: number;
  sensorChecks: number;
  irrigationEvents: number;
}

export interface CropDistributionItem {
  crop: string;
  hectares: number;
  color: string;
}

export interface FieldInsight {
  fieldName: string;
  crop: string;
  moisturePercent: number;
  lastTested: string;
  status: string;
}
