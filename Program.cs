using Microsoft.AspNetCore.Cors.Infrastructure;

namespace CSharpBackendProject;

public static class Program
{
    private const string LocalhostUrl = "http://localhost:5050";
    private const string AngularDevServerUrl = "http://localhost:4200";
    private const string FrontendCorsPolicyName = "FrontendDevelopment";

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
        builder.WebHost.UseUrls(LocalhostUrl);
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
                .WithOrigins(AngularDevServerUrl)
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
    }

    /// <summary>
    /// Returns a small message so you can confirm the server is running.
    /// </summary>
    private static string HandleHomeRequest()
    {
        return $"C# backend server is running on {LocalhostUrl}.";
    }

    /// <summary>
    /// Returns structured data that the Angular frontend can display on the home page.
    /// </summary>
    private static BackendStatusResponse HandleStatusRequest()
    {
        return new BackendStatusResponse(
            Status: "online",
            Message: "C# backend server is running.",
            ServerUrl: LocalhostUrl,
            LearningNote: "Angular reads this endpoint to prove the frontend and backend are linked.");
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
