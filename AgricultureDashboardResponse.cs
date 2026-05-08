namespace CSharpBackendProject;

/// <summary>
/// Represents the hardcoded agriculture dashboard data returned to the Angular frontend.
/// </summary>
public sealed record AgricultureDashboardResponse(
    string Title,
    string Subtitle,
    IReadOnlyList<DashboardSummaryMetricResponse> SummaryMetrics,
    IReadOnlyList<WeeklyUsagePointResponse> WeeklyUsage,
    IReadOnlyList<CropDistributionItemResponse> CropDistribution,
    IReadOnlyList<FieldInsightResponse> FieldInsights);

/// <summary>
/// Describes one summary card at the top of the dashboard.
/// </summary>
public sealed record DashboardSummaryMetricResponse(
    string Id,
    string Label,
    decimal Value,
    string Unit,
    string ChangeText,
    string ChangeDirection);

/// <summary>
/// Describes one point in the weekly usage bar chart.
/// </summary>
public sealed record WeeklyUsagePointResponse(
    string DayLabel,
    int SoilTests,
    int SensorChecks,
    int IrrigationEvents);

/// <summary>
/// Describes the crop mix shown in the doughnut chart.
/// </summary>
public sealed record CropDistributionItemResponse(
    string Crop,
    int Hectares,
    string Color);

/// <summary>
/// Describes one field insight row in the dashboard.
/// </summary>
public sealed record FieldInsightResponse(
    string FieldName,
    string Crop,
    int MoisturePercent,
    string LastTested,
    string Status);
