using Microsoft.AspNetCore.Cors.Infrastructure;

namespace CSharpBackendProject;

public static class Program
{
    private const string LocalhostUrl = "http://localhost:5050";
    private const string AngularDevServerUrl = "http://localhost:4200";
    private const string FrontendCorsPolicyName = "FrontendDevelopment";
    private const string RailwayPortEnvironmentVariableName = "PORT";
    private const string RailwayPublicDomainEnvironmentVariableName = "RAILWAY_PUBLIC_DOMAIN";
    private const string FrontendUrlsEnvironmentVariableName = "FRONTEND_URLS";

    /// <summary>
    /// Starts the backend server.
    /// </summary>
    public static void Main(string[] args)
    {
        var app = BuildApplication(args);
        app.Run();
    }

    /// <summary>
    /// Creates the web application and configures it to listen on localhost.
    /// </summary>
    private static WebApplication BuildApplication(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        builder.WebHost.UseUrls(GetListenUrl());
        builder.Services.AddCors(ConfigureCorsPolicies);

        var app = builder.Build();
        app.UseCors(FrontendCorsPolicyName);
        ConfigureRoutes(app);

        return app;
    }

    /// <summary>
    /// Allows the Angular development server to call this backend while you learn both sides locally.
    /// </summary>
    private static void ConfigureCorsPolicies(CorsOptions options)
    {
        options.AddPolicy(
            FrontendCorsPolicyName,
            policy => policy
                .WithOrigins(GetAllowedFrontendOrigins())
                .AllowAnyHeader()
                .AllowAnyMethod());
    }

    /// <summary>
    /// Registers the routes that this backend exposes.
    /// </summary>
    private static void ConfigureRoutes(WebApplication app)
    {
        app.MapGet("/", HandleHomeRequest);
        app.MapGet("/api/status", HandleStatusRequest);
        app.MapGet("/api/dashboard", HandleDashboardRequest);
    }

    /// <summary>
    /// Returns a small message so you can confirm the server is running.
    /// </summary>
    private static string HandleHomeRequest()
    {
        return $"C# backend server is running on {GetDisplayUrl()}.";
    }

    /// <summary>
    /// Returns structured data that the Angular frontend can display on the home page.
    /// </summary>
    private static BackendStatusResponse HandleStatusRequest()
    {
        return new BackendStatusResponse(
            Status: "online",
            Message: "C# backend server is running.",
            ServerUrl: GetDisplayUrl(),
            LearningNote: "Angular reads this endpoint to prove the frontend and backend are linked.");
    }

    /// <summary>
    /// Uses Railway's assigned port in production, while keeping localhost for local development.
    /// </summary>
    private static string GetListenUrl()
    {
        var railwayPort = Environment.GetEnvironmentVariable(RailwayPortEnvironmentVariableName);
        return string.IsNullOrWhiteSpace(railwayPort)
            ? LocalhostUrl
            : $"http://0.0.0.0:{railwayPort}";
    }

    /// <summary>
    /// Prefers Railway's public domain for display text so production responses don't advertise localhost.
    /// </summary>
    private static string GetDisplayUrl()
    {
        var railwayPublicDomain = Environment.GetEnvironmentVariable(RailwayPublicDomainEnvironmentVariableName);
        return string.IsNullOrWhiteSpace(railwayPublicDomain)
            ? LocalhostUrl
            : $"https://{railwayPublicDomain}";
    }

    /// <summary>
    /// Allows localhost in development and extra deployed frontend origins when provided through environment variables.
    /// </summary>
    private static string[] GetAllowedFrontendOrigins()
    {
        var configuredOrigins = Environment.GetEnvironmentVariable(FrontendUrlsEnvironmentVariableName);
        var additionalOrigins = string.IsNullOrWhiteSpace(configuredOrigins)
            ? []
            : configuredOrigins
                .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

        return [AngularDevServerUrl, .. additionalOrigins];
    }

    /// <summary>
    /// Returns hardcoded agriculture dashboard data so the frontend can show a realistic analytics page.
    /// </summary>
    private static AgricultureDashboardResponse HandleDashboardRequest()
    {
        return CreateDashboardResponse();
    }

    /// <summary>
    /// Keeps the demo data in one place so it is easy to tweak while learning the contract.
    /// </summary>
    private static AgricultureDashboardResponse CreateDashboardResponse()
    {
        return new AgricultureDashboardResponse(
            Title: "Crop usage dashboard",
            Subtitle: "A simple precision-agriculture demo showing how Angular can render charts, cards, and insights from a typed ASP.NET Core API.",
            SummaryMetrics:
            [
                new DashboardSummaryMetricResponse(
                    Id: "active-farms",
                    Label: "Active farms",
                    Value: 12,
                    Unit: string.Empty,
                    ChangeText: "2 more than last week",
                    ChangeDirection: "up"),
                new DashboardSummaryMetricResponse(
                    Id: "fields-monitored",
                    Label: "Fields monitored",
                    Value: 48,
                    Unit: string.Empty,
                    ChangeText: "6 new spring blocks added",
                    ChangeDirection: "up"),
                new DashboardSummaryMetricResponse(
                    Id: "soil-tests",
                    Label: "Soil tests this week",
                    Value: 186,
                    Unit: string.Empty,
                    ChangeText: "18% above last week",
                    ChangeDirection: "up"),
                new DashboardSummaryMetricResponse(
                    Id: "irrigation-efficiency",
                    Label: "Irrigation efficiency",
                    Value: 92,
                    Unit: "%",
                    ChangeText: "2% below target",
                    ChangeDirection: "down")
            ],
            WeeklyUsage:
            [
                new WeeklyUsagePointResponse("Mon", 24, 31, 10),
                new WeeklyUsagePointResponse("Tue", 29, 34, 12),
                new WeeklyUsagePointResponse("Wed", 22, 28, 9),
                new WeeklyUsagePointResponse("Thu", 33, 40, 15),
                new WeeklyUsagePointResponse("Fri", 30, 38, 13),
                new WeeklyUsagePointResponse("Sat", 25, 29, 11),
                new WeeklyUsagePointResponse("Sun", 23, 27, 8)
            ],
            CropDistribution:
            [
                new CropDistributionItemResponse("Wheat", 160, "#386641"),
                new CropDistributionItemResponse("Barley", 115, "#6a994e"),
                new CropDistributionItemResponse("Potatoes", 94, "#a7c957"),
                new CropDistributionItemResponse("Oilseed rape", 76, "#f2c14e"),
                new CropDistributionItemResponse("Beans", 58, "#bc6c25")
            ],
            FieldInsights:
            [
                new FieldInsightResponse("North Orchard", "Wheat", 71, "2026-05-08", "Optimal"),
                new FieldInsightResponse("River Meadow", "Barley", 63, "2026-05-07", "Watch"),
                new FieldInsightResponse("South Ridge", "Potatoes", 48, "2026-05-08", "Irrigate"),
                new FieldInsightResponse("Ash Corner", "Beans", 67, "2026-05-06", "Stable")
            ]);
    }

    /// <summary>
    /// Keeps the response shape explicit so it is easy to match on the Angular side.
    /// </summary>
    private sealed record BackendStatusResponse(
        string Status,
        string Message,
        string ServerUrl,
        string LearningNote);
}
