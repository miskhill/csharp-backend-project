namespace CSharpBackendProject;

public static class Program
{
    private const string LocalhostUrl = "http://localhost:5050";

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

        var app = builder.Build();
        ConfigureRoutes(app);

        return app;
    }

    /// <summary>
    /// Registers the routes that this backend exposes.
    /// </summary>
    private static void ConfigureRoutes(WebApplication app)
    {
        app.MapGet("/", HandleHomeRequest);
    }

    /// <summary>
    /// Returns a small message so you can confirm the server is running.
    /// </summary>
    private static string HandleHomeRequest()
    {
        return $"C# backend server is running on {LocalhostUrl}.";
    }
}
